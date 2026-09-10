# 동적 계획법과 알고리즘 설계 기법

> **TL;DR**
>
> 동적 계획법은 겹치는 부분 문제의 답을 한 번만 계산해 재사용하는 기법입니다. 분할 정복·그리디와 함께 알고리즘 설계의 핵심 패러다임이며, 문제의 구조(최적 부분 구조, 겹치는 부분 문제)에 따라 어떤 기법이 맞는지 달라집니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 세 가지 설계 패러다임

| 기법 | 아이디어 | 적용 조건 | 예 |
|---|---|---|---|
| 분할 정복 | 독립적인 하위 문제로 쪼개 합침 | 하위 문제가 겹치지 않음 | 병합 정렬, 이진 탐색 |
| 그리디 | 매 단계 지역 최적을 선택 | 지역 최적이 전역 최적을 보장 | 다익스트라, 허프만 |
| 동적 계획법 | 부분 문제 답을 저장해 재사용 | 최적 부분 구조 + 겹치는 부분 문제 | 최단 경로, 배낭, 편집 거리 |

DP를 쓸 수 있는 신호는 두 가지입니다. **최적 부분 구조**(큰 문제의 최적해가 부분 문제의 최적해로 구성됨)와 **겹치는 부분 문제**(같은 부분 문제가 반복 등장). 분할 정복과의 차이가 바로 이 "겹침"입니다.

## 메모이제이션과 타뷸레이션

같은 점화식을 위에서 아래로 재귀+캐시(메모이제이션)로 풀 수도, 아래에서 위로 표를 채워(타뷸레이션) 풀 수도 있습니다. 피보나치로 지수 시간이 선형 시간으로 바뀌는 과정을 봅니다.

```python
from functools import lru_cache

# (1) 순진한 재귀: 같은 부분 문제를 지수적으로 재계산 -> O(2^n)
def fib_slow(n):
    return n if n < 2 else fib_slow(n - 1) + fib_slow(n - 2)

# (2) 메모이제이션(top-down): 각 부분 문제를 한 번만 -> O(n)
@lru_cache(maxsize=None)
def fib_memo(n):
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)

# (3) 타뷸레이션(bottom-up): 표를 채우고 공간도 O(1)로 축소
def fib_tab(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## 점화식 세우기: 편집 거리 예시

DP 문제의 8할은 "상태와 점화식"을 정의하는 일입니다. 문자열 `a`, `b`의 편집 거리(삽입·삭제·교체)는 부분 문자열 길이 `i`, `j`를 상태로 둡니다.

```python
def edit_distance(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i                       # b가 빈 문자열이면 i번 삭제
    for j in range(n + 1):
        dp[0][j] = j                       # a가 빈 문자열이면 j번 삽입
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]           # 글자가 같으면 그대로
            else:
                dp[i][j] = 1 + min(dp[i - 1][j],      # 삭제
                                   dp[i][j - 1],      # 삽입
                                   dp[i - 1][j - 1])  # 교체
    return dp[m][n]
```

상태 수 `O(mn)`, 각 전이 `O(1)`이므로 전체 `O(mn)`입니다. 복잡도 분석은 [알고리즘과 Big-O](algorithms-complexity.md)와 이어집니다.

## 그래프 최단 경로와의 연결

여러 최단 경로 알고리즘(벨만-포드, 플로이드-워셜)은 DP로 볼 수 있습니다. 그래프 탐색은 [그래프·탐색·의존성](graphs-search.md)에서 다룹니다.

## 확인 질문

지금 풀려는 문제가 "겹치는 부분 문제"를 가지나요? 그렇지 않다면 분할 정복이나 그리디가 더 맞을 수 있습니다. 상태를 무엇으로 정의하고, 점화식은 어떻게 쓰나요?

## 참고 자료와 연결

[CLRS: Dynamic Programming (요약)](https://en.wikipedia.org/wiki/Dynamic_programming)

관련: [알고리즘과 Big-O](algorithms-complexity.md) · [자료구조](data-structures.md) · [그래프·탐색·의존성](graphs-search.md) · [목차](index.md)
