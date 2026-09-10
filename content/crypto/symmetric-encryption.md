# 대칭키 암호: AES와 운영 모드

> **TL;DR**
>
> 대칭키 암호는 하나의 비밀키로 암호화·복호화합니다. 빠르고 큰 데이터에 적합하지만 키 전달이 과제이며, 오늘날에는 기밀성과 무결성을 함께 주는 인증 암호화(AEAD, 예: AES-GCM)를 기본으로 씁니다.

AI 작성 해설

## 블록 암호와 스트림 암호

대칭키 암호는 같은 키로 잠그고 엽니다. AES 같은 블록 암호는 고정 크기 블록(AES는 128비트) 단위로, ChaCha20 같은 스트림 암호는 키스트림을 데이터와 XOR합니다. 대칭키의 역할과 다른 도구와의 비교는 [암호학 개요](foundations.md)에서 다룹니다.

## 운영 모드가 안전성을 좌우한다

블록 암호 자체보다 **어떤 모드로 쓰느냐**가 중요합니다. 대표적으로 ECB는 같은 평문 블록을 같은 암호문으로 만들어 패턴이 노출되므로 쓰지 않습니다. 오늘날 권장은 기밀성과 무결성을 함께 제공하는 AEAD입니다.

| 모드 | 특징 |
|---|---|
| ECB | 패턴 노출, 사용 금지 |
| CBC | 순차적, 무결성 없음(별도 MAC 필요), 패딩 오라클 위험 |
| CTR | 병렬 가능, 무결성 없음 |
| GCM (AEAD) | CTR + 인증 태그, 기밀성 + 무결성 |

## AES-GCM 사용 예

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

key = AESGCM.generate_key(bit_length=256)   # 256비트 대칭키
aead = AESGCM(key)
nonce = os.urandom(12)                       # 96비트 nonce: 같은 키로 재사용 금지
aad = b"header-v1"                            # 인증만 하고 암호화하지 않을 부가 데이터

ct = aead.encrypt(nonce, b"secret message", aad)   # 암호문 + 인증 태그
pt = aead.decrypt(nonce, ct, aad)                  # 태그 검증 실패 시 예외 → 결과 미사용
```

## nonce/IV 규칙이 핵심

AES-GCM에서 **같은 키로 nonce를 재사용하면** 보안이 무너져 평문·인증키가 노출될 수 있습니다. nonce는 비밀일 필요는 없지만 반드시 유일해야 합니다(카운터나 난수로 관리). 난수 요구사항은 [난수와 엔트로피](randomness.md)와 이어집니다. 복호화에서 태그 검증이 실패하면 그 결과를 절대 사용하지 않습니다.

## 자주 하는 오해

- Base64·인코딩은 암호화가 아닙니다(키가 없음).
- 자체 암호 설계·자체 모드 조합은 피하고, 검증된 라이브러리의 AEAD를 씁니다.
- 대칭키만으로는 "누가 보냈는가"를 여러 참여자 사이에서 구별하지 못합니다. 그건 [전자서명](mac-and-signatures.md)의 몫입니다.

## 확인 질문

지금 쓰는 암호화가 무결성까지 보장하나요(AEAD인가), 아니면 암호문 변조를 탐지 못하나요? nonce가 같은 키로 재사용될 여지가 있나요?

## 참고 자료와 연결

[NIST SP 800-38D (GCM)](https://csrc.nist.gov/pubs/sp/800/38/d/final) · [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

관련: [암호학 개요](foundations.md) · [비대칭키 암호](asymmetric-encryption.md) · [키 관리](key-management.md) · [목차](index.md) · [용어집](glossary.md)
