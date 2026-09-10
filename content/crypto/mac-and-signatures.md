# MAC과 전자서명

> **TL;DR**
>
> MAC은 공유 비밀키로 메시지의 무결성과 "키를 가진 쪽이 만들었다"를 증명하고, 전자서명은 개인키로 서명해 공개키로 누구나 검증하게 합니다. MAC은 대칭, 서명은 비대칭이라는 차이가 부인 방지 여부를 가릅니다.

AI 작성 해설

## 무결성을 넘어 출처까지

해시는 무결성 요약만 줍니다([해시 함수](hashing.md)). 키를 더하면 "이 메시지를 만든 주체가 키를 가졌다"까지 보증할 수 있습니다. MAC과 서명이 그 역할을 합니다.

| | MAC (예: HMAC) | 전자서명 (예: ECDSA, Ed25519) |
|---|---|---|
| 키 | 공유 비밀키(대칭) | 개인키 서명 / 공개키 검증(비대칭) |
| 검증 주체 | 같은 키를 가진 쪽 | 공개키를 가진 누구나 |
| 부인 방지 | 없음(둘 다 키 보유) | 있음(개인키 보유자만 서명) |
| 속도 | 빠름 | 상대적으로 느림 |

## HMAC 사용 예

```python
import hmac, hashlib

def sign(message: bytes, key: bytes) -> str:
    return hmac.new(key, message, hashlib.sha256).hexdigest()

def verify(message: bytes, key: bytes, tag: str) -> bool:
    expected = sign(message, key)
    return hmac.compare_digest(expected, tag)   # 상수 시간 비교로 타이밍 누출 방지
```

MAC 검증은 반드시 상수 시간 비교를 씁니다. 일반 `==`는 첫 불일치 바이트에서 빨리 끝나 타이밍으로 태그를 알아낼 수 있습니다.

## 전자서명

서명은 개인키로 메시지 해시에 서명하고, 검증자는 공개키로 확인합니다. 같은 키를 공유할 필요가 없어, 공개된 다수가 검증할 수 있고 서명자만 개인키를 가지므로 **부인 방지**가 성립합니다(공개키와 신원의 연결은 [PKI](pki-and-certificates.md)로 보증). 현대에는 Ed25519처럼 구현 실수에 강한 방식이 선호됩니다.

## MAC이냐 서명이냐

- 통신 두 당사자가 이미 비밀키를 공유하고 무결성만 필요하면 **MAC**(빠름).
- 다수가 검증해야 하거나 "누가 서명했는지"를 부인 못 하게 하려면 **서명**.
- API 요청 인증(공유 시크릿)에는 HMAC, 소프트웨어 배포·인증서에는 서명이 흔합니다.

## 자주 하는 오해

- 서명은 내용을 숨기지 않습니다(기밀성은 암호화의 몫).
- HMAC의 "인증"은 키를 공유한 두 주체를 구별하지 못하므로, 제3자에게 출처를 증명하는 용도로는 부족합니다.

## 확인 질문

이 무결성 검증을 제3자에게도 증명해야 하나요(그렇다면 서명)? 태그·서명 비교가 상수 시간인가요?

## 참고 자료와 연결

[RFC 2104 (HMAC)](https://datatracker.ietf.org/doc/html/rfc2104) · [RFC 8032 (EdDSA)](https://datatracker.ietf.org/doc/html/rfc8032)

관련: [해시 함수](hashing.md) · [비대칭키 암호](asymmetric-encryption.md) · [PKI와 인증서](pki-and-certificates.md) · [목차](index.md) · [용어집](glossary.md)
