# NoSQL·LDAP 인젝션

> **TL;DR**
>
> 인젝션은 SQL만의 문제가 아닙니다. NoSQL은 쿼리 연산자를, LDAP은 필터 메타문자를 입력으로 주입할 수 있습니다. 원인은 같습니다 — 입력을 질의 구조와 섞기. 방어도 같습니다 — 구조와 데이터를 분리하기.

AI 작성 해설

## 같은 원인, 다른 질의 언어

[SQL 인젝션](sql-injection.md)과 뿌리가 같습니다: 외부 입력이 질의의 **구조**로 해석되면 의미가 바뀝니다. 저장소가 SQL이 아니어도 마찬가지입니다.

## NoSQL: 연산자 주입

MongoDB 같은 문서 DB는 쿼리를 객체로 표현합니다. 사용자 입력을 그대로 객체에 넣으면, 공격자가 `$ne`·`$gt` 같은 **쿼리 연산자**를 주입해 조건을 우회합니다.

```python
# 취약: 요청 본문(JSON)을 그대로 쿼리에 사용
#   정상: {"user": "alice", "pass": "secret"}
#   공격: {"user": "alice", "pass": {"$ne": null}}  ← 비밀번호 무엇이든 매치
db.users.find_one({"user": body["user"], "pass": body["pass"]})

# 안전: 값이 문자열인지 타입을 강제하고, 인증은 해시 비교로 분리
if not isinstance(body["pass"], str):
    raise ValueError("invalid input")
user = db.users.find_one({"user": body["user"]})
ok = user and verify_password(body["pass"], user["pass_hash"])
```

핵심은 입력이 **값**이어야 할 자리에 **연산자 객체**가 들어오지 못하게 타입을 강제하는 것입니다.

## LDAP: 필터 메타문자 주입

LDAP 검색 필터는 `(uid=입력)` 형태입니다. 입력에 `*`, `)`, `(`, `&`, `|` 같은 메타문자를 넣으면 필터 논리가 바뀝니다.

```
정상 필터:  (uid=alice)
주입 입력:  alice)(|(uid=*
결과 필터:  (uid=alice)(|(uid=*))   ← 논리가 바뀌어 인증 우회 가능
```

방어는 필터에 넣기 전 메타문자를 규격에 맞게 이스케이프(예: `*` → `\2a`)하고, 가능하면 라이브러리의 안전한 필터 빌더를 쓰는 것입니다.

## 공통 방어

- 입력은 **값**으로만 다루고 질의 구조와 섞지 않습니다(파라미터화·바인딩).
- **타입·형식 검증**: 문자열 자리에 객체·배열·메타문자가 오면 거부합니다.
- 저장소별 안전 API·이스케이프 함수를 사용하고, 최소 권한 계정으로 접근합니다.

## 수정 후 확인할 조건

`{"$ne": null}`, `{"$gt": ""}` 같은 연산자 객체나 LDAP 메타문자(`*`, `)(`)를 입력했을 때 값으로만 취급되거나 거부되는지, 정상 입력은 그대로 동작하는지 확인합니다.

## 자주 하는 오해

"NoSQL은 SQL이 아니니 인젝션이 없다"는 오해입니다. 질의 언어가 다를 뿐 데이터·구조 경계 문제는 동일하며, [명령 주입](command-injection.md)·[SSTI](ssti.md)와 같은 계열입니다.

## 확인 질문

사용자 입력이 쿼리 객체나 검색 필터에 구조로 들어갈 여지가 있나요? 문자열이어야 할 입력이 객체·배열·메타문자로 올 때 이를 막고 있나요?

## 참고 자료와 연결

[OWASP: NoSQL Injection](https://owasp.org/www-community/Injection_Flaws) · [OWASP: LDAP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)

관련: [SQL Injection](sql-injection.md) · [명령 주입](command-injection.md) · [인증·세션 실패](authentication-session.md) · [학습 가이드](index.md) · [용어집](glossary.md)
