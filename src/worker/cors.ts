import { Env } from "./env";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours
  "content-encoding": "identity",
};

export function corsResponse(body: BodyInit | null, response?: ResponseInit) {
  return new Response(body, {
    status: response?.status,
    statusText: response?.statusText,
    headers: {
      ...response?.headers,
      ...corsHeaders,
    },
  });
}
