# 로드 밸런싱과 리버스 프록시

> **TL;DR**
>
> 로드 밸런서는 들어오는 요청을 여러 서버로 분산해 확장성과 가용성을 확보합니다. L4는 연결을, L7은 요청 내용을 보고 분배하며, 리버스 프록시는 그 앞단에서 TLS 종료·캐싱·라우팅을 함께 처리합니다.

AI 작성 해설

## 왜 앞단이 필요한가

한 서버로는 트래픽·장애를 감당하기 어렵습니다. 여러 서버(백엔드 풀) 앞에 분배기를 두면, 부하를 나누고 죽은 서버를 우회할 수 있습니다. 클라이언트는 하나의 주소만 알면 됩니다. 프록시·캐시 개념은 [HTTP 의미와 캐싱·프록시·CDN](http-caching.md)과 이어집니다.

## L4와 L7

| 구분 | 보는 것 | 할 수 있는 일 |
|---|---|---|
| L4(전송) | IP·포트·연결 | 연결 단위 분배, 매우 빠름, 내용 무관 |
| L7(응용) | HTTP 경로·헤더·쿠키 | 경로 기반 라우팅, TLS 종료, 헤더 조작, 콘텐츠 캐싱 |

L4는 [TCP·UDP와 전송 동작](tcp-udp.md) 수준에서 패킷을 넘기고, L7은 요청을 실제로 해석합니다. 리버스 프록시(nginx·Envoy·HAProxy)는 보통 L7에서 동작하며 로드 밸런싱을 포함합니다.

## 분배 알고리즘

- **라운드 로빈**: 순서대로 분배(가장 단순).
- **최소 연결**: 현재 연결이 가장 적은 서버로.
- **가중치**: 성능이 좋은 서버에 더 많이.
- **해시**: 클라이언트 IP·키로 같은 서버에 고정(세션 유지).

```nginx
# nginx: 리버스 프록시 + 로드 밸런싱 + 헬스 체크(개념 예시)
upstream app {
    least_conn;                       # 연결이 가장 적은 백엔드로
    server 10.0.0.11:8080 weight=2;   # 성능 좋은 서버에 가중치
    server 10.0.0.12:8080;
    server 10.0.0.13:8080 backup;     # 평소엔 대기, 장애 시 투입
}
server {
    listen 443 ssl;                   # 여기서 TLS 종료
    location / {
        proxy_pass http://app;
        proxy_set_header X-Forwarded-For $remote_addr;  # 원 클라이언트 IP 전달
    }
}
```

## 헬스 체크와 세션

로드 밸런서는 주기적으로 백엔드 상태를 확인해 실패한 서버를 풀에서 빼고 복구되면 되돌립니다. 상태를 서버 로컬에 두면 특정 서버에 고정(sticky)해야 하므로, 세션을 외부 저장소(공유 캐시·DB)에 두어 어느 서버든 처리하게 하는 편이 확장에 유리합니다. 이는 [분산 시스템](../cs/distributed-systems.md)의 상태 설계와 이어집니다.

## 보안·성능 관점

앞단에서 TLS를 종료하면 인증서 관리가 한곳으로 모입니다([TLS·HTTP/2·QUIC](tls-quic.md)). 여기서 레이트 리밋·WAF·헤더 정규화도 적용해 백엔드를 보호합니다([가용성과 DoS 방어](../security/availability-dos.md)). 다만 앞단은 단일 장애점이 될 수 있으므로, 로드 밸런서 자체도 이중화(애니캐스트·다중 인스턴스)합니다.

## 확인 질문

한 서버가 죽으면 요청이 자동으로 다른 서버로 가나요? 세션 상태가 특정 서버에 묶여 있어 확장을 막고 있지는 않나요?

## 참고 자료와 연결

[nginx: Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/) · [Envoy Proxy 문서](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/intro/what_is_envoy)

관련: [HTTP 의미와 캐싱](http-caching.md) · [TCP·UDP와 전송 동작](tcp-udp.md) · [TLS·HTTP/2·QUIC](tls-quic.md) · [목차](index.md) · [용어집](glossary.md)
