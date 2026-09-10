# 컨테이너·쿠버네티스 보안

> **TL;DR**
>
> 컨테이너는 가상 머신이 아니라 커널을 공유하는 격리된 프로세스입니다. 보안의 핵심은 이미지 신뢰, 최소 권한 실행, 커널 노출면 축소이며, 기본 설정은 대체로 안전하지 않으므로 명시적으로 조여야 합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 격리의 실제 경계

컨테이너 격리는 네임스페이스(무엇을 보는가)와 cgroups(얼마나 쓰는가), capabilities·seccomp(무엇을 할 수 있는가)로 구성됩니다. 호스트 커널을 공유하므로 커널 취약점은 격리를 넘을 수 있습니다. VM 수준 격리가 필요하면 gVisor·Kata 같은 샌드박스 런타임을 검토합니다. OS 관점의 메커니즘은 [컨테이너: 네임스페이스와 cgroups](../os/containers-namespaces.md)에서 다룹니다.

## 이미지: 신뢰의 출발점

작은 베이스 이미지를 쓰고, 태그 대신 다이제스트로 고정하며, 빌드 단계와 실행 단계를 분리합니다. 자격 증명이나 `.git`을 이미지에 넣지 않습니다.

```dockerfile
# 멀티 스테이지: 빌드 도구는 최종 이미지에 남기지 않는다
FROM golang:1.23 AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /app ./cmd/server

FROM gcr.io/distroless/static:nonroot   # 쉘·패키지 매니저 없음
COPY --from=build /app /app
USER nonroot:nonroot                     # root로 실행하지 않는다
ENTRYPOINT ["/app"]
```

이미지를 SBOM·서명(cosign)과 함께 배포하고 레지스트리 스캔을 CI에 붙입니다. 공급망 관점은 [소프트웨어 공급망 보안](software-supply-chain.md)과 이어집니다.

## 실행 시 최소 권한

`--privileged`, 호스트 네임스페이스 공유, 도커 소켓 마운트는 사실상 호스트 장악과 같습니다. 파드에는 명시적 보안 컨텍스트를 지정합니다.

```yaml
securityContext:
  runAsNonRoot: true
  readOnlyRootFilesystem: true          # 쓰기는 volume으로 제한
  allowPrivilegeEscalation: false       # setuid로 권한 상승 차단
  capabilities:
    drop: ["ALL"]                        # 필요한 capability만 다시 추가
  seccompProfile:
    type: RuntimeDefault                 # 위험한 syscall 차단
```

## 쿠버네티스 표면

RBAC는 필요한 동사·리소스만 부여하고, 서비스 어카운트 토큰 자동 마운트는 필요 없으면 끕니다. 네트워크는 기본 차단 후 필요한 통신만 여는 NetworkPolicy를 적용합니다. Secret은 etcd 암호화와 외부 시크릿 저장소를 함께 씁니다. Pod Security Admission으로 `restricted` 프로파일을 강제합니다. [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)

## 자주 하는 오해

"컨테이너니까 격리되어 안전하다"는 가정은 위험합니다. root로 도는 컨테이너의 프로세스는 대체로 호스트에서도 root이며, 커널·마운트·capability를 통해 탈출 경로가 생깁니다.

## 확인 질문

지금 배포 중인 컨테이너 중 root로 도는 것, `privileged`인 것이 있나요? 노출된 capability를 하나씩 설명할 수 있나요?

## 참고 자료와 연결

[NIST SP 800-190 컨테이너 보안](https://csrc.nist.gov/pubs/sp/800/190/final) · [OWASP Docker Top 10](https://github.com/OWASP/Docker-Security)

관련: [시스템 보안](system-security.md) · [클라우드 IAM과 시크릿](cloud-identity-secrets.md) · [소프트웨어 공급망 보안](software-supply-chain.md) · [목차](index.md)
