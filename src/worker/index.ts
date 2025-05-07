import { cors } from "./cors";
export { Chat } from "./chat";

export default {
  async fetch(req: Request, env: any, ctx: ExecutionContext) {
    return cors(req, env, ctx, async (request, env, context) => {
      const id = env.CHAT.idFromName("c1");
      const stub = env.CHAT.get(id);
      return stub.fetch(request);
    });
  },
};
