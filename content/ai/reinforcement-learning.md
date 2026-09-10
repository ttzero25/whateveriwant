# 강화학습: 보상으로 배우는 정책

> **TL;DR**
>
> 강화학습은 정답 라벨 대신 보상 신호로 배웁니다. 에이전트가 환경에서 행동하고, 받은 보상으로 장기 누적 보상을 최대화하는 정책을 학습합니다. 지연 보상과 탐험-활용 균형이 지도학습과의 핵심 차이입니다.

AI 작성 해설

## 지도학습과 무엇이 다른가

지도학습은 입력마다 정답이 주어지지만, 강화학습은 "이 행동이 정답"이라고 알려 주지 않고 **보상**만 줍니다. 게다가 보상은 지연됩니다(바둑은 마지막에야 승패를 앎). 그래서 어떤 행동이 좋은 결과에 기여했는지를 스스로 배분해야 합니다. 학습 패러다임 개요는 [AI·ML·딥러닝과 학습 방식](fundamentals.md)과 이어집니다.

## 구성 요소

- **상태(state)**: 지금 환경의 상황.
- **행동(action)**: 에이전트가 고를 수 있는 선택.
- **보상(reward)**: 행동 뒤 받는 즉각 신호.
- **정책(policy)**: 상태에서 행동을 고르는 규칙(학습 대상).
- **가치(value)**: 어떤 상태·행동이 앞으로 가져올 누적 보상의 기대치.

목표는 즉각 보상이 아니라 **할인된 누적 보상**의 기대를 최대화하는 정책입니다. 미래 보상은 할인율로 낮춰 반영합니다.

## 탐험과 활용

이미 좋다고 아는 행동만 하면(활용) 더 나은 선택을 못 찾고, 새 행동만 하면(탐험) 비효율적입니다. 균형이 필요합니다. 간단한 방법은 ε-탐욕: 대부분 최선을 고르되 가끔 무작위로 탐험합니다.

## Q-러닝: 가치로 정책 만들기

Q값 `Q(s,a)`은 상태 s에서 행동 a를 한 뒤 최적으로 행동했을 때의 기대 누적 보상입니다. 관측한 보상으로 이 추정을 조금씩 갱신합니다.

```python
import random

def q_learning_update(Q, s, a, r, s_next, actions, alpha=0.1, gamma=0.95):
    # 시간차(TD) 갱신: 관측 보상 + 다음 상태 최선값으로 현재 추정을 끌어당긴다
    best_next = max(Q.get((s_next, a2), 0.0) for a2 in actions)
    target = r + gamma * best_next            # gamma: 미래 보상 할인
    Q[(s, a)] = Q.get((s, a), 0.0) + alpha * (target - Q[(s, a)])
    return Q

def epsilon_greedy(Q, s, actions, eps=0.1):
    if random.random() < eps:
        return random.choice(actions)          # 탐험
    return max(actions, key=lambda a: Q.get((s, a), 0.0))  # 활용
```

## 정책 기반과 심층 강화학습

가치 대신 정책을 직접 최적화하는 정책 경사(policy gradient) 계열도 있습니다. 상태가 크거나 연속적이면 Q나 정책을 신경망으로 근사합니다(심층 강화학습). 신경망 학습 원리는 [신경망과 텐서](neural-networks.md)·[손실 함수와 최적화](training.md)와 이어집니다. LLM의 선호 학습(RLHF 등)도 강화학습 아이디어를 씁니다. [LLM의 사전학습과 후학습](llm-training-lifecycle.md)

## 어려운 점

보상 설계가 잘못되면 엉뚱한 행동을 최적화합니다(보상 해킹). 학습이 불안정하고 샘플이 많이 필요하며, 시뮬레이션과 현실의 차이도 문제입니다.

## 확인 질문

이 문제에 정답 라벨이 있나요, 아니면 결과 보상만 있나요? 지금 보상 함수가 정말 원하는 행동을 보상하나요, 아니면 지름길로 악용될 여지가 있나요?

## 참고 자료와 연결

[OpenAI Spinning Up](https://spinningup.openai.com/en/latest/) · [Sutton & Barto: Reinforcement Learning](https://en.wikipedia.org/wiki/Reinforcement_learning)

관련: [AI·ML·딥러닝과 학습 방식](fundamentals.md) · [손실 함수와 최적화](training.md) · [LLM의 사전학습과 후학습](llm-training-lifecycle.md) · [목차](index.md) · [용어집](glossary.md)
