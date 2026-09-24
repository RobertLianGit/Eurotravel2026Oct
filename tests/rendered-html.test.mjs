import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the interactive travel guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
  assert.match(html, /欧洲历史旅行手册/);
  assert.match(html, /梵蒂冈/);
  assert.match(html, /今日行程/);
  assert.match(html, /今日故事/);
  assert.match(html, /现场控制台/);
  assert.match(html, /今天要去哪/);
});

test("starter preview infrastructure is removed from the finished guide", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /export default function Home/);
  assert.doesNotMatch(page, /SkeletonPreview|react-loading-skeleton/);
  assert.match(page, /先排顺序，再补细节/);
  assert.match(page, /长按拖动，或用 ↑↓/);
  assert.match(page, /点击展开 · 每行一条/);
  assert.match(page, /罗马最后自由时段/);
  assert.doesNotMatch(page, /梵蒂冈（可选）/);
  assert.match(page, /Fly Away/);
  assert.match(page, /拍照 \/ 打卡建议/);
  assert.match(page, /自由行备选库/);
  assert.match(page, /邓紫棋 \/ 拍照/);
  assert.match(page, /加入第 \{activePlan.number\} 天/);
  assert.match(page, /priorityReminder/);
  assert.match(page, /学院美术馆/);
  assert.match(page, /巴杰罗国家博物馆/);
  assert.match(page, /9 月 30 日/);
  assert.match(page, /day-05.*9月30日/s);
  assert.match(page, /新增安排/);
  assert.match(page, /第11天｜拿着手机就能走的双语路线/);
  assert.match(page, /2026年10月6日 · 星期二/);
  assert.match(page, /Salle du Jeu de Paume/);
  assert.match(page, /1 rue du Jeu de Paume, 78000 Versailles/);
  assert.match(page, /Chambre de la Reine/);
  assert.match(page, /床龛左侧的小门/);
  assert.match(page, /Hôtel des Menus-Plaisirs/);
  assert.match(page, /22 avenue de Paris, 78000 Versailles/);
  assert.match(page, /La Liberté guidant le peuple/);
  assert.match(page, /Salle Mollien 700/);
  assert.match(page, /scheduledText/);
  assert.match(page, /alreadyScheduled/);
  assert.doesNotMatch(page, /berlin-brandenburg|berlin-bornholmer|berlin-checkpoint/);
  assert.match(layout, /欧洲历史旅行手册/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", templateRoot)));
});
