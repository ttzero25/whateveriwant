# AI 에이전트와 도구 오케스트레이션

> **TL;DR**
>
> AI 에이전트는 LLM이 목표를 향해 관찰→계획→도구 호출→결과 반영을 반복하는 시스템입니다. 도구로 능력을 확장하지만, 오류가 누적되고 프롬프트 인젝션 표면이 커지므로 권한과 검증을 밖에서 통제해야 합니다.

AI 작성 해설

## 단발 응답에서 반복 루프로

일반 LLM 호출은 한 번 묻고 한 번 답합니다. 에이전트는 목표를 받아 **여러 단계**를 스스로 진행합니다: 상황을 관찰하고, 다음 행동을 계획하고, 도구를 호출하고, 결과를 문맥에 반영해 다시 판단합니다. LLM 평가·도구 호출 경계는 [LLM 평가와 도구 호출](llm-evaluation-tools.md)에서 다룹니다.

```python
# 에이전트 루프(개념): 도구 호출을 정책으로 검증하고, 실행은 코드가 결정
def agent(goal, tools, max_steps=6):
    context = [f"목표: {goal}"]
    for _ in range(max_steps):
        step = call_model(context)          # 모델이 다음 행동을 제안
        if step.get("final"):
            return step["answer"]           # 완료
        name, args = step["tool"], step["args"]
        if not policy_allows(name, args):   # ← 밖에서 권한·범위 검증
            context.append(f"거부됨: {name}")
            continue
        result = tools[name](**args)        # 허용된 도구만 실행
        context.append(f"{name} 결과: {result}")  # 관찰을 문맥에 반영
    return "단계 한도 도달"                    # 무한 루프·비용 폭주 방지
```

## 구성 요소

- **계획(planning)**: 목표를 하위 단계로 쪼갬(ReAct: 추론과 행동을 번갈아).
- **도구(tools)**: 검색·계산·API·코드 실행 등 외부 능력. 검색 근거는 [RAG](rag.md)·[컨텍스트·메모리와 검색](context-retrieval.md)과 이어집니다.
- **메모리**: 단계 간 상태·과거 결과 유지.
- **오케스트레이션**: 여러 도구·여러 에이전트의 호출 순서와 종료 조건 관리.

## 왜 위험한가

- **오류 누적**: 한 단계의 실수가 다음 단계로 전파돼 크게 벗어날 수 있습니다. 단계 한도·검증 지점이 필요합니다.
- **프롬프트 인젝션**: 도구가 읽는 외부 콘텐츠(웹·문서)에 숨은 지시가 에이전트를 조종할 수 있습니다. 방어는 [LLM 프롬프트 인젝션 방어](../security-for-ai/llm-prompt-injection.md)에서 다룹니다.
- **권한 과다**: 부작용이 큰 도구(파일 쓰기·결제·삭제)를 자동 실행하면 피해가 큽니다. 읽기는 자동, 파괴적 조치는 사람 승인으로 나눕니다.

## 설계 원칙

- 도구를 **최소 권한**·좁은 범위로 주고, 각 호출을 정책 코드로 검증합니다(모델 판단을 신뢰하지 않음).
- 단계 수·비용·시간 한도를 두어 폭주를 막습니다.
- 모델 출력을 그대로 실행·렌더링하지 않고, 결과를 허용 목록으로 검증합니다.
- 관측·감사 로그로 무엇을 왜 했는지 추적합니다.

## 확인 질문

에이전트가 잘못된 판단이나 인젝션에 넘어갔을 때, 실제로 일어날 수 있는 최악의 행동은 무엇이고 그것을 모델 밖에서 막고 있나요? 단계·비용 한도가 있나요?

## 참고 자료와 연결

[ReAct: Reasoning and Acting (2022)](https://arxiv.org/abs/2210.03629)

관련: [LLM 평가와 도구 호출](llm-evaluation-tools.md) · [RAG](rag.md) · [컨텍스트·메모리와 검색](context-retrieval.md) · [LLM 프롬프트 인젝션 방어](../security-for-ai/llm-prompt-injection.md) · [목차](index.md) · [용어집](glossary.md)
