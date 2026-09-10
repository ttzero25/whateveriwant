# 백트래킹과 완전 탐색

> **TL;DR**
>
> 백트래킹은 부분 해를 하나씩 확장하다 제약을 어기면 되돌아가 다른 선택을 탐색합니다. 가지치기로 불필요한 경로를 잘라 완전 탐색보다 빠르며, 순열·조합·퍼즐·제약 충족 문제에 쓰입니다.

AI 작성 해설

## 아이디어: 탐색 트리와 되돌리기

가능한 선택을 트리로 보고 깊이 우선으로 내려가되, 지금까지의 부분 해가 제약을 어기면 더 내려가지 않고 **되돌아가(backtrack)** 다른 가지를 봅니다. 그래프 깊이 우선 탐색과 같은 골격입니다([그래프와 탐색](graphs-search.md)).

```python
def permutations(items):
    result, used, path = [], [False] * len(items), []
    def backtrack():
        if len(path) == len(items):
            result.append(path[:]); return       # 완전한 해 하나 완성
        for i, x in enumerate(items):
            if used[i]:
                continue                          # 이미 쓴 원소는 건너뜀(제약)
            used[i] = True; path.append(x)        # 선택
            backtrack()                           # 더 깊이
            used[i] = False; path.pop()           # 되돌리기(다른 선택 시도)
    backtrack()
    return result
```

`선택 → 재귀 → 되돌리기`가 백트래킹의 공통 패턴입니다.

## 가지치기가 핵심

순수 완전 탐색은 모든 조합을 보지만, 백트래킹은 "이 부분 해로는 절대 답이 될 수 없다"를 일찍 판단해 가지를 잘라(pruning) 탐색량을 크게 줄입니다. N-퀸에서 같은 열·대각선을 미리 배제하는 것이 예입니다.

## 대표 문제

| 문제 | 상태 / 제약 |
|---|---|
| 순열·조합 | 사용한 원소 / 중복 방지 |
| N-퀸 | 열별 위치 / 열·대각선 충돌 없음 |
| 스도쿠 | 칸별 숫자 / 행·열·박스 규칙 |
| 부분집합 합 | 선택 여부 / 합이 목표 초과 시 가지치기 |

제약 충족·조합 최적화에서 넓게 쓰입니다.

## 복잡도와 한계

최악의 경우는 여전히 지수적입니다(가능한 조합이 많음). 가지치기가 잘 되면 실용적으로 빠르지만 보장은 아닙니다. 겹치는 부분 문제가 있으면 [동적 계획법](dynamic-programming.md)이, 지역 최적으로 충분하면 [그리디](greedy.md)가 더 효율적일 수 있습니다. 즉 "완전 탐색이 꼭 필요한가"를 먼저 따집니다.

## 확인 질문

부분 해가 제약을 어기는 순간을 일찍 판단해 가지를 자를 수 있나요? 겹치는 부분 문제나 그리디 선택 속성이 있어 더 효율적인 방법이 있지는 않나요?

## 참고 자료와 연결

[Backtracking (개요)](https://en.wikipedia.org/wiki/Backtracking)

관련: [그래프와 탐색](graphs-search.md) · [동적 계획법과 알고리즘 설계](dynamic-programming.md) · [그리디](greedy.md) · [목차](index.md) · [용어집](glossary.md)
