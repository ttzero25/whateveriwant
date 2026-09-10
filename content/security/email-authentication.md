# 이메일 인증: SPF·DKIM·DMARC

> **TL;DR**
>
> 이메일은 본래 발신자를 검증하지 않으므로 스푸핑이 쉽습니다. SPF는 발신 서버 IP를, DKIM은 메시지 서명을, DMARC는 이 둘을 발신 도메인과 정렬해 검사하는 정책을 정의합니다. 세 가지를 함께 배포해야 도메인 사칭을 실질적으로 막습니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 왜 필요한가

SMTP의 `MAIL FROM`과 헤더의 `From:`은 누구나 임의로 채울 수 있습니다. 그래서 피싱은 신뢰받는 도메인을 사칭합니다. SPF·DKIM·DMARC는 모두 DNS TXT 레코드로 배포하는 도메인 소유자의 선언입니다. 인증·신뢰 경계 개념은 [인증과 인가](authentication-authorization.md)와 이어집니다.

## 세 메커니즘의 역할

| 표준 | 검증 대상 | 한계 |
|---|---|---|
| SPF | 어떤 IP가 이 도메인으로 보낼 수 있는가 | 전달(forwarding) 시 깨짐, `From:`이 아닌 envelope 검사 |
| DKIM | 메시지가 서명 후 변조되지 않았는가 | 서명만으로는 어느 `From:`인지 강제 못함 |
| DMARC | SPF/DKIM 결과가 `From:` 도메인과 정렬되는가 + 실패 시 정책 | SPF·DKIM 배포가 선행돼야 의미 |

## 배포 예시 (DNS TXT)

```dns
; SPF: 이 도메인의 정식 발신 서버만 허용, 나머지는 소프트 실패
example.com.        IN TXT "v=spf1 include:_spf.google.com ip4:203.0.113.10 -all"

; DKIM: 선택자(selector1)로 공개키 게시. 메일 서버가 개인키로 서명한다
selector1._domainkey.example.com. IN TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSq...QAB"

; DMARC: 정렬 실패 시 격리, 리포트 수신 주소 지정
_dmarc.example.com. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; adkim=s; aspf=s; pct=100"
```

`-all`은 하드 실패(허용 목록 외 거부 요청), `~all`은 소프트 실패입니다. DMARC의 `p=`는 `none`(관측만) → `quarantine` → `reject` 순으로 강화하며, 처음에는 `p=none`으로 리포트를 모아 정상 발신 경로를 모두 파악한 뒤 조입니다.

## 정렬(alignment)이 핵심

DMARC는 SPF/DKIM이 "통과"하는 것만으로 부족하고, 그 통과한 도메인이 사용자가 보는 `From:` 도메인과 **정렬**되어야 통과로 봅니다. 그래서 공격자가 자기 도메인으로 SPF를 통과시켜도 `From:`을 사칭하면 DMARC에서 걸립니다. `adkim=s`/`aspf=s`는 엄격 정렬(정확히 일치), 기본은 완화(상위 도메인 허용)입니다.

## 운영 절차

1. `p=none`으로 시작해 `rua` 리포트로 정상 발신 소스를 모두 식별합니다(마케팅·티켓·SaaS 포함).
2. 모든 소스에 SPF include와 DKIM 서명을 붙입니다.
3. 리포트가 깨끗해지면 `quarantine` → `reject`로 올립니다.
4. 전달·메일링리스트로 SPF가 깨지는 경우 DKIM으로 보완하고, 필요하면 ARC를 검토합니다.

## 확인 질문

우리 도메인의 모든 발신 경로(내부 메일, SaaS 알림, 마케팅)가 SPF/DKIM에 포함되어 있나요? DMARC 정책이 아직 `p=none`이라면, 관측된 사칭 시도를 리포트로 보고 있나요?

## 참고 자료와 연결

[RFC 7208 (SPF)](https://datatracker.ietf.org/doc/html/rfc7208) · [RFC 6376 (DKIM)](https://datatracker.ietf.org/doc/html/rfc6376) · [RFC 7489 (DMARC)](https://datatracker.ietf.org/doc/html/rfc7489)

관련: [네트워크 보안](network-security.md) · [인증과 인가](authentication-authorization.md) · [웹 보안](web-security.md) · [목차](index.md) · [용어집](glossary.md)
