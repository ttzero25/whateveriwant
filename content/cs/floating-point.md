# 부동소수점과 수치 오차

> **TL;DR**
>
> 실수를 이진 부동소수점으로 표현하면 대부분의 소수를 정확히 담을 수 없습니다. 그래서 `0.1 + 0.2`가 정확히 `0.3`이 아니며, 등호 비교·누적 합·금액 계산에서 오차를 다루는 방법을 알아야 합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## IEEE 754의 구조

부동소수점은 `부호 × 가수(mantissa) × 2^지수` 형태로 실수를 근사합니다. 배정밀도(double, 64비트)는 부호 1 + 지수 11 + 가수 52비트입니다. 가수의 비트 수가 유한하므로, `0.1`처럼 십진으로 간단한 수도 이진으로는 무한 반복이라 반올림됩니다. 비트·표현 기초는 [비트·바이트와 데이터 표현](data-representation.md)과 이어집니다.

```python
0.1 + 0.2            # 0.30000000000000004
0.1 + 0.2 == 0.3     # False  ← 정확 비교는 실패한다
(0.1).hex()          # '0x1.999999999999ap-4'  ← 0.1은 정확히 저장되지 않는다
```

## 등호 대신 허용 오차

부동소수점은 `==`로 비교하지 않습니다. 대신 두 값의 차이가 작은 허용 오차 안인지 봅니다. 크기가 다른 값에는 상대 오차를 함께 씁니다.

```python
import math
math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9, abs_tol=1e-12)   # True

def close(a, b, eps=1e-9):
    return abs(a - b) <= eps * max(1.0, abs(a), abs(b))      # 절대+상대 혼합
```

## 오차가 커지는 상황

- **누적 합**: 작은 값을 큰 값에 계속 더하면 작은 값이 반올림에 묻힙니다(카한 합산으로 완화).
- **상쇄(cancellation)**: 비슷한 두 수를 빼면 유효 자릿수가 급감합니다.
- **큰 정수**: double는 2^53을 넘는 정수를 정확히 표현하지 못합니다.
- **특수값**: `inf`, `-inf`, `NaN`이 생기며, `NaN`은 자기 자신과도 `==`가 거짓입니다.

## 금액은 부동소수점으로 다루지 않는다

돈은 반올림 오차가 곧 회계 오류이므로, 이진 부동소수점을 쓰지 않습니다. 최소 단위 정수(센트)로 저장하거나 십진(decimal) 타입을 씁니다.

```python
from decimal import Decimal
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")   # True (십진 기반)
# 또는: 금액을 센트 단위 정수로 저장하고 표시할 때만 나눈다
```

이는 [관계형 데이터베이스와 SQL](databases.md)에서 금액 컬럼 타입(DECIMAL/NUMERIC)을 고르는 기준과도 이어집니다. 머신러닝 수치 안정성은 [AI: 학습 안정성](../ai/training-stability.md) 관점과 통합니다.

## 확인 질문

지금 코드에서 부동소수점을 `==`로 비교하는 곳이 있나요? 금액·수량을 double로 다루고 있지는 않나요?

## 참고 자료와 연결

[What Every Computer Scientist Should Know About Floating-Point (Goldberg)](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) · [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)

관련: [비트·바이트와 데이터 표현](data-representation.md) · [관계형 데이터베이스와 SQL](databases.md) · [알고리즘과 Big-O](algorithms-complexity.md) · [목차](index.md)
