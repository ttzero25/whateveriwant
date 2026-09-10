# Attention과 Transformer

> **TL;DR**
>
> Transformer는 attention을 중심으로 입력 위치 사이의 관계를 계산하는 신경망 구조입니다.
> Q·K로 관계의 가중치를 만들고 V를 결합합니다. 다음 토큰 예측에서는 미래 위치를 가립니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## Attention 계산

각 위치의 표현으로 Query, Key, Value를 만듭니다. Query와 Key의 유사도로 가중치를 계산하고 그 가중치로 Value를 합칩니다.

$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

`d_k`는 Key 벡터의 차원입니다. Self-attention은 같은 시퀀스에서 Q·K·V를 만들며, multi-head attention은 여러 투영 공간에서 관계를 계산합니다.

블록에는 attention 외에도 위치별 feed-forward 연산, 잔차 연결, 정규화가 포함됩니다. 순서를 다루기 위한 위치 정보도 필요합니다.

| 구조 | 역할 |
|---|---|
| Encoder | 입력의 문맥 표현 생성 |
| Decoder | 이전 출력 등을 바탕으로 출력 생성 |
| Encoder–decoder | 입력 표현을 참조하며 출력 생성 |

원 논문은 encoder–decoder 구조입니다. 이후 decoder-only 모델 등 변형이 사용됩니다. Causal mask는 다음 토큰 예측에서 미래 위치를 보지 못하도록 제한합니다.

출처: [Vaswani et al. — Attention Is All You Need](https://arxiv.org/abs/1706.03762).

## 예시와 오해

'민수는 책을 샀고 그것을 읽었다'에서 '그것'의 표현은 문맥의 영향을 받습니다. Attention은 이런 관계를 반영할 수 있지만 가중치만으로 모델 판단의 원인을 완전히 설명했다고 볼 수는 없습니다.

관련: [신경망](neural-networks.md) · [임베딩](tokens-and-embeddings.md) · [LLM](llm-inference.md) · [목차](index.md)
