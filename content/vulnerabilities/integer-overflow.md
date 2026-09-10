# 정수 오버플로: 산술이 범위를 벗어날 때

> **TL;DR**
>
> 고정 폭 정수는 표현 범위를 넘으면 감싸거나(wrap) 정의되지 않은 동작을 합니다. 크기·길이·인덱스 계산에서 오버플로가 나면 너무 작은 버퍼를 할당하거나 검사를 통과시켜, 메모리 훼손과 로직 붕괴로 이어집니다.

AI 작성 해설 · 소유자 검토 전 · 출처 확인: 2026-09-10

## 발생 원리와 영향

C/C++·Go·Java 등의 정수는 폭이 고정입니다(예: 32비트). 부호 없는 정수는 최대치를 넘으면 0으로 감싸고, C의 부호 있는 오버플로는 **정의되지 않은 동작**입니다. 공격자가 통제하는 값이 곱셈·덧셈에 쓰이면 결과가 예상과 크게 달라집니다. 특히 "크기 검사 → 할당 → 복사" 패턴에서 위험합니다. 이는 [메모리 안전성](memory-safety.md)·[OOB 읽기·쓰기](out-of-bounds.md)의 흔한 선행 원인입니다.

```c
// 취약: count * size가 32비트에서 감싸면 아주 작은 값이 된다
void *make_array(uint32_t count, uint32_t size) {
    uint32_t bytes = count * size;      // 예: 0x10000 * 0x10000 = 0 (wrap)
    char *buf = malloc(bytes);          // 0바이트(또는 아주 작게) 할당
    for (uint32_t i = 0; i < count; i++)
        memcpy(buf + i * size, /*...*/, size);  // 힙 경계 밖으로 쓰기 → OOB write
    return buf;
}
```

검사 자체도 무력화됩니다. `if (len + header < buffer_size)`에서 `len + header`가 감싸 작은 값이 되면 검사를 통과한 뒤 실제로는 큰 데이터를 복사합니다.

## 예방과 수정

```c
#include <stdint.h>
// 1) 오버플로를 검사하는 곱셈 (계산 전에 감지)
if (size != 0 && count > SIZE_MAX / size) { /* 거부 */ }
size_t bytes = count * size;

// 2) 컴파일러 내장 함수로 오버플로 검출
size_t bytes2;
if (__builtin_mul_overflow(count, size, &bytes2)) { /* 거부 */ }

// 3) 안전한 할당 API (오버플로를 대신 검사)
char *buf = calloc(count, size);   // count*size 오버플로 시 실패 반환
```

- 뺄셈에서는 **부호 없는 언더플로**를 조심합니다(`a - b`에서 `b>a`면 거대한 값).
- 길이·인덱스는 넉넉한 폭(`size_t`)으로 다루고, 외부 입력의 범위를 먼저 검증합니다.
- 신호가 필요하면 UBSan(`-fsanitize=integer`)으로 테스트에서 오버플로를 잡습니다.
- 메모리 안전 언어라도 논리 오버플로(감싸 계산)는 금액·수량 로직을 깨뜨릴 수 있으니 검사합니다.

## 가상 사례로 이해하기

가상 이미지 디코더가 헤더의 `width * height * channels`로 버퍼를 잡는다고 합시다. 공격자가 값을 키워 곱을 감싸게 하면, 작은 버퍼가 할당되고 픽셀 복사가 경계를 넘어 힙을 덮어씁니다.

## 수정 후 확인할 조건

극단값(0, 최대치, 최대치 근처)을 넣었을 때 계산이 거부되거나 안전하게 처리되는지, 정상 크기는 그대로 동작하는지 확인합니다. 곱셈·덧셈 전에 범위 검사가 있는지 봅니다.

## 자주 하는 오해

"입력을 검사했으니 안전하다"는 검사식 자체가 오버플로로 무너질 수 있습니다. 검사에 쓰는 산술도 오버플로 안전해야 합니다.

## 확인 질문

크기·길이 계산에 외부 입력이 들어가나요? 그 곱셈·덧셈이 감쌀 수 있고, 감싼 결과가 할당·복사·검사에 그대로 쓰이나요?

## 참고 자료와 연결

[CWE-190: Integer Overflow or Wraparound](https://cwe.mitre.org/data/definitions/190.html) · [SEI CERT INT30-C](https://wiki.sei.cmu.edu/confluence/display/c/INT30-C.+Ensure+that+unsigned+integer+operations+do+not+wrap)

관련: [메모리 안전성](memory-safety.md) · [OOB 읽기·쓰기](out-of-bounds.md) · [학습 가이드](index.md) · [용어집](glossary.md)
