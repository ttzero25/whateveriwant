import {test} from 'node:test';
import assert from 'node:assert/strict';
import {unifiedItems,filterUnified} from '../web/robotics-archive.js';
const data={items:[{title:'ROS update',url:'https://arxiv.org/abs/1',source:'robotics',date:'2026-09-01',tags:['ros']},{title:'ROS update',url:'https://arxiv.org/abs/1',source:'autonomy',date:'2026-09-01',tags:['ros']},{title:'Old update',url:'https://arxiv.org/abs/2',source:'robotics',date:'2025-12-31',tags:['security']}],archive:{items:[{id:'a',title:'ROS paper',url:'https://example.org/list',venue:'ndss',year:2026,tags:['ros']},{id:'b',title:'Physical AI paper',url:'https://example.org/list',venue:'ndss',year:2026,tags:['physical']} ]}};
test('one chronology deduplicates shared preprints without losing source filters or distinct conference papers',()=>{
 const items=unifiedItems(data);assert.equal(items.length,4);assert.deepEqual(items.map(i=>i.year),[2026,2026,2026,2025]);
 assert.equal(items[0].entry_kind,'news');assert.equal(items[1].date,undefined);
 assert.equal(filterUnified(items,{source:'autonomy'}).length,1);assert.equal(filterUnified(items,{source:'robotics'}).length,2);
 assert.equal(filterUnified(items,{kind:'conference'}).length,2);
});
test('search and source/year/topic/type filters apply to the same results',()=>{
 const items=unifiedItems(data);
 assert.equal(filterUnified(items,{query:'ROS',topic:'ros',year:'2026'}).length,2);
 assert.equal(filterUnified(items,{query:'ROS',kind:'conference',source:'ndss',year:'2026'}).length,1);
 assert.equal(filterUnified(items,{year:'2025',kind:'conference'}).length,0);
 assert.equal(filterUnified(items,{query:'No matching paper'}).length,0);
});

test('AI conference collections share the unified list without classifying every ML paper as security',()=>{
 const data={items:[],conferences:[{id:'icml',year:2026,items:[{id:'icml1',title:'Neural network optimization',url:'https://icml.cc/1'}]},{id:'ndss',year:2026,items:[{id:'ndss1',title:'Prompt injection in AI agents',url:'https://ndss-symposium.org/1'}]}]};
 const items=unifiedItems(data);assert.equal(items.length,2);assert.equal(filterUnified(items,{source:'icml',kind:'conference'}).length,1);
 assert.deepEqual(items.find(i=>i.id==='icml1').tags,['research']);assert.ok(items.find(i=>i.id==='ndss1').tags.includes('security'));
});
