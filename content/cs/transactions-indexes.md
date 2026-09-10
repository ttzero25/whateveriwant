# 트랜잭션·ACID·인덱스

> **TL;DR**
>
> 트랜잭션은 여러 작업을 하나의 논리적 단위로 묶습니다. 인덱스는 조회 비용을 줄일 수 있는 추가 구조이지만 저장 공간과 쓰기 비용이 듭니다. 두 기능의 목적은 다릅니다.

AI 작성 해설

## ACID의 네 가지 관점

| 성질 | 의미 |
|---|---|
| Atomicity / 원자성 | 하나의 트랜잭션이 전부 반영되거나 취소됨 |
| Consistency / 일관성 | 정의된 제약과 불변식 유지 |
| Isolation / 격리성 | 동시 트랜잭션의 상호 영향 제어 |
| Durability / 지속성 | 커밋된 결과가 장애 이후에도 유지되도록 보장 |

## 예시: 두 값을 함께 갱신하기

재고를 하나 줄이고 주문을 추가하는 작업에서 한쪽만 반영되면 데이터가 어긋날 수 있습니다. 트랜잭션 안에서 묶고 성공 시 `COMMIT`, 실패 시 `ROLLBACK`으로 처리합니다. 실제 오류 처리와 제약 조건도 함께 설계해야 합니다.

출처: [PostgreSQL — Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html).

## 인덱스가 하는 일

테이블 전체를 확인하는 대신 필요한 행을 찾는 추가 경로를 제공합니다. 예를 들어 `user_id`로 반복 조회할 때 적절한 인덱스를 검토할 수 있습니다. B-tree와 hash 등 구조별로 지원하는 검색이 다릅니다.

출처: [PostgreSQL — Indexes: Introduction](https://www.postgresql.org/docs/current/indexes-intro.html).

인덱스가 많아지면 삽입·수정·삭제 시 함께 갱신해야 하고 공간도 차지합니다. 조건에 해당하는 행이 아주 많거나 테이블이 작으면 전체 스캔이 더 유리할 수도 있습니다. 실행 계획을 확인해 실제 사용 여부를 검증합니다.

## 헷갈리기 쉬운 점

격리 수준에 따라 관찰 가능한 동시성 현상이 달라집니다. ACID의 일관성이 애플리케이션의 모든 의미적 오류를 자동으로 고친다는 뜻은 아닙니다. 또한 DB 커밋과 외부 이메일 발송 같은 부수 효과는 기본적으로 하나의 원자적 작업이 아닙니다.

관련: [데이터베이스](databases.md) · [동시성](concurrency.md) · [복잡도](../algorithms/algorithms-complexity.md) · [목차](index.md)
