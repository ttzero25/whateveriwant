# OS 학습 가이드

> **TL;DR**
>
> 커널과 실행 단위 → CPU와 메모리 관리 → 파일·장치 → 동기화와 통신 순서로 운영체제를 연결해 이해합니다.

AI 작성 해설

## 학습 순서

1. [운영체제·커널·시스템 콜](kernel-system-calls.md)
2. [프로세스·스레드와 실행 상태](processes-threads.md)
3. [CPU 스케줄링과 문맥 교환](cpu-scheduling.md)
4. [가상 메모리·페이지·페이지 폴트](virtual-memory.md)
5. [파일 시스템·경로·파일 디스크립터](filesystems.md)
6. [I/O·인터럽트·블로킹과 비동기](io-interrupts.md)
7. [동기화·뮤텍스·세마포어·교착 상태](synchronization.md)
8. [IPC: 파이프·소켓·공유 메모리](ipc.md)

## 확장 학습

| 새 개념 | 수준 |
|---|---|
| [시그널: 비동기 프로세스 알림](signals.md) | 핵심 |
| [컨테이너: 네임스페이스와 cgroups](containers-namespaces.md) | 핵심 |
| [메모리 할당자: 힙·malloc·단편화](memory-allocation.md) | 핵심 |
| [실시간 스케줄링과 RTOS](realtime-scheduling.md) | 핵심 |
| [부팅 과정: 전원에서 사용자 공간까지](boot-process.md) | 핵심 |
| [디바이스 드라이버와 커널 모듈](device-drivers.md) | 핵심 |

학습 경로: 부팅 과정 → 커널 → 프로세스와 스레드 → 시그널 → 실시간 스케줄링 / 가상 메모리 → 메모리 할당자 / I/O → 디바이스 드라이버 / 파일 시스템 → 컨테이너(네임스페이스·cgroups).

## 목적별 경로

- 실행 원리: 커널 → 프로세스와 스레드 → 스케줄링 → 가상 메모리
- 데이터 처리: 파일 시스템 → I/O → IPC → 동기화
- 격리와 배포: 프로세스 → 시그널 → 네임스페이스·cgroups → [컨테이너 보안](../security/container-security.md)
- CS에서 이어 읽기: [컴퓨터 구조](../cs/computer-architecture.md) · [동시성](../cs/concurrency.md)
- 보안과 연결: [시스템 보안](../security/system-security.md)

## 자료를 읽는 방법

한국어는 공통 개념을 설명하는 자체 학습 노트입니다. Linux의 파일 디스크립터와 Windows의 핸들처럼 플랫폼별 차이를 구분합니다. 영어는 관련 공식 문서의 짧은 원문 발췌이며, 전체 설명은 출처 링크에서 읽을 수 있습니다. 도식과 예시는 이 사이트에서 작성했습니다.

[OS 용어집](glossary.md) · [백과 홈](../../README.md)
