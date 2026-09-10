# LLM 애플리케이션 보안

> **TL;DR**
>
> LLM을 앱에 붙이면 프롬프트 인젝션 외에도 안전하지 않은 출력 처리, 과도한 권한, 민감 정보 노출 같은 표면이 생깁니다. 모델을 신뢰 경계로 보고, 입력·출력·권한을 모델 밖에서 통제해야 합니다.

AI 작성 해설

## 모델은 신뢰 경계다

LLM 앱 보안의 출발점은 "모델의 입력과 출력을 모두 신뢰할 수 없는 것으로 다룬다"입니다. 프롬프트 인젝션은 그중 입력 측 대표 위협이며([LLM 프롬프트 인젝션 방어](llm-prompt-injection.md)), 여기서는 앱 전체 표면을 봅니다. OWASP는 이를 LLM 애플리케이션 위험 목록으로 정리합니다.

| 위험 | 설명 |
|---|---|
| 프롬프트 인젝션 | 콘텐츠에 숨은 지시가 모델을 조종 |
| 안전하지 않은 출력 처리 | 모델 출력을 검증 없이 실행·렌더 |
| 과도한 권한(excessive agency) | 모델이 부작용 큰 도구를 자율 실행 |
| 민감 정보 노출 | 시스템 프롬프트·학습·컨텍스트 유출 |
| 무제한 소비 | 비용·자원 폭주(질의 폭탄) |

## 안전하지 않은 출력 처리

모델 출력을 그대로 쓰면, 출력에 담긴 것이 그대로 실행됩니다. 웹에 넣으면 [XSS](../vulnerabilities/xss.md), 셸/쿼리에 넣으면 [명령 주입](../vulnerabilities/command-injection.md)·SQL 인젝션이 재현됩니다. 출력은 **데이터로 취급하고 문맥에 맞게 인코딩·검증**한 뒤 사용합니다.

```python
# 모델 출력을 실행·렌더 전에 검증 (예: URL은 허용 목록, 코드/명령은 금지)
def use_model_output(text, allowed_hosts):
    for url in extract_urls(text):
        if host_of(url) not in allowed_hosts:
            raise ValueError("disallowed URL in model output")
    return html_escape(text)          # 웹 렌더 시 문맥 인코딩 (XSS 방지)
# 핵심: 모델이 만든 것을 신뢰해 eval/exec/raw-render 하지 않는다
```

## 과도한 권한과 RAG 접근 통제

에이전트가 도구를 쓸수록 위험이 커집니다([AI 에이전트](../ai/ai-agents.md)). 도구는 최소 권한·좁은 범위로 주고, 부작용이 큰 동작은 사람 승인을 거칩니다. RAG에서는 검색이 **요청자의 접근 권한**을 반영해야 합니다 — 권한 없는 문서가 컨텍스트로 들어가면 인가 우회가 됩니다([컨텍스트·메모리와 검색](../ai/context-retrieval.md), [접근 제어](../vulnerabilities/access-control.md)).

## 방어 원칙

- 입력·출력을 신뢰 경계로 보고, 실행·렌더 전 검증.
- 최소 권한 도구 + 파괴적 동작 사람 승인.
- 시스템 프롬프트를 비밀로 여기지 말고(유출 전제), 진짜 통제는 권한으로.
- 비용·속도 한도와 관측·감사 로그.

## 자주 하는 오해

시스템 프롬프트에 규칙을 강하게 쓰면 안전해진다는 것은 오해입니다. 프롬프트는 완화일 뿐 경계가 아니며, 실제 보안은 모델 밖의 권한·검증에서 나옵니다.

## 확인 질문

모델 출력을 검증 없이 실행·렌더하는 지점이 있나요? RAG 검색이 요청자의 접근 권한을 반영하나요? 에이전트의 파괴적 도구에 사람 승인이 걸려 있나요?

## 참고 자료와 연결

[OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)

관련: [LLM 프롬프트 인젝션 방어](llm-prompt-injection.md) · [AI 시스템 보안](securing-ai-systems.md) · [AI 에이전트](../ai/ai-agents.md) · [XSS](../vulnerabilities/xss.md) · [목차](index.md) · [용어집](glossary.md)
