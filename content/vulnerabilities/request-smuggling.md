# HTTP 요청 스머글링: 파싱 불일치

> **TL;DR**
>
> 프론트엔드(프록시·CDN)와 백엔드가 요청의 경계를 서로 다르게 해석하면, 하나의 연결에 숨긴 두 번째 요청이 다른 사용자의 요청과 섞입니다. 원인은 `Content-Length`와 `Transfer-Encoding`의 처리 불일치입니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 발생 원리

HTTP는 요청 본문의 길이를 두 방식으로 나타냅니다: `Content-Length`(바이트 수)와 `Transfer-Encoding: chunked`(청크 종료 표시). 두 헤더가 함께 있거나 모호할 때, 프론트와 백엔드가 서로 다른 헤더를 신뢰하면 한쪽이 본문으로 본 바이트를 다른 쪽은 **다음 요청의 시작**으로 봅니다. 그 틈에 공격자가 요청을 끼워 넣습니다. 프록시·CDN·연결 재사용 개념은 [HTTP 의미와 캐싱·프록시·CDN](../network/http-caching.md)과 이어집니다.

## CL.TE와 TE.CL

```
POST / HTTP/1.1
Host: example.com
Content-Length: 6
Transfer-Encoding: chunked

0

GARBAGE
```

- **CL.TE**: 프론트는 `Content-Length`로, 백엔드는 `Transfer-Encoding`으로 파싱. 백엔드는 `0\r\n\r\n`에서 요청이 끝났다고 보고, 남은 `GARBAGE`를 다음 요청의 앞부분으로 처리합니다.
- **TE.CL**: 반대로 프론트가 chunked, 백엔드가 `Content-Length`를 신뢰.

끼워 넣은 조각은 뒤이어 오는 **다른 사용자의 요청 앞에 붙어** 그 요청의 경로·헤더를 오염시킵니다.

## 영향

- 프론트의 접근 제어를 우회해 내부 경로에 도달
- 다른 사용자의 요청을 탈취하거나 응답을 뒤섞기(요청/응답 큐 포이즈닝)
- 캐시 포이즈닝으로 악성 응답을 다수에게 배포
- 저장 XSS·자격 증명 탈취로 확대

## 예방과 수정

- **HTTP/2를 엔드투엔드로** 사용하면 본문 길이가 프레이밍으로 명확해져 이 계열 다수가 사라집니다. HTTP/1.1로 다운그레이드되는 구간을 점검합니다. [TLS·HTTP/2·QUIC](../network/tls-quic.md)
- 프론트와 백엔드가 **동일한 파서·동일한 규칙**을 쓰게 하고, `Content-Length`와 `Transfer-Encoding`이 함께 온 요청은 거부합니다.
- 모호하거나 규격 위반인 요청(중복 헤더, 비정상 chunked)은 통과시키지 말고 차단합니다.
- 프론트-백엔드 연결 재사용을 신중히 설정합니다.

이는 애플리케이션 코드보다 **인프라 구성**의 문제이며, 방어는 경계의 파싱 일관성에 있습니다.

## 수정 후 확인할 조건

프록시·CDN·웹서버·앱서버 각 단이 길이 헤더를 어떻게 해석하는지 일치하는지, 두 길이 헤더가 동시에 있는 요청이 거부되는지 확인합니다. 정상 chunked 업로드는 그대로 동작해야 합니다.

## 자주 하는 오해

"WAF가 있으니 괜찮다"는 가정은 위험합니다. 스머글링은 WAF 자체를 우회하는 데 쓰이기도 합니다. 근본 해법은 파싱 일관성입니다.

## 확인 질문

우리 요청 경로에 서로 다른 HTTP 구현이 몇 단이나 있고, 각 단이 요청 경계를 동일하게 해석하나요?

## 참고 자료와 연결

[PortSwigger: HTTP request smuggling](https://portswigger.net/web-security/request-smuggling) · [RFC 9112 §6 (message body)](https://datatracker.ietf.org/doc/html/rfc9112#section-6)

관련: [HTTP 의미와 캐싱](../network/http-caching.md) · [TLS·HTTP/2·QUIC](../network/tls-quic.md) · [설정 오류·정보 노출](misconfiguration.md) · [학습 가이드](index.md) · [용어집](glossary.md)
