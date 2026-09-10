# 취약점 한영 용어집

> **TL;DR**
>
> 취약점의 유형, 원인, 방어 수단을 구분하고 필요한 개념 글로 이동하세요.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 분류와 판단

| 용어 | 의미 |
|---|---|
| Weakness / 약점 | 보안 문제를 만들 수 있는 설계·구현상의 유형 |
| Vulnerability / 취약점 | 특정 제품·환경의 보안 요구를 깨는 문제 |
| CWE | 약점 유형을 분류하는 체계 |
| CVE | 공개된 취약점 레코드의 식별 체계 |
| CVSS | 취약점의 기술적 심각도를 표현하는 점수 체계 |
| Trust boundary / 신뢰 경계 | 서로 다른 신뢰 수준이 만나는 지점 |
| Attack surface / 공격 표면 | 외부 입력·접근을 받아들이는 인터페이스 범위 |

출처와 해설: [학습 가이드](index.md)

## 웹과 API

| 용어 | 의미 |
|---|---|
| SQL Injection | 외부 데이터가 SQL의 의미에 개입하는 문제 |
| XSS / Cross-site Scripting | 외부 데이터가 페이지의 실행 가능한 내용으로 해석되는 문제 |
| CSRF / Cross-site Request Forgery | 자동 전송 인증 정보를 이용한 원치 않는 요청 문제 |
| IDOR | 객체 참조에 대한 권한 확인 누락과 관련된 접근 제어 문제 |
| BOLA / Broken Object Level Authorization | API의 객체 수준 인가 실패 |
| SSRF / Server-side Request Forgery | 외부 입력에 의해 서버의 요청 대상이 부적절하게 결정되는 문제 |
| Session / 세션 | 여러 요청을 사용자의 인증·상태와 연결하는 수단 |

해설: [SQL](sql-injection.md) · [XSS](xss.md) · [CSRF](csrf.md) · [접근 제어](access-control.md) · [세션](authentication-session.md) · [SSRF](ssrf.md)

## 파일·객체·메모리

| 용어 | 의미 |
|---|---|
| Path traversal / 경로 순회 | 파일 접근이 허용된 디렉터리 범위를 벗어나는 문제 |
| Command injection / 명령 주입 | 외부 데이터가 운영체제 명령의 의미에 개입하는 문제 |
| Deserialization / 역직렬화 | 저장·전송 형식에서 데이터나 객체를 복원하는 과정 |
| Out-of-bounds / 경계 밖 접근 | 유효한 메모리 범위를 벗어난 읽기·쓰기 |
| Use-after-free / 해제 후 사용 | 수명이 끝난 메모리 객체를 계속 사용하는 문제 |
| Race condition / 경쟁 상태 | 공유 자원의 동기화 부족으로 실행 순서에 따라 결과가 달라지는 문제 |
| TOCTOU / Time of Check to Time of Use | 확인과 사용 사이의 상태 변경 문제 |
| Invariant / 불변식 | 작업과 동시 실행에도 유지해야 하는 규칙 |

해설: [파일 처리](file-handling.md) · [명령 주입](command-injection.md) · [역직렬화](deserialization.md) · [메모리 안전성](memory-safety.md) · [경쟁 상태](race-conditions.md)

## 방어와 수정

| 용어 | 의미 |
|---|---|
| Parameterized query / 매개변수화 쿼리 | 데이터 값과 SQL 구조를 분리하는 방식 |
| Output encoding / 출력 인코딩 | 출력 문맥에서 데이터를 문법으로 해석하지 않도록 표현 |
| Sanitization / 정화 | 허용된 구조만 남기는 처리; 출력 인코딩과 다름 |
| Allowlist / 허용 목록 | 허용된 대상·값·행동을 명시하는 정책 |
| Least privilege / 최소 권한 | 업무에 필요한 범위만 권한을 부여하는 원칙 |
| Fail closed | 검증·처리 실패 시 보호된 작업을 기본 거절하는 동작 |
| Regression test / 회귀 테스트 | 수정한 문제가 재발하지 않는지 확인하는 테스트 |

해설: [설정·오류 처리](misconfiguration.md) · [보안 원칙](../security/principles.md) · [학습 가이드](index.md)

## 심화 주제

- [OOB Read / Write](out-of-bounds.md): 경계 밖 읽기 / 쓰기. 수명 오류인 UAF와 구분합니다.
- [권한 우회 / Authorization bypass](authorization-bypass.md): 허용되지 않은 작업이 정책 검사를 제대로 거치지 않는 문제.
- 수평 권한: 같은 역할 사이의 자원 접근 범위. 수직 권한: 역할·권한 수준 사이의 경계.
- BFLA / Broken Function Level Authorization: 기능 수준 인가 실패.

## 확장 개념 용어

- [XXE / XML External Entity](xxe.md): XML 파서가 외부 엔터티를 확장해 파일 노출·SSRF로 이어지는 문제.
- [SSTI / Server-Side Template Injection](ssti.md): 사용자 입력이 템플릿 코드로 평가되어 코드 실행에 이르는 문제.
- [오픈 리다이렉트 / Open redirect](open-redirect.md): 검증 없는 리다이렉트 대상으로 피싱·토큰 탈취를 돕는 문제.
- [HTTP 요청 스머글링 / Request smuggling](request-smuggling.md): 프론트·백엔드의 요청 경계 해석 불일치를 악용.
- [클릭재킹 / Clickjacking](clickjacking.md): 투명 프레임으로 사용자의 클릭을 가로채는 UI 위장.
- [프로토타입 오염 / Prototype pollution](prototype-pollution.md): 입력의 `__proto__` 등으로 공유 원형을 오염.
- [정수 오버플로 / Integer overflow](integer-overflow.md): 산술이 표현 범위를 넘어 감싸며 검사·할당을 무너뜨림.
- ReDoS / Regular expression DoS: 중첩 수량자 정규식의 지수적 백트래킹을 악용한 서비스 거부.
