import { Env } from "./env";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours
};

export async function cors(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  actualFetch: (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ) => Promise<Response>
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const response = await actualFetch(request, env, ctx);

  // Clone the response to add CORS headers
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    // Only add a subset of CORS headers for actual responses, not all from OPTIONS
    if (
      [
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
      ].includes(key)
    ) {
      newHeaders.set(key, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
