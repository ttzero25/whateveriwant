import {createHash} from 'node:crypto';
import {parseConference} from './conference-feeds.mjs';
export const topicLabels={protocol:['프로토콜·TLS·DNS','Protocols · TLS · DNS'],routing:['라우팅·BGP','Routing · BGP'],wireless:['무선·5G·WiFi','Wireless · 5G · WiFi'],defense:['DDoS·침입탐지','DDoS & intrusion detection'],traffic:['트래픽 분석·검열','Traffic analysis & censorship'],privacy:['익명성·Tor·VPN','Anonymity · Tor · VPN']};
export function topicsFor(title){
 const tags=[],t=title;
 if(/\b(TLS|SSL|DTLS|DNS|DNSSEC|DoH|DoT|QUIC|HTTP\/?[23]|IPsec|X\.509|certificate authorit\w*|certificates?|\bPKI\b|handshake|WireGuard|protocol)\b/i.test(t))tags.push('protocol');
 if(/\b(BGP|RPKI|inter.?domain|routing|autonomous systems?|\bIXP\b|Internet topology|traceroute|anycast)\b/i.test(t))tags.push('routing');
 if(/\b(Wi.?Fi|WLAN|802\.11|5G|4G|LTE|cellular|baseband|Bluetooth|\bBLE\b|Zigbee|LoRa\w*|RFID|NFC|\bGSM\b|mmWave)\b/i.test(t))tags.push('wireless');
 if(/\b(DDoS|DoS|botnets?|intrusion detection|\bIDS\b|\bIPS\b|firewalls?|network intrusion|amplification|SYN flood|packet filtering|network defense)\b/i.test(t))tags.push('defense');
 if(/\b(traffic analysis|network measurement|censorship|deep packet inspection|\bDPI\b|netflow|website fingerprint\w*|network scanning|Internet.?wide scan|packet captur\w*|middlebox\w*)\b/i.test(t))tags.push('traffic');
 if(/\b(Tor|onion routing|anonymity|anonymous communication|mix.?net\w*|\bVPN\b|dark ?web|metadata privacy)\b/i.test(t))tags.push('privacy');
 return tags;
}
export function archiveSources(now=new Date()){
 const sources=[];
 for(let year=now.getUTCFullYear();year>=2025;year--){
  sources.push(
   {id:'ieee-sp',name:'IEEE S&P',year,url:`https://sp${year}.ieee-security.org/accepted-papers.html`},
   {id:'usenix-security',name:'USENIX Security',year,url:`https://www.usenix.org/conference/usenixsecurity${String(year).slice(-2)}/technical-sessions`},
   {id:'acm-ccs',name:'ACM CCS',year,url:year===2025?'https://www.sigsac.org/ccs/CCS2025/accepted-papers/':`https://www.sigsac.org/ccs/CCS${year}/program/accepted-papers.html`,...(year===2025?{feed:'https://www.sigsac.org/ccs/CCS2025/assets/accepted-papers.json'}:{})},
   {id:'ndss',name:'NDSS',year,url:`https://www.ndss-symposium.org/ndss${year}/accepted-papers/`}
  );
 }
 sources.push({id:'ndss',name:'NDSS',year:2024,url:'https://www.ndss-symposium.org/ndss2024/accepted-papers/'});
 return sources;
}
export function parseArchive(source,text){
 const matches=title=>topicsFor(title).length>0;
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
 }else parsed=parseConference(source,text,{matches,limit:Infinity,allowEmpty:true});
 return [...new Map(parsed.items.map(item=>[item.id,{...item,venue:source.id,year:source.year,tags:topicsFor(item.title)}])).values()];
}
export function mergeArchive(old,fresh){
 return [...new Map([...old,...fresh].map(i=>[i.id,i])).values()].sort((a,b)=>b.year-a.year||a.venue.localeCompare(b.venue)||a.title.localeCompare(b.title,'en'));
}
