# 정규 표현식과 오토마타

> **TL;DR**
>
> 정규 표현식은 정규 언어를 기술하고, 유한 오토마타(DFA/NFA)는 그것을 인식하는 기계입니다. 이 대응을 이해하면 정규식이 무엇을 할 수 있는지, 왜 어떤 패턴은 폭발적으로 느려지는지(ReDoS)를 설명할 수 있습니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 언어와 기계의 대응

촘스키 계층에서 가장 단순한 층이 정규 언어입니다. 세 가지가 같은 표현력을 가집니다.

| 형식 | 역할 |
|---|---|
| 정규 표현식 | 패턴을 사람이 기술 |
| NFA(비결정적 유한 오토마타) | 정규식에서 기계적으로 생성 |
| DFA(결정적 유한 오토마타) | 상태가 하나로 결정, 실행이 빠름 |

정규 언어는 유한한 메모리(상태)만으로 인식됩니다. 그래서 "여는 괄호와 닫는 괄호의 개수가 같은가" 같은 **중첩 균형**은 순수 정규 언어로 표현할 수 없습니다. 이는 문맥 자유 문법(파서)의 영역이며 [컴파일러·인터프리터·런타임 실행](language-execution.md)과 이어집니다.

## DFA로 직접 인식해 보기

정규식 엔진이 내부에서 하는 일을 작은 DFA로 흉내 냅니다. 아래는 "0과 1로 이루어진 문자열 중 1의 개수가 짝수인가"를 인식합니다.

```python
# 상태: even(1이 짝수) / odd(1이 홀수). 시작이자 수락 상태는 even.
transitions = {
    "even": {"0": "even", "1": "odd"},
    "odd":  {"0": "odd",  "1": "even"},
}

def accepts(s: str) -> bool:
    state = "even"
    for ch in s:
        if ch not in transitions[state]:
            return False          # 알파벳에 없는 입력은 거부
        state = transitions[state][ch]
    return state == "even"        # 수락 상태로 끝났는가

assert accepts("11")   and accepts("0110")   # 1이 짝수
assert not accepts("1") and not accepts("101")
```

DFA는 입력 한 글자당 전이 한 번이므로 문자열 길이에 **선형**입니다. 상태가 유한하고 되돌아가지 않는다는 점이 성능 보장의 핵심입니다.

## ReDoS: 백트래킹의 함정

많은 언어의 기본 정규식 엔진은 DFA가 아니라 백트래킹 방식이라, 특정 패턴에서 지수 시간이 걸립니다. 이를 악용한 서비스 거부가 ReDoS입니다.

```python
import re
# 위험: 중첩 수량자 (a+)+ 는 매칭 실패 시 조합이 폭발한다
BAD = re.compile(r"^(a+)+$")
# BAD.match("a" * 30 + "!")  # 입력이 조금만 길어도 사실상 멈춘다

# 안전: 중첩을 없애고 의미를 그대로 표현
GOOD = re.compile(r"^a+$")
```

방어: 신뢰할 수 없는 입력에 복잡한 정규식을 쓰지 않기, 중첩 수량자·모호한 교차 패턴 피하기, 길이 상한 두기, 선형 시간을 보장하는 엔진(RE2 등) 사용하기. 이 관점은 보안의 [설정 오류·정보 노출](../vulnerabilities/misconfiguration.md) 계열 방어와도 연결됩니다.

## 확인 질문

지금 쓰는 정규식에 `(x+)+`, `(x*)*`처럼 중첩된 수량자가 있나요? 그 입력이 사용자에게서 온다면 최악의 경우 실행 시간을 설명할 수 있나요?

## 참고 자료와 연결

[Russ Cox: Regular Expression Matching Can Be Simple And Fast](https://swtch.com/~rsc/regexp/regexp1.html) · [OWASP: ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)

관련: [컴파일러·인터프리터·런타임 실행](language-execution.md) · [이산수학과 논리](discrete-mathematics.md) · [알고리즘과 Big-O](algorithms-complexity.md) · [목차](index.md)
