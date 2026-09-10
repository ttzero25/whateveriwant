# 유니온-파인드(분리 집합)

> **TL;DR**
>
> 유니온-파인드는 원소들을 겹치지 않는 그룹으로 관리하며, 두 그룹을 합치기(union)와 어느 그룹인지 찾기(find)를 거의 상수 시간에 처리합니다. 연결성 판정과 최소 신장 트리(크루스칼)의 핵심 자료구조입니다.

AI 작성 해설

## 무엇을 푸는가

"이 둘은 같은 그룹인가?"와 "이 둘을 같은 그룹으로 합쳐라"를 빠르게 반복해야 할 때 씁니다. 각 그룹을 트리로 표현하고, 트리의 루트(대표)로 그룹을 식별합니다. 트리 개념은 [트리와 이진 탐색 트리](trees-and-bst.md)와 이어집니다.

## 두 최적화가 핵심

순진하게 하면 트리가 길어져 느립니다. 두 기법으로 거의 상수 시간(역아커만 함수 α, 사실상 O(1))이 됩니다.

- **경로 압축(path compression)**: find 도중 지나간 노드를 루트에 직접 연결.
- **랭크/크기 기준 합치기(union by size)**: 작은 트리를 큰 트리 밑에 붙임.

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))     # 처음엔 각자 자기 자신이 대표
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # 경로 압축(반쪽)
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                 # 이미 같은 그룹 → 합치지 않음
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra              # 큰 쪽(ra) 밑에 작은 쪽(rb)
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True
```

## 대표 용도

- **연결 요소·연결성**: 두 정점이 연결됐는지 즉시 판정.
- **크루스칼 MST**: 가장 가벼운 간선부터 보되, 사이클을 만들면(두 끝이 이미 같은 그룹) 건너뜁니다. 그리디 전략은 [그리디](greedy.md)와 이어집니다.
- **동적 그룹화**: 네트워크 연결, 친구 관계, 이미지 픽셀 라벨링.

```python
# 크루스칼: 사이클 없이 가장 가벼운 간선을 모아 최소 신장 트리
def kruskal(n, edges):                    # edges: [(weight, u, v), ...]
    dsu, mst = DSU(n), []
    for w, u, v in sorted(edges):
        if dsu.union(u, v):               # 합쳐지면(사이클 아님) 채택
            mst.append((u, v, w))
    return mst
```

## 자주 하는 오해

- 유니온-파인드는 그룹을 **합치기**는 쉽지만 **나누기**는 못 합니다(분할 취소가 필요하면 다른 구조).
- 경로 압축·크기 기준 합치기 중 하나만 써도 개선되지만, 둘 다 써야 최선입니다.

## 확인 질문

이 문제가 "합치기와 소속 판정"의 반복인가요? 그렇다면 매번 그래프 탐색([그래프와 탐색](graphs-search.md))을 다시 하는 대신 유니온-파인드가 훨씬 빠릅니다.

## 참고 자료와 연결

[Disjoint-set data structure (개요)](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)

관련: [그래프와 탐색](graphs-search.md) · [그리디](greedy.md) · [트리와 이진 탐색 트리](trees-and-bst.md) · [목차](index.md) · [용어집](glossary.md)
