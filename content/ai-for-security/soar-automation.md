# SOAR와 경보 자동 대응

> **TL;DR**
>
> SOAR는 반복적인 탐지·조사·대응 절차를 플레이북으로 자동화해 분석가의 부담을 줄입니다. 자동화의 관건은 되돌리기 어려운 조치일수록 사람 승인을 끼우고, 모든 결정에 근거와 감사 기록을 남기는 것입니다.

AI 작성 해설

## 왜 자동화인가

보안 관제는 경보량이 많고 조사 절차가 반복적입니다(평판 조회, 로그 수집, 유사 사건 검색). SOAR(Security Orchestration, Automation and Response)는 이 절차를 플레이북으로 엮어, 사람은 판단이 필요한 지점에 집중하게 합니다. 탐지 절차의 수명은 [탐지 엔지니어링 수명](detection-engineering.md)과 이어집니다.

## 조치의 위험도에 따라 자동화 수준을 나눈다

| 조치 | 되돌리기 | 자동화 |
|---|---|---|
| 지표 보강(평판·지오·이력 조회) | 부작용 없음 | 완전 자동 |
| 관련 로그·컨텍스트 수집 | 부작용 없음 | 완전 자동 |
| 계정 세션 만료·MFA 재요구 | 쉬움 | 조건부 자동 |
| 호스트 격리·계정 비활성화 | 어려움(업무 중단) | 사람 승인 필수 |

읽기·보강은 자동으로, **차단·격리 같은 파괴적 조치는 사람 승인**을 거치도록 설계합니다.

## 플레이북 골격

```python
def triage_alert(alert) -> dict:
    ctx = {}
    ctx["reputation"] = lookup_reputation(alert.src_ip)   # 자동: 부작용 없는 보강
    ctx["recent_logins"] = fetch_logins(alert.user, hours=24)
    ctx["similar"] = search_past_cases(alert.signature)   # 유사 사건 검색

    risk = score(alert, ctx)                              # 신호를 종합한 위험도
    if risk < LOW:
        return close(alert, reason="benign", context=ctx)  # 자동 종료(근거 기록)
    if risk >= HIGH and ctx["reputation"] == "known_bad":
        expire_sessions(alert.user)                       # 조건부 자동(되돌리기 쉬움)
        return escalate(alert, action="세션 만료됨, 격리는 승인 대기", context=ctx)
    return escalate(alert, action="분석가 검토 필요", context=ctx)  # 사람에게
```

모든 분기가 **근거(context)**를 남기는 점이 중요합니다. 자동 종료조차 왜 닫혔는지 추적할 수 있어야 합니다.

## LLM의 역할과 경계

LLM은 사건 요약·타임라인 정리·유사 사례 설명에 유용하지만, 근거 없는 단정이나 권한 있는 조치를 맡기면 위험합니다. LLM에는 허용된 데이터만 읽는 검색을 주고 출력은 제안으로만 받으며, 실제 조치는 정책 코드가 결정합니다. 이 경계는 [보안 운영을 위한 LLM](llm-security-operations.md)·[LLM 프롬프트 인젝션 방어](llm-prompt-injection.md)에서 다룹니다.

## 자동화의 함정

- **잘못된 자동 차단**: 오탐에 파괴적 조치를 자동화하면 스스로 서비스 장애를 만듭니다.
- **자동화 피로의 이전**: 플레이북이 부실하면 잘못된 판단만 빨라집니다.
- **감사 부재**: 자동 결정의 근거·주체가 남지 않으면 사후 조사가 불가능합니다. [보안 로깅과 사고 대응](../security/logging-incident-response.md)

## 확인 질문

이 자동 조치가 오탐이었다면 피해는 무엇이고 되돌릴 수 있나요? 자동으로 종료·차단한 경보의 근거가 사후에 추적 가능한가요?

## 참고 자료와 연결

[NIST SP 800-61: 사고 대응](https://csrc.nist.gov/pubs/sp/800/61/r3/final) · [MITRE ATT&CK](https://attack.mitre.org/)

관련: [탐지 엔지니어링 수명](detection-engineering.md) · [보안 운영을 위한 LLM](llm-security-operations.md) · [보안 모델 모니터링·재학습·롤백](model-operations.md) · [목차](index.md) · [용어집](glossary.md)
