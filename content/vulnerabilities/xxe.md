# XXE: XML 외부 엔터티 주입

> **TL;DR**
>
> XML 파서가 외부 엔터티를 해석하도록 허용되면, 공격자가 문서에 정의한 엔터티가 서버의 파일을 읽거나 내부로 요청을 보내게 만들 수 있습니다. 방어의 핵심은 파서에서 DTD와 외부 엔터티 처리를 끄는 것입니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 발생 원리와 영향

XML은 DTD로 엔터티를 정의할 수 있고, 외부 엔터티는 `SYSTEM` 식별자로 외부 자원을 가리킬 수 있습니다. 파서가 이를 확장하면 문서 파싱 과정에서 서버가 그 자원을 읽습니다. 영향은 로컬 파일 노출, 내부망 SSRF, 서비스 거부(엔터티 폭증)로 이어집니다.

```xml
<?xml version="1.0"?>
<!DOCTYPE data [
  <!ENTITY secret SYSTEM "file:///etc/passwd">
]>
<data>&secret;</data>   <!-- 파서가 확장하면 파일 내용이 응답에 실린다 -->
```

같은 방식으로 `SYSTEM "http://169.254.169.254/..."`를 넣으면 클라우드 메타데이터로 향하는 [SSRF](ssrf.md)가 됩니다.

## 가상 사례로 이해하기

가상 송장 시스템이 업로드된 XML 청구서를 파싱한다고 합시다. 문서 본문만 신뢰하고 DTD 처리를 켠 기본 파서를 쓰면, 공격자는 청구서 대신 위와 같은 엔터티를 넣어 서버 파일을 응답으로 되받을 수 있습니다.

## 예방과 수정

가장 확실한 방어는 **DTD/외부 엔터티 비활성화**입니다. 언어·라이브러리마다 스위치가 다릅니다.

```python
# Python: 표준 파서 대신 방어된 파서 사용
from lxml import etree

parser = etree.XMLParser(
    resolve_entities=False,   # 엔터티 확장 금지
    no_network=True,          # 외부 네트워크 접근 금지
    dtd_validation=False,
    load_dtd=False,
)
tree = etree.fromstring(untrusted_bytes, parser)
```

```java
// Java: 완전 비활성화가 가장 안전
DocumentBuilderFactory f = DocumentBuilderFactory.newInstance();
f.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
f.setFeature("http://xml.org/sax/features/external-general-entities", false);
f.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
f.setXIncludeAware(false);
f.setExpandEntityReferences(false);
```

가능하면 XML 대신 JSON을 쓰고, SVG·DOCX·SOAP처럼 내부적으로 XML을 쓰는 형식도 같은 파서 정책을 적용합니다.

## 수정 후 확인할 조건

정상 XML은 그대로 파싱되는지, DOCTYPE가 포함된 입력은 거부되거나 엔터티가 확장되지 않는지, 모든 XML 진입 경로(업로드·API·SOAP)가 같은 설정을 쓰는지 확인합니다.

## 자주 하는 오해

입력에서 `<!DOCTYPE`를 문자열로 걸러내는 방식은 인코딩·변형으로 우회됩니다. 파서 설정으로 막는 것이 정답입니다.

## 확인 질문

애플리케이션이 XML을 파싱하는 모든 지점에서 외부 엔터티가 꺼져 있다고 확신할 수 있나요?

## 참고 자료와 연결

[OWASP: XXE Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)

관련: [SSRF](ssrf.md) · [파일 처리](file-handling.md) · [안전하지 않은 역직렬화](deserialization.md) · [학습 가이드](index.md) · [용어집](glossary.md)
