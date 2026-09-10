# 적대적 머신러닝: 회피·오염·추론 공격

> **TL;DR**
>
> 보안에 쓰는 모델은 그 자체가 공격 대상이 됩니다. 공격자는 입력을 살짝 바꿔 탐지를 회피하거나(evasion), 학습 데이터를 오염시키거나(poisoning), 모델에서 학습 데이터를 추론(inference)합니다. 방어는 위협을 데이터·학습·운영 전 구간에서 함께 다뤄야 합니다.

AI 작성 해설

## 왜 보안 모델은 특별한가

일반 ML은 자연적으로 발생하는 분포를 가정하지만, 보안에서는 상대가 **모델을 이기려고 능동적으로 입력을 조작**합니다. 즉 데이터 분포가 적대적으로 움직입니다. 그래서 정확도가 높아도 회피에 약하면 실전에서 무력화됩니다. 보안 데이터의 특성·누수 문제는 [보안 데이터, 라벨, 누수](../ai-for-security/security-data.md)와 이어집니다.

## 공격 유형과 방어의 대응

| 공격 | 시점 | 목표 | 핵심 방어 |
|---|---|---|---|
| 회피(evasion) | 추론 | 악성 입력을 정상으로 오분류시킴 | 견고한 특징, 적대적 학습, 앙상블 |
| 오염(poisoning) | 학습 | 학습 데이터에 악성 샘플 주입 | 데이터 출처 검증, 이상치 제거 |
| 백도어 | 학습 | 특정 트리거에만 오작동 | 학습 파이프라인 무결성, 트리거 탐지 |
| 모델 추출 | 추론 | 질의로 모델 복제 | 질의 제한, 응답 정밀도 하향 |
| 멤버십 추론 | 추론 | 특정 샘플의 학습 포함 여부 추론 | 정규화, 차등 프라이버시 |

## 회피가 왜 쉬운가: 결정 경계의 취약성

많은 분류기의 결정 경계는 사람이 느끼지 못할 작은 변화에도 민감합니다. 아래는 개념을 보여 주는 축소 예시로, 그래디언트 방향으로 입력을 살짝 밀어 예측을 뒤집는 FGSM의 골격입니다.

```python
# 개념 예시: 입력을 손실 증가 방향으로 epsilon만큼 밀어 오분류 유도 (FGSM)
# 방어자가 자기 모델의 취약성을 평가할 때 쓰는 절차다.
def fgsm_example(model, x, y_true, epsilon, loss_fn):
    x = x.clone().detach().requires_grad_(True)
    loss = loss_fn(model(x), y_true)
    loss.backward()                          # 입력에 대한 그래디언트
    x_adv = x + epsilon * x.grad.sign()      # 손실이 커지는 방향으로 한 걸음
    return x_adv.clamp(0, 1).detach()        # 유효 입력 범위로 자른다
```

방어 평가에서는 이렇게 만든 적대적 샘플에 대한 정확도(robust accuracy)를 정상 정확도와 함께 봅니다. 탐지 성능 지표는 [탐지 지표와 경보 예산](../ai-for-security/detection-evaluation.md)에서 다룹니다.

## 오염과 공급망

학습 데이터가 외부 피드·크라우드소싱·공개 저장소에서 온다면 오염 표면이 생깁니다. 데이터·모델 가중치의 출처와 무결성을 검증하는 것은 [AI 시스템 보안](securing-ai-systems.md), [소프트웨어 공급망 보안](../security/software-supply-chain.md)과 같은 문제입니다.

## 견고한 방어의 원칙

- 특징 자체를 조작하기 어렵게 설계하고(공격자가 통제하기 힘든 신호 활용), 단일 모델에 의존하지 않습니다.
- 모델을 단독 차단 장치로 두지 않고, 규칙·평판·행위 로그와 함께 심층 방어를 구성합니다.
- 배포 후에도 회피 시도·분포 변화(drift)를 모니터링하고 재학습·롤백 절차를 둡니다. [보안 모델 모니터링·재학습·롤백](../ai-for-security/model-operations.md)

## 확인 질문

지금 모델의 정상 정확도만 보고 있지는 않나요? 상대가 입력을 통제할 수 있다는 전제에서 어떤 특징이 가장 쉽게 조작될까요?

## 참고 자료와 연결

[NIST AI 100-2: Adversarial ML 분류체계](https://csrc.nist.gov/pubs/ai/100/2/e2025/final) · [MITRE ATLAS](https://atlas.mitre.org/)

관련: [AI 시스템 보안](securing-ai-systems.md) · [보안 데이터·라벨·누수](../ai-for-security/security-data.md) · [모델 모니터링·재학습·롤백](../ai-for-security/model-operations.md) · [목차](../ai-for-security/index.md) · [용어집](../ai-for-security/glossary.md)
