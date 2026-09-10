# 클릭재킹: 보이지 않는 UI 위장

> **TL;DR**
>
> 공격자가 우리 사이트를 투명한 프레임으로 자기 페이지에 겹쳐 두면, 피해자는 미끼 버튼을 누른다고 생각하지만 실제로는 우리 사이트의 민감한 동작을 클릭합니다. 방어는 다른 사이트가 우리 페이지를 프레임에 넣지 못하게 막는 것입니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 발생 원리와 영향

브라우저는 로그인 세션을 프레임 안 요청에도 붙입니다. 공격자는 우리 페이지를 `iframe`으로 불러와 `opacity:0`으로 숨기고, 그 위에 "경품 받기" 같은 미끼를 배치합니다. 피해자의 클릭은 투명 프레임을 통과해 우리 사이트의 실제 버튼(설정 변경·결제·권한 부여)에 도달합니다. 이는 [CSRF](csrf.md)와 사촌 격으로, 브라우저가 자동 첨부하는 신뢰를 악용합니다.

```html
<!-- 공격자 페이지 개념 -->
<style>
  iframe { position:absolute; opacity:0; width:500px; height:400px; }
  button { position:absolute; top:120px; left:80px; }  /* 프레임의 위험 버튼과 겹침 */
</style>
<button>무료 경품 받기</button>
<iframe src="https://bank.example.com/transfer?to=attacker"></iframe>
```

## 예방: 프레이밍을 막는다

핵심 방어는 우리 페이지가 다른 출처의 프레임에 들어가는 것을 서버 응답 헤더로 거부하는 것입니다.

```http
Content-Security-Policy: frame-ancestors 'self'
X-Frame-Options: SAMEORIGIN
```

- `frame-ancestors`(CSP)가 현대 표준이며, 허용할 상위 출처를 정확히 지정합니다(`'none'`은 완전 차단).
- `X-Frame-Options`는 구형 호환용으로 함께 둡니다(`DENY` 또는 `SAMEORIGIN`).
- 민감한 상태 변경 동작에는 추가로 재인증·확인 단계를 두어, 단일 클릭으로 완료되지 않게 합니다.

CSP·출력 문맥은 [XSS](xss.md), 웹 신뢰 경계 전반은 웹 보안에서 다룹니다.

## 수정 후 확인할 조건

우리 페이지를 외부 도메인의 `iframe`에 넣었을 때 브라우저가 렌더링을 거부하는지 확인합니다. 로그인 후 대시보드·설정·결제 등 모든 인증 페이지에 헤더가 적용됐는지 점검합니다(일부 경로 누락이 흔한 실수).

## 자주 하는 오해

- JavaScript "프레임 깨기"(`if (top !== self) ...`)만으로는 `sandbox` 속성 등으로 무력화됩니다. 서버 헤더가 신뢰할 수 있는 방어입니다.
- 클릭재킹은 CSRF 토큰으로 막히지 않습니다. 사용자가 진짜 UI를 클릭하는 것이라 토큰이 정상 포함되기 때문입니다.

## 확인 질문

인증된 모든 페이지가 `frame-ancestors`로 보호되나요? 한 번의 클릭으로 되돌리기 어려운 동작이 완료되는 화면이 있나요?

## 참고 자료와 연결

[OWASP: Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html) · [MDN: CSP frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)

관련: [CSRF](csrf.md) · [XSS](xss.md) · [설정 오류·정보 노출](misconfiguration.md) · [학습 가이드](index.md) · [용어집](glossary.md)
