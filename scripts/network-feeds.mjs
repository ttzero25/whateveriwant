import {load} from 'cheerio';
import {excerpt} from './research-summaries.mjs';
const security='(all:security OR all:attack OR all:adversarial OR all:intrusion OR all:spoofing OR all:vulnerability OR all:privacy)';
const query=q=>'https://export.arxiv.org/api/query?'+new URLSearchParams({search_query:`${q} AND ${security}`,start:'0',max_results:'60',sortBy:'submittedDate',sortOrder:'descending'});
export const sources=[
 {id:'netsec',name:'arXiv · Network Security',url:query('(all:"network security" OR all:"DNS security" OR all:BGP OR all:DDoS OR all:"traffic analysis" OR all:"intrusion detection" OR all:firewall OR all:"TLS protocol")'),home:'https://arxiv.org/list/cs.CR/recent',description:['TLS·DNS·BGP·DDoS 등 네트워크 보안 프리프린트','Preprints on TLS, DNS, BGP, DDoS and network security']},
 {id:'wireless',name:'arXiv · Wireless & Protocol Security',url:query('(all:"5G" OR all:LTE OR all:"Wi-Fi" OR all:Bluetooth OR all:"wireless security" OR all:QUIC OR all:"routing security" OR all:Tor OR all:anonymity)'),home:'https://arxiv.org/list/cs.NI/recent',description:['무선·셀룰러·프로토콜·익명 통신 프리프린트','Preprints on wireless, cellular, protocol and anonymity security']}
];
export function classify(text){
 const tags=[];
 if(/\b(TLS|SSL|DTLS|DNS|DNSSEC|QUIC|IPsec|certificate|\bPKI\b|handshake|protocol)\b/i.test(text))tags.push('protocol');
 if(/\b(BGP|RPKI|inter.?domain|routing|autonomous system|anycast)\b/i.test(text))tags.push('routing');
 if(/\b(Wi.?Fi|WLAN|802\.11|5G|4G|LTE|cellular|Bluetooth|\bBLE\b|Zigbee|RFID|NFC|mmWave)\b/i.test(text))tags.push('wireless');
 if(/\b(DDoS|DoS|botnet|intrusion detection|\bIDS\b|\bIPS\b|firewall|amplification|network defense)\b/i.test(text))tags.push('defense');
 if(/\b(traffic analysis|network measurement|censorship|deep packet inspection|\bDPI\b|website fingerprint\w*|network scanning|middlebox)\b/i.test(text))tags.push('traffic');
 if(/\b(Tor|onion routing|anonymity|anonymous communication|mix.?net\w*|\bVPN\b|dark ?web)\b/i.test(text))tags.push('privacy');
 return tags;
}
export function parseFeed(source,text){
 const $=load(text,{xmlMode:true}),items=[];
 if(!$('feed').length)throw Error('Invalid feed document');
 let valid=0;
 const entries=$('entry');
 entries.each((_,entry)=>{
  const el=$(entry),title=el.find('title').first().text().replace(/\s+/g,' ').trim();
  let url=el.find('id').first().text();
  try{const u=new URL(url);if(u.hostname==='arxiv.org')u.protocol='https:';if(u.protocol!=='https:'||u.hostname!=='arxiv.org')return;url=u.href;}catch{return;}
  const date=el.find('published').first().text(),time=Date.parse(date);
  if(!title||!Number.isFinite(time)||time>Date.now()+86400000)return;
  valid++;
  const hint=el.find('summary').text();
  const text=(title+' '+hint).replace(/generative adversarial networks?/gi,'');
  if(!/\b(security|cyber\w*|attacks?|adversarial|intrusion|spoof\w*|vulnerabilit\w*|privacy|censorship|anonym\w*|eavesdrop\w*|malicious|jamming|deception)\b/i.test(text))return;
  // Require a genuine network-domain keyword so broad arXiv matches (e.g. "DNS" meaning
  // Direct Numerical Simulation) do not leak non-network papers into the feed.
  const tags=classify(text);if(!tags.length)return;
  items.push({source,title,url,date:new Date(time).toISOString().slice(0,10),published_at:new Date(time).toISOString(),date_kind:'published',kind:'preprint',channel:'papers',tags,excerpt:excerpt(hint)});
 });
 if(entries.length&&!valid)throw Error('No usable dated entries');
 return [...new Map(items.map(i=>[i.url,i])).values()];
}
