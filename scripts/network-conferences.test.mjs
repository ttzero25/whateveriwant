import {test} from 'node:test';
import assert from 'node:assert/strict';
import {archiveSources,topicsFor,parseArchive,mergeArchive} from './network-conferences.mjs';
const source={id:'acm-ccs',name:'ACM CCS',year:2026,url:'https://www.sigsac.org/ccs/CCS2026/program/accepted-papers.html'};
test('archives all network matches, not just eight; same index URLs have distinct IDs',()=>{
 const html='<table class="accepted-papers-table">'+Array.from({length:15},(_,i)=>`<tr><td>Measuring DNS resolver security ${i}</td><td>Author</td></tr>`).join('')+'</table>';
 const items=parseArchive(source,html);assert.equal(items.length,15);assert.equal(new Set(items.map(i=>i.id)).size,15);assert.equal(new Set(items.map(i=>i.url)).size,1);assert.ok(items.every(i=>!i.date&&i.year===2026));
});
test('non-network security papers are excluded; keyword classifier covers the main areas',()=>{
 assert.deepEqual(parseArchive(source,'<table class="accepted-papers-table"><tr><td>Threshold cryptography for signatures</td></tr></table>'),[]);
 assert.throws(()=>parseArchive(source,'<html>Service unavailable</html>'));
 assert.deepEqual(topicsFor('Fully homomorphic encryption for databases'),[]);
 assert.deepEqual(topicsFor('Neural network backdoor detection'),[]); // "network" alone must not match
 assert.ok(topicsFor('A Formal Analysis of the TLS 1.3 Handshake').includes('protocol'));
 assert.ok(topicsFor('Securing BGP with RPKI deployment').includes('routing'));
 assert.ok(topicsFor('Breaking 5G cellular authentication').includes('wireless'));
 assert.ok(topicsFor('Defending against DDoS amplification attacks').includes('defense'));
 assert.ok(topicsFor('Website fingerprinting via traffic analysis').includes('traffic'));
 assert.ok(topicsFor('Improving Tor onion routing anonymity').includes('privacy'));
});
test('CCS JSON uses official DOI links, strips paper numbers and blocks foreign links',()=>{
 const s={...source,year:2025,feed:'https://www.sigsac.org/papers.json'};
 const data={firstCycle:[{title:'(#12) DNS cache poisoning revisited',url:'https://dl.acm.org/doi/10.1145/123'},{title:'TLS downgrade attacks',url:'https://evil.example/paper'}],secondCycle:[]};
 const items=parseArchive(s,JSON.stringify(data));assert.equal(items.length,1);assert.equal(items[0].title,'DNS cache poisoning revisited');
});
test('archive retains older and temporarily absent papers; refresh deduplicates by ID',()=>{
 const old=[{id:'old',title:'DNSSEC',venue:'ndss',year:2024},{id:'same',title:'BGP hijack detection',venue:'acm-ccs',year:2025}];
 const next=mergeArchive(old,[{...old[1],excerpt:'Updated'},{id:'new',title:'QUIC privacy',venue:'ndss',year:2026}]);
 assert.deepEqual(next.map(i=>i.year),[2026,2025,2024]);assert.equal(next.length,3);assert.equal(next[1].excerpt,'Updated');
 const future=archiveSources(new Date('2027-01-01'));assert.ok(future.some(s=>s.year===2027));assert.ok(future.some(s=>s.year===2024&&s.id==='ndss'));
 assert.ok(!future.some(s=>s.id==='vehiclesec'));
});
