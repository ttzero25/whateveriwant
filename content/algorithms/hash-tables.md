# 해시 테이블

> **TL;DR**
>
> 해시 테이블은 키를 해시 함수로 버킷 인덱스에 대응시켜 평균 O(1)에 삽입·조회·삭제합니다. 충돌 처리와 부하율 관리가 성능을 좌우하며, 최악의 경우는 O(n)으로 나빠질 수 있습니다.

AI 작성 해설

## 아이디어: 키를 주소로

해시 함수가 키를 정수 인덱스로 바꾸면, 배열의 그 자리에 값을 두어 즉시 접근합니다. 그래서 평균 상수 시간입니다. 자료구조 전반은 [자료구조](data-structures.md)에서 다룹니다. 여기서 쓰는 해시는 속도용이며, 보안용 암호학적 해시([암호학: 해시 함수](../crypto/hashing.md))와는 목적이 다릅니다.

## 충돌은 반드시 생긴다

서로 다른 키가 같은 인덱스로 가는 충돌은 비둘기집 원리상 피할 수 없습니다. 두 가지 해결책이 있습니다.

| 방식 | 설명 |
|---|---|
| 체이닝 | 각 버킷에 연결 리스트/동적 배열을 두고 충돌 키를 이어 붙임 |
| 개방 주소법 | 충돌 시 다른 빈 버킷을 탐사(선형·이차·이중 해싱) |

```python
class HashMap:
    def __init__(self, cap=8):
        self.buckets = [[] for _ in range(cap)]   # 체이닝
        self.size = 0

    def _idx(self, key):
        return hash(key) % len(self.buckets)

    def put(self, key, value):
        bucket = self.buckets[self._idx(key)]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value); return   # 갱신
        bucket.append((key, value)); self.size += 1
        if self.size > len(self.buckets) * 0.75:    # 부하율 초과 시
            self._resize()                          # 리해시로 평균 O(1) 유지

    def get(self, key, default=None):
        for k, v in self.buckets[self._idx(key)]:
            if k == key:
                return v
        return default

    def _resize(self):
        old = [p for b in self.buckets for p in b]
        self.buckets = [[] for _ in range(len(self.buckets) * 2)]
        self.size = 0
        for k, v in old:
            self.put(k, v)
```

## 부하율과 리사이즈

부하율(원소 수 / 버킷 수)이 커지면 충돌이 늘어 성능이 떨어집니다. 임계치(예 0.75)를 넘으면 버킷을 늘리고 전체를 다시 배치(리해시)해 평균 O(1)을 유지합니다. 리사이즈는 가끔 O(n)이지만 분할 상환하면 상수입니다.

## 최악의 경우와 보안

해시가 몰리면(나쁜 해시나 적대적 입력) 한 버킷에 쏠려 O(n)이 됩니다. 공격자가 의도적으로 충돌을 유발하는 해시 충돌 DoS를 막기 위해, 언어 런타임은 실행마다 무작위화된 해시 시드를 씁니다.

## 무엇에 쓰나

집합·딕셔너리, 중복 제거, 캐시, 인덱스, 빈도 계산 등. 순서·범위 질의가 필요하면 대신 [트리](trees-and-bst.md)를 씁니다.

## 확인 질문

키가 균일하게 분포하나요, 아니면 적대적 입력으로 한 버킷에 몰릴 수 있나요? 순서나 범위 질의가 필요하지는 않나요?

## 참고 자료와 연결

[Hash table (개요)](https://en.wikipedia.org/wiki/Hash_table)

관련: [자료구조](data-structures.md) · [탐색](searching.md) · [트리와 이진 탐색 트리](trees-and-bst.md) · [목차](index.md) · [용어집](glossary.md)
