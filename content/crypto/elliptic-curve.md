# 타원곡선 암호(ECC)

> **TL;DR**
>
> ECC는 타원곡선 위 점의 이산로그 문제에 기반해, RSA와 같은 안전성을 훨씬 짧은 키로 달성합니다. 키 교환(ECDH)과 서명(ECDSA·Ed25519)에 쓰이며, 오늘날 TLS·모바일·암호화폐의 기본입니다.

AI 작성 해설

## 짧은 키로 같은 안전성

RSA가 인수분해의 어려움에 기댄다면, ECC는 타원곡선 위에서 정의된 이산로그 문제(ECDLP)의 어려움에 기댑니다. 이 문제가 더 어렵게 여겨져, 훨씬 작은 키로 같은 안전성을 얻습니다. 비대칭 암호의 역할 비교는 [비대칭키 암호](asymmetric-encryption.md)에서 다룹니다.

| 안전성 수준 | RSA 키 | ECC 키 |
|---|---|---|
| 128비트 | 3072비트 | 256비트 |
| 192비트 | 7680비트 | 384비트 |
| 256비트 | 15360비트 | 521비트 |

작은 키는 저장·전송·연산이 가벼워 모바일·임베디드·TLS 핸드셰이크에 유리합니다.

## 점 덧셈과 스칼라 곱

ECC의 연산은 곡선 위 점의 "덧셈"으로 정의됩니다. 한 점 G(생성점)를 정수 k만큼 더하는 스칼라 곱 k·G는 쉽게 계산되지만, 결과 점과 G만 보고 k를 역산하는 것(ECDLP)은 매우 어렵습니다. 개인키가 k, 공개키가 k·G입니다.

```python
# 개념 예시: 개인키(스칼라)로 공개키(점) 유도 — 실제로는 검증된 라이브러리를 쓴다
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes

priv = ec.generate_private_key(ec.SECP256R1())   # 개인키 k
pub = priv.public_key()                           # 공개키 k·G

sig = priv.sign(b"message", ec.ECDSA(hashes.SHA256()))  # ECDSA 서명
pub.verify(sig, b"message", ec.ECDSA(hashes.SHA256()))  # 검증(실패 시 예외)
```

## 대표 용도

- **ECDH**: 두 당사자가 상대 공개점에 자기 스칼라를 곱해 같은 공유 비밀을 유도(키 교환). 임시 키를 쓰면 전방향 비밀성이 생깁니다. [키 교환과 전방향 비밀성](key-exchange.md)
- **ECDSA / Ed25519**: 서명. Ed25519(Curve25519 기반 EdDSA)는 결정적이고 구현 실수에 강해 널리 권장됩니다. [MAC과 전자서명](mac-and-signatures.md)

## 곡선 선택과 함정

- 검증된 곡선(P-256, Curve25519 등)을 쓰고, 출처가 불분명한 곡선·매개변수는 피합니다.
- ECDSA는 서명마다 유일한 난수 k가 필요하며, k가 재사용·예측되면 개인키가 유출됩니다(과거 실제 사고). Ed25519는 k를 결정적으로 유도해 이 위험을 없앴습니다. 난수 요구는 [난수와 엔트로피](randomness.md)와 이어집니다.
- ECC도 양자 컴퓨터(쇼어 알고리즘)에는 취약해, [양자 이후 암호](post-quantum.md)로의 전환 대상입니다.

## 확인 질문

같은 안전성이라면 RSA와 ECC 중 키·성능 면에서 무엇이 유리한가요? ECDSA를 쓴다면 서명 난수 k의 유일성이 보장되나요(아니면 Ed25519가 안전)?

## 참고 자료와 연결

[SafeCurves](https://safecurves.cr.yp.to/) · [RFC 8032 (EdDSA)](https://datatracker.ietf.org/doc/html/rfc8032)

관련: [비대칭키 암호](asymmetric-encryption.md) · [RSA](rsa.md) · [키 교환](key-exchange.md) · [MAC과 전자서명](mac-and-signatures.md) · [목차](index.md) · [용어집](glossary.md)
