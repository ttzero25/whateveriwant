# 비트 조작

> **TL;DR**
>
> 비트 조작은 정수를 이진 비트의 묶음으로 보고 AND·OR·XOR·시프트로 직접 다루는 기법입니다. 플래그 집합, 빠른 계산, 공간 절약에 쓰이며, 몇 가지 관용구를 알면 코드가 간결해집니다.

AI 작성 해설

## 비트 연산 기본

정수의 각 비트를 켜고 끄고 읽습니다. 데이터가 비트로 저장되는 원리는 [비트·바이트와 데이터 표현](../cs/data-representation.md)에서 다룹니다.

| 연산 | 뜻 |
|---|---|
| `a & b` | 둘 다 1인 비트만 1 (마스킹) |
| `a \| b` | 하나라도 1이면 1 (설정) |
| `a ^ b` | 다르면 1 (토글·차이) |
| `~a` | 비트 반전 |
| `a << n` / `a >> n` | 왼쪽/오른쪽 시프트(×2ⁿ / ÷2ⁿ) |

## 자주 쓰는 관용구

```python
x = 0b1010                     # 10

x & (1 << i)                   # i번째 비트가 켜졌는지 검사(0이 아니면 켜짐)
x | (1 << i)                   # i번째 비트 켜기
x & ~(1 << i)                  # i번째 비트 끄기
x ^ (1 << i)                   # i번째 비트 토글

x & 1                          # 홀짝 판정(1이면 홀수)
x & (x - 1)                    # 가장 낮은 켜진 비트 하나 끄기
(x & (x - 1)) == 0             # 2의 거듭제곱인지(0 제외)
bin(x).count("1")              # 켜진 비트 수(popcount)
```

`x & (x-1)`로 켜진 비트를 하나씩 끄면, 켜진 비트 수만큼만 반복해 비트를 셀 수 있습니다.

## XOR의 성질을 이용한 트릭

XOR은 `a ^ a = 0`, `a ^ 0 = a`라는 성질이 있어, 짝지어 없어지는 계산에 강합니다.

```python
# 하나만 홀수 번 나오고 나머지는 짝수 번 나올 때, 그 하나 찾기
def find_unique(nums):
    r = 0
    for n in nums:
        r ^= n        # 짝수 번 나온 값은 서로 상쇄되어 0, 남는 건 유일값
    return r
```

## 비트 집합(bitmask)

작은 정수 집합은 정수 하나의 비트로 표현하면 메모리·속도에서 유리합니다. 부분집합 순회, 상태 압축 [동적 계획법](dynamic-programming.md)(비트마스크 DP), 권한 플래그 등에 쓰입니다.

## 자주 하는 오해

- 언어마다 정수 폭·부호 있는 시프트 동작이 달라, 오버플로·산술 시프트에 주의합니다([정수 오버플로](../vulnerabilities/integer-overflow.md)).
- 가독성을 해치면서까지 비트 트릭을 남발하지 않습니다. 성능이 실제로 중요한 곳에만 씁니다.

## 확인 질문

여러 불리언 플래그를 개별 변수로 두고 있지는 않나요(비트마스크로 묶을 수 있나요)? XOR의 상쇄 성질로 단순해지는 계산이 있나요?

## 참고 자료와 연결

[Bit manipulation (개요)](https://en.wikipedia.org/wiki/Bit_manipulation) · [Bit Twiddling Hacks](https://graphics.stanford.edu/~seander/bithacks.html)

관련: [비트·바이트와 데이터 표현](../cs/data-representation.md) · [알고리즘과 Big-O](algorithms-complexity.md) · [동적 계획법](dynamic-programming.md) · [목차](index.md) · [용어집](glossary.md)
