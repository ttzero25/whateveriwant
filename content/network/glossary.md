# Network 한영 용어집

> **TL;DR**
>
> 주소·전송·응용·운영 용어를 역할별로 찾아보고 해당 개념 글로 이동하세요.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

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
