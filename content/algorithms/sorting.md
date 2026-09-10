# 정렬 알고리즘

> **TL;DR**
>
> 정렬은 비교 기반이면 최선의 경우도 O(n log n)이 한계이며, 병합·퀵·힙 정렬이 대표적입니다. 안정성과 추가 메모리, 입력 특성에 따라 선택이 달라지고, 값의 범위가 좁으면 비교 없이 O(n)도 가능합니다.

AI 작성 해설

## 비교 정렬의 하한

원소를 비교로만 정렬하면, 가능한 순열 n!을 구분해야 하므로 최악·평균 모두 Ω(n log n)입니다. 이 하한 아래로 내려가려면 비교가 아닌 다른 정보(값의 범위)를 써야 합니다. 복잡도 분석은 [알고리즘과 Big-O](algorithms-complexity.md)와 이어집니다.

| 알고리즘 | 평균 | 최악 | 추가 메모리 | 안정성 |
|---|---|---|---|---|
| 병합 정렬 | O(n log n) | O(n log n) | O(n) | 안정 |
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | 불안정 |
| 힙 정렬 | O(n log n) | O(n log n) | O(1) | 불안정 |
| 삽입 정렬 | O(n²) | O(n²) | O(1) | 안정(거의 정렬 시 빠름) |
| 계수 정렬 | O(n+k) | O(n+k) | O(k) | 안정(정수 범위 k) |

## 병합 정렬: 분할 정복

```python
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])   # 반씩 정렬
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:          # <= 로 같은 값의 순서 유지 → 안정 정렬
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]
```

병합 정렬은 항상 O(n log n)이고 안정적이지만 O(n) 추가 메모리를 씁니다. 퀵 정렬은 제자리에 가깝고 보통 더 빠르지만, 나쁜 피벗 선택 시 O(n²)이 되므로 무작위·중앙값 피벗을 씁니다.

## 안정성이 중요한 경우

안정 정렬은 값이 같은 원소의 원래 순서를 보존합니다. 여러 기준으로 정렬할 때(예: 이름순 정렬 후 부서순 재정렬) 안정성이 있어야 앞 기준이 유지됩니다.

## 비교하지 않는 정렬

값이 작은 정수 범위 k라면 계수·기수 정렬로 O(n+k)에 정렬할 수 있습니다. 다만 k가 크면 메모리가 비싸므로 입력 특성을 확인해야 합니다.

## 실무 관점

표준 라이브러리 정렬(팀소트 등)은 대부분의 경우 최선입니다. 직접 구현보다 내장 정렬을 쓰되, 비교 함수·키를 정확히 정의합니다. 정렬은 이후 [탐색](searching.md)의 전제가 되기도 합니다(이진 탐색).

## 확인 질문

같은 값의 상대 순서를 보존해야 하나요(안정 정렬)? 추가 메모리를 쓸 수 있나요? 입력이 거의 정렬돼 있거나 값의 범위가 좁지는 않나요?

## 참고 자료와 연결

[Sorting algorithm (개요)](https://en.wikipedia.org/wiki/Sorting_algorithm)

관련: [알고리즘과 Big-O](algorithms-complexity.md) · [탐색](searching.md) · [힙과 우선순위 큐](heaps-priority-queues.md) · [목차](index.md) · [용어집](glossary.md)
