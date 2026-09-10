# 위협 인텔리전스 보강과 연관 분석

> **TL;DR**
>
> 위협 인텔리전스는 관측된 지표(IP·도메인·해시)에 맥락(누가·왜·얼마나 신뢰)을 붙여 경보의 우선순위를 높입니다. 저수준 지표는 쉽게 바뀌므로, 오래가는 것은 공격자의 행위(TTP)이며 여기에 무게를 둬야 합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 보강이란

원 경보는 "이 IP가 접속했다" 수준입니다. 보강(enrichment)은 여기에 평판·지오·과거 이력·관련 캠페인·신뢰도를 붙여 "이 IP는 최근 피싱 인프라로 보고됨, 신뢰도 중간"처럼 판단 가능한 형태로 만듭니다. 이는 [탐지 지표와 경보 예산](detection-evaluation.md)의 우선순위 결정에 직접 쓰입니다.

## 고통의 피라미드: 무엇을 바꾸기 쉬운가

지표마다 공격자가 바꾸기 쉬운 정도가 다릅니다(Pyramid of Pain).

| 지표 | 공격자가 바꾸기 |
|---|---|
| 해시값 | 매우 쉬움(1바이트만 바꿔도 달라짐) |
| IP·도메인 | 쉬움 |
| 네트워크·호스트 아티팩트 | 보통 |
| 도구 | 어려움 |
| TTP(전술·기법·절차) | 매우 어려움 |

그래서 해시·IP 차단은 단기 효과에 그치고, 오래가는 탐지는 행위(TTP)에 기반해야 합니다. TTP 분류 체계는 MITRE ATT&CK입니다.

## 지표 신뢰도와 만료

```python
from datetime import datetime, timedelta

def score_indicator(ind: dict, now: datetime) -> float:
    """출처 신뢰·최신성·중복 보고를 합쳐 지표 위험도를 매긴다."""
    age_days = (now - ind["first_seen"]).days
    freshness = max(0.0, 1.0 - age_days / 30)      # 오래된 지표는 감쇠
    source_trust = {"gov": 1.0, "vendor": 0.8, "community": 0.5}[ind["source"]]
    corroboration = min(1.0, ind["report_count"] / 5)  # 여러 출처가 보고할수록↑
    return round(0.5 * source_trust + 0.3 * freshness + 0.2 * corroboration, 3)

# 낮은 점수·만료된 지표로 자동 차단하면 오탐(정상 서비스 IP 재사용 등)이 늘어난다
```

지표에 **만료**를 두는 이유는, 재할당된 IP나 공유 CDN을 영구 차단하면 정상 서비스를 막기 때문입니다.

## 표준 포맷과 공유

STIX/TAXII 같은 표준으로 인텔을 구조화·교환하고, 관측(observable)·지표(indicator)·캠페인·행위자를 연결합니다. 자동 파이프라인은 수집한 지표를 내부 로그와 대조해 일치 항목을 경보로 올립니다. 자동 대응 연결은 [SOAR와 경보 자동 대응](soar-automation.md)에서 다룹니다.

## LLM으로 보강할 때

LLM은 비정형 위협 보고서를 요약하고 지표·TTP를 추출하는 데 유용하지만, 환각으로 없는 지표를 만들거나 신뢰도를 부풀릴 수 있습니다. 추출 결과는 출처에 대조해 검증하고, 자동 차단에 바로 연결하지 않습니다. [LLM 프롬프트 인젝션 방어](llm-prompt-injection.md)

## 확인 질문

지금 차단 목록이 바꾸기 쉬운 지표(해시·IP)에만 의존하나요, 행위 기반 탐지가 있나요? 오래된·저신뢰 지표에 만료와 신뢰도 가중이 적용되나요?

## 참고 자료와 연결

[MITRE ATT&CK](https://attack.mitre.org/) · [STIX/TAXII (OASIS)](https://oasis-open.github.io/cti-documentation/) · [Pyramid of Pain (개념)](https://detect-respond.blogspot.com/2013/03/the-pyramid-of-pain.html)

관련: [탐지 지표와 경보 예산](detection-evaluation.md) · [SOAR와 경보 자동 대응](soar-automation.md) · [UEBA와 그래프 기반 탐지](ueba-graph-detection.md) · [목차](index.md) · [용어집](glossary.md)
