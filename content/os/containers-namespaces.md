# 컨테이너: 네임스페이스와 cgroups

> **TL;DR**
>
> 컨테이너는 별도의 커널이 아니라, 리눅스 커널의 네임스페이스(무엇을 보는가)와 cgroups(얼마나 쓰는가)로 격리된 일반 프로세스입니다. 이 두 메커니즘을 알면 "컨테이너는 가벼운 VM"이라는 오해를 정확한 모델로 바꿀 수 있습니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 컨테이너 = 격리된 프로세스

VM은 하이퍼바이저 위에서 게스트 커널을 통째로 돌리지만, 컨테이너는 **호스트 커널을 공유**하는 프로세스입니다. 그래서 시작이 빠르고 오버헤드가 적은 대신, 커널이 격리 경계입니다. 프로세스 개념은 [프로세스·스레드·실행 상태](processes-threads.md)에서 다룹니다.

컨테이너를 만드는 재료는 세 가지입니다.

| 메커니즘 | 통제 대상 |
|---|---|
| 네임스페이스 | 프로세스가 무엇을 보는가 (PID, 마운트, 네트워크, 사용자 등) |
| cgroups | 프로세스가 자원을 얼마나 쓰는가 (CPU, 메모리, I/O) |
| capabilities·seccomp | 프로세스가 커널에 무엇을 요청할 수 있는가 |

## 네임스페이스: 격리된 시야

네임스페이스는 커널 자원의 뷰를 분리합니다. PID 네임스페이스 안의 프로세스는 자기 그룹만 보고, 그 안에서 자신이 PID 1처럼 보입니다. 종류에는 pid, mnt(마운트), net(네트워크 스택), uts(호스트명), ipc, user, cgroup 등이 있습니다.

```bash
# unshare로 네임스페이스를 직접 만들어 본다 (root 또는 user namespace 필요)
# 새 PID + 마운트 네임스페이스에서 셸 실행
sudo unshare --pid --mount --fork --mount-proc bash
#   이 셸 안에서:
ps aux        # 호스트 프로세스가 아니라 이 네임스페이스의 프로세스만 보인다
echo $$       # 1  (자신이 PID 1로 보인다)
```

user 네임스페이스는 컨테이너 안의 root(uid 0)를 호스트의 비특권 사용자로 매핑해, root로 도는 프로세스가 호스트 root가 아니게 만드는 중요한 방어입니다.

## cgroups: 자원 상한

cgroups(control groups)는 프로세스 그룹의 CPU·메모리·I/O 사용을 제한하고 측정합니다. 메모리 상한을 넘으면 OOM 킬러가 그 그룹의 프로세스를 종료합니다. 이는 가상 메모리·페이지 관리와 함께 이해합니다. [가상 메모리·페이징·페이지 폴트](virtual-memory.md)

```bash
# cgroup v2에서 메모리 상한 100MB 부여 (개념 예시)
mkdir /sys/fs/cgroup/demo
echo $((100 * 1024 * 1024)) > /sys/fs/cgroup/demo/memory.max
echo $$ > /sys/fs/cgroup/demo/cgroup.procs   # 현재 셸을 이 그룹에 넣는다
# 이제 이 셸의 자식들은 합쳐서 100MB를 넘을 수 없다
```

## 파일시스템: 오버레이

컨테이너 이미지는 읽기 전용 레이어를 쌓고, 그 위에 쓰기 가능한 얇은 레이어를 얹는 오버레이 파일시스템으로 구성됩니다. 마운트 네임스페이스가 이 루트를 컨테이너에 보여 줍니다. 파일 디스크립터·마운트 개념은 [파일시스템·경로·파일 디스크립터](filesystems.md)와 이어집니다.

## 보안 관점

컨테이너 격리는 커널 표면 축소가 핵심입니다. capability 제거, seccomp 프로파일, 비-root 실행, user 네임스페이스가 함께 작동해야 합니다. 운영·쿠버네티스 관점의 하드닝은 보안 주제의 [컨테이너·쿠버네티스 보안](../security/container-security.md)에서 다룹니다.

## 확인 질문

컨테이너 안에서 `ps`로 호스트 프로세스가 보인다면 무엇이 잘못된 걸까요? 컨테이너의 root와 호스트의 root는 언제 같아지나요?

## 참고 자료와 연결

[man 7 namespaces](https://man7.org/linux/man-pages/man7/namespaces.7.html) · [man 7 cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)

관련: [프로세스·스레드·실행 상태](processes-threads.md) · [가상 메모리·페이징](virtual-memory.md) · [파일시스템·경로·파일 디스크립터](filesystems.md) · [목차](index.md)
