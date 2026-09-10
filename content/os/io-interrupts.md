# I/O·인터럽트·블로킹과 비동기

> **TL;DR**
>
> I/O는 장치나 외부 데이터와 상호작용하는 작업입니다. 인터럽트는 이벤트 처리를 요청하는 메커니즘이며, 블로킹·논블로킹·비동기는 호출과 완료를 어떻게 다루는지 구분하는 개념입니다.

AI 작성 해설

## 장치와 CPU의 속도 차이

디스크나 네트워크 작업은 CPU 계산과 다른 시간 규모로 완료됩니다. 기다리는 동안 스레드를 잠들게 하고 다른 작업을 실행할 수 있습니다. 드라이버는 장치별 제어와 OS 인터페이스를 연결합니다.

## 인터럽트와 폴링

인터럽트 방식은 장치의 이벤트를 CPU에 알리고 등록된 처리 루틴이 대응합니다. 폴링은 소프트웨어가 상태를 반복 확인합니다. 실제 시스템은 부하와 장치 특성에 따라 둘을 섞기도 합니다. 인터럽트 하나가 반드시 사용자 요청 하나의 완료와 대응하는 것은 아닙니다.

DMA는 장치가 메모리와 데이터를 이동하는 데 사용하는 방식입니다. CPU가 바이트를 일일이 복사하는 부담을 줄일 수 있지만 설정·동기화·완료 처리까지 사라지는 것은 아닙니다.

## 호출 방식 비교

| 방식 | 호출자 관점 |
|---|---|
| Blocking | 필요한 조건이나 완료를 기다리며 호출이 반환하지 않을 수 있음 |
| Nonblocking | 즉시 진행 불가능하면 기다리지 않고 상태를 반환 |
| Asynchronous | 작업을 시작한 뒤 완료를 나중에 통지하거나 확인 |

API마다 구체적인 보장이 다릅니다. 준비 상태(readiness)는 지금 작업을 진행할 수 있다는 뜻이고, 완료(completion)는 요청한 작업이 끝났다는 뜻입니다.

## 예시: 파일 읽기

요청 제출 → 장치 작업 → 완료 처리 → 기다리던 작업을 다시 실행 가능하게 만들기라는 흐름을 생각할 수 있습니다. 캐시 적중이면 장치 접근을 생략할 수도 있습니다. 비동기 코드를 썼다고 CPU 계산이 자동으로 여러 코어에서 병렬 실행되는 것은 아닙니다.

관련: [스케줄링](cpu-scheduling.md) · [파일 시스템](filesystems.md) · [CS 동시성](../cs/concurrency.md)

공식 참고: [Microsoft · Interrupt service routines](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-interrupt-service-routines). 영어 보기는 이 자료의 관련 개념을 짧게 인용합니다.

추가 출처: [Microsoft — Synchronous and asynchronous I/O](https://learn.microsoft.com/en-us/windows/win32/fileio/synchronous-and-asynchronous-i-o).

[OS 학습 가이드](index.md)
