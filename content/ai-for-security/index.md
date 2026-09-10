# AI for Security 학습 가이드

> **TL;DR**
>
> 보안 문제 정의 → 데이터 설계 → 탐지 평가 → 로그 이상 탐지 → LLM 관제 지원 순서로 배웁니다. AI와 Security의 기초를 실제 방어 업무의 판단 기준으로 연결합니다.

AI 작성 해설

[백과 홈](../../README.md) · [한영 용어집](glossary.md)

## 핵심 개념의 학습 순서

| 순서 | 문서 | 읽고 나면 답할 수 있는 질문 |
|---|---|---|
| 1 | [AI for Security의 범위](fundamentals.md) | 어떤 업무를 AI에 맡기고 무엇으로 성공을 판단하는가? |
| 2 | [보안 데이터](security-data.md) | 로그와 라벨을 어떻게 신뢰할 수 있는 입력으로 만드는가? |
| 3 | [탐지 모델 평가](detection-evaluation.md) | 정확도 99%인데 경보 대부분이 오탐일 수 있는가? |
| 4 | [로그 이상 탐지](log-anomaly-detection.md) | 평소와 다른 활동이 반드시 악성인가? |
| 5 | [보안 관제의 LLM](llm-security-operations.md) | 근거 있는 요약과 권한 있는 검색을 어떻게 구성하는가? |

> AI 시스템 **자체를 보호**하는 주제(적대적 ML·프롬프트 인젝션·AI 시스템 보안)는 별도 섹션으로 분리했습니다 → [Security for AI 학습 가이드](../security-for-ai/index.md)

## 먼저 읽으면 좋은 기초

AI 기초가 필요하면 [데이터 분할과 일반화](../ai/data-and-generalization.md), [분류 모델 평가](../ai/evaluation.md), [RAG](../ai/rag.md)를 읽어 보세요. 보안 기초는 [보안 원칙](../security/principles.md)과 [인증·인가](../security/authentication-authorization.md)에서 이어집니다.

## 목적별 학습 경로

- 탐지 모델 설계: 1 → 2 → 3 → 4 → 확장 학습
- 관제 업무의 LLM 활용: 1 → 2 → 5 → 3
- AI 시스템 보호가 필요하면: [Security for AI](../security-for-ai/index.md) 섹션으로

모든 예시는 개념 설명을 위한 가상 사례이며 실제 제품 성능이나 사고 판정 결과가 아닙니다. 특히 [기저율 계산](detection-evaluation.md)은 수치가 높아 보이는 모델과 실제 경보 품질의 차이를 설명하기 위한 예입니다.

## 학습 결과를 하나의 설계로 연결하기

사내 로그인 경보를 검토하는 서비스를 생각해 보세요. 로그의 예측 시점과 라벨을 정의하고, 분석 가능한 경보량으로 임계값을 고릅니다. 이상 점수에 원본 이벤트와 기준 기간을 붙이고, LLM은 허용된 기록만 요약하게 합니다. 최종 판단과 계정 변경 권한은 별도로 관리합니다.

설계가 끝나면 “어떤 데이터를 보았는가, 무엇을 놓칠 수 있는가, 누가 어떤 권한으로 대응하는가, 문제가 생기면 어떻게 되돌리는가”를 설명할 수 있어야 합니다.

## 출처와 문서 성격

NIST·OWASP·Google·scikit-learn 공식 자료를 참고한 한국어 해설입니다. 원문 발췌나 번역이 아니며 각 문서에 출처를 연결했습니다. 확인일은 원문의 수정일과 다릅니다. 영어 보기에서는 한국어 본문 제공 안내를 표시합니다.

## 확장 학습: 기초에서 설계와 운영으로

| 새 개념 | 수준 |
|---|---|
| [탐지 엔지니어링: 가설·데이터·규칙·모델의 수명](detection-engineering.md) | 응용 |
| [피싱 분류 사례: 데이터에서 경보 검토까지](phishing-classification.md) | 응용 |
| [보안 모델 운영: 관측·재학습·롤백](model-operations.md) | 응용 |
| [악성코드 분류: 특징 공학과 회피](malware-classification.md) | 응용 |
| [UEBA와 그래프 기반 탐지](ueba-graph-detection.md) | 응용 |
| [SOAR와 경보 자동 대응](soar-automation.md) | 응용 |
| [위협 인텔리전스 보강과 연관 분석](threat-intel-enrichment.md) | 응용 |

적용 경로: 보안 데이터 → 탐지 평가 → 피싱 분류·악성코드 분류 → 탐지 엔지니어링 → UEBA·그래프 탐지 → 위협 인텔 보강 → SOAR 자동 대응 → 모델 운영. AI 시스템 자체의 방어는 [Security for AI](../security-for-ai/index.md)에서 다룹니다.
