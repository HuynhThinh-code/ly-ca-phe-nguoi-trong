import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await cp("public", "dist", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await cp(".openai/hosting.json", "dist/.openai/hosting.json");

const worker = `export default {
  async fetch() {
    return new Response("<!doctype html><meta charset='utf-8'><title>OK</title><h1>OK</h1>", {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
`;

await writeFile("dist/server/index.js", worker);
