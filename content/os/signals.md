# 시그널: 비동기 프로세스 알림

> **TL;DR**
>
> 시그널은 커널이 프로세스에 보내는 짧은 비동기 알림입니다. 종료·중단·자식 종료·타이머 만료 같은 사건을 전달하며, 핸들러 안에서 할 수 있는 일이 엄격히 제한된다는 점이 핵심입니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 시그널이란

시그널은 번호로 식별되는 간단한 알림으로, 프로세스의 정상 실행 흐름을 비동기적으로 가로챕니다. 커널이 보내기도 하고(`SIGSEGV`처럼 잘못된 메모리 접근), 사용자가 `kill`로 보내기도 합니다. 프로세스와 실행 상태 개념은 [프로세스·스레드·실행 상태](processes-threads.md)에서 다룹니다.

| 시그널 | 기본 동작 | 의미 |
|---|---|---|
| SIGINT | 종료 | 터미널에서 Ctrl+C |
| SIGTERM | 종료 | 정중한 종료 요청(기본 kill) |
| SIGKILL | 종료(잡을 수 없음) | 강제 종료 |
| SIGSEGV | 종료 + 코어 | 잘못된 메모리 접근 |
| SIGCHLD | 무시 | 자식 프로세스 상태 변화 |
| SIGHUP | 종료 | 터미널 종료 / 설정 재적재 관례 |

`SIGKILL`과 `SIGSTOP`은 잡거나 무시할 수 없습니다. 그래서 "정중히 멈춰달라"는 `SIGTERM`을 먼저 보내고, 응답이 없을 때 `SIGKILL`로 강제하는 것이 관례입니다.

## 핸들러의 제약: async-signal-safe

시그널은 프로그램이 어느 지점에 있든 끼어들 수 있습니다. 만약 핸들러가 `malloc`이 락을 쥔 순간에 들어와 다시 `malloc`을 호출하면 교착이 생깁니다. 그래서 핸들러 안에서는 **async-signal-safe** 함수만 써야 하며, 실무에서는 플래그만 세우고 실제 처리는 메인 루프에서 합니다.

```c
#include <signal.h>
#include <unistd.h>

volatile sig_atomic_t stop = 0;      // 핸들러와 메인이 공유하는 안전한 플래그

void on_term(int sig) {
    stop = 1;                        // 플래그만 세운다 (printf 등 금지)
}

int main(void) {
    struct sigaction sa = {0};
    sa.sa_handler = on_term;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGTERM, &sa, NULL);   // signal() 대신 sigaction() 권장
    sigaction(SIGINT,  &sa, NULL);

    while (!stop) {
        /* 일한다. 시그널이 오면 다음 루프 검사에서 빠져나간다 */
    }
    /* 여기서 정리(리소스 해제, 로그 flush)를 안전하게 수행 */
    return 0;
}
```

`signal()`은 플랫폼별 동작 차이가 있어 `sigaction()`이 권장됩니다. `sa_mask`로 핸들러 실행 중 블록할 시그널을 지정해 재진입을 통제합니다.

## graceful shutdown 패턴

서버는 `SIGTERM`을 받으면 새 연결을 그만 받고, 진행 중인 요청을 마친 뒤 종료합니다.

```python
import signal, sys

shutting_down = False

def handle(signum, frame):
    global shutting_down
    shutting_down = True          # 메인 루프가 확인하고 정리 후 종료

signal.signal(signal.SIGTERM, handle)
signal.signal(signal.SIGINT, handle)
# 메인 루프에서 shutting_down을 검사해 안전하게 빠져나간다
```

컨테이너 오케스트레이터는 파드를 멈출 때 `SIGTERM` 후 유예 시간을 주고 `SIGKILL`을 보냅니다. PID 1로 도는 프로세스는 시그널 기본 동작이 다르므로 init 처리를 유의합니다. 이 관점은 [컨테이너: 네임스페이스와 cgroups](containers-namespaces.md)와 이어집니다.

## 자식 프로세스와 SIGCHLD

자식이 종료하면 `SIGCHLD`가 오고, 부모가 `wait`로 수거하지 않으면 좀비 프로세스가 남습니다. 시그널·좀비·프로세스 간 통신은 [IPC: 파이프·소켓·공유 메모리](ipc.md)와 함께 이해합니다.

## 확인 질문

서버가 `SIGTERM`을 받았을 때 진행 중인 작업을 어떻게 마무리하나요? 시그널 핸들러 안에서 async-signal-safe하지 않은 함수를 호출하고 있지는 않나요?

## 참고 자료와 연결

[man 7 signal](https://man7.org/linux/man-pages/man7/signal.7.html) · [man 7 signal-safety](https://man7.org/linux/man-pages/man7/signal-safety.7.html)

관련: [프로세스·스레드·실행 상태](processes-threads.md) · [IPC: 파이프·소켓·공유 메모리](ipc.md) · [I/O·인터럽트·비동기](io-interrupts.md) · [목차](index.md) · [용어집](glossary.md)
