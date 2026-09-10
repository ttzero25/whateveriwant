# 데이터 프라이버시: PII 보호와 최소 수집

> **TL;DR**
>
> 프라이버시는 개인정보를 필요한 만큼만 수집하고, 목적에 맞게 쓰며, 저장·전송·삭제 전 구간에서 보호하는 문제입니다. 암호화만으로는 부족하고, 데이터 분류·최소화·가명화·수명 관리가 함께 필요합니다.

AI 작성 해설

## 보안과 프라이버시의 관계

보안은 무단 접근을 막고, 프라이버시는 "정당한 접근이라도 무엇을 수집·보관·공유해도 되는가"를 다룹니다. 겹치지만 같지 않습니다. 암호화 도구는 [암호학](../crypto/foundations.md)에서, 접근 통제는 [인증과 인가](authentication-authorization.md)에서 다룹니다.

## 데이터 분류가 먼저

무엇이 민감한지 모르면 보호할 수 없습니다. 데이터를 등급으로 분류하고 등급별로 취급 규칙을 정합니다.

| 등급 | 예 | 취급 |
|---|---|---|
| 공개 | 제품 문서 | 제약 없음 |
| 내부 | 운영 지표 | 사내 접근 |
| 기밀(PII) | 이름·이메일·주소 | 암호화·접근 로깅·최소 권한 |
| 민감(특수) | 건강·생체·금융 | 강한 통제·별도 저장·엄격한 보존 |

## 핵심 원칙

- **최소 수집**: 목적에 필요한 항목만 받습니다. 안 받은 데이터는 유출될 수 없습니다.
- **목적 제한**: 수집 목적 외 용도로 재사용하지 않습니다.
- **보존 한계**: 필요 기간이 지나면 삭제합니다(수명 관리).
- **접근 최소화·로깅**: 누가 언제 어떤 개인정보를 봤는지 기록합니다. [로깅·사고 대응](logging-incident-response.md)

## 가명화·익명화·토큰화

식별자를 그대로 두지 않고 분리·치환합니다. 되돌릴 수 있으면 가명화(pseudonymization), 되돌릴 수 없으면 익명화입니다.

```python
import hmac, hashlib

# 가명화: 안정적인 대체 식별자로 치환(같은 입력→같은 토큰). 키는 비밀로 분리 보관.
def pseudonymize(user_email: str, secret_key: bytes) -> str:
    return hmac.new(secret_key, user_email.encode(), hashlib.sha256).hexdigest()

# 분석 테이블에는 이메일 대신 이 토큰만 저장한다.
# 원본 매핑이 필요 없으면 키를 폐기해 사실상 익명화한다.
```

주의: 단순 해시는 값의 범위가 작으면(예: 전화번호) 무차별 대입으로 복원됩니다. 그래서 비밀 키를 쓰는 HMAC이나 별도 매핑 테이블을 사용합니다. 익명화가 진짜인지는 재식별 위험(k-익명성 등)으로 판단합니다.

## AI·로그와의 접점

학습 데이터·프롬프트·로그에 개인정보가 섞이면 그대로 노출 위험이 됩니다. 수집 단계에서 마스킹하고, 필요 없으면 애초에 남기지 않습니다. 보안 데이터의 라벨·누수는 [보안 데이터·라벨·누수](../ai-for-security/security-data.md)와 이어집니다.

## 확인 질문

지금 수집하는 개인정보 중 실제로 목적에 필요한 것은 무엇인가요? 로그·백업·분석 사본에도 같은 보호와 보존 규칙이 적용되나요?

## 참고 자료와 연결

[NIST Privacy Framework](https://www.nist.gov/privacy-framework) · [ENISA: Pseudonymisation](https://www.enisa.europa.eu/publications/pseudonymisation-techniques-and-best-practices)

관련: [암호학](../crypto/foundations.md) · [로깅·사고 대응](logging-incident-response.md) · [클라우드 IAM과 시크릿](cloud-identity-secrets.md) · [목차](index.md)
