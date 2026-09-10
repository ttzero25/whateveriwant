# 손실 함수와 최적화

> **TL;DR**
>
> 학습은 예측 오차를 수치화한 손실을 줄이도록 모델 파라미터를 조정하는 과정입니다.
> 순전파로 예측하고 역전파로 기울기를 구한 뒤 옵티마이저로 가중치를 갱신합니다.

AI 작성 해설

## 학습의 한 단계

1. 배치의 입력으로 예측합니다: 순전파(forward pass).
2. 예측과 목표를 비교해 손실(loss)을 계산합니다.
3. 역전파(backpropagation)로 파라미터별 기울기를 계산합니다.
4. 옵티마이저가 파라미터를 갱신합니다.

기본 경사하강법:

$$\theta_{t+1}=\theta_t-\eta\nabla_\theta L(\theta_t)$$

`θ`는 파라미터, `η`는 학습률, `L`은 손실입니다. 음의 기울기 방향으로 조금 이동합니다. 전역 최솟값에 도달한다는 보장은 아닙니다.

| 용어 | 의미 |
|---|---|
| Parameter | 학습으로 조정되는 가중치·편향 등 |
| Hyperparameter | 학습률처럼 학습 절차를 제어하는 설정 |
| Batch | 한 번의 계산에 묶는 데이터 |
| Epoch | 학습 데이터 전체를 한 차례 처리하는 단위 |

회귀에는 평균제곱오차, 분류에는 교차엔트로피를 자주 사용합니다. 선택은 문제와 출력 표현에 따라 달라집니다.

## 예시와 오해

`ŷ=wx`에서 `x=2`, 정답이 `6`인데 `w=1`이면 예측은 `2`입니다. 제곱오차의 기울기로 적절히 `w`를 늘리면 오차를 줄일 수 있습니다.

역전파는 기울기 계산이고, 옵티마이저는 갱신입니다. 두 용어는 같은 뜻이 아닙니다.

출처: [PyTorch — Optimizing Model Parameters](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html).

관련: [신경망](neural-networks.md) · [일반화](data-and-generalization.md) · [목차](index.md)
