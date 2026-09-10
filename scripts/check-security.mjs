import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const docs=JSON.parse(await fs.readFile('dist/documents.json','utf8'));
const topic=process.argv[3]||'security';
assert.ok(['security','ai-for-security','vulnerabilities'].includes(topic));
const security=docs.filter(d=>d.topic===topic);
await fs.mkdir('.preview',{recursive:true});
const catalog=JSON.parse(await fs.readFile('content/collections.json','utf8')).find(c=>c.topic===topic);
assert.equal(security.length,catalog.entries.length);
const routes=new Set(docs.map(d=>`#/${d.topic}/${d.slug}`));
assert.equal(routes.size,docs.length);
for(const doc of docs){
  for(const body of [doc.html,doc.en.html]){
    for(const [,href] of body.matchAll(/href="(#[^"]+)"/g)){
      assert.ok(href==='#/'||routes.has(href),`${doc.topic}/${doc.slug}: ${href}`);
    }
  }
}

const base=process.argv[2]||'http://127.0.0.1:4173/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'#/'+topic);
  await page.waitForSelector('.doc-card');
  if(topic==='vulnerabilities'){
    assert.equal(security.length,catalog.entries.length);
    await page.locator('.vulnerability-intro a').click();
    await page.waitForSelector('.article');
    await page.locator('.back-link').click();
    await page.waitForSelector('.doc-card');
  }
  assert.equal(await page.locator('.doc-card').count(),security.length);
  assert.equal(await page.locator('.doc-card[href^="#/ai/"]').count(),0);
  assert.equal(await page.locator('.'+topic+'-link.active').count(),1);
  assert.equal(await page.locator('.track-tabs').isVisible(),false);
  await page.locator('#search').fill(topic==='security'?'RBAC':topic==='vulnerabilities'?'IDOR':'기저율');
  assert.ok(await page.locator('.doc-card').count()>0);
  assert.ok(await page.locator('.doc-card').count()<security.length);
  if(topic==='vulnerabilities'){
    for(const [term,slug] of [['OOB','out-of-bounds'],['권한 우회','authorization-bypass']]){
      await page.locator('#search').fill(term);
      assert.equal(await page.locator(`.doc-card[href="#/vulnerabilities/${slug}"]`).count(),1);
    }
  }
  await page.locator('#search').fill('');
  await page.getByRole('button',{name:'기초',exact:true}).click();
  assert.equal(await page.locator('.doc-card').count(),security.filter(d=>d.level==='기초').length);
  await page.getByRole('button',{name:'전체',exact:true}).click();
  await page.screenshot({path:'.preview/'+topic+'-desktop.png',fullPage:true});
  for(const doc of security){
    await page.goto(base+'#/'+topic+'/'+doc.slug);
    await page.waitForSelector('.article');
    assert.equal(await page.locator('h1').innerText(),doc.title);
    assert.equal(await page.locator('.article').getAttribute('lang'),'ko');
    if(topic==='vulnerabilities')assert.equal(await page.locator('.concept-diagram').count(),['sql-injection','access-control','xss','csrf','ssrf','command-injection'].includes(doc.slug)?1:0);
    assert.match(await page.locator('.article blockquote').first().innerText(),/TL;DR/);
    assert.equal(await page.locator('.back-link').getAttribute('href'),'#/'+topic);
    assert.equal(await page.locator('.article-next a[href^="#/ai/"]').count(),0);
    await page.locator('.toc [data-section]').first().click();
    assert.equal(new URL(page.url()).hash,'#/'+topic+'/'+doc.slug);
  }
  if(topic==='ai-for-security'){
    assert.equal(await page.locator('.ai-link.active').count(),0);
    await page.goto(base+'#/ai-for-security/index');
    await page.waitForSelector('.article');
    await page.locator('.article a[href="#/security/principles"]').first().click();
    await page.waitForFunction(()=>document.querySelector('#breadcrumb')?.textContent.startsWith('Security /'));
    await page.goto(base+'#/ai-for-security/index');
    await page.waitForSelector('.article');
    await page.locator('.article a[href="#/ai/evaluation"]').first().click();
    await page.waitForFunction(()=>document.querySelector('#breadcrumb')?.textContent.startsWith('Artificial Intelligence /'));
    await page.goto(base+'#/ai-for-security/index');
    await page.waitForSelector('.article');
  }
  await page.getByRole('button',{name:'English',exact:true}).click();
  assert.match(await page.locator('.source-notice').innerText(),/currently available in Korean/);
  assert.ok((await page.locator('.source-link').getAttribute('href')).endsWith('/content/'+topic+'/index.md'));
  await page.reload();
  await page.waitForSelector('.article');
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.setViewportSize({width:390,height:844});
  for(const doc of security){
    await page.goto(base+'#/'+topic+'/'+doc.slug);
    await page.waitForSelector('.article');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),doc.slug);
  }
  await page.screenshot({path:'.preview/'+topic+'-mobile.png',fullPage:true});
  if(topic==='vulnerabilities'){
    await page.locator('#menu-toggle').click();
    await page.locator('.vulnerabilities-link').click();
    await page.waitForSelector('.doc-card');
    assert.equal(await page.locator('.doc-card').count(),security.length);
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  }
  await page.goto(base+'#/ai');
  await page.waitForSelector('.doc-card');
  assert.equal(await page.locator('.doc-card').count(),docs.filter(d=>d.topic==='ai').length);
  assert.equal(await page.locator('.doc-card[href^="#/security/"]').count(),0);
  await page.goto(base+'#/'+topic+'/missing');
  await page.waitForSelector('.empty');
  assert.match(await page.locator('h1').innerText(),/Document not found/);
  assert.deepEqual(errors,[]);
  console.log(topic+': PASS: unique routes, all internal article links, collection articles, topic isolation, search, filters, navigation, Korean fallback, mobile overflow and missing article.');
}finally{await browser.close();}
