# 문자열 매칭

> **TL;DR**
>
> 텍스트에서 패턴을 찾을 때 순진한 방법은 O(nm)이지만, KMP는 실패 시 이미 비교한 정보를 재사용해 O(n+m)에 찾습니다. 라빈-카프는 롤링 해시로, 트라이는 다수 패턴 검색에 유리합니다.

AI 작성 해설

## 순진한 매칭의 한계

길이 n 텍스트에서 길이 m 패턴을 찾을 때, 매 위치마다 처음부터 비교하면 최악 O(nm)입니다. 반복되는 접두사가 많은 패턴에서 특히 비효율적입니다. 복잡도 개념은 [알고리즘과 Big-O](algorithms-complexity.md)와 이어집니다.

```python
def naive_search(text, pattern):
    n, m = len(text), len(pattern)
    for i in range(n - m + 1):
        if text[i:i+m] == pattern:   # 매 위치에서 최대 m번 비교
            return i
    return -1
```

## KMP: 실패 정보를 재사용

KMP는 불일치가 났을 때 패턴을 1칸씩 미는 대신, 미리 계산한 "부분 일치 표(실패 함수)"로 얼마나 건너뛸지 정합니다. 텍스트 포인터는 절대 되돌아가지 않아 O(n+m)입니다.

```python
def kmp_failure(pattern):
    f = [0] * len(pattern)
    k = 0
    for i in range(1, len(pattern)):
        while k and pattern[i] != pattern[k]:
            k = f[k-1]               # 접두사=접미사 길이로 되돌림
        if pattern[i] == pattern[k]:
            k += 1
        f[i] = k
    return f                          # f[i] = 접두사이자 접미사인 최대 길이
```

이 표 덕분에 이미 일치한 접두사를 다시 비교하지 않습니다. 이는 [오토마타](../cs/automata-regex.md)로 패턴을 상태 기계로 본 것과 같은 아이디어입니다.

## 라빈-카프와 트라이

- **라빈-카프**: 패턴과 텍스트 창의 해시를 비교하고, 창을 옮길 때 롤링 해시로 O(1)에 갱신합니다. 해시가 같을 때만 실제 비교합니다. 여러 패턴을 동시에 찾을 때 유용합니다. 해싱은 [해시 테이블](hash-tables.md)과 이어집니다.
- **트라이(trie)**: 여러 패턴을 공통 접두사로 묶은 트리로, 사전·자동완성·다중 패턴 검색(아호-코라식)에 씁니다. 트리 구조는 [트리와 이진 탐색 트리](trees-and-bst.md)와 이어집니다.

## 무엇을 쓸까

| 상황 | 선택 |
|---|---|
| 단일 패턴, 최악 보장 | KMP |
| 다중 패턴·부분 문자열 다수 | 라빈-카프, 아호-코라식 |
| 접두사 검색·자동완성 | 트라이 |
| 복잡한 패턴(문자 클래스 등) | 정규식([오토마타](../cs/automata-regex.md)) |

## 확인 질문

찾을 패턴이 하나인가요, 여럿인가요? 최악의 경우 실행 시간을 보장해야 하나요? 접두사 기반 검색·자동완성이 필요하지는 않나요?

## 참고 자료와 연결

[KMP algorithm (개요)](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm)

관련: [알고리즘과 Big-O](algorithms-complexity.md) · [해시 테이블](hash-tables.md) · [트리와 이진 탐색 트리](trees-and-bst.md) · [정규 표현식과 오토마타](../cs/automata-regex.md) · [목차](index.md) · [용어집](glossary.md)
