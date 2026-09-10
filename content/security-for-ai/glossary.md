# Security for AI 한영 용어집

> **TL;DR**
>
> AI 시스템 보안의 주요 용어를 영어 표기와 함께 찾아보고 해당 개념 문서로 이동하세요.

AI 작성 해설

## 공격

| 용어 | 영어 | 의미 |
|---|---|---|
| 회피 공격 | Evasion | 추론 시 입력 조작으로 오분류 유도 |
| 적대적 예제 | Adversarial example | 미세 변형으로 예측을 뒤집는 입력 |
| 데이터 오염 | Data poisoning | 학습 데이터에 악성 샘플 주입 |
| 백도어 | Backdoor / Trojan | 트리거가 있을 때만 오작동하도록 심음 |
| 모델 추출 | Model extraction | 질의로 모델 동작을 복제 |
| 멤버십 추론 | Membership inference | 특정 샘플의 학습 포함 여부 추론 |
| 모델 반전 | Model inversion | 출력으로 입력 특징 재구성 |
| 프롬프트 인젝션 | Prompt injection | 콘텐츠에 숨은 지시가 모델을 조종 |
| 탈옥 | Jailbreak | 안전 정책을 우회하도록 유도 |

## 방어·거버넌스

| 용어 | 영어 | 의미 |
|---|---|---|
| 견고성 | Robustness | 적대적 입력에도 성능 유지 정도 |
| 차등 프라이버시 | Differential privacy | 개별 데이터 기여를 제한하는 보장 |
| 가드레일 | Guardrails | 입력·출력·행동을 제약하는 통제 |
| 안전하지 않은 출력 처리 | Insecure output handling | 모델 출력을 검증 없이 실행·렌더 |
| 과도한 권한 | Excessive agency | 모델이 부작용 큰 도구를 자율 실행 |
| 안전 텐서 | safetensors | 코드 실행이 없는 모델 저장 포맷 |
| 레드팀 | Red teaming | 적대적 관점의 능동 취약점 시험 |
| AI 위험관리 | NIST AI RMF | AI 위험을 체계로 관리하는 프레임워크 |

관련 문서: [AI 시스템 보안](securing-ai-systems.md) · [적대적 ML](adversarial-ml.md) · [데이터 오염](data-poisoning.md) · [모델 추출](model-extraction.md) · [학습 데이터 프라이버시](data-privacy-ml.md) · [프롬프트 인젝션](llm-prompt-injection.md) · [LLM 앱 보안](llm-application-security.md) · [ML 공급망](ml-supply-chain.md) · [레드팀·거버넌스](ai-red-teaming.md)
