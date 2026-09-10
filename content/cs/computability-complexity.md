# 계산 이론: 계산 가능성과 P·NP

> **TL;DR**
>
> 어떤 문제는 알고리즘으로 아예 풀 수 없고(계산 불가능), 풀 수 있는 문제도 필요한 자원에 따라 난이도가 나뉩니다. P·NP·NP-완전은 "효율적으로 풀 수 있는가"를 분류하는 틀입니다.

AI 작성 해설

## 무엇을 계산할 수 있는가

오토마타가 정규 언어를 인식했듯([정규 표현식과 오토마타](automata-regex.md)), 튜링 기계는 "계산 가능한 것"의 한계를 정의합니다. 놀랍게도 어떤 문제는 **어떤 알고리즘으로도 풀 수 없습니다.** 대표가 정지 문제(halting problem)입니다: 임의의 프로그램이 멈출지 여부를 항상 판정하는 프로그램은 존재할 수 없습니다(대각선 논법으로 증명). 논리·증명 기초는 [이산수학과 논리](discrete-mathematics.md)와 이어집니다.

## 풀 수 있는 문제의 난이도 분류

풀 수 있는 문제도 필요한 시간에 따라 나뉩니다. 복잡도 표기는 [알고리즘과 Big-O](../algorithms/algorithms-complexity.md)에서 다룹니다.

| 클래스 | 뜻 |
|---|---|
| P | 다항 시간에 **풀 수 있는** 결정 문제 |
| NP | 답(증명서)이 주어지면 다항 시간에 **검증할 수 있는** 문제 |
| NP-완전 | NP에서 가장 어려운 문제들(하나를 빨리 풀면 NP 전부를 빨리 품) |
| NP-난해 | 최소한 NP-완전만큼 어려움(결정 문제가 아닐 수도) |

## 검증은 쉬운데 푸는 건 어렵다

NP의 직관은 "정답을 찾긴 어려워도, 정답을 보여주면 맞는지 확인은 빠르다"입니다. 부분집합 합(어떤 수들을 골라 목표 합을 만들 수 있는가)이 예입니다 — 고르기는 어렵지만, 고른 집합을 주면 검증은 O(n)입니다.

```python
# NP 검증자: 해(증명서)가 주어지면 다항 시간에 확인
def verify_subset_sum(numbers, target, chosen_indices):
    picked = [numbers[i] for i in chosen_indices]
    return sum(picked) == target          # O(n) — 빠른 검증
# 하지만 chosen_indices를 '찾는' 것은 알려진 다항 알고리즘이 없다
```

## P = NP 문제와 환원

"검증이 빠른 모든 문제는 푸는 것도 빠른가?"(P = NP?)는 미해결 난제입니다. 대부분 P ≠ NP로 추측합니다. **환원(reduction)**은 문제 A를 문제 B로 바꿔 "B가 쉬우면 A도 쉽다"를 보이는 도구로, NP-완전성을 증명하는 방법입니다.

## 왜 실무에 중요한가

어떤 문제가 NP-완전이라고 알면, 완벽한 다항 해를 찾느라 시간을 낭비하는 대신 현실적 대안으로 방향을 틉니다: 근사 알고리즘, 휴리스틱, [그리디](../algorithms/greedy.md), 제약을 건 특수 경우, 또는 [백트래킹](../algorithms/backtracking.md)+가지치기. "이건 원래 어려운 문제"라는 판단 자체가 큰 정보입니다.

## 확인 질문

지금 풀려는 문제가 계산 가능하긴 한가요? NP-완전으로 알려진 문제에 완벽한 빠른 해를 찾고 있지는 않나요(근사·휴리스틱이 맞을 수 있습니다)?

## 참고 자료와 연결

[P versus NP (개요)](https://en.wikipedia.org/wiki/P_versus_NP_problem) · [Halting problem](https://en.wikipedia.org/wiki/Halting_problem)

관련: [정규 표현식과 오토마타](automata-regex.md) · [알고리즘과 Big-O](../algorithms/algorithms-complexity.md) · [이산수학과 논리](discrete-mathematics.md) · [목차](index.md)
