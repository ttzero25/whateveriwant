# 키 관리와 수명 주기

> **TL;DR**
>
> 암호의 안전성은 알고리즘보다 키 관리에서 무너지는 경우가 많습니다. 키는 생성·보관·사용·회전·폐기의 수명을 가지며, 접근을 최소화하고 유출 시 영향을 줄이도록 설계해야 합니다.

AI 작성 해설

## 키가 약한 고리다

강한 알고리즘을 써도 키가 소스 코드·로그·저장소에 노출되면 끝입니다. 실제 사고 다수가 하드코딩된 키, 공개 저장소에 커밋된 시크릿, 과도한 접근 권한에서 비롯합니다. 시크릿 관리는 [클라우드 IAM과 시크릿](../security/cloud-identity-secrets.md)과 이어집니다.

## 키의 수명 주기

```
생성 → 배포/보관 → 사용 → 회전 → 폐기/파기
  │        │         │       │        │
CSPRNG   HSM/KMS  최소권한  무중단   재암호화·
                            교체     복구 불가 대비
```

- **생성**: 예측 불가능한 난수로([난수와 엔트로피](randomness.md)).
- **보관**: 키를 애플리케이션과 분리해 KMS·HSM에 두고, 코드·로그·환경변수 평문 노출을 피합니다.
- **사용**: 데이터 접근 권한과 키 접근 권한을 분리하고 최소화합니다.
- **회전**: 정기적·사고 시 키를 교체합니다.
- **폐기**: 더 이상 필요 없는 키는 파기하되, 그 키로 암호화된 데이터의 복구 방법을 먼저 정합니다.

## 봉투 암호화(envelope encryption)

대규모에서는 데이터를 데이터 키(DEK)로 암호화하고, DEK를 마스터 키(KEK)로 감쌉니다. 회전 시 데이터 전체가 아니라 감싼 키만 다시 감싸면 되어 비용이 적습니다.

```python
# 개념 예시: DEK로 데이터 암호화, KEK(KMS)로 DEK를 감싼다
data_key = generate_data_key()                 # 임의 대칭키(DEK)
ciphertext = aead_encrypt(data_key, plaintext) # 데이터는 DEK로
wrapped_dek = kms.encrypt(key_id=KEK, plaintext=data_key)  # DEK는 KEK로 감싼다
store(ciphertext, wrapped_dek)                 # 평문 DEK는 저장하지 않는다
# 복호화 시 kms.decrypt로 DEK를 풀고, 사용 후 메모리에서 지운다
```

## 회전과 유출 대응

회전 전략을 미리 정합니다: 기존 데이터를 읽는 방법(구 키 유지), 재암호화 범위, 무중단 전환. 유출이 의심되면 즉시 회전하고 영향 범위를 조사합니다([로깅·사고 대응](../security/logging-incident-response.md)). 한 서비스 계정이 모든 키와 데이터를 자유롭게 읽는다면, 계정 침해 시 암호화의 이점이 사라집니다. 키 관리는 [최소 권한](../security/principles.md)과 함께 설계합니다.

## 확인 질문

지금 키가 코드·로그·저장소에 평문으로 있지는 않나요? 키를 회전할 절차와, 유출 시 영향 범위를 좁힐 경계가 있나요?

## 참고 자료와 연결

[NIST SP 800-57 (Key Management)](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final) · [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

관련: [난수와 엔트로피](randomness.md) · [클라우드 IAM과 시크릿](../security/cloud-identity-secrets.md) · [암호학 개요](foundations.md) · [목차](index.md) · [용어집](glossary.md)
