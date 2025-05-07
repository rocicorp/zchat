import OpenAI from "openai";

export class Chat {
  #env: Env;
  #client: OpenAI;

  constructor(_state: DurableObjectState, env: Env) {
    this.#env = env;
    this.#client = new OpenAI({
      apiKey: this.#env.OPENAI_API_KEY,
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/hello":
        return new Response("hello");
      case "/chat":
        // Create a transform stream for proper streaming
        const { readable, writable } = new TextEncoderStream();
        const writer = writable.getWriter();

        // Start streaming in the background
        const streamPromise = (async () => {
          try {
            const llmStream = await this.#client.responses.create({
              model: "gpt-3.5-turbo",
              input: [
                {
                  role: "user",
                  content: "Best ska album of all time?",
                },
              ],
              stream: true,
            });

            // Add timestamps to verify streaming
            for await (const chunk of llmStream) {
              if (chunk.type === "response.output_text.delta") {
                await writer.write(chunk.delta);
              }
            }
          } finally {
            await writer.close();
          }
        })();

        return new Response(readable, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            Connection: "keep-alive",
          },
        });
      default:
        return new Response("Not found", { status: 404 });
    }
  }
}

export default {
  async fetch(req: Request, env: any, ctx: ExecutionContext) {
    const id = env.CHAT.idFromName("c1");
    const stub = env.CHAT.get(id);
    return stub.fetch(req);
  },
};

interface Env {
  OPENAI_API_KEY: string;
}
