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

ROS Watch의 **보안 학회 아카이브**는 IEEE S&P, USENIX Security, ACM CCS, NDSS, VehicleSec의 2025년 이후 목록과 NDSS 2024를 추적합니다. 자율주행·차량·ROS·Physical AI 관련 제목을 선별해 상한 없이 보관하며, 학회 연도 내림차순(동년은 학회·제목순)으로 표시합니다. 개별 게시일은 추정하지 않습니다. 동향과 학회 논문은 하나의 카드 목록에서 통합 검색하며, 출처·학회/연도/주제/유형 필터를 함께 적용합니다. 같은 연도에서는 게시일이 있는 동향이 먼저 표시되고, 개별 날짜가 없는 학회 논문은 학회·제목순으로 표시됩니다.

- `data/robotics-conferences.json`: 누적 아카이브, 최초 수집 시각, 출처 상태
- `node scripts/update-robotics-conferences.mjs`: 수동 갱신. `update:research`의 일일 작업에도 포함됩니다.
- 일시적으로 목록에서 빠지거나 수집이 실패해도 기존 논문을 유지합니다. 제목 키워드 선별이므로 완전한 분야 목록을 보장하지 않습니다. 출처 상태를 화면에서 확인할 수 있습니다.
- 원문 초록이 제공된 경우 짧은 발췌를 표시하고, 한국어 요약은 별도로 작성된 항목만 표시합니다.

홈의 **오늘 업데이트**는 한국 시간(KST)을 기준으로 AI 동향, ROS·자율주행 동향, 보안 학회 아카이브를 함께 표시합니다. 오늘 게시·공고된 글과 오늘 새로 수집/변경된 글을 구분하며, 과거 학회 논문을 오늘 추가한 경우 학회 연도를 따로 표시합니다. 수집기는 `first_seen`과 `updated_at`을 보존하고, 기존 글의 알 수 없는 최초 수집일은 임의로 채우지 않습니다. 검증: `node --test scripts/daily-updates.test.mjs`, 미리보기 후 `node scripts/check-daily-updates.mjs`.

**보안 이슈 Watch** (`#/security-news`)는 홈의 별도 배너와 AI Research Watch 바로 아래 사이드바 메뉴에서 열 수 있습니다. 보안뉴스·데일리시큐·The Hacker News·CISA의 RSS를 수집하며 국내·해외는 매체/기관 소재 기준입니다. 사건 발생 국가를 추정하지 않습니다. 제목과 짧은 원문 발췌를 게시일 최신순으로 표시하고 지역·출처·주제·기간 검색을 제공합니다.

- `data/security-news.json`: 출처별 최대 150건 보관, 실패 시 이전 목록 유지
- `node scripts/update-security-news.mjs`: 수동 수집. 일일 `update:research` 작업에 포함됩니다.
- `node --test scripts/security-news-feeds.test.mjs`, 미리보기 후 `node scripts/check-security-news.mjs`: 날짜·링크·필터와 배너/메뉴 동작 검증

AI Research Watch도 ROS Watch와 같은 통합 카드 목록을 사용합니다. OpenAI·Anthropic·arXiv 동향과 현재 선별한 2026 학회 논문을 출처·학회/연도/주제/유형으로 함께 검색합니다. 날짜가 없는 학회 논문은 해당 연도의 날짜 있는 동향 다음에 학회·제목순으로 표시합니다.
