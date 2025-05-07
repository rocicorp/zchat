export { Chat } from "./chat";

export default {
  async fetch(req: Request, env: any, ctx: ExecutionContext) {
    const id = env.CHAT.idFromName("c1");
    const stub = env.CHAT.get(id);
    const response = stub.fetch(req);
    console.log("forwardding response");
    return response;
  },
};
