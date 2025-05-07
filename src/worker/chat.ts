import { corsResponse } from "./cors";
import { Env } from "./env";
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
    if (request.method === "OPTIONS") {
      return corsResponse(null, {
        status: 204,
        headers: {},
      });
    }

    const url = new URL(request.url);
    switch (url.pathname) {
      case "/hello":
        return corsResponse("hello");
      case "/chat":
        // Create a transform stream for proper streaming
        const { readable, writable } = new TextEncoderStream();
        const writer = writable.getWriter();
        const input = await request.text();

        // Start streaming in the background
        (async () => {
          try {
            const llmStream = await this.#client.responses.create({
              model: "gpt-3.5-turbo",
              input: [
                {
                  role: "user",
                  content: input,
                },
              ],
              stream: true,
            });

            for await (const chunk of llmStream) {
              if (chunk.type === "response.output_text.delta") {
                await writer.write(chunk.delta);
              }
            }
          } catch (e: any) {
            console.error("LLM Stream error:", e);
            try {
              await writer.write(`\n\nError in stream: ${e.message}`);
            } catch (writeError) {
              console.error("Error writing error to stream:", writeError);
            }
          } finally {
            await writer.close();
          }
        })();

        console.log("sending response");
        return corsResponse(readable, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      default:
        return corsResponse("Not found", { status: 404 });
    }
  }
}
