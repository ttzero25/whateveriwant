# 암호학적 해시 함수

> **TL;DR**
>
> 암호학적 해시는 임의 길이 입력을 고정 길이 요약으로 바꾸며, 되돌릴 수 없고 충돌을 찾기 어렵습니다. 무결성 확인·중복 제거·커밋에 쓰이지만, 그 자체로는 출처를 보증하지 못합니다.

AI 작성 해설

## 세 가지 보안 성질

- **역상 저항(preimage)**: 해시값만으로 원본을 찾기 어렵다.
- **제2 역상 저항**: 주어진 입력과 같은 해시를 내는 다른 입력을 찾기 어렵다.
- **충돌 저항(collision)**: 같은 해시를 내는 임의의 두 입력을 찾기 어렵다.

이 성질이 깨지면 위조가 가능합니다. MD5·SHA-1은 충돌이 실증되어 보안 용도에서 폐기되었고, 현재는 SHA-256/512(SHA-2)나 SHA-3를 씁니다. 해시가 다른 도구와 어떻게 다른지는 [암호학 개요](foundations.md)에서 다룹니다.

## 무엇에 쓰나

| 용도 | 설명 |
|---|---|
| 무결성 확인 | 파일·메시지 변경 여부 비교 |
| 커밋·식별 | git 커밋 해시, 콘텐츠 주소 지정 |
| 중복 제거 | 같은 내용 판별 |
| 파생 | HMAC·KDF·서명의 구성 요소 |

```python
import hashlib

def file_digest(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)                 # 큰 파일도 조각으로 스트리밍
    return h.hexdigest()

# 무결성 비교는 상수 시간 비교로 (타이밍 누출 방지)
import hmac
ok = hmac.compare_digest(expected_hex, file_digest("download.bin"))
```

## 해시만으로는 출처를 보증하지 못한다

다운로드 파일과 그 해시를 **같은 신뢰할 수 없는 경로**에서 받으면, 공격자가 둘 다 바꿀 수 있어 아무것도 보증하지 못합니다. 출처까지 보증하려면 키가 개입하는 [MAC과 전자서명](mac-and-signatures.md)이 필요합니다. 즉 해시=무결성 요약, 서명=무결성+출처입니다.

## 비밀번호에는 일반 해시를 쓰지 않는다

SHA-256은 너무 빨라서 비밀번호를 대량으로 추측하는 비용을 충분히 높이지 못합니다. 비밀번호에는 느리고 메모리를 많이 쓰는 전용 함수(Argon2id 등)를 씁니다. [비밀번호 저장](password-storage.md)

## 자주 하는 오해

- 해시는 암호화가 아닙니다(키가 없고 복원 불가).
- 값이 작은 입력(전화번호 등)은 해시해도 무차별 대입으로 복원됩니다. 이 경우 키가 있는 HMAC이나 별도 매핑이 필요합니다.

## 확인 질문

무결성만 필요한가요, 출처(누가 만들었는가)까지 필요한가요? 해시 비교를 상수 시간으로 하고 있나요?

## 참고 자료와 연결

[NIST: Hash Functions](https://csrc.nist.gov/projects/hash-functions)

관련: [암호학 개요](foundations.md) · [MAC과 전자서명](mac-and-signatures.md) · [비밀번호 저장](password-storage.md) · [목차](index.md) · [용어집](glossary.md)
