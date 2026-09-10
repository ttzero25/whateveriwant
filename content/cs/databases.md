# 관계형 데이터베이스와 SQL

> **TL;DR**
>
> 관계형 데이터베이스는 테이블의 행과 열로 데이터를 모델링하고 제약 조건으로 관계를 관리합니다. SQL은 원하는 결과를 기술하며 실제 실행 방법은 실행 계획에 따라 달라집니다.

AI 작성 해설

## 기본 구성

| 용어 | 의미 |
|---|---|
| Table | 일정한 열 구조를 가진 행 집합 |
| Row | 하나의 레코드 |
| Column | 이름과 자료형을 가진 속성 |
| Primary key | 행을 고유하게 식별하는 키 |
| Foreign key | 다른 행과의 참조 관계를 제약 |
| Schema | 테이블과 관계 등 데이터 구조의 정의 또는 DB 내 이름 공간 |

출처: [PostgreSQL — Concepts](https://www.postgresql.org/docs/current/tutorial-concepts.html).

## 예시: 사용자와 주문

`users(id, name)`과 `orders(id, user_id, total)`을 두면 주문의 `user_id`로 사용자를 연결할 수 있습니다. 같은 사용자 이름을 모든 주문에 복사하는 대신 식별자로 관계를 표현합니다.

```sql
SELECT users.name, orders.total
FROM users
JOIN orders ON orders.user_id = users.id
WHERE orders.total >= 100
ORDER BY orders.total DESC;
```

이 쿼리는 가상의 스키마 예시입니다. 조건에 맞는 주문과 사용자를 연결하고 금액 순서로 결과를 보여줍니다.

## NULL과 순서

NULL은 일반적인 숫자 0이나 빈 문자열과 다릅니다. NULL 여부는 `IS NULL`로 확인하며 비교에 미지의 결과가 생길 수 있습니다. `ORDER BY`가 없다면 결과 행의 순서를 가정해서는 안 됩니다.

## 데이터 정규화와 성능

데이터 정규화는 중복과 갱신 이상을 줄이기 위한 설계 원칙입니다. 머신러닝의 regularization과는 다른 개념입니다. 조인을 줄이기 위해 중복 데이터를 두기도 하지만 일관성 관리 비용이 생깁니다. 최적화는 실제 질의와 실행 계획으로 검증하세요.

관련: [트랜잭션과 인덱스](transactions-indexes.md) · [자료구조](../algorithms/data-structures.md) · [목차](index.md)
