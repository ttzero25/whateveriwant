# 오픈 리다이렉트: 신뢰받는 도메인을 미끼로

> **TL;DR**
>
> 애플리케이션이 사용자가 준 URL로 그대로 리다이렉트하면, 공격자는 신뢰받는 도메인의 링크를 미끼로 피해자를 임의의 사이트로 보냅니다. 리다이렉트 대상은 서버가 정한 허용 목록에서만 선택해야 합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 발생 원리와 영향

로그인 후 복귀, 짧은 링크, 결제 콜백 등에서 `?next=`·`?returnUrl=` 같은 파라미터로 이동 대상을 받습니다. 이 값을 검증 없이 `Location` 헤더에 넣으면, `https://신뢰도메인/login?next=https://악성사이트`처럼 도메인만 보면 정상인 링크가 피해자를 외부로 보냅니다. 단독으로는 피싱 신뢰도를 높이고, OAuth 흐름과 결합하면 인가 코드·토큰 탈취로 확대됩니다. [SSRF](ssrf.md)가 서버의 요청을 노린다면 오픈 리다이렉트는 브라우저의 이동을 노립니다.

## 취약한 코드와 안전한 코드

```python
from urllib.parse import urlparse
from flask import request, redirect

# 취약: 외부 입력을 그대로 리다이렉트
def login_done_bad():
    return redirect(request.args.get("next", "/"))   # next=//evil.com 로 외부 이동

# 안전 1: 상대 경로만 허용(스킴·호스트가 붙으면 거부)
def safe_next(raw: str, default: str = "/") -> str:
    if not raw:
        return default
    p = urlparse(raw)
    if p.scheme or p.netloc:      # 절대 URL·프로토콜 상대(//host)는 거부
        return default
    if not raw.startswith("/") or raw.startswith("//"):
        return default
    return raw

# 안전 2: 사전 정의된 목적지 중에서만 선택
ALLOWED = {"dashboard": "/dashboard", "settings": "/settings"}
def login_done_ok():
    return redirect(ALLOWED.get(request.args.get("to"), "/"))
```

## 가상 사례로 이해하기

가상 뉴스 사이트가 로그인 후 `next` 파라미터로 원래 보던 페이지로 돌려보낸다고 합시다. `next`를 검증하지 않으면, 공격자가 그 사이트 도메인으로 시작하는 로그인 링크를 뿌리고, 로그인 직후 피해자를 자신의 가짜 페이지로 보냅니다. 링크의 앞부분이 진짜 도메인이라 피해자는 의심하기 어렵습니다.

## 예방과 수정

- 외부 입력을 목적지로 쓰지 말고, 서버가 정한 **허용 목록**에서 선택합니다.
- 부득이 경로를 받아야 하면 **상대 경로만** 허용하고, `//`(프로토콜 상대)와 절대 URL을 거부합니다.
- OAuth·SSO의 `redirect_uri`는 정확히 등록된 값만 허용합니다(부분 일치 금지). [API 보안](../security/api-security.md)
- 외부로 나가야 한다면 "지금 외부 사이트로 이동합니다" 같은 인터스티셜을 둡니다.

## 수정 후 확인할 조건

`next=//evil.com`, `next=https://evil.com`, `next=/\evil.com`, 백슬래시·인코딩 변형을 모두 거부하는지, 정상 내부 경로는 그대로 동작하는지 확인합니다.

## 자주 하는 오해

`http://`만 걸러내는 방식은 `//host`, `https:`, 백슬래시, 인코딩으로 우회됩니다. 문자열 필터가 아니라 구조적 허용 목록이 정답입니다.

## 확인 질문

리다이렉트 대상이 외부 입력에서 오나요? 그 값이 우리 도메인 밖으로 향할 수 있는 모든 표현을 막고 있나요?

## 참고 자료와 연결

[OWASP: Unvalidated Redirects and Forwards](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)

관련: [SSRF](ssrf.md) · [인증·세션 실패](authentication-session.md) · [XSS](xss.md) · [학습 가이드](index.md) · [용어집](glossary.md)
