# Security for AI 학습 가이드

> **TL;DR**
>
> AI 시스템 **자체를 보호**하는 분야입니다. 학습 데이터·모델·파이프라인·LLM 애플리케이션을 겨냥한 공격(오염·회피·추출·인젝션)과 그 방어를, 위협 모델부터 레드팀·거버넌스까지 연결합니다. "AI로 방어"하는 [AI for Security](../ai-for-security/index.md)와 방향이 반대입니다.

AI 작성 해설

[백과 홈](../../README.md) · [한영 용어집](glossary.md)

## AI for Security와 무엇이 다른가

| | AI for Security | Security for AI |
|---|---|---|
| 방향 | AI를 **써서** 보안 업무 수행 | AI 시스템 **자체를** 보호 |
| 예 | 탐지·SOC·악성코드 분류 | 데이터 오염·프롬프트 인젝션 방어 |

## 학습 순서

| 순서 | 문서 | 읽고 나면 답할 수 있는 질문 |
|---|---|---|
| 1 | [AI 시스템 보안: 범위와 경계](securing-ai-systems.md) | 데이터·모델·도구의 경계를 어디서 강제하는가? |
| 2 | [적대적 머신러닝: 회피·오염·추론](adversarial-ml.md) | 상대가 입력을 조작한다면 무엇이 무너지는가? |
| 3 | [데이터 오염과 백도어](data-poisoning.md) | 학습 데이터가 오염되면 어떻게 드러나는가? |
| 4 | [모델 추출과 도용](model-extraction.md) | 질의만으로 모델을 복제할 수 있는가? |
| 5 | [학습 데이터 프라이버시](data-privacy-ml.md) | 모델이 학습 데이터를 얼마나 흘리는가? |
| 6 | [LLM 프롬프트 인젝션 방어](llm-prompt-injection.md) | 콘텐츠에 숨은 지시를 어떻게 막는가? |
| 7 | [LLM 애플리케이션 보안](llm-application-security.md) | 출력 처리·권한·노출 표면을 어떻게 통제하는가? |
| 8 | [ML 공급망 보안](ml-supply-chain.md) | 외부 모델·데이터를 왜 그대로 믿으면 안 되는가? |
| 9 | [AI 레드팀과 거버넌스](ai-red-teaming.md) | 적대적 관점으로 어떻게 지속 검증하는가? |

## 목적별 읽기

- 공격 이해: 적대적 ML → 데이터 오염 → 모델 추출 → 프라이버시
- LLM 앱 보안: 프롬프트 인젝션 → LLM 애플리케이션 보안 → [AI 에이전트](../ai/ai-agents.md)
- 파이프라인·운영: ML 공급망 → 레드팀·거버넌스 → [모델 모니터링·재학습·롤백](../ai-for-security/model-operations.md)
- 보안 기초와 연결: [Security 학습 가이드](../security/index.md) · [암호학](../crypto/index.md)

## 한 가지 관점

AI 보안의 출발점은 "모델의 입력과 출력, 학습 데이터, 배포 파이프라인을 모두 신뢰 경계로 본다"입니다. 정확도 지표는 정상 상황만 말할 뿐, 상대가 실패를 유도하는 상황은 별도로 평가해야 합니다.

## 출처와 문서 성격

NIST AI RMF·OWASP LLM/ML Top 10·MITRE ATLAS 등을 참고한 한국어 해설입니다. 각 문서에 출처를 연결했으며 예시 코드는 개념 설명용입니다.
