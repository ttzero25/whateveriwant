# 추천 시스템

> **TL;DR**
>
> 추천 시스템은 사용자와 항목의 상호작용에서 선호를 예측합니다. 협업 필터링은 "비슷한 사용자·항목"을, 콘텐츠 기반은 "항목의 특징"을 활용하며, 콜드 스타트와 편향·평가가 핵심 난제입니다.

AI 작성 해설

## 문제 정의

입력은 사용자×항목의 상호작용(평점·클릭·구매)이고, 출력은 아직 보지 않은 항목에 대한 선호 예측·순위입니다. 대부분의 행렬은 대부분 비어 있는 희소 데이터입니다. 예측·평가 기초는 [분류 모델 평가](evaluation.md)와 이어집니다.

## 두 가지 접근

| 방식 | 아이디어 | 약점 |
|---|---|---|
| 협업 필터링 | 비슷한 사용자/항목의 상호작용으로 예측 | 새 사용자·항목(콜드 스타트)에 약함 |
| 콘텐츠 기반 | 항목의 특징과 사용자 취향을 매칭 | 취향의 다양성·의외성이 낮음 |

실무는 둘을 섞고(하이브리드), 인기·최신성·맥락을 함께 씁니다.

## 이웃 기반 협업 필터링

가장 직관적인 방법은 유사한 사용자를 찾아 그들이 좋아한 항목을 추천하는 것입니다. 유사도는 상호작용 벡터의 코사인으로 잽니다.

```python
import numpy as np

# 행: 사용자, 열: 항목. 0은 미상호작용(희소)
R = np.array([
    [5, 4, 0, 0],
    [4, 5, 0, 1],
    [0, 0, 5, 4],
])

def cosine(a, b):
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return (a @ b) / denom if denom else 0.0

def recommend(user_idx, R, k=1):
    sims = [(other, cosine(R[user_idx], R[other]))
            for other in range(len(R)) if other != user_idx]
    sims.sort(key=lambda x: x[1], reverse=True)          # 유사한 사용자 순
    scores = np.zeros(R.shape[1])
    for other, sim in sims[:k]:
        scores += sim * R[other]                          # 유사도로 가중 합
    scores[R[user_idx] > 0] = -1                          # 이미 본 항목 제외
    return int(np.argmax(scores))

print("사용자 0에게 추천할 항목:", recommend(0, R))
```

## 행렬 분해

큰 희소 행렬은 사용자·항목을 각각 낮은 차원의 잠재 벡터로 분해해, 그 내적으로 선호를 예측합니다. 이는 [차원 축소와 PCA](dimensionality-reduction.md)와 같은 잠재 표현 아이디어이며, 잠재 요인이 "장르 선호" 같은 숨은 축을 담습니다. 관측된 평점에 맞도록 잠재 벡터를 학습합니다(정규화로 과적합 방지, [정규화](regularization.md)).

## 명시적 vs 암묵적 피드백

별점 같은 명시적 신호는 드물고, 클릭·체류처럼 암묵적 신호는 많지만 노이즈가 큽니다("클릭=선호"가 아님). 암묵적 데이터는 "본 것"과 "안 본 것"의 의미를 신중히 다뤄야 합니다.

## 어려운 점

- **콜드 스타트**: 새 사용자·항목은 이력이 없어 콘텐츠·인기로 보완합니다.
- **인기 편향·피드백 루프**: 인기 항목만 추천하면 그 편향이 강화됩니다.
- **평가**: 오프라인 지표(정밀도@k, 순위)와 실제 온라인 효과가 다를 수 있어 A/B 테스트가 필요합니다.

## 확인 질문

지금 신호가 명시적 선호인가요, 노이즈 있는 암묵 신호인가요? 새 사용자·항목에 대한 추천은 어떻게 시작하나요? 추천이 인기 편향을 스스로 강화하고 있지는 않나요?

## 참고 자료와 연결

[Koren et al., Matrix Factorization (2009)](https://ieeexplore.ieee.org/document/5197422)

관련: [차원 축소와 PCA](dimensionality-reduction.md) · [분류 모델 평가](evaluation.md) · [정규화](regularization.md) · [목차](index.md) · [용어집](glossary.md)
