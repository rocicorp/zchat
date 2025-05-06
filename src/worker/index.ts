import OpenAI from "openai";

export class Chat {
  state: DurableObjectState;
  value: number = 0;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/increment":
        this.value += 1;
        return new Response(this.value.toString());
      case "/value":
        return new Response(this.value.toString());
      case "/chat":
        const client = new OpenAI({
          apiKey: this.env.OPENAI_API_KEY,
        });

        const response = await client.responses.create({
          model: "gpt-4.1",
          input: "Write a one-sentence bedtime story about a unicorn.",
        });

        return new Response(response.output_text);
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
