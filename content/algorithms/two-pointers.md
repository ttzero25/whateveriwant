# 투 포인터와 슬라이딩 윈도우

> **TL;DR**
>
> 투 포인터는 배열·문자열에서 두 인덱스를 조건에 따라 움직여 이중 반복(O(n²))을 선형(O(n))으로 줄이는 기법입니다. 슬라이딩 윈도우는 그 특수형으로, 연속 구간을 넓히고 좁히며 조건을 만족하는 창을 찾습니다.

AI 작성 해설

## 이중 반복을 선형으로

모든 쌍·모든 구간을 다 보면 O(n²)입니다. 하지만 데이터가 정렬돼 있거나 구간이 단조롭게 움직이면, 두 포인터를 한 방향으로만 진행시켜 O(n)에 풀 수 있습니다. 복잡도 관점은 [알고리즘과 Big-O](algorithms-complexity.md)와 이어집니다.

## 마주 보는 투 포인터: 정렬된 배열의 쌍 합

정렬된 배열에서 합이 목표인 두 수를 찾을 때, 양 끝에서 좁혀 옵니다. 합이 크면 오른쪽을 당기고, 작으면 왼쪽을 밉니다. 정렬이 전제라 [정렬](sorting.md)과 함께 쓰입니다.

```python
def two_sum_sorted(a, target):
    i, j = 0, len(a) - 1
    while i < j:
        s = a[i] + a[j]
        if s == target:
            return (i, j)
        if s < target:
            i += 1          # 합을 키우려면 왼쪽을 오른쪽으로
        else:
            j -= 1          # 합을 줄이려면 오른쪽을 왼쪽으로
    return None
```

## 슬라이딩 윈도우: 연속 구간

연속 부분 배열·부분 문자열 문제는 창(window)의 오른쪽 끝을 넓히며 조건을 유지하고, 어기면 왼쪽 끝을 좁힙니다. 각 원소가 창에 최대 한 번 들어오고 한 번 나가므로 O(n)입니다.

```python
# 길이 k 부분 배열의 최대 합 (창을 굴리며 재계산 없이 갱신)
def max_sum_window(a, k):
    window = sum(a[:k])
    best = window
    for i in range(k, len(a)):
        window += a[i] - a[i - k]   # 새 원소 추가, 빠지는 원소 제거
        best = max(best, window)
    return best

# 가변 창: 중복 없는 가장 긴 부분 문자열
def longest_unique(s):
    seen, left, best = {}, 0, 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1       # 중복이 생기면 왼쪽을 그 다음으로
        seen[ch] = right
        best = max(best, right - left + 1)
    return best
```

## 언제 쓰나

| 신호 | 기법 |
|---|---|
| 정렬된 배열에서 쌍·삼중 찾기 | 마주 보는 투 포인터 |
| 연속 구간의 합·길이·조건 | 슬라이딩 윈도우 |
| 두 정렬 리스트 병합·교집합 | 같은 방향 투 포인터 |

## 자주 하는 오해

- 정렬이 전제인 투 포인터를 정렬 안 된 배열에 쓰면 틀립니다(먼저 정렬하거나 [해시 테이블](hash-tables.md)을 고려).
- 슬라이딩 윈도우는 "조건이 단조로울 때"만 성립합니다. 창을 넓히면 나빠지고 좁히면 좋아지는 성질이 있어야 합니다.

## 확인 질문

이 문제가 정렬된 데이터의 쌍/구간인가요? 이중 반복 대신 두 포인터를 한 방향으로만 움직여 선형으로 줄일 수 있나요?

## 참고 자료와 연결

[Two pointers technique (개요)](https://en.wikipedia.org/wiki/Two-pointer_technique)

관련: [정렬](sorting.md) · [탐색](searching.md) · [해시 테이블](hash-tables.md) · [문자열 매칭](string-matching.md) · [목차](index.md) · [용어집](glossary.md)
