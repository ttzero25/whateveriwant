# API 보안: OAuth 2.0, OIDC, JWT

> **TL;DR**
>
> OAuth 2.0은 인가 위임, OIDC는 그 위에 얹은 인증, JWT는 그 결과를 담는 토큰 형식입니다. 세 가지는 목적이 다르며, 토큰은 서버에서 서명·발급자·수신자·수명·범위를 모두 검증해야 신뢰할 수 있습니다.

AI 작성 해설

## 세 개념의 역할을 분리하기

혼동하기 쉬운 세 가지를 먼저 나눕니다.

| 개념 | 답하는 질문 | 산출물 |
|---|---|---|
| OAuth 2.0 | 이 앱이 사용자를 대신해 어떤 자원에 접근해도 되는가 (인가 위임) | access token |
| OpenID Connect | 이 사용자는 누구인가 (인증) | ID token |
| JWT | 위 정보를 어떻게 담아 전달하는가 (형식) | 서명된 토큰 문자열 |

OAuth는 "인증 프로토콜"이 아닙니다. 로그인을 구현하려면 OAuth 위에 정의된 OIDC를 사용합니다. access token으로 사용자 신원을 판단하는 것은 흔한 설계 오류입니다. [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) · [OIDC](https://openid.net/specs/openid-connect-core-1_0.html)

## 권장 인가 흐름

브라우저·모바일·SPA 모두 **Authorization Code + PKCE**를 사용합니다. Implicit Grant와 Resource Owner Password Grant는 폐기 대상입니다. PKCE는 인가 코드가 탈취되어도 `code_verifier` 없이는 교환할 수 없게 만듭니다.

```
브라우저 ──(1) /authorize?code_challenge=S256(verifier)──▶ 인가 서버
        ◀──(2) redirect ?code=xxx&state=yyy──────────────┘
앱      ──(3) /token  code=xxx & code_verifier=verifier ─▶ 인가 서버
        ◀──(4) access_token(+ id_token, refresh_token)───┘
```

`state`는 CSRF 방지, `nonce`는 ID token 재생 방지에 사용합니다. redirect_uri는 사전 등록된 정확한 값만 허용합니다. [PKCE (RFC 7636)](https://datatracker.ietf.org/doc/html/rfc7636)

## JWT 검증에서 놓치기 쉬운 것

JWT는 `header.payload.signature`의 Base64URL 세 부분입니다. payload는 **암호화가 아니라 서명**일 뿐이므로 민감 정보를 넣지 않습니다. 검증에서 서명만 보고 클레임을 빠뜨리는 사례가 많습니다.

```python
import jwt  # PyJWT

def verify(token: str, jwks_key, issuer: str, audience: str) -> dict:
    return jwt.decode(
        token,
        key=jwks_key,
        algorithms=["RS256"],   # alg=none, HS256 혼용 공격 차단 (허용 알고리즘 고정)
        issuer=issuer,          # iss: 신뢰하는 발급자인가
        audience=audience,      # aud: 이 API가 수신자인가
        options={"require": ["exp", "iat", "iss", "aud"]},
    )  # exp/nbf(수명)는 라이브러리가 자동 검증
```

핵심 검증 항목: 서명, `alg` 고정(특히 `none`과 대칭키 혼용 금지), `iss`, `aud`, `exp`. 하나라도 빠지면 다른 서비스용 토큰이나 만료 토큰이 통과할 수 있습니다.

## 토큰 수명과 폐기

access token은 짧게(분 단위) 두고, 갱신은 refresh token으로 합니다. 서명된 JWT는 만료 전 강제 폐기가 어렵습니다. 로그아웃·유출 대응이 필요하면 서버 측 세션이나 토큰 introspection, 또는 짧은 수명 + 폐기 목록(jti)을 함께 씁니다. refresh token은 회전(rotation)시키고 재사용을 탐지합니다.

## 확인 질문

access token만으로 "현재 로그인한 사용자"를 판단하고 있지는 않나요? 여러 API가 발급자·수신자 클레임을 모두 검증하나요?

## 참고 자료와 연결

[OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x00-header/) · [OAuth 2.0 Security BCP](https://datatracker.ietf.org/doc/html/rfc9700)

관련: [인증과 인가](authentication-authorization.md) · [웹 보안](web-security.md) · [클라우드 IAM과 시크릿](cloud-identity-secrets.md) · [목차](index.md) · [용어집](glossary.md)
