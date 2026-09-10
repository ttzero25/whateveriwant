# 비대칭키 암호: RSA와 타원곡선

> **TL;DR**
>
> 비대칭키 암호는 공개키와 개인키 쌍을 씁니다. 공개키로 암호화하면 개인키로만 풀고, 개인키로 서명하면 공개키로 검증합니다. 느리므로 대개 키 설정·서명에 쓰고 대량 데이터는 대칭키로 암호화합니다.

AI 작성 해설

## 두 키의 역할

한 키로 잠그면 짝이 되는 다른 키로만 엽니다. 공개키는 배포하고 개인키는 비밀로 지킵니다. 이 구조 덕에 사전 공유 비밀 없이도 키 설정과 신원 검증이 가능합니다. 대칭키와의 역할 분담은 [암호학 개요](foundations.md)에서 다룹니다.

| 용도 | 방향 |
|---|---|
| 기밀 전송 | 공개키로 암호화 → 개인키로 복호화 |
| 전자서명 | 개인키로 서명 → 공개키로 검증 |
| 키 교환 | 양측 공개값으로 공유 비밀 유도 |

## RSA와 타원곡선(ECC)

RSA는 큰 수 인수분해의 어려움에, ECC는 타원곡선 이산로그의 어려움에 기반합니다. ECC는 같은 안전성을 훨씬 짧은 키로 달성해(예: 256비트 ECC ≈ 3072비트 RSA) 모바일·TLS에서 선호됩니다. 알고리즘마다 지원 용도가 다릅니다: RSA는 암호화·서명 모두, ECDSA/EdDSA는 서명, ECDH는 키 교환.

## 하이브리드 암호화

비대칭 연산은 느리므로 실제로는 **하이브리드**로 씁니다: 임의의 대칭키를 만들어 데이터는 대칭키로 빠르게 암호화하고, 그 대칭키만 상대 공개키로 감쌉니다.

```python
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

# 1) 데이터는 대칭키로 (빠름)
data_key = AESGCM.generate_key(bit_length=256)
nonce = os.urandom(12)
ciphertext = AESGCM(data_key).encrypt(nonce, b"large payload...", None)

# 2) 대칭키만 상대 공개키로 감싼다 (OAEP 패딩 필수)
wrapped = public_key.encrypt(
    data_key,
    padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None),
)
# 수신자는 개인키로 data_key를 풀고, 그 키로 데이터를 복호화한다
```

RSA 암호화에는 반드시 OAEP 같은 안전한 패딩을 씁니다(교과서 RSA·PKCS#1 v1.5는 취약).

## 신뢰의 문제

공개키 자체는 "이 키가 정말 그 사람의 것인가"를 증명하지 못합니다. 공개키와 신원의 연결은 [PKI와 인증서](pki-and-certificates.md)로 보증합니다. 또한 큰 양자 컴퓨터는 RSA·ECC를 깨뜨릴 수 있어, 포스트 양자 암호로의 전환이 진행 중입니다.

## 확인 질문

지금 대용량 데이터를 공개키로 직접 암호화하고 있지는 않나요(하이브리드가 맞습니다)? 이 공개키가 정말 상대의 것임을 무엇으로 신뢰하나요?

## 참고 자료와 연결

[NIST: Key Management (SP 800-57)](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)

관련: [암호학 개요](foundations.md) · [대칭키 암호](symmetric-encryption.md) · [키 교환](key-exchange.md) · [PKI와 인증서](pki-and-certificates.md) · [목차](index.md) · [용어집](glossary.md)
