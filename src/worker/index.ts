export class Chat {
  state: DurableObjectState;
  value: number = 0;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/increment":
        this.value += 1;
        return new Response(this.value.toString());
      case "/value":
        return new Response(this.value.toString());
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
