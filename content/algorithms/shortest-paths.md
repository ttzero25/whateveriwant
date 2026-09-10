# 최단 경로 알고리즘

> **TL;DR**
>
> 가중치 없는 그래프는 BFS, 음이 아닌 가중치는 다익스트라, 음수 간선까지는 벨만-포드로 최단 경로를 구합니다. 간선 가중치의 성질이 어떤 알고리즘을 쓸 수 있는지를 결정합니다.

AI 작성 해설

## 문제와 알고리즘 선택

한 출발점에서 다른 정점들까지의 최단 거리를 구하는 문제입니다. 그래프 표현·탐색 기초는 [그래프와 탐색](graphs-search.md)에서 다룹니다. 핵심은 **간선 가중치**입니다.

| 상황 | 알고리즘 | 복잡도 |
|---|---|---|
| 가중치 없음(모든 간선 1) | BFS | O(V+E) |
| 음이 아닌 가중치 | 다익스트라 | O(E log V) |
| 음수 간선 허용 | 벨만-포드 | O(V·E) |
| 모든 쌍 최단 경로 | 플로이드-워셜 | O(V³) |

## 다익스트라: 가까운 것부터 확정

다익스트라는 아직 확정하지 않은 정점 중 가장 가까운 것을 골라 확정하는 그리디 방식입니다([그리디](greedy.md)). "가장 가까운 미확정 정점"을 빠르게 꺼내려고 [우선순위 큐(힙)](heaps-priority-queues.md)를 씁니다.

```python
import heapq

def dijkstra(graph, start):          # graph: {u: [(v, weight), ...]}
    dist = {start: 0}
    pq = [(0, start)]                # (거리, 정점) 최소 힙
    while pq:
        d, u = heapq.heappop(pq)     # 가장 가까운 미확정 정점
        if d > dist.get(u, float("inf")):
            continue                 # 이미 더 짧은 경로로 확정됨 → 건너뜀
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd         # 완화(relaxation)
                heapq.heappush(pq, (nd, v))
    return dist
```

다익스트라는 **음수 간선이 있으면 틀립니다.** 한 번 확정한 거리를 나중에 더 줄이는 음수 간선을 그리디가 놓치기 때문입니다.

## 벨만-포드: 음수 간선과 음수 사이클

벨만-포드는 모든 간선을 V−1번 반복 완화합니다. 음수 간선도 처리하고, V번째 완화에서 거리가 더 줄면 **음수 사이클**이 있다는 뜻입니다(최단 경로가 정의되지 않음). 이 반복 완화는 [동적 계획법](dynamic-programming.md)의 관점으로 볼 수 있습니다.

## 자주 하는 오해

- "다익스트라는 항상 최단 경로"가 아닙니다 — 음이 아닌 가중치 전제입니다.
- 가중치가 모두 같다면 다익스트라보다 BFS가 더 단순하고 빠릅니다.
- 최단 경로 하나가 아니라 실제 경로가 필요하면, 완화할 때 이전 정점(parent)을 기록해 역추적합니다.

## 확인 질문

간선에 음수 가중치가 있나요(있다면 다익스트라 대신 벨만-포드)? 가중치가 모두 같다면 BFS로 충분하지 않나요? 거리뿐 아니라 경로 자체가 필요한가요?

## 참고 자료와 연결

[Dijkstra's algorithm (개요)](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

관련: [그래프와 탐색](graphs-search.md) · [힙과 우선순위 큐](heaps-priority-queues.md) · [그리디](greedy.md) · [동적 계획법](dynamic-programming.md) · [목차](index.md) · [용어집](glossary.md)
