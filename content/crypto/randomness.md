# 난수와 엔트로피

> **TL;DR**
>
> 암호는 예측 불가능한 난수 위에 서 있습니다. 키·nonce·salt·토큰은 반드시 암호학적으로 안전한 난수(CSPRNG)로 생성해야 하며, 일반 난수 생성기는 예측 가능해 보안에 쓰면 안 됩니다.

AI 작성 해설

## 예측 가능성이 곧 취약점

키를 추측할 수 있으면 암호가 아무리 강해도 소용없습니다. `random` 같은 일반 PRNG는 통계적으로는 무작위처럼 보여도 시드를 알거나 출력 몇 개를 보면 다음 값을 예측할 수 있어, 세션 토큰·키·비밀번호 재설정 토큰에 쓰면 위험합니다.

| 용도 | 생성기 |
|---|---|
| 시뮬레이션·게임 | 일반 PRNG(빠름, 예측 가능) |
| 키·nonce·토큰·salt | CSPRNG(예측 불가) |

## 안전한 난수 사용

```python
import secrets   # 암호학적으로 안전 (OS 엔트로피 기반)

token = secrets.token_urlsafe(32)     # URL-safe 세션/재설정 토큰
api_key = secrets.token_hex(32)       # 256비트 키를 hex로
pick = secrets.choice(items)          # 편향 없는 무작위 선택

# 금지: random.random(), random.randint() 등은 보안용이 아니다
```

운영체제는 하드웨어 잡음 등에서 엔트로피를 모아 CSPRNG(리눅스 `getrandom`)에 공급합니다. 파이썬 `secrets`, 자바 `SecureRandom`, 웹 `crypto.getRandomValues`가 이를 사용합니다.

## nonce·IV·salt의 요구는 각기 다르다

- **salt**: 유일하면 충분(비밀 아님). [비밀번호 저장](password-storage.md)
- **nonce/IV**: 같은 키로 재사용 금지. AES-GCM에서 재사용은 치명적. [대칭키 암호](symmetric-encryption.md)
- **키**: 비밀이고 충분히 길고 예측 불가.

"비밀이어야 함"과 "중복되면 안 됨"은 서로 다른 요구입니다. 혼동하면 안전성이 깨집니다.

## 함정

- 시간(`time()`)·PID·순차 카운터를 시드로 쓰면 예측됩니다.
- 임베디드·부팅 초기에는 엔트로피가 부족해 키 품질이 낮을 수 있습니다.
- 재현성이 필요하다고 보안 난수를 고정 시드로 쓰면 안 됩니다.

## 확인 질문

세션 토큰·키·재설정 토큰을 CSPRNG로 만드나요, 아니면 일반 난수로 만들고 있나요? nonce가 같은 키로 반복될 여지가 있나요?

## 참고 자료와 연결

[NIST SP 800-90A (DRBG)](https://csrc.nist.gov/pubs/sp/800/90/a/r1/final) · [Python secrets](https://docs.python.org/3/library/secrets.html)

관련: [대칭키 암호](symmetric-encryption.md) · [비밀번호 저장](password-storage.md) · [키 관리](key-management.md) · [목차](index.md) · [용어집](glossary.md)
