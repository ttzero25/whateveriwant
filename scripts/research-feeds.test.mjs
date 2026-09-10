import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed,classify,safeURL} from './research-feeds.mjs';
test('official URLs only; external scripts cannot become navigation targets',()=>{
 assert.equal(safeURL('javascript:alert(1)','openai'),null);
 assert.equal(safeURL('https://openai.com.attacker.invalid/story','openai'),null);
 assert.equal(safeURL('/research/example','anthropic'),'https://www.anthropic.com/research/example');
});
test('RSS retains news and products as well as research, preserving titles without full text',()=>{
 const xml='<rss><channel><item><title>Prompt injection &amp; safety</title><link>https://openai.com/index/example</link><pubDate>Wed, 09 Sep 2026 00:00:00 GMT</pubDate><description>Full article body must not be saved</description></item><item><title>Store opening</title><link>https://openai.com/index/shop</link><pubDate>Wed, 09 Sep 2026 00:00:00 GMT</pubDate><category>Company</category></item></channel></rss>';
 const items=parseFeed('openai',xml);
 assert.equal(items.length,2);assert.equal(items[0].title,'Prompt injection & safety');
 assert.equal(items[1].channel,'news');assert.equal(items[1].category,'Company');
 assert.equal(items[0].published_at,'2026-09-09T00:00:00.000Z');
 assert.deepEqual(items[0].tags,['security','safety']);assert.equal(items[0].description,undefined);
});
test('arXiv uses announcement dates and deduplicates feed entries',()=>{
 const item='<item><title>A language model benchmark</title><link>https://arxiv.org/abs/2609.00001</link><pubDate>Wed, 09 Sep 2026 00:00:00 -0400</pubDate><description>We study prompt injection in language models.</description></item>';
 const items=parseFeed('arxiv','<rss><channel>'+item+item+'</channel></rss>');
 assert.equal(items.length,1);assert.equal(items[0].date_kind,'announced');assert.equal(items[0].kind,'preprint');assert.ok(items[0].tags.includes('security'));
});
test('Anthropic parser uses dated publication rows and rejects broken layouts',()=>{
 const html='<a href="/research/example"><time>Sep 9, 2026</time><span class="PublicationList__subject">Alignment</span><span class="PublicationList__title">A research title</span></a>';
 assert.equal(parseFeed('anthropic',html)[0].date,'2026-09-09');
 assert.throws(()=>parseFeed('anthropic','<html>Temporarily unavailable</html>'));
 assert.throws(()=>parseFeed('arxiv','<html>Server error</html>'));
 assert.deepEqual(parseFeed('arxiv','<rss><channel></channel></rss>'),[]);
});
test('classifies topic candidates without inventing incident status',()=>{
 assert.deepEqual(classify('A prompt injection defense benchmark'),['security','evaluation']);
 assert.deepEqual(classify('A new optimization method'),[]);
});

test('Anthropic news cards can separate the headline and date across links',()=>{
 const html='<a href="/new-model"><h2>Introducing a new model</h2></a><a href="/new-model"><time>Sep 1, 2026</time><p>A description that must not become the title</p></a>';
 const items=parseFeed('anthropic',html,'https://www.anthropic.com/news');
 assert.equal(items.length,1);assert.equal(items[0].title,'Introducing a new model');assert.equal(items[0].channel,'news');assert.equal(items[0].date,'2026-09-01');
});
test('OpenAI product announcements are not silently filtered out',()=>{
 const xml='<rss><channel><item><title>A new model</title><link>https://openai.com/index/new-model</link><pubDate>Wed, 09 Sep 2026 11:00:00 GMT</pubDate><category>Product</category></item></channel></rss>';
 assert.equal(parseFeed('openai',xml)[0].channel,'news');
});
