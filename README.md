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

## 매일 자동 갱신

`.github/workflows/pages.yml`은 매일 08:17 KST에 공식 출처를 수집하고, 스냅샷을 `main`에 커밋한 뒤 GitHub Pages에 배포하도록 구성되어 있습니다. GitHub 실행 상황에 따라 지연될 수 있습니다. 저장소의 Pages 게시 소스를 **GitHub Actions**로 설정해야 활성화됩니다. Actions의 **Refresh research and deploy → Run workflow**로 바로 실행할 수도 있습니다.

새 글의 원문 제목·짧은 발췌와 수집 상태는 자동으로 갱신됩니다. 한국어 TL;DR은 별도 작성 자료이며 자동 생성하지 않습니다. 일부 출처 수집에 실패하면 기존 목록을 보존하고 화면에 상태를 표시합니다.

ROS & Autonomous Security Watch (`#/robotics-security`)는 AI Research Watch와 같은 검색·출처·주제·기간 필터, 한영 TL;DR, 모바일·다크 모드를 제공합니다. Open Robotics Discourse의 security 태그(커뮤니티 게시물)와 arXiv의 로봇·자율주행 보안 검색 결과를 별도 수집합니다. arXiv는 최초 제출일 기준이며, 보안 키워드로 선별하므로 포괄적인 취약점 목록은 아닙니다.

- `data/robotics-security.json`: 별도 동향 스냅샷과 출처 상태
- `node scripts/update-research.mjs --robotics`: 해당 동향만 갱신
- 매일 실행되는 `update:research`와 Pages 배포에 포함됩니다. 수집 실패 시 이전 목록을 유지합니다.
- 검증: `node --test scripts/robotics-feeds.test.mjs`, 빌드·미리보기 후 `node scripts/check-robotics.mjs`
