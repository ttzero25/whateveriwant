# 그래프 신경망(GNN)

> **TL;DR**
>
> 그래프 신경망은 노드와 간선으로 이뤄진 데이터에서 학습합니다. 각 노드가 이웃의 정보를 모아 자기 표현을 갱신하는 메시지 전달로, 관계 구조 자체를 특징으로 활용합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 왜 그래프인가

이미지는 격자, 텍스트는 순열이지만, 소셜 네트워크·분자·지식 그래프·인프라는 **관계**가 본질입니다. 노드를 표 형태로 펼치면 "누가 누구와 연결됐는가"라는 핵심 정보가 사라집니다. GNN은 연결 구조를 그대로 입력으로 씁니다. 그래프 자료구조·탐색은 [그래프와 탐색](../cs/graphs-search.md), 신경망 기초는 [신경망과 텐서](neural-networks.md)와 이어집니다.

## 메시지 전달

핵심 아이디어는 단순합니다. 각 노드는 (1) 이웃의 표현을 모으고(aggregate), (2) 자기 표현과 합쳐 갱신합니다(update). 이 과정을 여러 층 반복하면, 한 노드의 표현에 점점 먼 이웃 정보까지 담깁니다. 한 층은 1홉, 두 층은 2홉 이웃을 반영합니다.

```python
# 개념 골격: 한 층의 메시지 전달 (평균 집계)
def gnn_layer(H, adj, W):
    # H: 노드 표현 행렬 (N x d), adj: 이웃 관계, W: 학습 가중치
    messages = []
    for v in range(len(H)):
        neighbors = adj[v]
        agg = mean([H[u] for u in neighbors]) if neighbors else H[v]  # 이웃 집계
        messages.append(combine(H[v], agg))     # 자기 표현과 합침
    return relu(matmul(stack(messages), W))      # 비선형 변환

# 여러 층을 쌓으면 더 먼 이웃까지 정보가 전파된다
```

집계 함수(평균·합·어텐션)에 따라 GCN, GraphSAGE, GAT 등으로 나뉩니다.

## 세 가지 과제 수준

| 수준 | 예 |
|---|---|
| 노드 분류 | 계정이 정상인지 악성인지 |
| 간선 예측 | 두 사용자가 연결될 가능성(추천) |
| 그래프 분류 | 분자 전체가 특정 성질을 갖는지 |

## 보안에서의 쓰임

계정·호스트·자원을 노드로 두면, 개별 이벤트로는 안 보이는 횡적 이동·공유 인프라·이상 군집을 노드 표현으로 학습할 수 있습니다. 이는 [UEBA와 그래프 기반 탐지](../ai-for-security/ueba-graph-detection.md)와 직접 이어집니다.

## 한계

- **과평활화(over-smoothing)**: 층을 너무 쌓으면 모든 노드 표현이 비슷해져 구별력을 잃습니다.
- **확장성**: 거대한 그래프는 이웃 샘플링·미니배치가 필요합니다.
- **동적 그래프**: 시간에 따라 변하는 연결은 추가 설계가 필요합니다.

## 확인 질문

이 데이터에서 관계 구조가 예측에 중요한가요, 아니면 노드 특징만으로 충분한가요? 층을 몇 개나 쌓아야 필요한 이웃 범위를 담을 수 있나요?

## 참고 자료와 연결

[Kipf & Welling, GCN (2017)](https://arxiv.org/abs/1609.02907) · [Distill: A Gentle Introduction to GNNs](https://distill.pub/2021/gnn-intro/)

관련: [신경망과 텐서](neural-networks.md) · [그래프와 탐색](../cs/graphs-search.md) · [UEBA와 그래프 기반 탐지](../ai-for-security/ueba-graph-detection.md) · [목차](index.md) · [용어집](glossary.md)
