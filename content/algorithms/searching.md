# 탐색: 이진 탐색과 해시 탐색

> **TL;DR**
>
> 정렬된 데이터는 이진 탐색으로 O(log n)에 찾고, 해시 테이블은 평균 O(1)에 찾습니다. 자료의 정렬 여부·순서 필요성·메모리에 따라 어떤 탐색이 맞는지 달라집니다.

AI 작성 해설

## 선형 탐색에서 이진 탐색으로

정렬되지 않은 데이터는 하나씩 보는 선형 탐색(O(n))뿐입니다. 정렬돼 있으면 매 단계 후보를 절반으로 줄이는 이진 탐색으로 O(log n)에 찾습니다. 복잡도 개념은 [알고리즘과 Big-O](algorithms-complexity.md)와 이어집니다.

```python
def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2         # 오버플로 우려 언어는 lo + (hi-lo)//2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1             # 후보를 절반으로
        else:
            hi = mid - 1
    return -1                        # 없음
```

경계 조건(`<=`, `mid±1`)이 까다로워 off-by-one 버그가 흔합니다. 표준 라이브러리(`bisect` 등)를 쓰면 안전합니다.

## 이진 탐색의 변형

이진 탐색은 "조건이 어느 지점부터 참이 되는가"를 찾는 데 일반화됩니다: 삽입 위치(lower/upper bound), 답이 단조로운 최적화 문제의 "결정 문제로 바꿔 이분 탐색"(parametric search)에 널리 쓰입니다.

## 해시 탐색: 평균 O(1)

정렬·순서가 필요 없고 "존재/조회"만 빠르면 되면 해시 테이블이 평균 O(1)입니다. 대신 순서 있는 순회·범위 질의는 못 합니다. 원리는 [해시 테이블](hash-tables.md)에서 다룹니다.

| 탐색 | 시간 | 전제 | 범위·순서 질의 |
|---|---|---|---|
| 선형 | O(n) | 없음 | - |
| 이진 | O(log n) | 정렬 필요 | 가능 |
| 해시 | O(1) 평균 | 해시 가능 키 | 불가 |
| 균형 트리 | O(log n) | 비교 가능 | 가능 |

## 무엇을 고를까

- 존재/조회만, 순서 불필요 → 해시 테이블.
- 정렬·범위 질의·정렬 순회 필요 → 이진 탐색/[균형 트리](trees-and-bst.md).
- 데이터가 자주 바뀌고 정렬 유지 비용이 크면 트리가 유리합니다.

## 확인 질문

정렬 순서나 범위 질의가 필요한가요, 아니면 단순 조회만 필요한가요? 이진 탐색의 경계 조건을 직접 구현하고 있다면 off-by-one을 어떻게 검증하나요?

## 참고 자료와 연결

[Binary search algorithm (개요)](https://en.wikipedia.org/wiki/Binary_search_algorithm)

관련: [정렬](sorting.md) · [해시 테이블](hash-tables.md) · [트리와 이진 탐색 트리](trees-and-bst.md) · [목차](index.md) · [용어집](glossary.md)
