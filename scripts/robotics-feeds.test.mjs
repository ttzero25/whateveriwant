import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed,classify} from './robotics-feeds.mjs';
test('Atom parser preserves publication dates, restricts URLs and classifies sensors',()=>{
 const entry=(url,date='2026-08-01')=>`<entry><id>${url}</id><title>LiDAR security for autonomous vehicles</title><published>${date}</published><summary>Research on sensor resilience.</summary></entry>`;
 const items=parseFeed('autonomy',`<feed>${entry('http://arxiv.org/abs/2608.00001')}${entry('https://evil.example/paper')}${entry('https://arxiv.org/abs/1','invalid')}</feed>`);
 assert.equal(items.length,1);assert.equal(items[0].url,'https://arxiv.org/abs/2608.00001');assert.equal(items[0].date,'2026-08-01');assert.deepEqual(items[0].tags,['security','autonomy','sensors']);
});
test('ROS RSS retains community attribution and rejects malformed feeds',()=>{
 const items=parseFeed('ros','<rss><channel><item><title>ROS 2 DDS security</title><link>https://discourse.openrobotics.org/t/security/1</link><pubDate>2026-08-01</pubDate><description>Community security update.</description></item></channel></rss>');
 assert.equal(items[0].kind,'community');assert.ok(items[0].tags.includes('ros'));assert.throws(()=>parseFeed('ros','<html>Error</html>'));
 assert.deepEqual(parseFeed('robotics','<feed></feed>'),[]);assert.ok(classify('DDS permissions','robotics').includes('ros'));
});

test('irrelevant search hits and generative adversarial networks are excluded',()=>{
 const entry=title=>`<entry><id>https://arxiv.org/abs/2608.00002</id><title>${title}</title><published>2026-08-01</published><summary>Image transmission in vehicles.</summary></entry>`;
 assert.equal(parseFeed('autonomy',`<feed>${entry('Generative adversarial networks for communication')}</feed>`).length,0);
 assert.equal(parseFeed('autonomy',`<feed>${entry('EV charging economics')}</feed>`).length,0);
});
