# PKI와 인증서

> **TL;DR**
>
> 공개키 자체는 소유자를 증명하지 못합니다. PKI는 신뢰할 수 있는 인증기관(CA)이 "이 공개키는 이 주체의 것"이라고 서명한 인증서로 공개키와 신원을 연결합니다. 브라우저의 HTTPS 신뢰가 이 구조 위에 있습니다.

AI 작성 해설

## 공개키의 신뢰 문제

[비대칭키 암호](asymmetric-encryption.md)에서 공개키는 누구나 배포할 수 있지만, "이 공개키가 정말 그 은행의 것인가"는 별도로 증명해야 합니다. 그렇지 않으면 공격자가 자기 키를 은행 것이라 속이는 중간자 공격이 가능합니다. PKI는 이 연결을 신뢰받는 제3자의 서명으로 보증합니다.

## 인증서와 인증서 체인

X.509 인증서는 주체 이름, 공개키, 유효기간, 발급 CA, 그리고 그 CA의 서명을 담습니다. 신뢰는 사슬로 이어집니다.

```
루트 CA (브라우저·OS에 미리 신뢰됨, 자체 서명)
   │ 서명
   ▼
중간 CA
   │ 서명
   ▼
서버 인증서 (example.com)  ← 서버가 제시
```

검증자는 서버 인증서부터 신뢰 저장소의 루트까지 서명을 거슬러 확인하고, 각 인증서의 유효기간·용도·도메인 일치를 검사합니다. 하나라도 실패하면 신뢰하지 않습니다.

```bash
# 서버 인증서 체인과 주체·발급자 확인
openssl s_client -connect example.com:443 -servername example.com </dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

## 폐기와 수명

유출·오발급된 인증서는 만료 전 폐기해야 합니다. CRL(폐기 목록)과 OCSP(온라인 상태 조회)가 이를 다루며, 인증서 수명은 점점 짧아지는 추세입니다(자동 갱신 전제). 발급 투명성은 Certificate Transparency 로그로 감시합니다.

## 어디에 쓰나

- **HTTPS/TLS**: 서버 신원 검증([TLS·HTTP/2·QUIC](../network/tls-quic.md), [키 교환](key-exchange.md)).
- **코드 서명**: 소프트웨어 배포 출처 검증([소프트웨어 공급망 보안](../security/software-supply-chain.md)).
- **mTLS**: 서버·클라이언트 양방향 인증([제로 트러스트](../security/zero-trust.md)).

## 자주 하는 오해

- 자체 서명 인증서는 암호화는 되지만 신원 신뢰를 주지 못합니다(체인이 신뢰 저장소로 이어지지 않음).
- 인증서 검증을 끄거나 오류를 무시하면 MITM에 그대로 노출됩니다.
- "자물쇠 아이콘 = 안전한 사이트"가 아닙니다. TLS는 연결의 기밀성·서버 신원만 보증하며, 그 사이트가 선의라는 뜻은 아닙니다.

## 확인 질문

이 공개키가 상대의 것임을 무엇이 보증하나요? 인증서 검증 실패를 코드가 무시하고 있지는 않나요? 폐기·갱신은 어떻게 처리하나요?

## 참고 자료와 연결

[RFC 5280 (X.509)](https://datatracker.ietf.org/doc/html/rfc5280) · [Certificate Transparency](https://certificate.transparency.dev/)

관련: [비대칭키 암호](asymmetric-encryption.md) · [키 교환](key-exchange.md) · [MAC과 전자서명](mac-and-signatures.md) · [목차](index.md) · [용어집](glossary.md)
