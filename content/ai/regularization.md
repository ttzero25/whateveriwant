# 정규화: 과적합을 줄이는 학습 제약

> **TL;DR**
>
> 정규화(regularization)는 모델이 학습 데이터에 지나치게 맞춰지는 것을 줄이기 위한 제약이나 기법입니다. 가중치 페널티, dropout, 조기 종료는 작동 방식이 서로 다릅니다.

AI 작성 해설

## L2 정규화

데이터 손실에 가중치 크기에 대한 페널티를 더합니다.

$$L_{total}=L_{data}+\lambda\sum_jw_j^2$$

`λ`는 페널티 강도입니다. 너무 작으면 효과가 약하고, 너무 크면 필요한 패턴까지 학습하지 못할 수 있습니다. 페널티를 적용할 파라미터와 손실의 스케일은 구현마다 확인해야 합니다.

출처: [Google — L2 regularization](https://developers.google.com/machine-learning/crash-course/overfitting/regularization).

## 기법별 비교

| 기법 | 학습에 미치는 영향 |
|---|---|
| L2 페널티 | 큰 가중치에 비용 부과 |
| Dropout | 학습 중 일부 활성화를 확률적으로 제거 |
| Early stopping | 검증 결과를 기준으로 학습 시점 선택 |

일반적인 dropout은 추론 시 비활성화합니다. 학습 때 유지 확률에 따른 스케일 보정 방식도 구현에 포함될 수 있습니다.

용어 참고: [Google — Dropout regularization](https://developers.google.com/machine-learning/glossary?hl=en#dropout-regularization).

## 예시: 손실이 계속 내려가는데 멈추는 이유

학습 손실이 계속 감소해도 검증 손실이 여러 번 악화되면 이전 체크포인트를 선택할 수 있습니다. 이때 평가에 쓴 데이터는 검증 세트입니다. 최종 테스트를 학습 중단 시점 선택에 반복 사용하면 안 됩니다.

## 헷갈리기 쉬운 점

Regularization과 입력 스케일을 바꾸는 normalization은 다른 개념입니다. Adam 같은 적응형 옵티마이저에서는 L2 페널티와 분리된 weight decay가 일반적으로 같은 갱신을 만들지 않습니다. 정규화는 데이터 누출이나 잘못된 레이블을 고치는 대안도 아닙니다.

관련: [일반화](data-and-generalization.md) · [학습](training.md) · [CNN](cnn.md) · [목차](index.md)
