# whateveriwant
Security · CS · OS · AI · AI for Security를 연결하는 개인 지식백과.

## 먼저 읽기

[AI 지식백과](content/ai/index.md): 기초부터 LLM 활용까지 10개 개념 문서와 한영 용어 찾아보기.

현재 문서는 공식 교육 자료와 원 논문을 참고한 **AI 작성 한국어 해설**입니다. 원문 전문이나 공식 번역이 아니며 소유자 검토 전입니다. 출처 확인일은 원문 수정일과 다릅니다.

## 콘텐츠 관리

- `content/ai/`: AI 개념과 학습 순서
- `sources/ai.json`: 참고 출처와 확인일
- 자동 수집·커밋과 Pages 배포는 아직 설정하지 않았습니다.
- 향후 원문 저장 시 출처별 재배포 조건을 확인합니다.

사이트 예정 주소: `https://ttzero25.github.io/whateveriwant/`

## 사이트 미리보기

Node.js 22 이상과 Python 3를 사용합니다.

```sh
npm ci
npm run build
npm run preview
```

브라우저에서 `http://127.0.0.1:4173`을 열면 검색·분야별 탐색·TL;DR·수식이 포함된 사이트를 볼 수 있습니다. `content/ai/`의 문서를 수정한 뒤 다시 빌드하면 반영됩니다. 빌드 결과는 `dist/`에 생성되며 Git에서는 제외합니다.

Chrome이 설치된 환경에서는 미리보기 서버를 실행한 상태로 `node scripts/check-preview.mjs`를 실행해 검색·필터·문서 이동·모바일 화면을 확인할 수 있습니다. 스크린샷은 `.preview/`에 저장됩니다.
