# 멀티캐스트와 브로드캐스트

> **TL;DR**
>
> 유니캐스트가 1:1이라면 멀티캐스트는 관심 있는 다수에게 한 번의 전송으로 전달하고, 브로드캐스트는 세그먼트의 모두에게 보냅니다. 멀티캐스트는 그룹 가입(IGMP)으로 필요한 수신자에게만 효율적으로 배포합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 세 가지 전달 방식

| 방식 | 대상 | 예 |
|---|---|---|
| 유니캐스트 | 특정 한 수신자 | 일반 웹 요청 |
| 브로드캐스트 | 세그먼트의 모든 호스트 | ARP, DHCP 초기 탐색 |
| 멀티캐스트 | 그룹에 가입한 수신자 | IPTV, 시세 피드, 서비스 탐색 |

같은 데이터를 N명에게 유니캐스트로 보내면 N번 복사해 보내야 하지만, 멀티캐스트는 한 번 보내고 네트워크가 필요한 가지에서만 복제합니다. 링크 계층·ARP·브로드캐스트 도메인은 [Ethernet·Wi-Fi와 스위칭](ethernet-switching.md)과 이어집니다.

## 멀티캐스트 주소와 그룹

멀티캐스트는 특정 수신자가 아니라 **그룹**을 가리키는 주소(IPv4 224.0.0.0/4, IPv6 ff00::/8)를 씁니다. 호스트는 관심 그룹에 가입하고, 라우터·스위치는 어느 포트에 가입자가 있는지 파악해 그쪽으로만 전달합니다. IPv4는 IGMP, IPv6는 MLD로 가입을 알립니다. 주소 체계는 [IPv4·IPv6와 서브넷](ip-subnetting.md)과 이어집니다.

```python
import socket, struct

GROUP = "239.1.1.1"   # 관리 범위(admin-scoped) 멀티캐스트 주소
PORT = 5000

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(("", PORT))

# 그룹에 가입: 이 인터페이스로 GROUP 트래픽을 받겠다고 알린다(IGMP)
mreq = struct.pack("4s4s", socket.inet_aton(GROUP), socket.inet_aton("0.0.0.0"))
sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

while True:
    data, addr = sock.recvfrom(2048)   # 그룹으로 온 데이터그램 수신
```

멀티캐스트는 [UDP](tcp-udp.md) 위에서 동작합니다. TCP는 1:1 연결이라 멀티캐스트에 맞지 않고, 신뢰성이 필요하면 애플리케이션이 재전송·순서를 다룹니다.

## 스위치와 라우터의 역할

스위치는 기본적으로 멀티캐스트를 브로드캐스트처럼 모든 포트로 흘릴 수 있습니다. IGMP 스누핑을 켜면 가입한 포트로만 보내 대역폭을 아낍니다. 도메인 간 멀티캐스트 라우팅(PIM 등)은 별도 설정이 필요하며, 그래서 멀티캐스트는 대개 통제된 네트워크 안에서 쓰입니다. 라우팅 개념은 [라우팅과 NAT](routing-nat.md)와 이어집니다.

## 어디에 쓰나

실시간 스트리밍(IPTV), 금융 시세 배포, 서비스·장치 탐색(mDNS/SSDP), 그리고 차량·산업 네트워크의 센서 데이터 배포에 쓰입니다. 공용 인터넷에서는 널리 라우팅되지 않아 오버레이·유니캐스트로 대체되는 경우가 많습니다.

## 자주 하는 오해

멀티캐스트는 "브로드캐스트의 대체"가 아니라 "가입 기반 선택 배포"입니다. 또한 멀티캐스트 자체는 신뢰성을 보장하지 않으므로 손실을 감당하거나 애플리케이션에서 보완해야 합니다.

## 확인 질문

같은 데이터를 다수에게 보낼 때 N번 복사하고 있지는 않나요? 수신자가 통제된 네트워크 안에 있나요, 공용 인터넷을 건너야 하나요?

## 참고 자료와 연결

[RFC 1112 (IP 멀티캐스트)](https://datatracker.ietf.org/doc/html/rfc1112) · [RFC 3376 (IGMPv3)](https://datatracker.ietf.org/doc/html/rfc3376)

관련: [Ethernet·Wi-Fi와 스위칭](ethernet-switching.md) · [IPv4·IPv6와 서브넷](ip-subnetting.md) · [TCP·UDP와 전송 동작](tcp-udp.md) · [목차](index.md) · [용어집](glossary.md)
