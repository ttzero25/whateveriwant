# 메모리 할당자: 힙·malloc·단편화

> **TL;DR**
>
> 힙 할당자는 운영체제에서 큰 메모리 덩어리를 받아, 프로그램의 크고 작은 할당 요청에 잘라 나눠 줍니다. 할당·해제 패턴에 따라 단편화가 생기며, 잘못된 수명 관리는 누수와 메모리 안전 버그로 이어집니다.

AI 작성 해설

## 스택과 힙

지역 변수는 스택에 쌓이고 함수가 끝나면 자동 회수됩니다. 크기가 실행 중 정해지거나 함수 밖까지 살아야 하는 데이터는 힙에 둡니다. 힙은 명시적으로(또는 GC로) 관리해야 합니다. 가상 주소·페이지 개념은 [가상 메모리·페이징·페이지 폴트](virtual-memory.md)와 이어집니다.

## 할당자는 커널과 프로그램 사이에 있다

`malloc`은 시스템 콜이 아니라 라이브러리 함수입니다. 내부적으로 `brk`/`mmap` 같은 시스템 콜로 커널에서 큰 영역을 받아 두고, 이후의 작은 요청은 그 안에서 잘라 줍니다. 그래서 대부분의 `malloc`은 커널에 들어가지 않아 빠릅니다. 시스템 콜 경계는 [운영체제·커널·시스템 콜](kernel-system-calls.md)에서 다룹니다.

```c
#include <stdlib.h>

char *buf = malloc(1024);   // 힙에서 1KB 확보 (실패 시 NULL)
if (!buf) { /* 반드시 확인 */ }
/* ... 사용 ... */
free(buf);                  // 반환. 이후 buf를 쓰면 use-after-free
buf = NULL;                 // dangling 포인터 재사용을 막는 습관
```

## 흔한 오류

- **누수(leak)**: 해제하지 않아 회수되지 않는 메모리. 오래 도는 서버에서 점점 쌓입니다.
- **이중 해제(double free)** / **use-after-free**: 이미 해제한 영역을 다시 해제·사용. 힙 메타데이터를 훼손해 공격에 악용됩니다. [메모리 안전성](../vulnerabilities/memory-safety.md)
- **경계 밖 쓰기**: 할당 크기를 넘어 쓰면 인접 청크를 덮습니다. [OOB 읽기·쓰기](../vulnerabilities/out-of-bounds.md)

## 단편화

- **외부 단편화**: 빈 공간의 총량은 충분한데 조각조각 흩어져 큰 요청을 못 받는 상태.
- **내부 단편화**: 요청보다 크게(정렬·최소 단위) 할당해 남는 낭비.

할당자는 크기별 자유 리스트(free list)·분리 저장소(size class)로 이를 완화합니다. 오래 도는 프로그램은 할당·해제 패턴을 일정하게 유지하고, 풀(pool)·아레나(arena)로 수명이 같은 객체를 묶어 단편화를 줄입니다.

## 언어별 차이

C/C++는 수동 관리(또는 RAII/스마트 포인터), Java·Go·Python은 가비지 컬렉터가 도달 불가능한 객체를 회수합니다. GC는 use-after-free를 없애 주지만, 참조를 놓지 않으면 여전히 논리적 누수가 생기고 수집에 멈춤(pause) 비용이 있습니다.

## 확인 질문

이 할당의 수명은 어디서 끝나고 누가 해제하나요? 오래 도는 프로세스의 메모리 사용량이 시간에 따라 계속 증가한다면, 어디서 참조를 놓지 않고 있을까요?

## 참고 자료와 연결

[man 3 malloc](https://man7.org/linux/man-pages/man3/malloc.3.html) · [glibc malloc 내부 개요](https://sourceware.org/glibc/wiki/MallocInternals)

관련: [가상 메모리·페이징](virtual-memory.md) · [운영체제·커널·시스템 콜](kernel-system-calls.md) · [메모리 안전성](../vulnerabilities/memory-safety.md) · [목차](index.md)
