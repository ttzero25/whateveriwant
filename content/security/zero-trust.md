# 제로 트러스트와 네트워크 분할

> **TL;DR**
>
> 제로 트러스트는 "내부망이니 신뢰한다"는 전제를 버리고, 모든 접근을 신원·기기·맥락으로 매 요청마다 검증하는 모델입니다. 네트워크 위치가 아니라 검증된 정책이 접근을 결정하며, 세분화로 침해의 확산을 제한합니다.

AI 작성 해설

## 경계 방어의 한계

전통적 모델은 방화벽 안쪽을 신뢰 구역으로 보았습니다. 하지만 한 번 내부에 들어온 공격자는 자유롭게 옆으로 이동(lateral movement)합니다. 제로 트러스트는 **암묵적 신뢰 구역을 없애고**, 자원마다 접근을 개별 검증합니다. 원칙적 배경은 [보안 원칙과 위협 모델링](principles.md), 신원 검증은 [인증과 인가](authentication-authorization.md)·[API 보안](api-security.md)과 이어집니다.

## 핵심 원칙 (NIST SP 800-207)

- 모든 데이터·서비스를 자원으로 보고, 접근은 세션 단위로 부여합니다.
- 접근 결정은 신원, 기기 상태, 요청 맥락(시간·위치·민감도)을 종합합니다.
- 최소 권한을 적용하고, 부여된 신뢰는 지속적으로 재평가합니다.
- 모든 접근을 기록하고 관측해 정책을 개선합니다.

## 정책 결정과 집행의 분리

제로 트러스트 구현은 정책 결정 지점(PDP)과 집행 지점(PEP)을 나눕니다. 게이트웨이(PEP)가 요청을 가로채 PDP에 물어보고, 허용된 경우에만 통과시킵니다.

```python
# 정책 결정 지점(PDP): 매 요청을 신원·기기·맥락으로 평가
def authorize(request) -> bool:
    if not request.identity.authenticated:
        return False
    if not request.device.compliant:            # 기기 상태(패치·디스크 암호화 등)
        return False
    if request.resource.sensitivity == "high" and not request.identity.mfa:
        return False                             # 민감 자원은 MFA 요구
    if not policy.allows(request.identity.role, request.resource, request.action):
        return False                             # 최소 권한 정책
    return True

# 집행 지점(PEP): 게이트웨이가 결정을 강제. 통과해도 세션은 계속 재평가된다
```

위치가 아니라 이 결정이 접근을 좌우합니다. VPN으로 내부에 들어왔다는 사실 자체가 권한을 주지 않습니다.

## 네트워크 분할과 mTLS

세분화(microsegmentation)는 워크로드 사이의 통신을 기본 차단하고 필요한 것만 명시적으로 엽니다. 서비스 간에는 상호 TLS(mTLS)로 양쪽 신원을 인증합니다. 쿠버네티스에서는 기본 거부 NetworkPolicy로 시작합니다.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: default-deny-all }
spec:
  podSelector: {}          # 네임스페이스의 모든 파드에 적용
  policyTypes: ["Ingress", "Egress"]   # 인그레스·이그레스 모두 기본 차단
  # 이후 서비스별로 필요한 통신만 별도 정책으로 허용한다
```

이 관점은 [네트워크 보안](network-security.md), [컨테이너·쿠버네티스 보안](container-security.md)과 이어집니다.

## 자주 하는 오해

제로 트러스트는 특정 제품이 아니라 아키텍처 원칙입니다. VPN을 하나 도입한다고 완성되지 않으며, 신원·기기·정책·관측이 함께 작동해야 합니다.

## 확인 질문

내부망에 있다는 이유만으로 접근이 허용되는 경로가 남아 있나요? 서비스 간 통신이 기본 차단인가요, 기본 허용인가요?

## 참고 자료와 연결

[NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

관련: [보안 원칙](principles.md) · [인증과 인가](authentication-authorization.md) · [API 보안](api-security.md) · [네트워크 보안](network-security.md) · [클라우드 IAM과 시크릿](cloud-identity-secrets.md) · [목차](index.md)
