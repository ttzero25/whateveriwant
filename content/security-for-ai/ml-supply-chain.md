# ML 공급망 보안

> **TL;DR**
>
> 모델·데이터셋·프레임워크를 외부에서 받아 쓰는 순간 공급망 위협이 생깁니다. 특히 pickle 기반 모델 파일은 로드만으로 코드가 실행될 수 있어, 출처·무결성 검증과 안전한 포맷이 필수입니다.

AI 작성 해설

## AI 파이프라인의 공급망

현대 ML은 사전학습 모델, 공개 데이터셋, 오픈소스 프레임워크, 모델 허브를 조합합니다. 각 구성 요소가 신뢰의 대상이며, 하나라도 오염되면 다운스트림 전체가 영향을 받습니다. 일반 소프트웨어 공급망은 [소프트웨어 공급망 보안](../security/software-supply-chain.md)에서 다룹니다.

## 가장 흔한 함정: 역직렬화

많은 모델 파일이 pickle 같은 직렬화를 쓰는데, pickle은 **로드하는 것만으로 임의 코드를 실행**할 수 있습니다. 신뢰할 수 없는 모델 파일을 내려받아 로드하면 그 자체가 코드 실행입니다. 이는 [안전하지 않은 역직렬화](../vulnerabilities/deserialization.md)와 같은 문제입니다.

```python
# 위험: 신뢰할 수 없는 pickle 로드 = 임의 코드 실행 가능
# torch.load(untrusted_path)          # 구버전 기본은 pickle 사용
# joblib.load(untrusted_path)

# 안전: 코드 실행이 없는 포맷을 쓰고, weights-only 로드를 강제
import torch
model.load_state_dict(torch.load(path, weights_only=True))   # 텐서만 로드
# 또는 safetensors 같은 실행 불가 포맷 사용
```

## 오염 표면과 방어

| 구성 요소 | 위협 | 방어 |
|---|---|---|
| 모델 파일 | 로드 시 코드 실행, 백도어 | safetensors·weights_only, 서명·해시 검증 |
| 데이터셋 | [데이터 오염](data-poisoning.md) | 출처 검증, 이상치·라벨 감사 |
| 프레임워크·의존성 | 악성 패키지, 취약점 | 핀 고정, SBOM, 스캔 |
| 모델 허브 | 사칭·변조 업로드 | 신뢰 게시자, 다이제스트 고정 |

- **출처·무결성**: 모델·데이터의 출처를 검증하고 다이제스트·서명으로 변조를 탐지합니다([PKI와 인증서](../crypto/pki-and-certificates.md)).
- **안전한 포맷**: pickle 대신 safetensors 등 코드 실행이 없는 포맷.
- **격리 로드**: 신뢰 못 할 아티팩트는 샌드박스에서 검사([컨테이너 보안](../security/container-security.md)).
- **SBOM·핀 고정**: 데이터·모델·의존성의 버전을 고정하고 목록화합니다.

## 자주 하는 오해

"유명 허브에서 받았으니 안전"은 위험합니다. 사칭·변조 업로드가 가능하므로 게시자 신뢰와 다이제스트 고정이 필요하며, 파일 포맷 자체의 실행 위험도 별개로 다뤄야 합니다.

## 확인 질문

내려받는 모델 파일이 로드 시 코드를 실행할 수 있는 포맷인가요(pickle)? 모델·데이터의 출처와 무결성을 검증하나요? 신뢰 못 할 아티팩트를 격리해서 다루나요?

## 참고 자료와 연결

[OWASP ML Security Top 10](https://owasp.org/www-project-machine-learning-security-top-10/) · [safetensors](https://github.com/huggingface/safetensors)

관련: [데이터 오염과 백도어](data-poisoning.md) · [소프트웨어 공급망 보안](../security/software-supply-chain.md) · [안전하지 않은 역직렬화](../vulnerabilities/deserialization.md) · [목차](index.md) · [용어집](glossary.md)
