# whateveriwant

AI · Security · Vulnerabilities · CS · OS · Network · AI for Security를 정리하는 개인 지식백과입니다.
최신 AI 소식과 연구에서 관련 개념으로 이어서 공부할 수 있습니다.

[사이트 바로가기](https://ttzero25.github.io/whateveriwant/)

## 로컬 실행

Node.js 22 이상과 Python 3가 필요합니다.

```sh
npm ci
npm run build
npm run preview
```

브라우저에서 http://127.0.0.1:4173 을 엽니다.

## 관리

- `content/`: 개념 문서
- `web/`: 화면과 스타일
- `sources/`: 참고 출처
- `data/research.json`: OpenAI · Anthropic · arXiv 소식과 짧은 원문 발췌
- `data/conferences.json`: IEEE S&P · USENIX Security · ACM CCS · NDSS · ICML 논문
- `data/research-summaries.json`: 출처를 확인해 작성한 한국어 TL;DR
- `npm run update:research`: 동향 수동 갱신 후 다시 빌드

문서는 AI 작성 해설과 공식 자료의 일부 원문 발췌를 포함합니다. 출처와 이용 조건은 각 문서에 표시합니다.

학회는 2026 공식 목록에서 AI 관련 제목을 알파벳순 8건씩 선별합니다. 전체 논문은 각 학회의 공식 목록 링크에서 볼 수 있습니다. 새 글의 한국어 요약은 확인 후 추가하며, 아직 없으면 짧은 영어 원문 발췌를 표시합니다. 학회 연도·수집 주소는 `scripts/conference-feeds.mjs`에서 관리합니다.
