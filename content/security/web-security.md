# 웹 보안: 브라우저와 서버의 신뢰 경계

> **TL;DR**
>
> 웹 보안의 핵심은 외부 입력을 데이터로 다루고, 서버에서 권한을 확인하며, 브라우저가 자동으로 수행하는 동작을 이해하는 것입니다. 취약점마다 원인과 필요한 방어가 다릅니다.

AI 작성 해설

## 요청이 지나가는 경계

브라우저 → 웹 서버 → 애플리케이션 → 데이터베이스에는 여러 신뢰 경계가 있습니다. 폼에서 선택지를 제한해도 서버가 받는 값이 그 선택지 안에 있다는 보장은 없습니다. 입력의 형식·길이·범위를 검증하고, 요청자의 인증·인가를 별도로 확인합니다.

## 주요 문제와 방어의 대응

| 문제 | 원인 | 핵심 방어 |
|---|---|---|
| SQL Injection | 입력이 질의 구문으로 해석됨 | 매개변수화 쿼리, DB 최소 권한 |
| XSS | 신뢰할 수 없는 내용이 실행 가능한 웹 문맥에 들어감 | 문맥에 맞는 출력 인코딩, 안전한 DOM API |
| CSRF | 브라우저가 인증 정보를 자동 첨부한 원치 않는 요청 | CSRF 토큰, Origin 확인, SameSite 정책 |
| 접근 제어 실패 | 대상 객체나 작업에 대한 인가 누락 | 서버의 요청별·객체별 정책 검사 |
| SSRF | 서버의 외부 요청 대상이 신뢰할 수 없는 입력에 좌우됨 | 목적지 허용 정책, 네트워크 송신 제한 |

Injection은 입력을 코드와 섞는 문제입니다. SQL에서는 값을 바인딩하고, 동적 식별자처럼 바인딩할 수 없는 부분은 사전에 정한 허용 목록으로 선택합니다. 입력 검증만으로 질의 구조 분리를 대신하지 않습니다. [OWASP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)

## XSS: 출력되는 위치가 중요하다

HTML 본문, 속성, URL, 자바스크립트는 서로 다른 문맥입니다. 한 문맥의 이스케이프를 다른 문맥에 그대로 적용하지 않습니다. 사용자 문자열을 표시할 때는 텍스트 API를 사용하고, HTML을 허용해야 한다면 검증된 sanitizer로 정화합니다. CSP는 추가 방어이며 안전한 출력 처리를 대신하지 않습니다. [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## CSRF와 CORS를 구분하기

쿠키 기반 로그인에서는 브라우저가 요청에 쿠키를 붙일 수 있습니다. 따라서 상태 변경 작업에는 요청 의도와 출처를 확인하는 보호가 필요합니다. GET 요청으로 상태를 변경하지 않고, 프레임워크의 CSRF 보호를 적용합니다. [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

동일 출처 정책은 브라우저의 출처 간 접근을 제한합니다. 출처는 스킴·호스트·포트의 조합입니다. CORS는 다른 출처의 스크립트에 응답 읽기를 허용하는 정책이며 API의 인증이나 인가가 아닙니다. CORS 설정만으로 모든 외부 요청을 차단하거나 CSRF를 방지할 수 없습니다. SameSite에서 말하는 사이트도 출처와 완전히 같은 개념이 아닙니다.

## 서버의 외부 요청과 파일 처리

URL 미리보기 기능은 사용자가 지정한 위치로 서버가 접근하게 합니다. 업무상 필요한 목적지만 허용하고, 리디렉션과 DNS 해석 후의 실제 대상도 정책에 맞는지 다룹니다. 애플리케이션 검증과 네트워크 송신 통제를 함께 적용합니다. [OWASP SSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

업로드 파일은 사용자 입력입니다. 크기와 형식을 제한하고, 서버가 저장 이름을 정하며, 실행 가능한 경로와 분리합니다. 다운로드 역시 인가를 적용합니다. 확장자만으로 내용을 신뢰할 수 없습니다.

## 예시와 확인 질문

개인 메모 앱에 공유 기능을 넣는다면 본문 출력에는 XSS 방어, 공유 설정 변경에는 CSRF 보호와 인가, 첨부파일에는 별도 저장과 다운로드 인가가 필요합니다. HTTPS를 적용해도 이 요구들은 남습니다.

확인 질문: 로그인한 사용자가 접근할 수 있는 모든 문서를 수정해도 될까요? 읽기와 수정의 정책을 각각 설명해 보세요.

관련: [인증과 인가](authentication-authorization.md) · [시스템 보안](system-security.md) · [목차](index.md)
