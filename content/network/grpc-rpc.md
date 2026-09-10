# gRPC와 원격 프로시저 호출(RPC)

> **TL;DR**
>
> RPC는 네트워크 너머의 함수를 로컬 함수처럼 호출하는 모델입니다. gRPC는 HTTP/2 위에서 Protocol Buffers로 메시지를 직렬화해, 빠르고 타입이 명확한 서비스 간 통신을 제공합니다.

AI 작성 해설

## RPC의 아이디어와 한계

RPC는 원격 호출을 지역 함수 호출처럼 보이게 합니다. 하지만 네트워크는 지연·부분 실패·재시도가 있으므로, "로컬처럼 보이지만 로컬이 아니다"라는 점을 잊으면 안 됩니다. 이 간극은 [분산 시스템](../cs/distributed-systems.md)에서 다룹니다. REST가 자원 중심이라면 RPC는 동작(메서드) 중심입니다.

## gRPC의 구성

gRPC는 세 가지를 결합합니다: 전송은 [HTTP/2](tls-quic.md)(다중화·스트리밍), 직렬화는 Protocol Buffers(작고 빠른 이진 포맷), 계약은 `.proto` 스키마입니다. 스키마에서 클라이언트·서버 코드를 자동 생성하므로 타입이 명확합니다.

```protobuf
// user.proto — 서비스 계약(클라이언트·서버가 공유)
syntax = "proto3";

message GetUserRequest { int64 id = 1; }         // 필드마다 번호로 식별
message User { int64 id = 1; string name = 2; }

service UserService {
  rpc GetUser(GetUserRequest) returns (User);    // 원격 메서드 선언
}
```

```python
# 생성된 스텁으로 원격 메서드를 지역 함수처럼 호출
import grpc, user_pb2, user_pb2_grpc

with grpc.insecure_channel("localhost:50051") as channel:  # 실서비스는 TLS 사용
    stub = user_pb2_grpc.UserServiceStub(channel)
    user = stub.GetUser(user_pb2.GetUserRequest(id=7))
    print(user.name)
```

## 네 가지 호출 형태

HTTP/2 스트리밍 덕에 단순 요청-응답을 넘어섭니다: 단항(1:1), 서버 스트리밍(1:N), 클라이언트 스트리밍(N:1), 양방향 스트리밍(N:N). 실시간 지속 연결은 [웹소켓](websockets.md)과 목적이 겹치지만, gRPC는 스키마·코드 생성·다중화가 강점입니다.

## 스키마 진화와 호환성

Protobuf는 필드를 **번호**로 식별하므로, 이름을 바꿔도 번호가 같으면 호환됩니다. 새 필드는 추가하되 기존 번호를 재사용하지 않고, 삭제한 번호는 예약(reserved)합니다. 이렇게 하면 구·신 버전이 공존해도 통신이 깨지지 않습니다.

## 언제 쓰나

- 마이크로서비스 간 내부 통신(저지연·고빈도)에 적합합니다.
- 브라우저에서 직접 호출은 제약이 있어(gRPC-Web 필요), 공개 API는 여전히 REST/JSON이 흔합니다.
- 사람이 읽는 디버깅은 JSON보다 불편하므로 도구가 필요합니다.

보안은 채널 TLS + 호출별 인증·인가가 함께 필요하며, 이는 [API 보안](../security/api-security.md)과 이어집니다.

## 확인 질문

이 통신이 자원 조회 중심인가요, 동작 호출 중심인가요? 스키마를 바꿀 때 구버전 클라이언트가 계속 동작하도록 필드 번호 규칙을 지키고 있나요?

## 참고 자료와 연결

[gRPC 공식 문서](https://grpc.io/docs/) · [Protocol Buffers](https://protobuf.dev/)

관련: [TLS·HTTP/2·QUIC](tls-quic.md) · [웹소켓](websockets.md) · [분산 시스템](../cs/distributed-systems.md) · [목차](index.md) · [용어집](glossary.md)
