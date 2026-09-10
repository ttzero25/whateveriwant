# 비밀번호 저장

> **TL;DR**
>
> 비밀번호는 복원할 필요가 없으므로 암호화가 아니라 느린 해시로 저장합니다. Argon2id·bcrypt처럼 추측 비용이 큰 함수에 사용자마다 다른 salt를 붙여, 유출되어도 대량 크래킹을 어렵게 만듭니다.

AI 작성 해설

## 왜 암호화가 아니라 해시인가

로그인은 입력이 저장된 것과 같은지만 확인하면 됩니다. 원문을 복원할 이유가 없으므로 되돌릴 수 없는 해시가 맞습니다. 암호화하면 복호화 키가 또 다른 유출 표면이 됩니다. 해시의 성질은 [해시 함수](hashing.md)에서 다룹니다.

## 일반 해시로는 부족하다

SHA-256은 초당 수십억 회 계산할 만큼 빨라서, 유출된 해시를 사전·무차별로 대량 추측하는 비용을 충분히 높이지 못합니다. 비밀번호에는 의도적으로 느리고 메모리를 많이 쓰는 함수를 씁니다.

| 함수 | 특징 |
|---|---|
| Argon2id | 현재 권장, 메모리 하드(GPU 크래킹 저항) |
| scrypt | 메모리 하드 |
| bcrypt | 널리 검증됨, 비용 인자 조절 |
| PBKDF2 | 레거시 호환용, 반복 횟수 높게 |

## salt와 비용 인자

salt는 사용자마다 다른 값으로, 같은 비밀번호도 다른 저장값을 갖게 해 레인보우 테이블과 동시 크래킹을 막습니다. salt는 비밀이 아니며 해시와 함께 저장합니다.

```python
from argon2 import PasswordHasher   # argon2-cffi

ph = PasswordHasher()               # salt 자동 생성, 매개변수 내장
stored = ph.hash("correct horse battery staple")   # DB에 이 문자열만 저장

# 로그인 검증
try:
    ph.verify(stored, user_input)   # 실패 시 예외
    if ph.check_needs_rehash(stored):
        stored = ph.hash(user_input)  # 비용 인자 상향 시 자동 재해시
    ok = True
except Exception:
    ok = False
```

비용 인자(메모리·반복)는 서버 성능과 공식 지침으로 정하고, 하드웨어가 좋아지면 상향합니다.

## pepper와 추가 방어

pepper는 모든 비밀번호에 공통으로 더하는 비밀로, DB와 분리된 곳(앱 시크릿·HSM)에 둡니다. DB만 유출돼도 pepper 없이는 검증이 어렵습니다. 여기에 레이트 리밋·MFA를 더해 심층 방어를 구성합니다. 인증 흐름은 [인증과 인가](../security/authentication-authorization.md)와 이어집니다.

## 자주 하는 오해

- salt는 비밀이 아니며, salt만으로 느린 해시를 대신하지 못합니다.
- "SHA-256 + salt"는 여전히 너무 빠릅니다. 전용 비밀번호 함수를 씁니다.

## 확인 질문

비밀번호를 복호화할 수 있는 형태로 저장하고 있지는 않나요? 크래킹 비용(메모리·시간)이 충분히 높고, 하드웨어 발전에 맞춰 올릴 수 있나요?

## 참고 자료와 연결

[OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

관련: [해시 함수](hashing.md) · [인증과 인가](../security/authentication-authorization.md) · [키 관리](key-management.md) · [목차](index.md) · [용어집](glossary.md)
