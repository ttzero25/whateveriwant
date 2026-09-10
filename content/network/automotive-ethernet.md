# 차량용 Ethernet: T1·게이트웨이·시간 제약

> **TL;DR**
>
> 차량용 Ethernet은 센서 데이터와 제어기 사이의 큰 데이터 흐름을 연결합니다. CAN·LIN과 공존할 수 있으며, 물리 링크·스위칭·IP·애플리케이션 역할을 나누어 이해해야 합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## T1은 무엇이 다른가

100BASE-T1과 1000BASE-T1은 각각 100 Mbit/s와 1 Gbit/s급 단일 꼬임쌍 Ethernet 물리 계층입니다. 같은 속도의 사무실 Ethernet과 커넥터·물리 신호를 그대로 호환한다고 가정하면 안 됩니다. [TI: Single-Pair Ethernet PHY](https://www.ti.com/product-category/interface/ethernet-ics/ethernet-phys/overview.html)

물리 계층이 달라져도 Ethernet 프레임, 스위치, 상위 IP 통신이라는 역할 구분은 유효합니다. 반대로 Ethernet을 쓴다고 모든 데이터가 반드시 TCP로 전달되는 것은 아닙니다.

## CAN·LIN과 공존하는 구조

| 부분 | 가상의 역할 배치 |
|---|---|
| LIN 서브네트워크 | 단순 센서·액추에이터 상태 교환 |
| CAN / CAN FD | 제어기 사이의 짧은 상태·제어 메시지 |
| Ethernet | 큰 센서 데이터·제어기 간 백본 통신 |
| 게이트웨이 | 필요한 데이터의 선택·변환·전달 정책 |

이는 학습용 구조이며 모든 차량의 배치를 나타내지 않습니다. 실제 게이트웨이 플랫폼은 CAN·LIN·Ethernet 등 여러 인터페이스를 조합합니다. [NXP: 차량 게이트웨이](https://www.nxp.com/applications/SERVICE-ORIENTED-GATEWAY)

영역별로 가까운 장치를 모으는 zonal 구조와 기능별로 묶는 domain 구조를 구분할 수도 있습니다. 구체적인 분할은 차량 설계에 따라 다릅니다.

## 빠른 링크와 마감 시간

대역폭이 크다고 최악의 지연이 자동으로 작아지지는 않습니다. 송신 큐·스위치 큐·게이트웨이 변환·수신 처리 시간이 누적됩니다. TSN(Time-Sensitive Networking)은 시간 동기화와 트래픽 제어 등 시간 제약을 다루는 기술군입니다. “TSN 지원”이라는 이름만으로 모든 경로의 지연을 보장할 수는 없습니다. [NXP: TSN 게이트웨이 구성](https://www.nxp.com/applications/SERVICE-ORIENTED-GATEWAY)

가상 요구사항이 “측정부터 수신 처리까지 20ms 이내”라면 링크 속도뿐 아니라 측정 주기와 전체 경로의 대기 시간을 예산에 포함해야 합니다.

## 게이트웨이가 확인할 의미

CAN 프레임을 Ethernet 쪽으로 전달할 때는 무엇을 전달할지 정의해야 합니다. 원래 프레임을 포장할 수도 있고, 신호를 해석해 상위 메시지로 바꿀 수도 있습니다. 수신 측에는 시각·단위·유효성·누락 여부가 필요합니다. 게이트웨이는 단순한 케이블 변환기보다 넓은 역할을 가집니다.

보안 설계에서는 통신 허용 범위, 메시지 검증, 관리 기능 접근, 로그를 함께 고려합니다. VLAN으로 나눈 것과 애플리케이션 메시지를 인증한 것은 서로 다른 보호입니다.

## 확인 질문

CAN에서 100ms마다 받은 값을 Ethernet으로 즉시 전달해도 20ms 이내 최신 측정이라는 요구를 항상 만족할 수 있을까요?

관련: [Ethernet·스위칭](ethernet-switching.md) · [CAN](can-bus.md) · [CAN FD](can-fd.md) · [LIN](lin.md) · [성능](performance-mtu.md) · [목차](index.md)
