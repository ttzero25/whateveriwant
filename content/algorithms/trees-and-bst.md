# 트리와 이진 탐색 트리

> **TL;DR**
>
> 트리는 계층 구조를 표현하고, 이진 탐색 트리(BST)는 정렬 순서를 유지하며 탐색·삽입·삭제를 O(log n)에 처리합니다. 균형이 무너지면 O(n)이 되므로 자가 균형 트리가 필요합니다.

AI 작성 해설

## 트리 기본

트리는 부모-자식 관계로 이뤄진 비순환 계층 구조입니다. 파일 시스템, DOM, 파싱 트리, 인덱스 등에 쓰입니다. 자료구조 전반은 [자료구조](data-structures.md)에서 다룹니다. 이진 트리는 각 노드가 자식을 최대 둘 가집니다.

## 이진 탐색 트리(BST)

BST는 "왼쪽 < 노드 < 오른쪽" 불변식을 유지해, 값 비교로 탐색 경로를 절반씩 좁힙니다.

```python
class Node:
    def __init__(self, key):
        self.key = key
        self.left = self.right = None

def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)    # 작으면 왼쪽으로
    elif key > root.key:
        root.right = insert(root.right, key)  # 크면 오른쪽으로
    return root

def search(root, key):
    while root and root.key != key:
        root = root.left if key < root.key else root.right
    return root

def inorder(root, out):
    if root:
        inorder(root.left, out); out.append(root.key); inorder(root.right, out)
    return out                                # 중위 순회 = 정렬된 순서
```

중위 순회가 정렬 순서를 주므로, BST는 정렬 유지·범위 질의·정렬 순회에 강합니다.

## 균형이 성능을 가른다

정렬된 데이터를 순서대로 삽입하면 BST가 한쪽으로 치우쳐 사실상 연결 리스트(O(n))가 됩니다. 그래서 자가 균형 트리(AVL, 레드-블랙)가 회전으로 높이를 O(log n)으로 유지합니다. 대부분의 표준 라이브러리 정렬 맵/셋이 레드-블랙 트리 기반입니다.

| 구조 | 탐색 | 순서 질의 |
|---|---|---|
| 정렬 배열 | O(log n) 탐색, O(n) 삽입 | 가능 |
| 해시 테이블 | O(1) 평균 | 불가 |
| 균형 BST | O(log n) | 가능 |

## 디스크와 B-트리

메모리가 아닌 디스크(데이터베이스 인덱스)에서는 노드 하나에 많은 키를 담아 트리 높이를 낮춘 B-트리/B+트리를 씁니다. 이는 [트랜잭션·ACID·인덱스](../cs/transactions-indexes.md)와 이어집니다.

## 확인 질문

정렬 순서나 범위 질의가 필요한가요(그렇다면 트리)? 삽입 순서가 치우쳐 트리가 불균형해질 여지가 있나요? 데이터가 메모리인가요, 디스크인가요?

## 참고 자료와 연결

[Binary search tree (개요)](https://en.wikipedia.org/wiki/Binary_search_tree)

관련: [자료구조](data-structures.md) · [해시 테이블](hash-tables.md) · [힙과 우선순위 큐](heaps-priority-queues.md) · [트랜잭션·인덱스](../cs/transactions-indexes.md) · [목차](index.md) · [용어집](glossary.md)
