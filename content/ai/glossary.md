# AI 한영 용어 찾아보기

AI 작성 해설

| 용어 | 뜻 | 상세 |
|---|---|---|
| AI / 인공지능 | 지능적 작업을 다루는 분야 | [기초](fundamentals.md) |
| ML / 머신러닝 | 데이터에서 패턴 학습 | [기초](fundamentals.md) |
| Deep learning / 딥러닝 | 다층 신경망 학습 | [신경망](neural-networks.md) |
| Supervised learning / 지도학습 | 정답을 사용한 학습 | [기초](fundamentals.md) |
| Self-supervised learning / 자기지도학습 | 데이터에서 학습 목표 구성 | [기초](fundamentals.md) |
| Reinforcement learning / 강화학습 | 보상 기반 정책 학습 | [기초](fundamentals.md) |
| Feature / 특성 | 입력 정보 | [신경망](neural-networks.md) |
| Label / 레이블 | 목표 정답 | [기초](fundamentals.md) |
| Parameter / 파라미터 | 학습되는 값 | [학습](training.md) |
| Hyperparameter / 하이퍼파라미터 | 학습 절차 설정 | [학습](training.md) |
| Loss / 손실 | 예측 오차 수치 | [학습](training.md) |
| Gradient / 기울기 | 변화율 벡터 | [학습](training.md) |
| Backpropagation / 역전파 | 기울기 계산 | [학습](training.md) |
| Optimizer / 옵티마이저 | 파라미터 갱신 | [학습](training.md) |
| Batch / 배치 | 데이터 묶음 | [학습](training.md) |
| Epoch / 에포크 | 전체 데이터 한 차례 처리 | [학습](training.md) |
| Overfitting / 과적합 | 학습 데이터에 지나친 적응 | [일반화](data-and-generalization.md) |
| Generalization / 일반화 | 새 데이터 예측 능력 | [일반화](data-and-generalization.md) |
| Precision / 정밀도 | 양성 예측의 적중 비율 | [평가](evaluation.md) |
| Recall / 재현율 | 실제 양성의 탐지 비율 | [평가](evaluation.md) |
| Tensor / 텐서 | 여기서는 다차원 배열 | [신경망](neural-networks.md) |
| Token / 토큰 | 텍스트 처리 단위 | [토큰](tokens-and-embeddings.md) |
| Embedding / 임베딩 | 벡터 표현 | [임베딩](tokens-and-embeddings.md) |
| Attention / 어텐션 | 관계 가중치로 표현 결합 | [Transformer](transformer.md) |
| Transformer / 트랜스포머 | Attention 중심 구조 | [Transformer](transformer.md) |
| Inference / 추론 | 모델 실행 | [LLM](llm-inference.md) |
| Context window / 문맥 창 | 처리 가능한 문맥 범위 | [LLM](llm-inference.md) |
| RAG / 검색 증강 생성 | 검색 자료로 생성 보완 | [RAG](rag.md) |
| Fine-tuning / 파인튜닝 | 추가 학습 | [파인튜닝](fine-tuning.md) |
| LoRA | 저랭크 변화량 학습 | [파인튜닝](fine-tuning.md) |

참고: [Google Machine Learning Glossary](https://developers.google.com/machine-learning/glossary). 기술별 출처는 연결된 상세 문서에 있습니다.

[목차](index.md)

## ML / DL 추가 용어

| 용어 | 뜻 | 상세 |
|---|---|---|
| Linear regression / 선형 회귀 | 가중합으로 연속 값 예측 | [선형 회귀](linear-regression.md) |
| Residual / 잔차 | 관측값과 예측값의 차이 | [선형 회귀](linear-regression.md) |
| MSE / 평균제곱오차 | 제곱오차의 평균 | [선형 회귀](linear-regression.md) |
| Logistic regression / 로지스틱 회귀 | 선형 점수로 클래스 확률 모델링 | [로지스틱 회귀](logistic-regression.md) |
| Threshold / 임계값 | 판정을 나누는 기준 | [로지스틱 회귀](logistic-regression.md) |
| Decision tree / 결정 트리 | 분기 조건을 따라 예측 | [결정 트리](decision-trees.md) |
| Clustering / 군집화 | 유사한 샘플 묶기 | [군집화](clustering.md) |
| Centroid / 중심점 | 군집을 대표하는 위치 | [군집화](clustering.md) |
| Activation / 활성화 | 비선형 변환 | [활성화 함수](activation-functions.md) |
| CNN / 합성곱 신경망 | 지역 필터를 공유하는 신경망 | [CNN](cnn.md) |
| Stride / 스트라이드 | 필터 이동 간격 | [CNN](cnn.md) |
| RNN / 순환 신경망 | 순차적으로 상태 갱신 | [RNN](rnn.md) |
| LSTM | 게이트와 셀 상태를 사용하는 RNN | [RNN](rnn.md) |
| Regularization / 정규화 | 과적합을 줄이는 제약·기법 | [정규화](regularization.md) |
| Dropout | 학습 중 일부 활성화 제거 | [정규화](regularization.md) |

정의와 출처는 각 상세 문서에서 확인할 수 있습니다.

## 확장 개념 찾아보기

| 용어 | 의미 | 해설 |
|---|---|---|
| 조건부 확률 / Conditional probability | 관측 조건을 반영한 사건의 확률 | [개념 보기](probability-statistics.md) |
| 교차 검증 / Cross-validation | 분할을 바꿔 모델·파이프라인을 평가 | [개념 보기](model-selection-features.md) |
| 배깅·부스팅 / Bagging, boosting | 다른 학습·결합 방식의 앙상블 | [개념 보기](ensembles.md) |
| 주성분 분석 / PCA | 분산 보존 방향을 이용한 선형 차원 축소 | [개념 보기](dimensionality-reduction.md) |
| 자동 미분 / Automatic differentiation | 연산의 미분을 연결해 기울기 계산 | [개념 보기](backpropagation.md) |
| 잔차 연결 / Residual connection | 입력에 학습한 변환을 더하는 경로 | [개념 보기](training-stability.md) |
| 지도 미세조정 / SFT | 입력·바람직한 응답 예시로 후학습 | [개념 보기](llm-training-lifecycle.md) |
| 재순위화 / Reranking | 검색 후보를 더 정밀하게 재정렬 | [개념 보기](context-retrieval.md) |
| 도구 호출 / Tool calling | 외부 기능에 구조화된 실행 요청 제안 | [개념 보기](llm-evaluation-tools.md) |

## 확장 개념 용어

| 용어 | 영어 | 의미 |
|---|---|---|
| 강화학습 | Reinforcement learning | 보상으로 정책을 학습하는 패러다임 |
| 정책·가치 | Policy / Value | 행동 규칙과 기대 누적 보상 |
| Q-러닝 | Q-learning | 시간차 갱신으로 행동 가치를 학습 |
| 탐험·활용 | Exploration / Exploitation | 새 행동 시도와 최선 선택의 균형 |
| 생성적 적대 신경망 | GAN | 생성기·판별기를 경쟁시키는 생성 모델 |
| 확산 모델 | Diffusion model | 노이즈를 점진적으로 제거해 생성 |
| 그래프 신경망 | GNN | 이웃 정보를 집계하는 메시지 전달 학습 |
| 서포트 벡터 머신 | SVM | 최대 여백 경계와 커널 기반 분류 |
| 커널 트릭 | Kernel trick | 고차원 내적으로 비선형 경계를 효율적으로 |
| 오토인코더 | Autoencoder | 병목으로 압축·복원하는 표현 학습 |
| 멀티모달 | Multimodal | 여러 모달리티를 공통 표현으로 연결 |
| 협업 필터링 | Collaborative filtering | 유사 사용자·항목으로 선호 예측 |
| 행렬 분해 | Matrix factorization | 잠재 벡터의 내적으로 선호를 근사 |

관련 문서: [강화학습](reinforcement-learning.md) · [생성 모델](generative-models.md) · [그래프 신경망](graph-neural-networks.md) · [서포트 벡터 머신](support-vector-machines.md) · [오토인코더](autoencoders.md) · [멀티모달 모델](multimodal-models.md) · [추천 시스템](recommender-systems.md)
