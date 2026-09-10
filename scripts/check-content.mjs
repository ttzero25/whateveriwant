// Fast, browser-free content integrity gate for CI.
// Verifies route uniqueness, internal-link resolution, per-topic counts against the
// catalogs (single source of truth), and the expansion-doc contract. Exits non-zero on
// any failure so a broken link or a count drift blocks the deploy.
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = async (p) => JSON.parse(await fs.readFile(path.join(root, p), 'utf8'));

const docs = await read('dist/documents.json');
const collections = await read('content/collections.json');
const aiCatalog = await read('content/catalog.json');
const csCatalog = await read('content/cs/catalog.json');
const osCatalog = await read('content/os/catalog.json');
const expansion = await read('content/expansion.json');

const errors = [];
const fail = (m) => errors.push(m);

// 1) Unique routes
const routes = new Map(docs.map((d) => [`#/${d.topic}/${d.slug}`, d]));
if (routes.size !== docs.length) fail('Duplicate document routes.');

// 2) Every internal link resolves (both language views)
for (const doc of docs)
  for (const html of [doc.html, doc.en?.html])
    for (const [, href] of (html || '').matchAll(/href="(#[^"]+)"/g))
      if (href !== '#/' && !routes.has(href)) fail(`Dead link ${doc.topic}/${doc.slug} -> ${href}`);

// 3) Per-topic document count matches its catalog (single source of truth)
const expected = {
  ai: aiCatalog.length,
  cs: csCatalog.length,
  os: osCatalog.length,
};
for (const c of collections) expected[c.topic] = c.entries.length;
const actual = {};
for (const d of docs) actual[d.topic] = (actual[d.topic] || 0) + 1;
for (const [topic, n] of Object.entries(expected))
  if (actual[topic] !== n) fail(`Count mismatch for ${topic}: docs=${actual[topic]} catalog=${n}`);

// 4) Expansion contract: Korean-authored articles wired into their topic guide
for (const item of expansion) {
  const doc = routes.get(`#/${item.topic}/${item.slug}`);
  if (!doc) { fail(`Expansion doc missing: ${item.topic}/${item.slug}`); continue; }
  if (doc.en?.type !== 'korean') fail(`${item.slug}: en.type should be korean`);
  if ((doc.headings?.length || 0) < 3) fail(`${item.slug}: needs >=3 sections`);
  if (!doc.html.includes('https://')) fail(`${item.slug}: no external reference link`);
  const guide = routes.get(`#/${item.topic}/index`);
  if (!guide?.html.includes(`#/${item.topic}/${item.slug}`)) fail(`${item.slug}: not linked from ${item.topic}/index`);
}

if (errors.length) {
  console.error(`check-content FAILED (${errors.length}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`check-content PASS: ${docs.length} docs, ${routes.size} routes, ${expansion.length} expansion articles, counts match catalogs.`);
