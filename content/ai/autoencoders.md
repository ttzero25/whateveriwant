# 오토인코더와 표현 학습

> **TL;DR**
>
> 오토인코더는 입력을 좁은 잠재 표현으로 압축했다가 다시 복원하도록 학습하는 신경망입니다. 병목을 통과시켜 데이터의 핵심 구조를 배우며, 차원 축소·이상 탐지·표현 학습에 쓰입니다.

AI 작성 해설

## 구조: 인코더-병목-디코더

오토인코더는 두 부분입니다. 인코더는 입력을 저차원 잠재 벡터로 압축하고, 디코더는 그 벡터에서 원본을 복원합니다. 출력이 입력과 같아지도록 학습하므로 라벨이 필요 없습니다(자기지도). 좁은 병목이 모든 정보를 담을 수 없게 만들어, 모델이 중요한 구조만 남기게 강제합니다. 신경망 기초는 [신경망과 텐서](neural-networks.md)와 이어집니다.

```python
import torch.nn as nn

class AutoEncoder(nn.Module):
    def __init__(self, d_in=784, d_latent=32):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(d_in, 128), nn.ReLU(),
                                     nn.Linear(128, d_latent))   # 병목으로 압축
        self.decoder = nn.Sequential(nn.Linear(d_latent, 128), nn.ReLU(),
                                     nn.Linear(128, d_in))       # 원본 복원
    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z), z

# 손실: 복원 오차(입력과 출력의 차이)를 최소화 → 라벨 불필요
# loss = mse(model(x)[0], x)
```

## PCA와의 관계

선형 활성화만 쓰는 오토인코더는 사실상 [차원 축소와 PCA](dimensionality-reduction.md)와 비슷한 부분공간을 찾습니다. 비선형 층을 넣으면 PCA가 못 잡는 곡면 구조까지 압축할 수 있다는 점이 차이입니다.

## 이상 탐지에서의 쓰임

정상 데이터로만 학습하면, 모델은 정상 패턴을 잘 복원합니다. 반대로 처음 보는 이상 입력은 복원 오차가 큽니다. 이 오차를 이상 점수로 써서, 라벨 없이 이상을 탐지할 수 있습니다. 이는 [로그 이상 탐지와 드리프트](../ai-for-security/log-anomaly-detection.md)에서 실제로 활용됩니다.

```python
# 정상으로 학습한 모델의 복원 오차가 크면 이상 후보
def anomaly_score(model, x):
    recon, _ = model(x)
    return ((recon - x) ** 2).mean(dim=1)   # 표본별 복원 오차
# 주의: "복원 오차 큼 = 이상"일 뿐 "= 악성"이 아니다. 맥락으로 검토해야 한다.
```

## 변형들

- **디노이징 오토인코더**: 입력에 노이즈를 넣고 원본을 복원하게 해 더 견고한 표현을 배웁니다.
- **변분 오토인코더(VAE)**: 잠재 공간을 확률 분포로 학습해 새 표본을 생성합니다. 생성 계열은 [생성 모델](generative-models.md)과 이어집니다.
- **표현 학습**: 학습된 잠재 벡터를 다른 과제의 입력 특징으로 재사용합니다.

## 한계와 유의점

복원이 잘 된다고 표현이 항상 유용한 것은 아니며, 병목 크기·구조에 성능이 민감합니다. 이상 탐지에서 오차 임계값은 기저율과 경보 예산을 고려해 정합니다. [탐지 지표와 경보 예산](../ai-for-security/detection-evaluation.md)

## 확인 질문

라벨 없이 데이터의 구조나 이상을 찾으려는 상황인가요? 복원 오차가 큰 표본을 곧바로 "이상/악성"으로 단정하고 있지는 않나요?

## 참고 자료와 연결

[Deep Learning Book: Autoencoders](https://www.deeplearningbook.org/contents/autoencoders.html)

관련: [차원 축소와 PCA](dimensionality-reduction.md) · [신경망과 텐서](neural-networks.md) · [로그 이상 탐지와 드리프트](../ai-for-security/log-anomaly-detection.md) · [목차](index.md) · [용어집](glossary.md)
