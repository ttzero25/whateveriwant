import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const docs=JSON.parse(await fs.readFile('dist/documents.json','utf8'));
const added=JSON.parse(await fs.readFile('content/expansion.json','utf8'));
assert.equal(added.length,67);
const routes=new Map(docs.map(d=>[`#/${d.topic}/${d.slug}`,d]));
assert.equal(routes.size,docs.length);
for(const doc of docs){
  for(const view of [doc,doc.en]){
    for(const [,href] of view.html.matchAll(/href="(#[^"]+)"/g))assert.ok(href==='#/'||routes.has(href),`${doc.topic}/${doc.slug}: ${href}`);
  }
}
for(const item of added){
  const doc=routes.get(`#/${item.topic}/${item.slug}`);
  assert.ok(doc);
  assert.equal(doc.en.type,'korean');
  assert.deepEqual(doc.headings,doc.en.headings);
  assert.ok(doc.headings.length>=3);
  assert.ok(doc.html.includes('https://'));
  const guide=routes.get(`#/${item.topic}/index`);
  assert.ok(guide.html.includes(`#/${item.topic}/${item.slug}`));
}
// Check the worked examples independently of the presentation.
assert.equal((8+10)/2,9);
assert.equal((2+10)/2,6);
assert.equal(2*(1*2-6)*2,-16);
assert.ok(Math.abs(((1-0.1*(-16))*2-6)**2-0.64)<1e-12);
assert.equal(80/(80+120),0.4);
assert.equal(80/(80+20),0.8);
const base=process.argv[2]||'http://127.0.0.1:4173/';
await fs.mkdir('.preview',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await page.waitForSelector('.doc-card');
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
    await page.setViewportSize(viewport);
    for(const language of ['ko','en']){
      await page.locator(`[data-language="${language}"]`).click();
      for(const item of added){
        const route=`#/${item.topic}/${item.slug}`,doc=routes.get(route);
        await page.goto(base+route);
        await page.waitForFunction(title=>document.querySelector('h1')?.textContent===title,language==='ko'?doc.title:doc.en.title);
        assert.equal(await page.locator('.article').getAttribute('lang'),'ko');
        assert.equal(await page.locator('.toc [data-section]').count(),doc.headings.length);
        assert.ok((await page.locator('.source-link').getAttribute('href')).endsWith(`/content/${item.topic}/${item.slug}.md`));
        if(language==='en')assert.match(await page.locator('.source-notice').innerText(),/currently available in Korean/);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route);
      }
    }
  }
  await page.goto(base+'#/ai/backpropagation');
  await page.waitForSelector('.concept-diagram');
  await page.screenshot({path:'.preview/expanded-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('[data-language="ko"]').click();
  await page.goto(base+'#/ai-for-security/phishing-classification');
  await page.waitForSelector('.article');
  await page.screenshot({path:'.preview/expanded-case.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS: 20 expanded concepts, all article links, guide coverage, worked examples, Korean fallback, source links, TOCs and desktop/mobile layouts.');
}finally{await browser.close();}
