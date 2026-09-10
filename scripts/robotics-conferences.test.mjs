import {test} from 'node:test';
import assert from 'node:assert/strict';
import {archiveSources,topicsFor,parseArchive,mergeArchive} from './robotics-conferences.mjs';
const source={id:'acm-ccs',name:'ACM CCS',year:2026,url:'https://www.sigsac.org/ccs/CCS2026/program/accepted-papers.html'};
test('archives all matches, not just eight; same index URLs have distinct IDs',()=>{
 const html='<table class="accepted-papers-table">'+Array.from({length:15},(_,i)=>`<tr><td>Autonomous driving security ${i}</td><td>Author</td></tr>`).join('')+'</table>';
 const items=parseArchive(source,html);assert.equal(items.length,15);assert.equal(new Set(items.map(i=>i.id)).size,15);assert.equal(new Set(items.map(i=>i.url)).size,1);assert.ok(items.every(i=>!i.date&&i.year===2026));
});
test('zero matching titles differs from broken source; robotics acronym false positives excluded',()=>{
 assert.deepEqual(parseArchive(source,'<table class="accepted-papers-table"><tr><td>Threshold cryptography</td></tr></table>'),[]);
 assert.throws(()=>parseArchive(source,'<html>Service unavailable</html>'));
 assert.deepEqual(topicsFor('Robot: Robust Threshold BBS+ in Two Rounds'),[]);
 assert.deepEqual(topicsFor('Decentralized Information-Flow Control for ROS2'),['ros']);
 assert.ok(topicsFor('Physical AI threat modeling').includes('physical'));
 assert.ok(topicsFor('Automated Driving Systems').includes('autonomy'));
});
test('CCS JSON uses official DOI links, strips paper numbers and blocks foreign links',()=>{
 const s={...source,year:2025,feed:'https://www.sigsac.org/papers.json'};
 const data={firstCycle:[{title:'(#12) ROS2 Security',url:'https://dl.acm.org/doi/10.1145/123'},{title:'Vehicle security',url:'https://evil.example/paper'}],secondCycle:[]};
 const items=parseArchive(s,JSON.stringify(data));assert.equal(items.length,1);assert.equal(items[0].title,'ROS2 Security');
});
test('archive retains older and temporarily absent papers; refresh deduplicates by ID',()=>{
 const old=[{id:'old',title:'ROS2',venue:'ndss',year:2024},{id:'same',title:'Vehicle security',venue:'acm-ccs',year:2025}];
 const next=mergeArchive(old,[{...old[1],excerpt:'Updated'},{id:'new',title:'Physical AI',venue:'ndss',year:2026}]);
 assert.deepEqual(next.map(i=>i.year),[2026,2025,2024]);assert.equal(next.length,3);assert.equal(next[1].excerpt,'Updated');
 const future=archiveSources(new Date('2027-01-01'));assert.ok(future.some(s=>s.year===2027));assert.ok(future.some(s=>s.year===2024&&s.id==='ndss'));
});
