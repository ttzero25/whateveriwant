# 가용성과 서비스 거부(DoS) 방어

> **TL;DR**
>
> 가용성은 CIA 삼각형의 한 축이며, 서비스 거부는 자원을 고갈시켜 정상 사용자를 막는 공격입니다. 방어는 레이트 리밋, 자원 상한, 우아한 성능 저하, 그리고 분산 공격(DDoS)에 대한 상위 계층 완화로 겹겹이 구성합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 무엇을 고갈시키는가

DoS는 CPU·메모리·연결 수·대역폭·디스크·백엔드 쿼리 등 유한한 자원을 겨냥합니다. 분산(DDoS)은 다수 출처에서 동시에 쏟아부어 차단을 어렵게 만듭니다. 계층별로 성격이 다릅니다.

| 계층 | 예 | 완화 지점 |
|---|---|---|
| 네트워크/전송 | SYN 플러드, UDP 증폭 | ISP·클라우드 스크러빙, SYN 쿠키 |
| 애플리케이션 | 비싼 검색 반복, 대량 로그인 | 레이트 리밋, 캐시, WAF |
| 논리 | 증폭 가능한 정규식(ReDoS), 무한 재귀 | 입력 상한, 안전한 알고리즘 |

전송 계층 동작은 [TCP·UDP와 전송 동작](../network/tcp-udp.md), ReDoS는 [정규 표현식과 오토마타](../cs/automata-regex.md)와 이어집니다.

## 레이트 리밋: 토큰 버킷

가장 흔한 방어는 요청 속도를 제한하는 것입니다. 토큰 버킷은 일정 속도로 토큰을 채우고, 요청마다 하나씩 소비해 순간 폭주를 흡수하면서 평균 속도를 제한합니다.

```python
import time

class TokenBucket:
    def __init__(self, rate: float, capacity: float):
        self.rate = rate          # 초당 보충 토큰
        self.capacity = capacity  # 버킷 최대치(허용 버스트)
        self.tokens = capacity
        self.updated = time.monotonic()

    def allow(self, cost: float = 1.0) -> bool:
        now = time.monotonic()
        self.tokens = min(self.capacity, self.tokens + (now - self.updated) * self.rate)
        self.updated = now
        if self.tokens >= cost:
            self.tokens -= cost   # 토큰이 있으면 허용하고 소비
            return True
        return False              # 없으면 거절(429 Too Many Requests)

# 클라이언트/IP/사용자 키별로 버킷을 두고, 비싼 요청은 cost를 높게 매긴다
```

## 자원 상한과 우아한 성능 저하

한 요청이 시스템을 통째로 삼키지 못하게 상한을 둡니다: 요청 본문·업로드 크기, 타임아웃, 커넥션 풀 크기, 쿼리 결과 페이지네이션, 스레드/고루틴 수. 과부하 시에는 전면 장애 대신 일부 기능을 낮추거나 큐를 두는 우아한 성능 저하를 설계합니다. 자원 관점은 [시스템 보안](system-security.md), 성능·큐는 [성능·RTT·큐·MTU](../network/performance-mtu.md)와 이어집니다.

## DDoS는 혼자 못 막는다

대규모 분산 공격은 대역폭 자체가 목표이므로 서버 코드만으로는 부족합니다. CDN·클라우드 스크러빙·애니캐스트로 트래픽을 상위에서 흡수·분산하고, 캐시로 원본 부하를 줄입니다. 정상 트래픽과 공격을 구분하는 지표(급증·비정상 패턴)를 관측합니다.

## 자주 하는 오해

레이트 리밋만으로 DDoS가 막히지 않습니다. 또한 리밋 키를 IP만으로 잡으면 NAT 뒤 다수 사용자가 함께 막히거나, 분산 출처에 무력합니다. 사용자·API 키·행위 기반을 함께 씁니다.

## 확인 질문

한 요청이 소비할 수 있는 CPU·메모리·시간에 상한이 있나요? 과부하 상황에서 서비스는 전면 중단되나요, 아니면 일부 기능만 낮추며 버티나요?

## 참고 자료와 연결

[OWASP: Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html) · [CISA: DDoS 이해](https://www.cisa.gov/news-events/news/understanding-denial-service-attacks)

관련: [시스템 보안](system-security.md) · [네트워크 보안](network-security.md) · [웹 보안](web-security.md) · [목차](index.md)
