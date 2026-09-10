# XSS: 브라우저가 데이터를 코드로 해석할 때

> **TL;DR**
>
> XSS는 신뢰하지 않는 데이터가 페이지의 실행 가능한 내용으로 해석되는 문제입니다. 출력 위치에 맞는 인코딩과 안전한 DOM API가 핵심입니다.

AI 작성 해설

## 발생 원리와 영향

저장형은 저장된 데이터가 나중에 출력되고, 반사형은 요청의 데이터가 응답에 반영됩니다. DOM 기반 XSS는 브라우저 측 데이터 처리 경로에 주목하는 구분으로 앞의 분류와 겹칠 수 있습니다.

## 가상 사례로 이해하기

가상 댓글 화면에서 작성자의 문장은 텍스트로 보여야 합니다. 서식 있는 HTML을 허용한다면 허용 요소를 제한하는 정화 처리가 필요합니다. 다른 사용자의 페이지에서 코드가 실행되면 그 사용자의 권한에 영향을 줄 수 있습니다.

## 예방과 수정

- 텍스트 출력에는 textContent처럼 HTML로 해석하지 않는 API를 사용합니다.
- HTML·속성·URL 등 출력 문맥을 구분하고 프레임워크의 자동 이스케이프를 유지합니다.
- HTML 허용 시 검증된 sanitizer를 사용하고, CSP를 추가 방어로 적용합니다.

## 수정 후 확인할 조건

특수문자가 포함된 정상 댓글이 문자 그대로 보이는지 확인합니다. 템플릿의 원시 HTML 삽입 경로와 정화 이후 DOM 변경도 검토합니다.

## 자주 하는 오해

HttpOnly는 스크립트의 쿠키 읽기를 제한하지만 XSS 전체를 막지 않습니다. CSP도 올바른 출력 처리의 대체물이 아닙니다.

## 확인 질문

HTML 본문에 쓰던 인코딩을 URL이나 스크립트 문맥에 그대로 적용해도 될까요?

## 참고 자료와 연결

[OWASP: XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

관련: [웹 보안](../security/web-security.md) · [HTTP](../network/http-caching.md) · [학습 가이드](index.md) · [용어집](glossary.md)
