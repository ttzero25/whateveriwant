# 웹소켓: 실시간 양방향 통신

> **TL;DR**
>
> 웹소켓은 HTTP로 시작한 연결을 업그레이드해, 하나의 TCP 연결 위에서 서버와 클라이언트가 서로 자유롭게 메시지를 보내는 양방향 채널을 만듭니다. 요청-응답 모델이 맞지 않는 실시간 통신에 씁니다.

AI 작성 해설

## 왜 필요한가

HTTP는 클라이언트가 요청해야 서버가 응답하는 모델입니다. 채팅·알림·실시간 시세처럼 서버가 먼저 밀어줘야 하는 경우, 폴링은 지연과 오버헤드가 큽니다. 웹소켓은 연결을 한 번 맺고 계속 열어 두어 양쪽이 언제든 메시지를 보냅니다. HTTP 의미는 [HTTP 의미와 캐싱·프록시·CDN](http-caching.md)에서 다룹니다.

## 핸드셰이크: HTTP에서 시작한다

웹소켓 연결은 일반 HTTP GET에 `Upgrade` 헤더를 실어 시작합니다. 서버가 `101 Switching Protocols`로 응답하면 같은 TCP 연결이 웹소켓 프레임 채널로 전환됩니다.

```
클라이언트 → 서버
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

서버 → 클라이언트
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=   # Key + 고정 GUID의 SHA-1
```

전환 이후에는 요청-응답 구조가 사라지고, 텍스트·바이너리 프레임이 양방향으로 흐릅니다. TLS 위에서 쓰면 `wss://`입니다. [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)

## 최소 예제

```javascript
// 브라우저 클라이언트
const ws = new WebSocket("wss://example.com/chat");
ws.onopen  = () => ws.send(JSON.stringify({ type: "join", room: "general" }));
ws.onmessage = (e) => console.log("받음:", e.data);   // 서버가 먼저 밀어줄 수 있다
ws.onclose = () => console.log("연결 종료");
```

```python
# 서버(예: websockets 라이브러리) — 각 연결마다 코루틴이 돈다
import asyncio, websockets

clients = set()

async def handler(ws):
    clients.add(ws)
    try:
        async for message in ws:               # 클라이언트 메시지 수신 루프
            for peer in clients:               # 다른 모두에게 브로드캐스트
                if peer is not ws:
                    await peer.send(message)
    finally:
        clients.discard(ws)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        await asyncio.Future()                 # 계속 실행

asyncio.run(main())
```

## 운영에서 유의할 점

- **하트비트**: 유휴 연결은 프록시·NAT가 끊습니다. ping/pong 프레임으로 살아 있음을 확인하고 [성능·RTT·큐·MTU](performance-mtu.md) 관점에서 타임아웃을 잡습니다.
- **인증·인가**: 핸드셰이크는 HTTP이므로 여기서 인증하고, 연결 후에도 메시지마다 권한을 확인합니다. Origin 헤더를 검증해 다른 사이트에서 열리는 연결(Cross-Site WebSocket Hijacking)을 막습니다.
- **역압(backpressure)**: 느린 클라이언트가 서버 버퍼를 채우지 않도록 전송 큐 상한을 둡니다.
- **확장**: 여러 서버로 늘리면 연결이 서버별로 흩어지므로 pub/sub(예: Redis)으로 메시지를 공유합니다.

## 다른 실시간 기법과 비교

단방향 서버 푸시만 필요하면 Server-Sent Events(SSE)가 더 단순합니다. 낮은 지연·비순서 전송이 중요하면 [TLS·HTTP/2·QUIC·HTTP/3](tls-quic.md) 위의 WebTransport도 대안입니다.

## 확인 질문

연결이 끊겼을 때 재연결과 상태 복구는 어떻게 처리하나요? 핸드셰이크에서 인증한 신원을 이후 메시지의 인가에도 계속 적용하고 있나요?

## 참고 자료와 연결

[MDN: WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) · [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)

관련: [HTTP 의미와 캐싱](http-caching.md) · [TCP·UDP와 전송 동작](tcp-udp.md) · [TLS·HTTP/2·QUIC](tls-quic.md) · [목차](index.md) · [용어집](glossary.md)
