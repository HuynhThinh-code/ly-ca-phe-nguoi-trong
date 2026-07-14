import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await cp("public", "dist", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await cp(".openai/hosting.json", "dist/.openai/hosting.json");

const html = await readFile("public/index.html", "utf8");
const css = await readFile("public/styles.css", "utf8");
const js = await readFile("public/script.js", "utf8");
const inlineHtml = html
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>\n${css}\n</style>`)
  .replace('<script src="script.js"></script>', `<script>\n${js}\n</script>`);
const body = [...Buffer.from(inlineHtml, "utf8")];

const worker = `const body = ${JSON.stringify(body)};

export default {
  async fetch() {
    return new Response(new Uint8Array(body), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    });
  },
};
`;

await writeFile("dist/server/index.js", worker);
