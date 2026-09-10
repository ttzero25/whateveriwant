# 분류 모델 평가

> **TL;DR**
>
> 평가는 모델의 성공과 실패를 실제 목적에 맞는 지표로 측정하는 과정입니다.
> 정확도만 보지 말고 정밀도·재현율과 오탐·미탐을 함께 확인합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 혼동 행렬

양성(positive)을 '찾으려는 대상'으로 정합니다.

| 실제 / 예측 | 양성으로 예측 | 음성으로 예측 |
|---|---|---|
| 실제 양성 | TP: 올바른 탐지 | FN: 미탐 |
| 실제 음성 | FP: 오탐 | TN: 올바른 제외 |

$$\mathrm{Accuracy}=\frac{TP+TN}{TP+TN+FP+FN}$$
$$\mathrm{Precision}=\frac{TP}{TP+FP},\quad\mathrm{Recall}=\frac{TP}{TP+FN}$$
$$F_1=\frac{2TP}{2TP+FP+FN}$$

정밀도는 '찾았다고 한 것 중 실제 대상 비율', 재현율은 '실제 대상 중 찾아낸 비율'입니다. 분모가 0이면 별도의 처리 규칙이 필요합니다.

출처: [Google — Accuracy, recall, precision](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall).

## 계산 예시

가상 샘플 1,000개 중 대상이 10개라면, 모두 음성이라고 해도 정확도는 99%지만 재현율은 0%입니다.

다른 결과가 `TP=8, FN=2, FP=12, TN=978`이면 정밀도는 40%, 재현율은 80%, F1은 약 53.3%입니다.

## 해석할 때

같은 점수 모델에서 양성 판정 임계값을 낮추면 더 많이 탐지하면서 오탐도 늘 수 있습니다. 정밀도가 반드시 단조롭게 변하는 것은 아닙니다. 임계값은 검증 세트에서 선택하고 최종 테스트는 분리합니다.

관련: [데이터 분할](data-and-generalization.md) · [목차](index.md)
