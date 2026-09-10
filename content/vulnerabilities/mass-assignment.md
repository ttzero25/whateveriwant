# 매스 어사인먼트

> **TL;DR**
>
> 사용자 입력을 객체·모델에 통째로 바인딩하면, 공격자가 노출하려던 필드 외의 것(권한·잔액·소유자)까지 설정할 수 있습니다. 방어는 수정 가능한 필드를 허용 목록으로 명시하는 것입니다.

AI 작성 해설

## 발생 원리

편의를 위해 요청 본문(JSON)을 데이터 모델에 자동으로 매핑하는 프레임워크가 많습니다. 이때 어떤 필드를 받을지 제한하지 않으면, 클라이언트가 보낸 **예상 밖 필드**까지 그대로 반영됩니다. 이는 [접근 제어](access-control.md)·[권한 우회](authorization-bypass.md)와 이어지는 인가 계열 문제입니다.

## 취약한 코드와 안전한 코드

```python
# 취약: 요청 본문 전체를 모델에 그대로 반영
#   정상 의도: {"name": "Alice", "email": "a@x.com"}
#   공격 본문: {"name": "Alice", "role": "admin", "balance": 999999}
user.update(**request.json)          # role·balance까지 덮어써짐

# 안전 1: 수정 허용 필드를 명시적으로 선택(allowlist)
ALLOWED = {"name", "email", "bio"}
updates = {k: v for k, v in request.json.items() if k in ALLOWED}
user.update(**updates)               # 그 외 필드는 무시

# 안전 2: 입력 전용 DTO/스키마로 받고, 서버가 민감 필드를 따로 설정
data = ProfileUpdate(**request.json)  # name·email·bio만 정의된 스키마
user.name, user.email, user.bio = data.name, data.email, data.bio
```

허용 목록(allowlist)이 핵심입니다. "무엇을 막을까"(차단 목록)가 아니라 "무엇을 허용할까"를 명시해야 새 필드가 추가돼도 안전합니다.

## 가상 사례로 이해하기

가상 프로필 수정 API가 본문을 사용자 레코드에 통째로 바인딩한다고 합시다. 공격자는 프로필 저장 요청에 `"role":"admin"`이나 `"isVerified":true`를 몰래 끼워 넣어, 화면에 없는 권한 필드를 스스로 올립니다. UI에 그 입력란이 없어도 API가 받으면 반영됩니다.

## 예방과 수정

- **허용 목록 바인딩**: 각 엔드포인트가 수정 가능한 필드를 명시합니다.
- **입력 전용 스키마(DTO)**: 클라이언트가 채울 수 있는 필드와 서버만 정하는 필드(권한·소유자·타임스탬프)를 분리합니다.
- **서버 측 결정**: 소유자·권한·상태는 입력이 아니라 서버 로직이 설정합니다.
- **객체 수준 인가**도 함께 확인합니다(그 레코드를 수정할 권한이 있는가).

## 수정 후 확인할 조건

정상 필드 외에 `role`·`isAdmin`·`ownerId`·`balance` 같은 필드를 본문에 추가로 넣어 보내도 무시되는지, 정상 수정은 그대로 동작하는지 확인합니다.

## 자주 하는 오해

- UI에 입력란이 없다고 안전한 것이 아닙니다. API가 필드를 받으면 반영됩니다.
- 차단 목록(민감 필드 몇 개만 제외)은 새 민감 필드가 생기면 뚫립니다. 허용 목록이 안전합니다.

## 확인 질문

이 엔드포인트가 요청 본문을 모델에 통째로 바인딩하나요? 클라이언트가 채울 수 있는 필드와 서버만 정해야 하는 필드가 코드에서 분리돼 있나요?

## 참고 자료와 연결

[OWASP: Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)

관련: [접근 제어·IDOR·BOLA](access-control.md) · [권한 우회](authorization-bypass.md) · [설정 오류·정보 노출](misconfiguration.md) · [학습 가이드](index.md) · [용어집](glossary.md)
