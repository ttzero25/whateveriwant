# OS 한영 용어집

> **TL;DR**
>
> 운영체제 기본 용어 30개를 확인하고 상세 문서의 예시로 연결합니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 용어 찾아보기

| 용어 | 짧은 뜻 | 상세 |
|---|---|---|
| Kernel / 커널 | 운영체제의 핵심 자원 제어 | [개념 보기](kernel-system-calls.md) |
| System call / 시스템 콜 | 커널 서비스 요청 인터페이스 | [개념 보기](kernel-system-calls.md) |
| User mode / 사용자 모드 | 제한된 실행 권한 수준 | [개념 보기](kernel-system-calls.md) |
| Kernel mode / 커널 모드 | 핵심 OS 코드를 위한 실행 권한 수준 | [개념 보기](kernel-system-calls.md) |
| Shell / 셸 | 명령 해석과 프로그램 실행 | [개념 보기](kernel-system-calls.md) |
| Process / 프로세스 | 실행 자원과 주소 공간의 단위 | [개념 보기](processes-threads.md) |
| Thread / 스레드 | 프로세스 안의 실행 흐름 | [개념 보기](processes-threads.md) |
| Ready / 준비 | CPU를 받으면 실행 가능 | [개념 보기](processes-threads.md) |
| Blocked / 대기 | 이벤트나 조건을 기다리는 상태 | [개념 보기](processes-threads.md) |
| Scheduler / 스케줄러 | 다음 실행 작업 선택 | [개념 보기](cpu-scheduling.md) |
| Time slice / 시간 할당량 | 한 차례의 CPU 사용 시간 몫 | [개념 보기](cpu-scheduling.md) |
| Context switch / 문맥 교환 | 실행 상태를 저장하고 다른 흐름으로 전환 | [개념 보기](cpu-scheduling.md) |
| Preemption / 선점 | 실행 중인 작업의 CPU 사용을 중단해 재배정 | [개념 보기](cpu-scheduling.md) |
| Virtual address / 가상 주소 | 프로그램이 사용하는 주소 | [개념 보기](virtual-memory.md) |
| Page / 페이지 | 가상 메모리 관리 단위 | [개념 보기](virtual-memory.md) |
| Frame / 프레임 | 물리 메모리 관리 단위 | [개념 보기](virtual-memory.md) |
| Page table / 페이지 테이블 | 주소 매핑과 접근 속성 기록 | [개념 보기](virtual-memory.md) |
| TLB | 주소 변환 결과 캐시 | [개념 보기](virtual-memory.md) |
| Page fault / 페이지 폴트 | 메모리 접근을 OS가 처리해야 하는 예외 | [개념 보기](virtual-memory.md) |
| Inode | 파일 메타데이터 등을 관리하는 객체 | [개념 보기](filesystems.md) |
| File descriptor / 파일 디스크립터 | 프로세스의 열린 파일 등 식별자 | [개념 보기](filesystems.md) |
| VFS | 파일 시스템 공통 인터페이스 계층 | [개념 보기](filesystems.md) |
| Interrupt / 인터럽트 | 이벤트 처리를 요청하는 신호 | [개념 보기](io-interrupts.md) |
| DMA | 장치와 메모리 사이 데이터 전송 방식 | [개념 보기](io-interrupts.md) |
| Blocking / 블로킹 | 진행 조건을 기다리는 동안 호출이 반환하지 않을 수 있음 | [개념 보기](io-interrupts.md) |
| Mutex / 뮤텍스 | 임계 구역 상호 배제 | [개념 보기](synchronization.md) |
| Semaphore / 세마포어 | 카운터 기반 자원·신호 조정 | [개념 보기](synchronization.md) |
| Deadlock / 교착 | 상호 대기로 진행 불가 | [개념 보기](synchronization.md) |
| IPC | 프로세스 사이 통신과 조정 | [개념 보기](ipc.md) |
| Shared memory / 공유 메모리 | 여러 프로세스가 접근하는 메모리 영역 | [개념 보기](ipc.md) |

출처와 플랫폼별 차이는 각 상세 문서에서 확인하세요.

[OS 학습 가이드](index.md)
