# 생성 모델: GAN과 확산 모델

> **TL;DR**
>
> 생성 모델은 데이터의 분포를 배워 새로운 표본을 만듭니다. GAN은 생성기와 판별기를 경쟁시켜, 확산 모델은 노이즈를 점진적으로 걷어 내며 생성합니다. 최근 이미지·오디오 생성의 주류는 확산 모델입니다.

AI 작성 해설

## 판별 모델과 생성 모델

판별 모델은 "이 입력의 라벨은?"(경계)을 배우고, 생성 모델은 "데이터가 어떻게 생겼는가"(분포)를 배워 새 표본을 만듭니다. 분류·평가 기초는 [분류 모델 평가](evaluation.md)와 이어집니다. 텍스트 생성의 주류인 Transformer는 [Attention과 Transformer](transformer.md)에서 다루므로, 여기서는 이미지 계열을 봅니다.

## GAN: 생성기 대 판별기

GAN은 두 신경망을 경쟁시킵니다. 생성기는 가짜를 만들고, 판별기는 진짜와 가짜를 구별합니다. 서로를 이기려는 과정에서 생성기의 표본이 점점 진짜에 가까워집니다.

```python
# 개념 골격: 판별기는 진짜/가짜를 맞히고, 생성기는 판별기를 속이도록 학습
for real in dataloader:
    z = sample_noise(batch)              # 무작위 잠재 벡터
    fake = generator(z)

    # 1) 판별기: 진짜는 1, 가짜는 0으로
    d_loss = bce(discriminator(real), 1) + bce(discriminator(fake.detach()), 0)
    d_loss.backward(); d_opt.step()

    # 2) 생성기: 판별기가 가짜를 1로 착각하게
    g_loss = bce(discriminator(fake), 1)
    g_loss.backward(); g_opt.step()
```

GAN은 선명한 이미지를 빠르게 만들지만 학습이 불안정하고(모드 붕괴 등) 튜닝이 까다롭습니다.

## 확산 모델: 노이즈를 걷어 낸다

확산 모델은 두 과정으로 정의됩니다. **정방향**은 데이터에 노이즈를 조금씩 더해 완전한 잡음으로 만들고, **역방향**은 신경망이 각 단계의 노이즈를 예측해 제거하며 데이터를 복원합니다. 학습이 끝나면 순수 잡음에서 시작해 여러 단계로 표본을 생성합니다.

```python
# 학습: 임의 시점 t의 노이즈를 예측하도록 회귀
t = random_timestep()
noise = randn_like(x0)
x_t = sqrt(alpha_bar[t]) * x0 + sqrt(1 - alpha_bar[t]) * noise   # 정방향(닫힌 형태)
loss = mse(model(x_t, t), noise)     # 더해진 노이즈를 맞히면 역방향으로 생성 가능
```

확산 모델은 학습이 안정적이고 표본 품질·다양성이 높아 이미지 생성의 주류가 되었지만, 여러 단계를 거쳐 생성이 느립니다(가속 기법 활발). VAE는 잠재 공간으로 압축·복원하는 또 다른 계열로, 표현 학습은 [오토인코더](autoencoders.md)와 이어집니다.

## 평가와 위험

생성 품질은 정답이 없어 평가가 어렵습니다(FID 등 지표 + 사람 평가). 또한 생성 모델은 학습 데이터를 기억·재현할 수 있어 저작권·프라이버시 문제가 있고, 딥페이크 등 오용 위험이 있습니다. 방어적 관점은 [AI 시스템 보안](../security-for-ai/securing-ai-systems.md)과 이어집니다.

## 확인 질문

지금 풀려는 문제가 분류(경계)인가요, 생성(분포)인가요? 생성 결과의 품질을 무엇으로 평가하고, 학습 데이터 유출·오용 위험은 어떻게 다루나요?

## 참고 자료와 연결

[Goodfellow et al., GAN (2014)](https://arxiv.org/abs/1406.2661) · [Ho et al., Denoising Diffusion (2020)](https://arxiv.org/abs/2006.11239)

관련: [신경망과 텐서](neural-networks.md) · [CNN](cnn.md) · [오토인코더](autoencoders.md) · [목차](index.md) · [용어집](glossary.md)
