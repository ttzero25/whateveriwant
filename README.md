# whateveriwant
Security · CS · OS · AI · AI for Security를 연결하는 개인 지식백과.

## 먼저 읽기

[AI 지식백과](content/ai/index.md): 기초부터 LLM 활용까지 18개 개념 문서와 한영 용어 찾아보기.

한국어 문서는 공식 교육 자료와 원 논문을 참고한 **AI 작성 해설**이며 소유자 검토 전입니다. 영어 보기는 Google 공식 용어집의 **원문 발췌**입니다. 한국어 해설의 번역이나 원문 전문이 아닙니다. 출처 확인일은 원문 수정일과 다릅니다.

## Security 지식백과

[Security 학습 가이드](content/security/index.md): 보안 원칙, 인증과 인가, 암호학, 웹·시스템·네트워크 보안의 여섯 개념 문서와 한영 용어집입니다. 각 문서는 핵심 개념·예시·확인 질문·공식 출처를 포함합니다. 영어 보기에서는 한국어 본문 제공 안내를 표시합니다.

## AI for Security 지식백과

[AI for Security 학습 가이드](content/ai-for-security/index.md): 보안 AI의 문제 정의, 보안 데이터, 탐지 평가, 로그 이상 탐지, LLM 관제 지원, AI 시스템 보호의 여섯 개념 글과 한영 용어집입니다. 기존 AI·Security 개념으로 이어지는 링크와 가상 계산 예제를 포함합니다. 영어 보기에서는 한국어 본문 제공 안내를 표시합니다.

## 콘텐츠 관리

- `content/catalog.json`: 문서 순서·수준·AI/ML/DL/LLM 분류
- `content/ai-for-security/`: 보안 AI의 개념·학습 순서·용어집
- `content/collections.json`: Security·AI for Security의 문서 순서·수준·영문 제목
- `sources/ai-for-security.json`: 보안 AI 참고 출처와 확인일
- `content/security/`: Security 개념·학습 순서·용어집
- `sources/security.json`: Security 참고 출처와 확인일
- `content/ai/`: AI·ML·DL·LLM 개념과 학습 순서
- `content/en/originals.json`: 재사용 조건을 확인한 Google 영어 원문 발췌와 출처 기록
- `sources/ai.json`: 참고 출처와 확인일
- 정기 원문 수집·커밋은 아직 설정하지 않았습니다. GitHub Pages는 `gh-pages` 브랜치에서 배포합니다.
- 향후 원문 저장 시 출처별 재배포 조건을 확인합니다.

사이트: [whateveriwant](https://ttzero25.github.io/whateveriwant/)

## 사이트 미리보기

Node.js 22 이상과 Python 3를 사용합니다.

```sh
npm ci
npm run build
npm run preview
```

브라우저에서 `http://127.0.0.1:4173`을 열면 검색·분야별 탐색·TL;DR·수식이 포함된 사이트를 볼 수 있습니다. `content/ai/`의 문서를 수정한 뒤 다시 빌드하면 반영됩니다. 빌드 결과는 `dist/`에 생성되며 Git에서는 제외합니다.

Chrome이 설치된 환경에서는 미리보기 서버를 실행한 상태로 `node scripts/check-preview.mjs`를 실행해 검색·필터·문서 이동·모바일 화면을 확인할 수 있습니다. 스크린샷은 `.preview/`에 저장됩니다.

## 한영 전환과 개념 도식

상단의 `한국어 / English` 버튼으로 메뉴·문서·도식의 언어를 바꿉니다. 선택은 이 브라우저에 저장되며 문서 이동과 새로고침에도 유지됩니다. 검색은 두 언어의 내용을 함께 찾습니다.

기초 AI·ML·DL·LLM의 18개 개념에 자체 제작 SVG 도식을 제공합니다. 원문 이미지가 아니며 각 도식의 `SVG ↓`로 내려받을 수 있습니다. 작은 화면에서는 도식 내부를 가로로 스크롤합니다.

영어 본문은 [Google Machine Learning Glossary](https://developers.google.com/machine-learning/glossary?hl=en)의 선택된 도입 문단과 목록을 그대로 발췌했습니다. 텍스트는 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), 포함된 코드 예시는 Apache 2.0 조건을 따릅니다. 원문의 미디어는 가져오지 않았습니다. 문구를 번역·재작성하지 않았으며 공백·레이아웃과 수식 렌더링 문법만 정규화합니다. 사이트 제목·학습 가이드·도식은 백과에서 별도로 작성한 내용입니다. 원문 전체는 각 항목의 출처 링크에서 볼 수 있습니다.

`npm run import:english`는 공식 용어집에서 원문 발췌를 수동 갱신합니다. 실행 후 변경 내용과 재사용 조건을 검토하고 `npm run build`로 반영하세요. 정기 실행은 아직 설정하지 않았습니다.

Security 전용 검증: `node scripts/check-security.mjs` — 분야별 필터, 내부 링크, 여덟 문서, 언어 안내와 모바일 화면을 확인합니다.

AI for Security 검증: `node scripts/check-security.mjs http://127.0.0.1:4173/ ai-for-security` — 새 분야의 탐색, AI·Security 교차 링크와 모바일 화면을 확인합니다.

## 공개 배포

소스는 `main`, 빌드한 정적 파일은 `gh-pages` 브랜치에서 관리합니다. GitHub Pages는 `gh-pages`의 루트(`/`)를 HTTPS로 제공합니다. `main`의 수정만으로 사이트가 다시 빌드되지는 않으며, 새 빌드 결과를 `gh-pages`에 푸시하면 배포됩니다.

공개 사이트 검증: `node scripts/check-preview.mjs https://ttzero25.github.io/whateveriwant/`

## Computer Science

CS에 8개 개념, 30개 항목 용어집, 학습 가이드를 제공합니다. 데이터 표현, 컴퓨터 구조, 자료구조, 알고리즘·복잡도, 네트워크, 관계형 DB·SQL, 트랜잭션·인덱스, 동시성·동기화를 다룹니다. 각 개념은 TL;DR과 한영 SVG 도식을 포함합니다.

- `content/cs/`: 한국어 해설과 문서 목록 `catalog.json`
- `sources/cs.json`: Python·PostgreSQL·NIST·Arm·MDN의 짧은 영어 원문 발췌, 출처와 확인일
- `scripts/excerpt-build.mjs`: CS의 한국어 문서와 영어 원문 보기 생성

CS 영어 보기는 한국어 본문의 번역이 아닌, 관련 공식 개념의 짧은 원문 인용과 전체 문서 링크입니다. 영어 학습 가이드와 분야 목록은 사이트 자체 작성입니다.

CS 검증: `node scripts/check-cs.mjs` (배포 사이트 URL을 인자로 전달할 수 있습니다).

## Operating Systems

OS 핵심 개념 8개, 용어집 30개 항목, 학습 가이드를 제공합니다. 커널·시스템 콜, 프로세스·스레드, CPU 스케줄링, 가상 메모리, 파일 시스템, I/O·인터럽트, 동기화·교착, IPC를 다룹니다. 각 개념에 TL;DR과 한영 SVG 도식이 있으며, Linux·Windows 구현 차이를 구분합니다.

- `content/os/`: 한국어 문서와 목록 `catalog.json`
- `sources/os.json`: Microsoft Learn·Linux Kernel·Linux man-pages의 짧은 영어 원문 인용과 확인일
- `scripts/excerpt-build.mjs`: CS·OS 공통 문서 빌더

영어 본문은 한국어 해설의 번역이 아닌 관련 개념의 원문 발췌입니다. 전체 자료는 문서 안의 공식 출처 링크에서 확인합니다.

OS 검증: `node scripts/check-os.mjs` (배포 URL을 인자로 전달할 수 있습니다). 원문 대조: `node scripts/check-os-sources.mjs`.

## 라이트 / 다크 테마

상단의 해·달 버튼으로 전환합니다. 처음에는 기기의 색상 설정을 따르고, 직접 선택한 테마는 브라우저에 저장됩니다. 한영 전환과 문서 이동 후에도 유지되며 다른 탭에도 반영됩니다. `web/theme.js`가 스타일 로드 전에 저장된 테마를 적용합니다. 표·코드·수식·인라인 도식에도 다크 색상을 적용하며, 내려받는 SVG는 독립적으로 읽을 수 있는 기존 라이트 팔레트를 유지합니다.

## 심화 개념 확장

AI 9개, CS 4개, Security 4개, AI for Security 3개의 개념 글을 추가했습니다. 보안 AI의 기존 여섯 글과 OS의 스케줄링·가상 메모리·동기화·파일시스템 글도 심화했습니다.

- AI: 확률·통계, 교차 검증·특징 공학, 앙상블, 차원 축소, 역전파, 학습 안정성, 사전·후학습, 컨텍스트·검색, LLM 평가·도구 호출
- CS: 논리·불변식, 그래프·탐색, 언어 실행, 분산 시스템
- Security: 로깅·사고 대응, 시큐어 개발, 공급망, 클라우드 신원·비밀 관리
- AI for Security: 탐지 엔지니어링, 피싱 분류 설계 사례, 모델 운영·재학습·롤백

확장 글의 본문은 공식 자료를 참고한 한국어 해설이며 영어 보기에서도 이를 표시합니다. 기존 영어 원문 발췌는 유지합니다. `content/expansion.json`은 이번 추가 목록, `sources/expansion.json`은 참고 링크와 확인 기록입니다. 각 분야의 학습 가이드와 용어집에서 새 개념으로 이동할 수 있습니다.
