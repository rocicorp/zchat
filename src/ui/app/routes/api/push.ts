import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { schema } from "~/src/zero/schema";
import { createMutators } from "~/src/zero/mutators";
import { sql } from "~/src/db";

// PushProcessor is provided by Zero to encapsulate a standard
// implementation of the push protocol.
const processor = new PushProcessor(
  new ZQLDatabase(
    new PostgresJSConnection(postgres(process.env.ZERO_UPSTREAM_DB! as string)),
    schema
  )
);

export const APIRoute = createAPIFileRoute("/api/push")({
  POST: async ({ request }) => {
    try {
      const result = await processor.process(
        createMutators(),
        Object.fromEntries(new URL(request.url).searchParams.entries()),
        await request.json()
      );
      return await json(result);
    } catch (e) {
      console.error(e);
      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  },
});
