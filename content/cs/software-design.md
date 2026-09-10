# 소프트웨어 설계: OOP·SOLID·디자인 패턴

> **TL;DR**
>
> 좋은 설계는 변경이 한 곳에 머물게 하고, 의존성을 한 방향으로 흐르게 합니다. 객체지향의 캡슐화·다형성, SOLID 원칙, 검증된 디자인 패턴은 모두 "변할 것을 격리하고 인터페이스에 의존하라"는 한 아이디어의 표현입니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 무엇을 위한 설계인가

코드는 한 번 쓰고 여러 번 고칩니다. 설계의 목표는 요구가 바뀔 때 **고칠 곳을 좁히는 것**입니다. 이를 위해 응집도(관련 있는 것끼리 모음)를 높이고 결합도(모듈 간 얽힘)를 낮춥니다.

## 객체지향의 네 기둥

- **캡슐화**: 내부 상태를 숨기고 정해진 통로로만 접근.
- **추상화**: 무엇을 하는지를 노출하고 어떻게 하는지는 감춤.
- **상속**: 공통을 재사용(과용하면 결합을 높이므로 조합을 우선).
- **다형성**: 같은 인터페이스로 다른 구현을 교체.

## SOLID 원칙

| 원칙 | 뜻 |
|---|---|
| S — 단일 책임 | 한 클래스는 바뀔 이유가 하나여야 한다 |
| O — 개방·폐쇄 | 확장에는 열고, 수정에는 닫는다 |
| L — 리스코프 치환 | 하위 타입은 상위 타입 자리에 넣어도 동작해야 한다 |
| I — 인터페이스 분리 | 쓰지 않는 메서드에 의존하지 않게 인터페이스를 쪼갠다 |
| D — 의존 역전 | 구체가 아니라 추상에 의존한다 |

## 의존 역전과 전략 패턴 예시

결제 방식이 늘어날 때마다 `if/elif`를 늘리는 대신, 공통 인터페이스에 의존하고 구현을 주입합니다(전략 패턴 + 의존 역전).

```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):                 # 추상(정책이 의존하는 대상)
    @abstractmethod
    def pay(self, amount: int) -> str: ...

class Card(PaymentMethod):
    def pay(self, amount): return f"카드로 {amount}원 결제"

class Voucher(PaymentMethod):
    def pay(self, amount): return f"상품권으로 {amount}원 결제"

class Checkout:                           # 고수준 정책: 구체가 아니라 추상에 의존
    def __init__(self, method: PaymentMethod):
        self.method = method              # 의존성 주입
    def run(self, amount): return self.method.pay(amount)

Checkout(Card()).run(1000)                # 새 결제수단은 클래스 추가만으로 확장(개방·폐쇄)
```

`Checkout`은 결제 종류가 늘어도 바뀌지 않습니다. 이것이 개방·폐쇄와 의존 역전이 함께 작동하는 모습입니다.

## 디자인 패턴은 어휘다

패턴(전략·관찰자·어댑터·팩토리·데코레이터 등)은 반복되는 설계 문제의 이름 붙은 해법입니다. 목적은 "패턴을 많이 쓰는 것"이 아니라 팀이 같은 언어로 구조를 논의하는 것입니다. 과도한 추상화는 오히려 결합과 복잡도를 늘립니다.

## 자주 하는 오해

상속으로 재사용하면 좋다는 생각은 위험합니다. 깊은 상속 계층은 리스코프 원칙을 깨기 쉽고 결합을 높입니다. 대개는 상속보다 **조합**이 유연합니다.

## 확인 질문

새 요구가 들어올 때 고쳐야 할 파일이 몇 개인가요? `if 타입 == ...` 분기가 곳곳에서 늘고 있다면, 다형성으로 대체할 수 있나요?

## 참고 자료와 연결

[Refactoring Guru: Design Patterns](https://refactoring.guru/design-patterns) · [SOLID (개요)](https://en.wikipedia.org/wiki/SOLID)

관련: [언어 실행: 컴파일러·인터프리터·런타임](language-execution.md) · [타입 시스템](type-systems.md) · [자료구조](data-structures.md) · [목차](index.md)
