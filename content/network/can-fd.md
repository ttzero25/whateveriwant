# CAN FD와 CAN XL: 데이터 길이·속도·호환성

> **TL;DR**
>
> CAN FD는 Classical CAN보다 큰 데이터 필드와 선택적인 비트율 전환을 제공합니다. CAN XL은 더 큰 데이터 전달을 위한 별도 세대입니다. 이름이 비슷해도 기존 노드와의 혼용 가능성은 따로 확인해야 합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 세대별 차이

| 구분 | 프레임의 데이터 필드 | 핵심 차이 |
|---|---|---|
| Classical CAN / CAN CC | 최대 8바이트 | 짧은 제어 메시지 |
| CAN FD | 최대 64바이트 | 데이터 길이 확대와 비트율 전환 |
| CAN XL | 최대 2,048바이트 | 더 큰 데이터와 Ethernet 연계 등을 고려한 설계 |

표의 크기는 애플리케이션 처리량이 아닙니다. 헤더·CRC·중재·대기와 상위 프로토콜 오버헤드를 제외해야 유용한 데이터 전달률을 계산할 수 있습니다. [CiA: CAN 세대](https://www.can-cia.org/can-knowledge/can-data-link-layer-generations), [CiA: CAN XL](https://www2.can-cia.org/canxl)

## CAN FD의 두 비트율

중재 구간에서는 버스 참여자들이 전송 순서를 정합니다. BRS(Bit Rate Switch)를 사용하면 데이터 구간에서 다른 비트율로 전환할 수 있습니다. FD라고 항상 더 빠른 데이터 비트율을 쓰는 것은 아닙니다. 가능한 속도는 트랜시버·배선·토폴로지·타이밍 조건에 좌우됩니다. [CiA: CAN FD](https://can-cia.org/can-knowledge/can-fd-the-basic-idea)

따라서 “데이터 구간이 몇 배 빨라졌으니 전체 응답도 같은 비율로 빨라진다”는 계산은 성립하지 않습니다. 대기 시간과 중재 비용이 남기 때문입니다.

## DLC와 실제 길이

DLC(Data Length Code)는 길이의 코드입니다. CAN FD에서는 0~8바이트 다음으로 12·16·20·24·32·48·64바이트 길이를 표현합니다. DLC의 숫자와 바이트 수를 항상 같다고 읽으면 안 됩니다. 예컨대 애플리케이션 데이터 10바이트를 담을 때는 12바이트 프레임을 사용하고 나머지 처리 규칙을 합의할 수 있습니다. [Linux: CAN FD 데이터 구조](https://docs.kernel.org/networking/can.html)

## 호환성과 마이그레이션

FD 컨트롤러가 Classical 프레임을 처리할 수 있다는 사실과 Classical 전용 노드가 FD 프레임을 수용한다는 주장은 다릅니다. FD를 이해하지 못하는 노드가 있으면 오류를 발생시킬 수 있으므로 혼용 조건을 확인해야 합니다. 초기 non-ISO CAN FD와 ISO CAN FD의 차이도 있습니다. [CiA: CAN FD 프로토콜](https://can-cia.org/can-knowledge/can-fd-the-basic-idea)

설계 검토에서는 컨트롤러·트랜시버 지원, 프레임 형식, 전체 버스의 참여 노드, 게이트웨이 경계를 함께 확인합니다. CAN XL도 FD의 설정값 하나만 바꾸어 얻는 기능으로 취급하지 않습니다.

## 확인 질문

CAN FD 지원 장치를 하나 추가하면 나머지가 Classical 전용인 버스에서도 바로 FD 프레임을 사용할 수 있을까요? 장치의 지원과 버스 전체의 호환성을 나누어 설명해 보세요.

관련: [CAN 기초](can-bus.md) · [성능·처리량](performance-mtu.md) · [차량용 Ethernet](automotive-ethernet.md) · [목차](index.md)
