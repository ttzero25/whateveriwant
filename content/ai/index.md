# AI 지식백과

[백과 홈](../../README.md) · [한영 용어 찾아보기](glossary.md)

모든 문서는 AI 작성 해설이며 소유자 검토 전입니다. 출처 확인일: 2026-09-10.

| 순서 | 개념 | 읽고 나면 답할 수 있는 질문 |
|---|---|---|
| 1 | [AI·ML·딥러닝과 학습 방식](fundamentals.md) | AI와 LLM은 같은 말인가? |
| 2 | [데이터 분할과 일반화](data-and-generalization.md) | 학습 성적이 좋은데 실제로는 왜 틀릴까? |
| 3 | [손실 함수와 최적화](training.md) | 학습은 어떤 값을 바꾸는가? |
| 4 | [신경망과 텐서](neural-networks.md) | 숫자 배열로 패턴을 어떻게 표현할까? |
| 5 | [분류 모델 평가](evaluation.md) | 정확도 99%를 믿어도 될까? |
| 6 | [토큰과 임베딩](tokens-and-embeddings.md) | 텍스트가 어떻게 숫자로 바뀔까? |
| 7 | [Attention과 Transformer](transformer.md) | 문맥에 따라 표현이 어떻게 달라질까? |
| 8 | [LLM의 생성과 추론](llm-inference.md) | 모델은 답변을 어떻게 이어 쓰는가? |
| 9 | [RAG](rag.md) | 내 문서를 근거로 답하게 하려면? |
| 10 | [파인튜닝과 LoRA](fine-tuning.md) | 언제 모델 가중치를 바꿔야 할까? |

## 목적별 학습 순서

- 기초: 1 → 2 → 3 → 4 → 5
- LLM 이해: 4 → 6 → 7 → 8
- 문서 기반 서비스: 6 → 8 → 9 → 10
- 보안 데이터 분석 기초: 2 → 5. 데이터 누출과 오탐·미탐부터 이해하세요.

예시는 개념 설명을 위한 가상 사례이며 실제 모델의 성능 측정 결과가 아닙니다.

## 머신러닝 · ML

[데이터 분할](data-and-generalization.md) → [선형 회귀](linear-regression.md) → [로지스틱 회귀](logistic-regression.md) → [분류 평가](evaluation.md) 순서로 시작하세요.

| 개념 | 핵심 질문 |
|---|---|
| [선형 회귀](linear-regression.md) | 숫자 예측과 오차는 어떻게 계산할까? |
| [로지스틱 회귀](logistic-regression.md) | 확률 추정과 최종 판정은 어떻게 다를까? |
| [결정 트리](decision-trees.md) | 조건을 나눠서 예측하는 원리는 무엇일까? |
| [군집화와 K-means](clustering.md) | 정답 없이 비슷한 데이터를 묶으려면? |

## 딥러닝 · DL

[신경망](neural-networks.md) → [활성화 함수](activation-functions.md) → [학습](training.md) → [정규화](regularization.md)를 익힌 뒤 CNN과 RNN을 비교하세요.

| 개념 | 핵심 질문 |
|---|---|
| [활성화 함수](activation-functions.md) | 층 사이에 비선형 함수가 왜 필요할까? |
| [CNN](cnn.md) | 지역 패턴과 채널은 어떻게 처리할까? |
| [RNN과 LSTM](rnn.md) | 순서에 따라 상태를 어떻게 갱신할까? |
| [정규화](regularization.md) | L2, dropout, 조기 종료는 어떻게 다를까? |

ML과 DL은 별개의 배타적 분야가 아닙니다. DL은 ML에 포함되며, 이 백과의 분류는 학습 경로를 쉽게 탐색하기 위한 구분입니다.
