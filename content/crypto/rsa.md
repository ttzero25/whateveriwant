# RSA: 원리와 안전한 사용

> **TL;DR**
>
> RSA는 큰 두 소수의 곱을 인수분해하기 어렵다는 점에 기반한 공개키 알고리즘으로, 암호화와 서명에 모두 쓰입니다. 원리는 단순하지만 패딩·키 크기·구현을 지키지 않으면 쉽게 깨지므로 검증된 방식(OAEP·PSS)을 씁니다.

AI 작성 해설

## 열쇠 쌍이 만들어지는 원리

RSA 키 생성은 다음과 같습니다. 큰 소수 p, q를 고르고 n = p·q(모듈러스)를 만든 뒤, φ(n) = (p−1)(q−1)과 서로소인 공개 지수 e를 고르고, e의 역원 d(개인 지수)를 φ(n)에 대해 구합니다. 공개키는 (n, e), 개인키는 d입니다. 비대칭 암호의 역할은 [비대칭키 암호](asymmetric-encryption.md)에서 다룹니다.

```python
# 교육용 장난감 구현 — 실제로는 절대 이렇게 쓰지 않는다(작은 수·패딩 없음)
from sympy import mod_inverse

p, q = 61, 53
n = p * q                 # 3233 (모듈러스, 공개)
phi = (p - 1) * (q - 1)   # 3120
e = 17                    # 공개 지수(φ와 서로소)
d = mod_inverse(e, phi)   # 2753 (개인 지수)

m = 65                    # 평문(숫자로 인코딩된 상태라고 가정)
c = pow(m, e, n)          # 암호화: c = m^e mod n  = 2790
m2 = pow(c, d, n)         # 복호화: m = c^d mod n  = 65
assert m2 == m
```

암호화는 공개키로 거듭제곱, 복호화는 개인키로 거듭제곱입니다. 서명은 반대로 개인키로 만들고 공개키로 검증합니다.

## 왜 안전한가, 그리고 왜 깨지는가

공격자는 (n, e)를 알아도 d를 구하려면 φ(n)이 필요하고, 그러려면 n을 인수분해해야 합니다. 충분히 큰 n에서는 이것이 현실적으로 불가능합니다. 하지만 다음을 어기면 무너집니다.

- **교과서 RSA(패딩 없음)**: 결정적이라 같은 평문이 같은 암호문 → 추측·선택 평문 공격에 취약.
- **작은 키·작은 e + 패딩 없음**: 세제곱근 공격 등.
- **잘못된 패딩(PKCS#1 v1.5)**: 패딩 오라클 공격.

## 실무: OAEP와 PSS

실제로는 반드시 안전한 패딩을 씁니다: 암호화는 **OAEP**, 서명은 **PSS**. 또한 RSA로 큰 데이터를 직접 암호화하지 않고, 대칭키만 감싸는 하이브리드로 씁니다([대칭키 암호](symmetric-encryption.md)).

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

key = rsa.generate_private_key(public_exponent=65537, key_size=3072)  # 최소 3072비트 권장

signature = key.sign(                       # 서명: PSS 패딩
    b"message",
    padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
    hashes.SHA256(),
)
key.public_key().verify(                    # 검증(실패 시 예외)
    signature, b"message",
    padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
    hashes.SHA256(),
)
```

## 키 크기와 대안

1024비트 RSA는 이미 안전하지 않고, 현재 최소 2048비트, 권장 3072비트입니다. 같은 안전성을 훨씬 짧은 키로 얻는 [타원곡선 암호](elliptic-curve.md)가 성능상 선호되며, 미래의 양자 컴퓨터는 RSA를 깨뜨릴 수 있어 [양자 이후 암호](post-quantum.md)로의 전환이 진행 중입니다. 공개 지수는 관례적으로 65537을 씁니다.

## 확인 질문

RSA를 패딩 없이(교과서 방식) 쓰고 있지는 않나요? 대용량 데이터를 RSA로 직접 암호화하고 있지는 않나요(하이브리드가 맞습니다)? 키가 2048비트 이상인가요?

## 참고 자료와 연결

[RFC 8017 (PKCS#1 v2.2)](https://datatracker.ietf.org/doc/html/rfc8017) · [NIST SP 800-57 (키 크기)](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)

관련: [비대칭키 암호](asymmetric-encryption.md) · [타원곡선 암호](elliptic-curve.md) · [MAC과 전자서명](mac-and-signatures.md) · [PKI와 인증서](pki-and-certificates.md) · [목차](index.md) · [용어집](glossary.md)
