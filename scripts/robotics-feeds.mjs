import {load} from 'cheerio';
import {excerpt} from './research-summaries.mjs';
const security='(all:security OR all:attack OR all:adversarial OR all:intrusion OR all:spoofing OR all:vulnerability)';
const query=q=>'https://export.arxiv.org/api/query?'+new URLSearchParams({search_query:`${q} AND ${security}`,start:'0',max_results:'60',sortBy:'submittedDate',sortOrder:'descending'});
export const sources=[
 {id:'ros',name:'ROS Discourse',url:'https://discourse.openrobotics.org/tag/security.rss',home:'https://discourse.openrobotics.org/tag/security',description:['Open Robotics 커뮤니티 · security 태그','Open Robotics community · security tag']},
 {id:'robotics',name:'arXiv · Robotics Security',url:query('(ti:robot OR ti:robotics OR all:"Robot Operating System" OR all:"ROS 2" OR all:SROS2)'),home:'https://arxiv.org/list/cs.RO/recent',description:['ROS·로봇 보안 관련 프리프린트','Preprints on ROS and robotics security']},
 {id:'autonomy',name:'arXiv · Autonomous Security',url:query('(all:"autonomous driving" OR all:"autonomous vehicle" OR all:"connected vehicle" OR all:"in-vehicle" OR all:LiDAR)'),home:'https://arxiv.org/list/cs.CR/recent',description:['자율주행·차량·센서 보안 프리프린트','Preprints on autonomous vehicles and sensor security']}
];
export function classify(text,source){
 const tags=['security'];
 if(source==='ros'||/\b(ROS|ROS2|SROS2|DDS|middleware|robot operating system)\b/i.test(text))tags.push('ros');
 if(source==='autonomy'||/autonomous (driving|vehicle)|connected vehicle|in.vehicle|\bCAN bus\b/i.test(text))tags.push('autonomy');
 if(/lidar|radar|sensor|perception|camera|GNSS|GPS|spoof/i.test(text))tags.push('sensors');
 return tags;
}
export function parseFeed(source,text){
 const $=load(text,{xmlMode:true}),items=[];
 if(!$('rss,feed').length)throw Error('Invalid feed document');
 let valid=0;
 const ros=source==='ros',entries=$(ros?'item':'entry');
 entries.each((_,entry)=>{
  const el=$(entry),title=el.find('title').first().text().replace(/\s+/g,' ').trim();
  let url=ros?el.find('link').first().text():el.find('id').first().text();
  try{const u=new URL(url);if(!ros&&u.hostname==='arxiv.org')u.protocol='https:';if(u.protocol!=='https:'||!(ros?['discourse.ros.org','discourse.openrobotics.org']:['arxiv.org']).includes(u.hostname))return;url=u.href;}catch{return;}
  const date=el.find(ros?'pubDate':'published').first().text(),time=Date.parse(date);
  if(!title||!Number.isFinite(time)||time>Date.now()+86400000)return;
  valid++;
  const hint=el.find(ros?'description':'summary').text();
  if(!ros&&!/\b(security|cyber\w*|attacks?|adversarial|intrusion|spoof\w*|vulnerabilit\w*|privacy|zero.trust|attestation|authentication|malicious|jamming|deception)\b/i.test((title+' '+hint).replace(/generative adversarial networks?/gi,'')))return;
  items.push({source,title,url,date:new Date(time).toISOString().slice(0,10),published_at:new Date(time).toISOString(),date_kind:'published',kind:ros?'community':'preprint',channel:ros?'news':'papers',tags:classify(title+' '+hint,source),excerpt:excerpt(hint)});
 });
 if(entries.length&&!valid)throw Error('No usable dated entries');
 return [...new Map(items.map(i=>[i.url,i])).values()];
}
