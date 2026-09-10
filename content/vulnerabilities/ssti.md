# SSTI: 서버 사이드 템플릿 주입

> **TL;DR**
>
> 사용자 입력이 템플릿 문자열 자체로 합쳐지면, 템플릿 엔진이 입력을 데이터가 아니라 코드로 평가해 서버에서 임의 코드 실행으로 이어질 수 있습니다. 입력은 항상 렌더링 데이터로만 전달해야 합니다.

AI 작성 해설

## 발생 원리와 영향

템플릿 엔진(Jinja2, Twig, Freemarker 등)은 `{{ ... }}` 같은 구문을 평가합니다. 개발자가 사용자 입력을 **템플릿 소스에 문자열로 이어 붙이면**, 입력 안의 템플릿 구문이 그대로 실행됩니다. 대부분의 엔진은 객체 내부 속성에 접근할 수 있어, 여기서 런타임 객체를 타고 올라가면 코드 실행까지 도달합니다.

## 취약한 코드와 안전한 코드

```python
from jinja2 import Template
from flask import render_template

# 취약: 사용자 입력이 템플릿 "소스"가 된다
def greet_bad(name):
    return Template("Hello " + name + "!").render()
    # name = "{{ 7*7 }}"  -> "Hello 49!"  (입력이 평가됨)
    # 여기서 객체 그래프를 타면 임의 코드 실행으로 확장된다

# 안전: 템플릿은 고정, 입력은 렌더링 "데이터"로만 전달
def greet_ok(name):
    return render_template("greet.html", name=name)
    #   greet.html:  Hello {{ name }}!   (name은 이스케이프된 값)
```

핵심은 `7*7`이 `49`로 바뀌는 순간, 이미 입력이 코드로 평가되고 있다는 신호라는 점입니다. 이는 [명령 주입](command-injection.md)·[XSS](xss.md)와 같은 "데이터와 코드의 경계 붕괴" 계열입니다.

## 가상 사례로 이해하기

가상 뉴스레터 도구가 사용자가 입력한 제목으로 이메일 템플릿을 만든다고 합시다. 제목을 템플릿 소스에 이어 붙이면, 제목에 넣은 템플릿 구문이 발송 서버에서 실행됩니다. 제목은 렌더링 컨텍스트의 변수로만 넘겨야 합니다.

## 예방과 수정

- 사용자 입력을 **절대 템플릿 소스로 합치지 않습니다.** 템플릿은 정적이고, 입력은 컨텍스트 변수로만 넘깁니다.
- 사용자가 서식을 편집해야 한다면, 임의 표현식을 막는 로직리스(logic-less) 엔진이나 샌드박스 모드를 쓰고, 그마저도 탈출 가능성을 전제로 최소 권한으로 실행합니다.
- 자동 이스케이프를 켜 둡니다(같은 붕괴가 XSS로도 나타나기 때문).

## 수정 후 확인할 조건

`{{ 7*7 }}`, `${7*7}`, `#{7*7}` 등 엔진별 구문을 입력했을 때 그대로 문자열로 출력되는지 확인합니다. 계산 결과가 나오면 여전히 평가되고 있는 것입니다.

## 자주 하는 오해

특정 문자만 차단하는 방식은 엔진의 다양한 구문·우회로 뚫립니다. 구조적으로 "입력=데이터" 원칙을 지키는 것이 유일하게 안정적인 방어입니다.

## 확인 질문

지금 코드에서 사용자 입력이 템플릿 문자열에 연결되는 지점이 있나요? 그 입력이 계산·객체 접근으로 평가될 여지가 있나요?

## 참고 자료와 연결

[PortSwigger: Server-side template injection](https://portswigger.net/web-security/server-side-template-injection) · [OWASP Testing Guide: SSTI](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/18-Testing_for_Server-side_Template_Injection)

관련: [명령 주입](command-injection.md) · [XSS](xss.md) · [학습 가이드](index.md) · [용어집](glossary.md)
