import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { compress } from "hono/compress";
export const config = {
  runtime: "edge",
};
const app = new Hono();
app.use("/*", cors());
app.use(compress());
app.get("/api", async (c) => {
  const outputurl = c.req.query("with") as string;
  const fetchData = await fetch(outputurl);
  const response = new Response(fetchData.body as ReadableStream<Uint8Array>, {
    status: fetchData.status,
    headers: fetchData.headers,
  });
  response.headers.set(
    "Cache-Control",
    "public,max-age=31536000,s-maxage=31536000,immutable"
  );
  response.headers.set(
    "CDN-Cache-Control",
    "public,max-age=31536000,s-maxage=31536000,immutable"
  );
  return response;
});

export default handle(app);
