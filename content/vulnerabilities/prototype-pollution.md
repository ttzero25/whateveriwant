# 프로토타입 오염: 공유 원형을 오염시키기

> **TL;DR**
>
> 자바스크립트 객체는 프로토타입을 공유합니다. 사용자 입력의 `__proto__` 같은 키를 검사 없이 깊은 병합하면 `Object.prototype`이 오염되어, 무관한 코드의 동작까지 바뀌고 조건에 따라 코드 실행으로 확대될 수 있습니다.

AI 작성 해설

## 발생 원리

JS에서 거의 모든 객체는 `Object.prototype`을 조상으로 공유합니다. 여기에 속성을 심으면 그 속성이 **모든 객체에서 보이게** 됩니다. 공격자가 `__proto__`, `constructor`, `prototype` 같은 키를 담은 JSON을 보내고, 애플리케이션이 이를 재귀적으로 병합·설정하면 원형이 오염됩니다.

```javascript
// 취약한 깊은 병합: 키를 검사하지 않는다
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = target[key] || {};
      merge(target[key], source[key]);   // __proto__를 타고 들어가 원형을 건드린다
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

merge({}, JSON.parse('{"__proto__":{"isAdmin":true}}'));
// 이후 완전히 무관한 객체에서도:
({}).isAdmin;   // true  ← 오염된 원형이 새어 나온다
```

## 영향

- 인가 우회: `isAdmin` 같은 플래그가 모든 객체에 나타나 권한 검사를 통과([권한 우회](authorization-bypass.md))
- 서비스 거부·로직 변경: 기본값·설정이 오염돼 예기치 않은 분기
- 다른 가젯과 결합 시 서버(Node.js)에서 코드 실행, 브라우저에서 [XSS](xss.md)로 확대

## 예방과 수정

```javascript
// 1) 위험한 키를 거부
const BLOCKED = new Set(["__proto__", "constructor", "prototype"]);
function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (BLOCKED.has(key)) continue;               // 원형으로 가는 키 차단
    // ... 안전하게 병합
  }
}

// 2) 원형이 없는 객체를 사용
const store = Object.create(null);                // Object.prototype을 상속하지 않음

// 3) Map은 프로토타입 오염과 무관하게 임의 키를 안전히 다룬다
const m = new Map();
m.set(userKey, value);
```

추가로: `Object.freeze(Object.prototype)`로 원형을 동결하고, JSON 스키마로 입력을 검증하며, 검증된 라이브러리의 안전한 병합 함수를 사용합니다. 이는 SQL Injection·XSS와 같은 "데이터가 구조를 바꾸는" 계열이며, 신뢰 경계에서 입력의 키까지 통제해야 합니다.

## 수정 후 확인할 조건

`{"__proto__":{"x":1}}`, `{"constructor":{"prototype":{"x":1}}}`를 병합한 뒤 `({}).x`가 `undefined`인지 확인합니다. 정상 중첩 객체 병합은 그대로 동작해야 합니다.

## 자주 하는 오해

`__proto__`만 막으면 된다고 보기 쉽지만, `constructor.prototype` 경로로도 도달합니다. 세 키를 모두 막거나, 원형 없는 자료구조(`Object.create(null)`·`Map`)를 쓰는 편이 안전합니다.

## 확인 질문

사용자 입력을 객체에 깊은 병합·동적 설정하는 코드가 있나요? 그 경로가 `__proto__`·`constructor`를 걸러 내나요?

## 참고 자료와 연결

[OWASP: Prototype Pollution Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)

관련: [권한 우회](authorization-bypass.md) · [XSS](xss.md) · [안전하지 않은 역직렬화](deserialization.md) · [학습 가이드](index.md) · [용어집](glossary.md)
