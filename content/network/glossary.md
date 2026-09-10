# Network 한영 용어집

> **TL;DR**
>
> 주소·전송·응용·운영 용어를 역할별로 찾아보고 해당 개념 글로 이동하세요.

AI 작성 해설

## 링크와 주소

| 용어 | 의미 |
|---|---|
| Encapsulation / 캡슐화 | 상위 데이터를 하위 계층의 전달 단위로 감쌈 |
| Frame / 프레임 | 링크에서 전달하는 단위 |
| MAC address | 링크 계층에서 사용하는 주소 |
| ARP | IPv4에서 다음 홉의 링크 주소 등을 찾는 프로토콜 |
| NDP | IPv6의 이웃·라우터 탐색 등 |
| VLAN | 링크의 전달·브로드캐스트 범위를 논리적으로 분리 |
| CIDR / 프리픽스 | 주소의 네트워크 부분을 비트 길이로 표현 |
| Subnet / 서브넷 | 주소 프리픽스 등으로 구분하는 네트워크 범위 |
| Gateway / 게이트웨이 | 다른 네트워크로 전달할 때 사용하는 다음 홉 |
| Longest prefix match | 일치하는 경로 중 가장 구체적인 프리픽스 선택 |
| NAT / NAPT | 주소 / 주소·포트 변환 |
| OSPF / BGP | 내부 링크 상태 라우팅 / 자율 시스템 간 정책 기반 경로 교환 |

해설: [계층](layers-packets.md) · [스위칭](ethernet-switching.md) · [서브넷](ip-subnetting.md) · [라우팅](routing-nat.md)

## 전송과 애플리케이션

| 용어 | 의미 |
|---|---|
| TCP | 순서 있는 신뢰성 있는 바이트 스트림 |
| UDP | 자체 전달·순서 보장 없는 데이터그램 전송 |
| Socket / 소켓 | 프로그램이 통신 끝점을 다루는 인터페이스·객체 |
| Flow control / 흐름 제어 | 수신 측 수용량에 맞게 전송 제한 |
| Congestion control / 혼잡 제어 | 네트워크 혼잡 상태에 맞게 전송 조절 |
| Resolver / 리졸버 | 이름 조회를 처리하는 구성 요소 |
| Authoritative server / 권한 서버 | 담당 DNS 영역의 정보 제공 |
| DNS TTL | DNS 데이터 캐시 수명에 관여하는 값 |
| DHCP lease / 임대 | 일정 조건·기간의 주소 할당 |
| Proxy / 프록시 | 요청·연결을 중개하는 구성 요소 |
| CDN | 분산 위치에서 콘텐츠 캐시·전달 등을 제공 |
| ETag | 표현 버전 등을 구분하는 HTTP 검증자 |
| TLS | 전송 중 기밀성·무결성과 피어 인증 |
| QUIC | UDP 위의 보안·다중화 전송 프로토콜 |
| HTTP/3 | QUIC 위에서 HTTP 의미를 전달 |

해설: [TCP·UDP](tcp-udp.md) · [DNS·DHCP](dns-dhcp.md) · [HTTP](http-caching.md) · [TLS·QUIC](tls-quic.md)

## 성능과 관측

| 용어 | 의미 |
|---|---|
| RTT | 왕복 시간 |
| Throughput / 처리량 | 실제 단위 시간에 전달·처리한 양 |
| Goodput | 유용한 데이터의 전달률 |
| Jitter | 지연의 변동 |
| BDP | 대역폭과 지연의 곱 |
| MTU | 링크·경로가 전달할 패킷 크기와 관련된 한도 |
| MSS | TCP 세그먼트의 데이터 크기 |
| PMTU | 경로의 링크 제약을 반영한 MTU |
| ICMP | IP 통신의 오류·제어 정보 전달 프로토콜 |

해설: [성능·MTU](performance-mtu.md) · [진단](troubleshooting.md) · [학습 가이드](index.md)

## 차량·임베디드 통신

| 용어 | 의미 |
|---|---|
| CAN / Controller Area Network | 차량·산업 제어기 등의 메시지 기반 네트워크 |
| ECU / Electronic Control Unit | 센서 처리·장치 제어 등을 수행하는 전자 제어기 |
| CAN ID | 프레임 식별·우선순위에 쓰는 값; 그 자체로 송신자 인증은 아님 |
| Arbitration / 중재 | 동시 전송 시 버스 사용 순서를 정하는 과정 |
| Dominant / Recessive | 중재에서 우세하게 관측되는 상태 / 이에 양보하는 상태 |
| Bus-off | 오류 누적으로 CAN 노드가 버스 송신에서 이탈한 상태 |
| CAN FD / Flexible Data Rate | 최대 64바이트와 선택적 비트율 전환을 지원하는 CAN 세대 |
| BRS / Bit Rate Switch | CAN FD의 데이터 구간 비트율 전환 표시 |
| DLC / Data Length Code | 프레임 데이터 길이의 코드; 항상 바이트 수와 같지는 않음 |
| CAN XL | 최대 2,048바이트 데이터 필드를 지원하는 CAN 세대 |
| ISO-TP | CAN 위에서 메시지 분할·재조립과 흐름 제어를 다루는 전송 프로토콜 |
| UDS / Unified Diagnostic Services | 차량 진단 서비스의 의미와 동작을 정의하는 상위 규칙 |
| LIN / Local Interconnect Network | commander가 스케줄을 관리하는 저비용 제어 네트워크 |
| 100BASE-T1 / 1000BASE-T1 | 단일 꼬임쌍의 100 Mbit/s / 1 Gbit/s급 Ethernet 물리 계층 |
| TSN / Time-Sensitive Networking | 시간 동기화·트래픽 제어 등 시간 제약을 다루는 기술군 |

해설: [CAN](can-bus.md) · [CAN FD·XL](can-fd.md) · [LIN](lin.md) · [차량용 Ethernet](automotive-ethernet.md)

## 확장 개념 용어

| 용어 | 의미 |
|---|---|
| 웹소켓 / WebSocket | HTTP 업그레이드로 만든 양방향 지속 연결 |
| 소켓 / Socket | 애플리케이션이 전송 계층을 다루는 종단점 |
| 로드 밸런싱 / Load balancing | 요청을 여러 서버로 분산 |
| 리버스 프록시 / Reverse proxy | 백엔드 앞단에서 라우팅·TLS 종료·캐싱 |
| BGP / Border Gateway Protocol | 자율 시스템 간 경로를 광고·선택 |
| 자율 시스템 / AS | 한 조직이 관리하는 라우팅 도메인 |
| RPKI | 프리픽스를 광고할 정당한 AS를 암호학적으로 검증 |
| VPN / 터널링 | 신뢰할 수 없는 망 위의 암호화 터널 |
| IPsec / WireGuard | 대표적 L3 VPN 프로토콜 |
| gRPC / RPC | 원격 함수 호출과 그 HTTP/2 기반 구현 |
| Protocol Buffers | 스키마 기반 이진 직렬화 |
| 멀티캐스트 / Multicast | 가입한 그룹에 한 번의 전송으로 배포 |
| IGMP | 멀티캐스트 그룹 가입을 알리는 프로토콜 |
| NTP / PTP | 시간 동기화 프로토콜(광역 / 정밀) |

해설: [웹소켓](websockets.md) · [소켓 프로그래밍](socket-programming.md) · [로드 밸런싱](load-balancing.md) · [BGP](bgp.md) · [VPN·터널링](vpn-tunneling.md) · [gRPC/RPC](grpc-rpc.md) · [멀티캐스트](multicast.md) · [시간 동기화](time-sync.md)
