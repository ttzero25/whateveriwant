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

## 확장 개념 용어

| 용어 | 영어 | 의미 |
|---|---|---|
| 시그널 | Signal | 커널이 프로세스에 보내는 비동기 알림 |
| 네임스페이스 | Namespace | 프로세스가 보는 커널 자원의 뷰를 격리 |
| 제어 그룹 | cgroups | 프로세스 그룹의 자원 사용을 제한·측정 |
| 컨테이너 | Container | 네임스페이스·cgroups로 격리된 프로세스 |
| 힙 할당자 | malloc / allocator | 힙 메모리를 잘라 나눠 주는 라이브러리 |
| 단편화 | Fragmentation | 빈 공간이 흩어져 큰 할당을 못 받는 상태 |
| 실시간 운영체제 | RTOS | 마감 시간을 보장하도록 설계된 OS |
| 우선순위 역전 | Priority inversion | 저우선순위가 쥔 락으로 고우선순위가 지연 |
| 펌웨어 | UEFI / BIOS | 전원 후 하드웨어를 초기화하는 첫 코드 |
| 초기 램디스크 | initramfs | 루트 마운트에 필요한 임시 루트 |
| 디바이스 드라이버 | Device driver | 하드웨어를 OS 인터페이스로 변환하는 커널 코드 |
| 커널 모듈 | Kernel module | 실행 중 적재·제거 가능한 커널 확장 |

관련 문서: [시그널](signals.md) · [컨테이너: 네임스페이스와 cgroups](containers-namespaces.md) · [메모리 할당자](memory-allocation.md) · [실시간 스케줄링](realtime-scheduling.md) · [부팅 과정](boot-process.md) · [디바이스 드라이버](device-drivers.md)
