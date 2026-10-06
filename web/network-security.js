import {setupNetworkFeed} from './robotics-archive.js';
import {createResearchWatch} from './research.js';
export const {renderResearch:renderNetwork,loadResearch:loadNetwork}=createResearchWatch({
 setupFeed:setupNetworkFeed,feedId:'network-feed',
 route:'#/network-security',file:'./network-security.json',
 title:'Network Security Watch',
 description:['TLS·DNS·BGP·무선·DDoS·익명 통신 등 네트워크 보안 연구를 arXiv와 4대 보안 학회에서 원문으로 모아봅니다.','Follow network security research — TLS, DNS, BGP, wireless, DDoS and anonymity — across arXiv and the four major security conferences.'],
 search:['제목·요약 검색: TLS, DNS, BGP, DDoS, Tor…','Search titles and summaries: TLS, DNS, BGP, DDoS, Tor…'],
 labels:{protocol:['프로토콜·TLS·DNS','Protocols · TLS · DNS'],routing:['라우팅·BGP','Routing · BGP'],wireless:['무선·5G·WiFi','Wireless · 5G · WiFi'],defense:['DDoS·침입탐지','DDoS & intrusion detection'],traffic:['트래픽 분석·검열','Traffic analysis & censorship'],privacy:['익명성·Tor·VPN','Anonymity · Tor · VPN'],security:['네트워크 보안','Network security']}
});
