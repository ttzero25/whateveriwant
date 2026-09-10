# CAN 버스: 메시지 ID·중재·오류 처리

> **TL;DR**
>
> CAN(Controller Area Network)은 차량·산업 장비의 제어기들이 짧은 메시지를 공유하는 네트워크입니다. 같은 버스에서 전송하려는 노드들은 비트 단위 중재로 순서를 정합니다. CAN ID는 IP 주소처럼 해석하면 안 됩니다.

AI 작성 해설

## ECU와 공유 버스

ECU(Electronic Control Unit)는 센서 정보를 처리하거나 장치를 제어하는 전자 제어기입니다. CAN 컨트롤러가 프레임을 다루고 트랜시버가 물리 신호를 연결합니다. 여러 노드가 버스를 공유하며, 수신 측은 관심 있는 메시지를 필터링합니다. 자동차뿐 아니라 기계 제어에도 사용됩니다. [CiA: Classical CAN](https://www.can-cia.org/can-knowledge/can-cc)

일반적인 고속 CAN은 CAN_H·CAN_L의 차동 신호를 사용합니다. 배선·종단·비트 타이밍도 통신 품질에 영향을 줍니다. Ethernet용 IP·MAC 설정을 그대로 적용하는 인터페이스가 아닙니다.

## 프레임과 ID

| 요소 | 읽는 방법 |
|---|---|
| 11비트 / 29비트 ID | 프레임 식별과 중재에 사용; 송신자 신원 증명은 아님 |
| 데이터 필드 | Classical CAN에서는 최대 8바이트 |
| CRC | 전송 오류 검출용; 암호학적 인증과 다름 |
| ACK | 수신 노드의 프레임 수신 확인; 업무 처리 완료와 다름 |

ID와 바이트만으로 온도·상태 등의 의미를 알 수는 없습니다. 애플리케이션이 신호 위치, 바이트 순서, 부호, 배율, 단위를 합의해야 합니다. 상위 프로토콜은 ID 일부에 노드 주소를 담을 수도 있습니다. [Linux: SocketCAN](https://docs.kernel.org/networking/can.html)

## 비트 단위 중재

CAN의 dominant 상태는 recessive 상태보다 우세합니다. 중재 중 recessive를 보냈는데 dominant를 관측한 노드는 전송 경쟁에서 빠지고 수신으로 전환합니다. 이때 승자의 프레임은 계속 전달됩니다.

같은 형식의 데이터 프레임끼리는 수치가 작은 ID가 우선합니다. 가상의 11비트 ID `0x120`과 `0x180`이 동시에 시작하면 `0x120`이 먼저 전달됩니다. 이는 실제 차량의 메시지 정의가 아닙니다. 표준·확장 프레임 혼합에서는 ID 길이와 중재 필드도 고려해야 합니다. [CiA: 중재 원리](https://www.can-cia.org/can-knowledge/can-cc)

우선순위가 높아도 이미 시작된 프레임을 중간에 끊지는 않습니다. 마감 시간을 판단하려면 버스 부하, 프레임 길이, 주기, 상위 우선순위 트래픽을 함께 봐야 합니다.

## 오류 처리와 관측

오류 검출·재전송과 오류 누적에 따른 상태 관리가 신뢰성을 높입니다. error-active, error-passive, bus-off를 구분하며, bus-off 노드는 버스에 영향을 주는 송신을 중단합니다. 복구 정책은 컨트롤러와 시스템 설정에 달려 있습니다. [Linux: CAN 장치 상태](https://docs.kernel.org/networking/can.html)

운영 시에는 오류 카운터·누락 주기·큐 지연·버스 부하를 함께 관측합니다. 수신 기록이 비었다는 사실만으로 상대 ECU 고장이라고 단정하지 않습니다. 필터 설정이나 기록 장치의 누락일 수도 있습니다.

## 긴 메시지와 ISO-TP

CAN 위에 더 긴 메시지를 전달할 때 ISO-TP 같은 상위 전송 규칙을 사용할 수 있습니다. ISO-TP는 한 프레임에 들어가는 메시지와 여러 프레임으로 나누는 메시지를 구분하고, 분할 전송에는 수신 측 흐름 제어를 사용합니다. UDS의 진단 서비스 의미와 ISO-TP의 분할·재조립 역할은 별개입니다. [Linux: ISO-TP](https://docs.kernel.org/networking/iso15765-2.html)

Classical CAN 자체에는 송신자 인증·암호화가 기본 제공되지 않습니다. CRC 검사를 통과한 메시지도 신뢰 정책과 상위 계층 검증이 필요합니다.

## 확인 질문

CAN ACK를 받았다는 이유만으로 특정 ECU가 값을 저장했다고 결론 내릴 수 있을까요? 프레임 수신과 애플리케이션 응답을 구분해 설명해 보세요.

관련: [CAN FD·XL](can-fd.md) · [LIN](lin.md) · [차량용 Ethernet](automotive-ethernet.md) · [네트워크 보안](../security/network-security.md) · [목차](index.md)
