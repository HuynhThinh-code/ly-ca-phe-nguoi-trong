import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await cp("public", "dist", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await cp(".openai/hosting.json", "dist/.openai/hosting.json");

const html = await readFile("public/index.html");
const css = await readFile("public/styles.css");
const js = await readFile("public/script.js");

const files = {
  "/": { body: html.toString("base64"), type: "text/html; charset=utf-8" },
  "/index.html": { body: html.toString("base64"), type: "text/html; charset=utf-8" },
  "/styles.css": { body: css.toString("base64"), type: "text/css; charset=utf-8" },
  "/script.js": { body: js.toString("base64"), type: "application/javascript; charset=utf-8" },
};

const worker = `const files = ${JSON.stringify(files)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname.endsWith("/") && url.pathname !== "/" ? url.pathname.slice(0, -1) : url.pathname;
    const file = files[pathname] || files["/"];

    return new Response(decodeBase64(file.body), {
      headers: {
        "content-type": file.type,
        "cache-control": pathname === "/" || pathname === "/index.html" ? "public, max-age=300" : "public, max-age=31536000, immutable",
      },
    });
  },
};
`;

await writeFile("dist/server/index.js", worker);
