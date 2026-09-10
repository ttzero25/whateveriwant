import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seoulDay,todaysItems} from '../web/daily-updates.js';
test('today uses KST across the UTC date boundary',()=>{
 assert.equal(seoulDay('2026-09-09T15:00:00Z'),'2026-09-10');
 assert.equal(seoulDay('2026-09-09T14:59:59Z'),'2026-09-09');
 assert.equal(seoulDay('invalid'),'');
});
test('today distinguishes publication, new archival additions and changes without making old papers new',()=>{
 const now=new Date('2026-09-10T13:00:00Z');
 const items=[{url:'old',title:'Old',date:'2025-01-01'},
 {url:'published',title:'Published',published_at:'2026-09-09T16:00:00Z'},
 {id:'archive',title:'Archived',year:2024,first_seen:'2026-09-10T01:00:00Z'},
 {url:'changed',title:'Changed',date:'2025-01-01',updated_at:'2026-09-10T02:00:00Z'},
 {url:'unknown',title:'Unknown',first_seen:null},
 {url:'future',title:'Future',published_at:'2026-09-11T01:00:00Z'}];
 const result=todaysItems(items,now);assert.deepEqual(result.map(i=>i.today_reason),['changed','added','published']);assert.equal(result[1].year,2024);
});
test('deduplicates overlaps and leaves an empty day empty',()=>{
 const item={url:'same',title:'Same',date:'2026-09-10'};
 assert.equal(todaysItems([item,item],new Date('2026-09-10')).length,1);
 assert.deepEqual(todaysItems([item],new Date('2026-09-11')),[]);
});

test('collection stamps survive repeat fetches and do not invent legacy first-seen dates',async()=>{
 const {stampCollected}=await import('./collection-metadata.mjs');
 const item={title:'Paper',excerpt:'Description'},at='2026-09-10T01:00:00Z',later='2026-09-11T01:00:00Z';
 const fresh=stampCollected(item,undefined,at);assert.equal(fresh.first_seen,at);
 const repeat=stampCollected(item,fresh,later);assert.equal(repeat.first_seen,at);assert.equal(repeat.updated_at,undefined);
 const changed=stampCollected({...item,excerpt:'Revised'},repeat,later);assert.equal(changed.first_seen,at);assert.equal(changed.updated_at,later);
 const legacy=stampCollected(item,item,at);assert.equal(legacy.first_seen,null);assert.equal(legacy.updated_at,undefined);
});
