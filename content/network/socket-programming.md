# 소켓 프로그래밍: 버클리 소켓 API

> **TL;DR**
>
> 소켓은 애플리케이션이 전송 계층(TCP/UDP)을 다루는 표준 인터페이스입니다. 서버는 bind·listen·accept로 연결을 받고, 클라이언트는 connect로 연결하며, 이 흐름이 모든 네트워크 프로그램의 밑바탕입니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 소켓이란

소켓은 IP 주소와 포트로 식별되는 통신 종단점입니다. 운영체제는 소켓을 파일 디스크립터로 다루므로, 네트워크 입출력도 파일처럼 읽고 씁니다. 전송 계층 동작(연결·순서·재전송 vs 비연결)은 [TCP·UDP와 전송 동작](tcp-udp.md)에서 다룹니다. OS 관점의 디스크립터·시스템 콜은 [파일시스템·경로·파일 디스크립터](../os/filesystems.md)와 이어집니다.

## TCP 서버와 클라이언트의 호출 순서

```
서버                          클라이언트
socket()                     socket()
bind()   (주소·포트 지정)
listen() (연결 대기 큐)
accept() ◀───────────────── connect()   (3-way handshake)
recv()/send() ◀──────────▶ send()/recv()
close()                      close()
```

`accept()`는 새 연결마다 별도의 소켓을 돌려줍니다. 원래의 리스닝 소켓은 계속 새 연결을 받습니다.

## 최소 TCP 에코 서버

```python
import socket

srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)   # IPv4 + TCP
srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) # 재시작 시 주소 재사용
srv.bind(("0.0.0.0", 9000))
srv.listen(128)                                           # 대기 큐 크기
print("listening on :9000")

while True:
    conn, addr = srv.accept()                             # 연결 하나 수락
    with conn:
        while True:
            data = conn.recv(4096)                        # 스트림에서 일부 수신
            if not data:                                  # 상대가 close -> EOF
                break
            conn.sendall(data)                            # 받은 만큼 되돌려 보냄
```

```python
# 클라이언트
import socket
with socket.create_connection(("127.0.0.1", 9000)) as s:
    s.sendall(b"hello")
    print(s.recv(4096))   # b"hello"
```

## TCP는 스트림이다: 메시지 경계가 없다

가장 흔한 오해는 `send()` 한 번이 `recv()` 한 번과 대응한다는 가정입니다. TCP는 **바이트 스트림**이라 한 번의 recv가 여러 send를 합치거나 하나를 쪼갤 수 있습니다. 그래서 애플리케이션이 직접 메시지 경계를 정해야 합니다(길이 접두사 또는 구분자).

```python
import struct

def send_msg(sock, payload: bytes):
    sock.sendall(struct.pack(">I", len(payload)) + payload)   # 4바이트 길이 + 본문

def recv_exact(sock, n: int) -> bytes:
    buf = b""
    while len(buf) < n:                    # 원하는 바이트 수를 다 받을 때까지 반복
        chunk = sock.recv(n - len(buf))
        if not chunk:
            raise ConnectionError("connection closed")
        buf += chunk
    return buf

def recv_msg(sock) -> bytes:
    (length,) = struct.unpack(">I", recv_exact(sock, 4))
    return recv_exact(sock, length)
```

## UDP: 연결 없는 데이터그램

UDP는 handshake 없이 `sendto`/`recvfrom`로 데이터그램을 주고받습니다. 순서·재전송을 보장하지 않으므로 손실을 애플리케이션이 감당하거나 무시합니다. 실시간·조회형 트래픽에 적합합니다.

## 확장: 동시성

블로킹 소켓 하나로는 한 번에 한 연결만 처리합니다. 다수 연결은 스레드/프로세스, 또는 `select`/`epoll` 기반 이벤트 루프로 다룹니다. 이벤트 루프는 [I/O·인터럽트·비동기](../os/io-interrupts.md)와 이어집니다.

## 확인 질문

지금 프로토콜에서 메시지 경계를 어떻게 정하고 있나요? `recv`가 기대한 바이트보다 적게 돌려줄 수 있다는 점을 코드가 처리하나요?

## 참고 자료와 연결

[Beej's Guide to Network Programming](https://beej.us/guide/bgnet/) · [Python socket 문서](https://docs.python.org/3/library/socket.html)

관련: [TCP·UDP와 전송 동작](tcp-udp.md) · [네트워크 계층과 패킷 전달](layers-packets.md) · [웹소켓](websockets.md) · [목차](index.md)
