# 운영체제·커널·시스템 콜

> **TL;DR**
>
> 운영체제는 CPU·메모리·파일·장치 사용을 관리합니다. 커널은 핵심 제어를 담당하며, 프로그램은 시스템 콜이라는 정해진 인터페이스로 커널 서비스를 요청합니다.

AI 작성 해설

## OS, 커널, 셸 구분하기

| 용어 | 역할 |
|---|---|
| Operating system | 실행 환경과 자원 관리 제공 |
| Kernel | 권한이 필요한 자원 관리와 핵심 서비스 수행 |
| Shell | 사용자의 명령을 해석하고 프로그램 실행 |
| System call | 프로그램이 커널 서비스를 요청하는 인터페이스 |
| User mode / Kernel mode | CPU가 실행 코드에 허용하는 권한 수준 구분 |

셸이나 바탕화면은 운영체제 전체가 아닙니다. 또한 관리자 계정으로 실행하는 것과 CPU가 커널 모드로 실행하는 것은 다른 구분입니다.

## 예시: 파일을 읽는 요청

프로그램이 라이브러리의 파일 읽기 함수를 호출하면, 필요한 경우 라이브러리가 시스템 콜로 커널에 요청합니다. 커널은 인자·접근 권한을 확인하고 파일 시스템이나 장치에 작업을 전달한 뒤 결과를 돌려줍니다. 이미 라이브러리 버퍼에 데이터가 있다면 호출마다 커널에 들어가지 않을 수도 있습니다.

## 모드 전환과 문맥 교환

시스템 콜로 실행 권한이 바뀌어도 같은 스레드의 실행을 이어갈 수 있습니다. 다른 실행 흐름으로 CPU를 넘기는 문맥 교환과 항상 일대일로 대응하지 않습니다. 세부 진입 방식은 CPU와 OS에 따라 다릅니다.

## 헷갈리기 쉬운 점

모든 라이브러리 함수가 시스템 콜은 아닙니다. Linux와 Windows는 공통 개념을 공유하지만 API와 내부 구조는 다릅니다. 아래 Linux 시스템 콜 문서와 Windows 모드 설명은 각 플랫폼의 예시로 읽으세요.

추가 출처: [Microsoft — User mode and kernel mode](https://learn.microsoft.com/en-us/windows-hardware/drivers/gettingstarted/user-mode-and-kernel-mode).

관련: [프로세스와 스레드](processes-threads.md) · [파일 시스템](filesystems.md) · [CS 컴퓨터 구조](../cs/computer-architecture.md)

공식 참고: [Linux man-pages · System calls](https://man7.org/linux/man-pages/man2/syscalls.2.html). 영어 보기는 이 자료의 관련 개념을 짧게 인용합니다.

[OS 학습 가이드](index.md)
