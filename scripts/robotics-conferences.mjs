import {createHash} from 'node:crypto';
import {parseConference} from './conference-feeds.mjs';
export const topicLabels={autonomy:['자율주행','Autonomous driving'],vehicle:['차량 보안','Vehicle security'],ros:['ROS·미들웨어','ROS & middleware'],physical:['Physical AI·로봇','Physical AI & robotics']};
export function topicsFor(title,venue=''){
 const tags=[];
 // ‘Robot’ is also the name of a threshold-signature protocol, unrelated to robotics.
 if(/^Robot: Robust Threshold BBS/i.test(title))return tags;
 if(/(?:autonomous|automated) (driving|vehicles?)|self.driving|autopilot|ADAS|autoware|apollo|lidar|lane (detection|keeping)|traffic sign|perception systems?|camera.based perception|autonomous target tracking|perception in autonomous systems/i.test(title))tags.push('autonomy');
 if(venue==='vehiclesec'||/\b(vehicles?|vehicular|automotive|cars?|V2X|V2V|V2I|CAN.bus|CAN.FD|ECUs?|OBD|charging stations?|electric vehicles?|in.vehicle|controller area network)\b/i.test(title))tags.push('vehicle');
 if(/\b(ROS|ROS2|SROS2|DDS|RTPS)\b|robot operating system/i.test(title))tags.push('ros');
 if(/\b(robots?|robotic\w*|drones?|UAVs?|UAS|embodied|SLAM|LiDAR|radar|GPS|GNSS)\b|unmanned aerial|physical[ -](AI|world|adversarial|latency|distance.pulling)|sensor vulnerabilities|thermal image perception|vision.language.action|sensor (fusion|spoofing)|autonomous driving/i.test(title))tags.push('physical');
 return tags;
}
export function archiveSources(now=new Date()){
 const sources=[];
 for(let year=now.getUTCFullYear();year>=2025;year--){
  sources.push(
   {id:'ieee-sp',name:'IEEE S&P',year,url:`https://sp${year}.ieee-security.org/accepted-papers.html`},
   {id:'usenix-security',name:'USENIX Security',year,url:`https://www.usenix.org/conference/usenixsecurity${String(year).slice(-2)}/technical-sessions`},
   {id:'acm-ccs',name:'ACM CCS',year,url:year===2025?'https://www.sigsac.org/ccs/CCS2025/accepted-papers/':`https://www.sigsac.org/ccs/CCS${year}/program/accepted-papers.html`,...(year===2025?{feed:'https://www.sigsac.org/ccs/CCS2025/assets/accepted-papers.json'}:{})},
   {id:'ndss',name:'NDSS',year,url:`https://www.ndss-symposium.org/ndss${year}/accepted-papers/`},
   {id:'vehiclesec',name:'VehicleSec',year,url:`https://www.usenix.org/conference/vehiclesec${String(year).slice(-2)}/technical-sessions`}
  );
 }
 sources.push({id:'ndss',name:'NDSS',year:2024,url:'https://www.ndss-symposium.org/ndss2024/accepted-papers/'});
 return sources;
}
export function parseArchive(source,text){
 const matches=title=>topicsFor(title,source.id).length>0;
 let parsed;
 if(source.feed?.endsWith('.json')){
  const data=JSON.parse(text);
  if(!Array.isArray(data.firstCycle)||!Array.isArray(data.secondCycle))throw Error('Invalid CCS paper feed');
  const items=[];
  for(const row of [...data.firstCycle,...data.secondCycle]){
   const title=String(row.title||'').replace(/^\(#\d+\)\s*/,'').trim();if(!matches(title))continue;
   let url;try{url=new URL(row.url);if(url.protocol!=='https:'||!['dl.acm.org','www.sigsac.org'].includes(url.hostname))continue;}catch{continue;}
   items.push({id:`${source.id}:${source.year}:`+createHash('sha256').update(title.toLowerCase()).digest('hex').slice(0,16),title,url:url.href,basis:'title',description:''});
  }
  if(!data.firstCycle.length&&!data.secondCycle.length)throw Error('Empty CCS source');
  parsed={items};
 }else parsed=parseConference({...source,id:source.id==='vehiclesec'?'usenix-security':source.id},text,{matches,limit:Infinity,allowEmpty:true});
 return [...new Map(parsed.items.map(item=>{
  if(source.id==='vehiclesec')item.id=item.id.replace('usenix-security:','vehiclesec:');
  return [item.id,{...item,venue:source.id,year:source.year,tags:topicsFor(item.title,source.id)}];
 })).values()];
}
export function mergeArchive(old,fresh){
 return [...new Map([...old,...fresh].map(i=>[i.id,i])).values()].sort((a,b)=>b.year-a.year||a.venue.localeCompare(b.venue)||a.title.localeCompare(b.title,'en'));
}
