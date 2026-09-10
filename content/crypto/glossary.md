# 암호학 한영 용어집

> **TL;DR**
>
> 암호학의 주요 용어를 영어 표기와 함께 찾아보고 해당 개념 문서로 이동하세요.

AI 작성 해설

## 암호화와 키

| 용어 | 영어 | 의미 |
|---|---|---|
| 대칭키 암호 | Symmetric encryption | 하나의 비밀키로 암·복호화 |
| 공개키 암호 | Asymmetric / Public-key | 공개키·개인키 쌍 사용 |
| 인증 암호화 | AEAD | 기밀성 + 무결성을 함께 제공(AES-GCM 등) |
| 운영 모드 | Mode of operation | 블록 암호를 데이터에 적용하는 방식(GCM·CTR·CBC) |
| 초기화 벡터 | IV / nonce | 매 암호화마다 유일해야 하는 값 |
| 하이브리드 암호화 | Hybrid encryption | 데이터는 대칭키, 키는 공개키로 |
| 전방향 비밀성 | Forward secrecy | 장기 키 유출에도 과거 세션 보호 |

## 무결성과 신원

| 용어 | 영어 | 의미 |
|---|---|---|
| 암호학적 해시 | Cryptographic hash | 되돌릴 수 없는 고정 길이 요약 |
| 충돌 저항 | Collision resistance | 같은 해시의 두 입력을 찾기 어려움 |
| 메시지 인증 코드 | MAC / HMAC | 공유 키로 무결성·보유 증명 |
| 전자서명 | Digital signature | 개인키 서명·공개키 검증, 부인 방지 |
| 키 유도 함수 | KDF | 비밀에서 키를 파생 |
| 인증기관 | CA | 공개키와 신원을 서명으로 연결 |
| 인증서 | X.509 certificate | 주체·공개키·CA 서명을 담은 신뢰 문서 |
| 인증서 체인 | Certificate chain | 루트 CA까지 이어지는 신뢰 사슬 |

## 저장과 난수

| 용어 | 영어 | 의미 |
|---|---|---|
| 솔트 | Salt | 사용자별 유일 값(비밀 아님) |
| 페퍼 | Pepper | DB와 분리해 보관하는 공통 비밀 |
| 비밀번호 해시 | Argon2id / bcrypt | 추측 비용이 큰 느린 해시 |
| 암호학적 난수 | CSPRNG | 예측 불가능한 보안용 난수 |
| 봉투 암호화 | Envelope encryption | DEK를 KEK로 감싸는 키 계층 |
| 키 회전 | Key rotation | 키를 주기적·사고 시 교체 |

관련 문서: [암호학 개요](foundations.md) · [대칭키](symmetric-encryption.md) · [비대칭키](asymmetric-encryption.md) · [해시](hashing.md) · [MAC·서명](mac-and-signatures.md) · [키 교환](key-exchange.md) · [비밀번호 저장](password-storage.md) · [PKI](pki-and-certificates.md) · [난수](randomness.md) · [키 관리](key-management.md)
