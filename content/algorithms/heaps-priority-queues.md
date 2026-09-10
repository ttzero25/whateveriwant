# 힙과 우선순위 큐

> **TL;DR**
>
> 우선순위 큐는 "가장 우선하는 원소"를 빠르게 꺼내는 자료구조이고, 이진 힙이 대표 구현입니다. 삽입·삭제가 O(log n), 최댓값/최솟값 조회가 O(1)이라 스케줄링·다익스트라·top-k에 쓰입니다.

AI 작성 해설

## 우선순위 큐란

일반 큐는 FIFO지만, 우선순위 큐는 우선순위가 가장 높은 원소를 먼저 꺼냅니다. 자료구조 기초는 [자료구조](data-structures.md)에서 다룹니다. 정렬을 매번 다시 하지 않고도 최우선 원소를 효율적으로 유지하는 것이 핵심입니다.

## 이진 힙

이진 힙은 완전 이진 트리를 배열로 표현하며, 부모가 자식보다 우선(최소 힙이면 작음)이라는 힙 성질을 유지합니다. 삽입은 위로 끌어올리고(sift-up), 최상단 제거는 마지막 원소를 올린 뒤 내려보냅니다(sift-down). 둘 다 트리 높이 O(log n)입니다.

```python
import heapq

pq = []
heapq.heappush(pq, (3, "보통 작업"))     # (우선순위, 값) 튜플 — 작을수록 먼저
heapq.heappush(pq, (1, "긴급 작업"))
heapq.heappush(pq, (5, "낮은 우선순위"))

while pq:
    priority, task = heapq.heappop(pq)    # 항상 가장 우선(작은)한 것부터
    print(priority, task)                 # 1, 3, 5 순서
# 최댓값 힙이 필요하면 우선순위에 음수를 넣거나 별도 래퍼를 쓴다
```

`heappush`/`heappop`이 O(log n), `pq[0]` 조회가 O(1)입니다.

## 어디에 쓰나

- **스케줄링**: 우선순위 작업 처리, 이벤트 시뮬레이션.
- **최단 경로**: 다익스트라에서 다음에 확정할 정점 선택([그래프와 탐색](graphs-search.md)).
- **top-k**: 크기 k 힙으로 스트림에서 상위 k개 유지(전체 정렬 없이 O(n log k)).
- **허프만 부호화**: 빈도가 낮은 노드를 반복 병합.

```python
# top-k: 큰 데이터에서 상위 k개만 (전체 정렬 O(n log n)보다 저렴)
def top_k(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)     # 최소 힙에 k개만 유지 → 남는 게 상위 k개
    return sorted(h, reverse=True)
```

## 힙 정렬과의 관계

힙에 전부 넣고 하나씩 빼면 정렬됩니다(힙 정렬, O(n log n), 제자리·불안정). 정렬은 [정렬 알고리즘](sorting.md)에서 다룹니다. 다만 "전체 정렬"이 아니라 "최우선 원소만 반복해서" 필요할 때 힙의 진가가 드러납니다.

## 확인 질문

전체를 정렬해야 하나요, 아니면 매번 최우선 원소만 필요한가요? 상위 k개만 필요하다면 전체를 정렬하고 있지는 않나요?

## 참고 자료와 연결

[Binary heap (개요)](https://en.wikipedia.org/wiki/Binary_heap) · [Python heapq](https://docs.python.org/3/library/heapq.html)

관련: [자료구조](data-structures.md) · [정렬](sorting.md) · [그래프와 탐색](graphs-search.md) · [목차](index.md) · [용어집](glossary.md)
