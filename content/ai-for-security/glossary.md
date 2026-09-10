# AI for Security 한영 용어집

> **TL;DR**
>
> 보안 AI의 데이터·평가·관제·시스템 보호 용어를 찾아보고 관련 해설로 이동하세요.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 데이터와 문제 정의

| 용어 | 영어 | 의미 |
|---|---|---|
| 보안을 위한 AI | AI for Security | AI로 보안 분석과 방어 업무를 지원 |
| AI를 위한 보안 | Security for AI | AI 데이터·모델·서비스 자체의 보호 |
| 라벨 | Label | 학습·평가에 사용하는 목표 판정 |
| 특징 | Feature | 모델 판단에 사용하는 입력 표현 |
| 데이터 누출 | Data leakage | 평가 시 알아서는 안 될 정보가 학습·판단에 반영 |
| 라벨 지연 | Label delay | 이벤트 발생과 확정 판정 사이의 시간 차이 |
| 선택 편향 | Selection bias | 수집·검토한 사례가 대상 전체를 대표하지 못하는 문제 |
| 기저율 | Base rate | 대상 집단에서 실제 양성 사례가 차지하는 비율 |

관련 해설과 출처: [문제 정의](fundamentals.md) · [보안 데이터](security-data.md)

## 탐지와 평가

| 용어 | 영어 | 의미 |
|---|---|---|
| 오탐 | False positive, FP | 정상을 양성으로 예측 |
| 미탐 | False negative, FN | 실제 양성을 놓침 |
| 정밀도 | Precision | 양성 예측 중 실제 양성의 비율 |
| 재현율 | Recall / TPR | 실제 양성 중 탐지한 비율 |
| 오탐률 | False positive rate, FPR | 실제 정상 중 경보가 된 비율 |
| 임계값 | Threshold | 점수를 경보 등의 결정으로 바꾸는 기준 |
| 경보 예산 | Alert budget | 일정 기간에 검토할 수 있도록 정한 경보량 |
| 이상 탐지 | Anomaly detection | 기준에서 벗어난 관측을 찾는 작업 |
| 신규성 탐지 | Novelty detection | 정상 기준을 학습하고 새 입력의 이탈을 판단 |
| 데이터 드리프트 | Data drift | 시간에 따른 입력 분포 변화 |
| 개념 드리프트 | Concept drift | 입력과 목표 정답의 관계 변화 |
| 관측 전용 배포 | Shadow mode | 실제 대응에 연결하지 않고 운영 입력으로 평가 |

관련 해설과 출처: [탐지 평가](detection-evaluation.md) · [로그 이상 탐지](log-anomaly-detection.md)

## LLM과 AI 시스템 보호

| 용어 | 영어 | 의미 |
|---|---|---|
| 보안 관제 | SOC | 보안 이벤트를 관측·조사·대응하는 조직과 업무 |
| 우선순위 분류 | Triage | 검토·대응 우선순위를 정하는 작업 |
| 검색 증강 생성 | RAG | 검색한 자료를 생성의 문맥으로 제공 |
| 근거 연결 | Grounding | 생성된 주장을 제공된 자료에 연결 |
| 환각 | Hallucination | 사실이나 제공 근거와 맞지 않는 내용 생성 |
| 프롬프트 인젝션 | Prompt injection | 입력 속 지시가 원래 업무에 영향을 주는 문제 |
| 데이터 오염 | Data poisoning | 학습 데이터·라벨 훼손으로 모델에 영향을 주는 문제 |
| 회피 | Evasion | 운영 입력에서 모델의 올바른 판단을 벗어나게 하는 문제 |
| 출처·이력 | Provenance | 데이터와 아티팩트의 기원 및 변경 기록 |
| 판단 유보 | Abstention | 근거·조건이 부족할 때 결론을 내리지 않음 |
| 사람의 검토 | Human-in-the-loop | 중요한 판단과 실행에 사람의 검토를 포함 |

관련 해설과 출처: [보안 관제의 LLM](llm-security-operations.md) · [AI 시스템 보호](securing-ai-systems.md) · [학습 가이드](index.md)
