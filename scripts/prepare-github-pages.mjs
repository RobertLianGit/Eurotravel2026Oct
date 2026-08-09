import { readFile, writeFile } from "node:fs/promises";

const output = "dist/client/index.html";
let html = await readFile(output, "utf8");

// GitHub Pages serves this project below /Eurotravel2026Oct/.
// Convert vinext's root-absolute asset references to paths relative to index.html.
html = html
  .replaceAll('href="/_next/', 'href="./_next/')
  .replaceAll('src="/_next/', 'src="./_next/')
  .replaceAll('href="/favicon.svg"', 'href="./favicon.svg"')
  .replaceAll('"/_next/', '"./_next/')
  .replace(/(?<!\.)\/favicon\.svg/g, "./favicon.svg");

await writeFile(output, html);
