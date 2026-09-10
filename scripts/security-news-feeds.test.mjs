import {test} from 'node:test';import assert from 'node:assert/strict';
import {sources,parseSecurityNews} from './security-news-feeds.mjs';
import {filterSecurityNews} from '../web/security-news.js';
const source=sources.find(s=>s.id==='dailysecu');
const item=(title,url='https://www.dailysecu.com/news/articleView.html?idxno=1',date='2026-09-10 21:00:00')=>`<item><title>${title}</title><link>${url}</link><pubDate>${date}</pubDate><description>최근 취약점 패치 안내입니다.</description></item>`;
test('Korean timezone-less feed dates are KST; only publisher links survive',()=>{
 const rows=parseSecurityNews(source,`<rss>${item('보안 취약점 공지')}${item('피싱 경보','https://evil.example/a')}${item('해킹 경보','javascript:alert(1)')}${item('취약점','https://www.dailysecu.com/2','invalid')}</rss>`);
 assert.equal(rows.length,1);assert.equal(rows[0].published_at,'2026-09-10T12:00:00.000Z');assert.equal(rows[0].region,'kr');assert.ok(rows[0].tags.includes('vulnerability'));assert.equal(rows[0].description,undefined);
});
test('fiction and broken RSS are not news; repeated entries deduplicate',()=>{
 assert.equal(parseSecurityNews(source,`<rss>${item('정보보안 연재소설')}${item('피싱 피해 경보')}${item('피싱 피해 경보')}</rss>`).length,1);
 assert.throws(()=>parseSecurityNews(source,'<html>Moved</html>'));
});
test('news search combines region, source, topic and period in newest order',()=>{
 const items=[{title:'New phishing',excerpt:'',region:'global',source:'cisa',tags:['phishing'],published_at:'2026-09-10T01:00:00Z'},{title:'Old phishing',excerpt:'',region:'kr',source:'dailysecu',tags:['phishing'],published_at:'2026-01-01T01:00:00Z'}];
 assert.equal(filterSecurityNews(items,{query:'phishing'},Date.parse('2026-09-10T10:00:00Z')).length,1);
 assert.equal(filterSecurityNews(items,{region:'kr',days:'all'},Date.parse('2026-09-10')).length,1);
 assert.equal(filterSecurityNews(items,{source:'cisa',topic:'vulnerability',days:'all'}).length,0);
});
