import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const docs=JSON.parse(await fs.readFile('dist/documents.json','utf8'));
const network=docs.filter(d=>d.topic==='network');
assert.equal(network.length,12);
const diagramSlugs=['layers-packets','routing-nat','dns-dhcp'];
const routes=new Set(docs.map(d=>`#/${d.topic}/${d.slug}`));
assert.equal(routes.size,docs.length);
for(const doc of docs)for(const view of [doc,doc.en]){
  for(const [,href] of view.html.matchAll(/href="(#[^"]+)"/g))assert.ok(href==='#/'||routes.has(href),`${doc.topic}/${doc.slug}: ${href}`);
}
for(const doc of network){
  assert.equal(doc.en.type,'korean');
  assert.deepEqual(doc.en.headings,doc.headings);
  assert.ok(doc.headings.length>=3);
}
assert.ok(docs.find(d=>d.topic==='cs'&&d.slug==='networking').html.includes('#/network/index'));
assert.ok(docs.find(d=>d.topic==='security'&&d.slug==='network-security').html.includes('#/network/index'));
const base=process.argv[2]||'http://127.0.0.1:4173/';
await fs.mkdir('.preview',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await page.waitForSelector('.doc-card');
  assert.equal(await page.locator('.topic').count(),6);
  await page.locator('.topic[href="#/network"]').click();
  await page.waitForFunction(()=>document.querySelector('.network-link.active'));
  assert.equal(await page.locator('.doc-card').count(),12);
  assert.equal(await page.locator('.ai-link.active').count(),0);
  assert.equal(await page.locator('.track-tabs').isVisible(),false);
  assert.equal(await page.locator('.network-link .nav-count').innerText(),'12');
  for(const level of ['기초','핵심','응용','참고','가이드']){
    await page.locator(`[data-filter="${level}"]`).click();
    assert.equal(await page.locator('.doc-card').count(),network.filter(d=>d.level===level).length);
  }
  await page.locator('[data-filter="전체"]').click();
  await page.locator('#search').fill('CIDR');
  assert.ok(await page.locator('.doc-card[href="#/network/ip-subnetting"]').count());
  assert.equal(await page.locator('.doc-card:not([href^="#/network/"])').count(),0);
  await page.locator('#search').fill('no-result-11223344');
  assert.equal(await page.locator('.doc-card').count(),0);
  await page.locator('#search').fill('');
  await page.screenshot({path:'.preview/network-desktop.png',fullPage:true});
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
    await page.setViewportSize(viewport);
    for(const language of ['ko','en']){
      await page.locator(`[data-language="${language}"]`).click();
      for(const doc of network){
        await page.goto(base+'#/network/'+doc.slug);
        await page.waitForFunction(title=>document.querySelector('h1')?.textContent===title,language==='ko'?doc.title:doc.en.title);
        assert.equal(await page.locator('.article').getAttribute('lang'),'ko');
        assert.equal(await page.locator('.back-link').getAttribute('href'),'#/network');
        assert.equal(await page.locator('.toc [data-section]').count(),doc.headings.length);
        assert.equal(await page.locator('.concept-diagram').count(),diagramSlugs.includes(doc.slug)?1:0);
        assert.ok((await page.locator('.source-link').getAttribute('href')).endsWith(`/content/network/${doc.slug}.md`));
        for(const href of await page.locator('.article-next a').evaluateAll(as=>as.map(a=>a.getAttribute('href'))))assert.ok(href.startsWith('#/network/'));
        if(language==='en')assert.match(await page.locator('.source-notice').innerText(),/currently available in Korean/);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),doc.slug);
      }
    }
  }
  await page.goto(base+'#/network/dns-dhcp');
  await page.waitForSelector('.concept-diagram');
  await page.screenshot({path:'.preview/network-mobile.png',fullPage:true});
  await page.reload();
  await page.waitForSelector('.article');
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.locator('#menu-toggle').click();
  await page.locator('.network-link').click();
  await page.waitForSelector('.doc-card');
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('.doc-card').count(),12);
  await page.goto(base+'#/cs/networking');
  await page.waitForSelector('.article');
  await page.locator('[data-language="ko"]').click();
  await page.locator('.article a[href="#/network/index"]').click();
  await page.waitForFunction(()=>location.hash==='#/network/index'&&document.querySelector('h1')?.textContent==='Network 학습 가이드');
  await page.locator('.article a[href="#/security/network-security"]').first().click();
  await page.waitForFunction(()=>document.querySelector('#breadcrumb')?.textContent.startsWith('Security /'));
  await page.goto(base+'#/network/missing');
  await page.waitForSelector('.empty');
  assert.deepEqual(errors,[]);
  console.log('PASS: Network navigation, 12 documents, three bilingual diagrams, filters, search, language persistence, all internal links, legacy cross-links and mobile layouts.');
}finally{await browser.close();}
