# 상식퀴즈 프로젝트 - 페이지 기반 구조 가이드

## 📚 소개

이 프로젝트는 HTML, CSS, JavaScript를 활용한 간단한 상식 퀴즈 웹 애플리케이션입니다. 코드는 **페이지 기반 구조**로 설계되어 있어 이해하기 쉽고 확장이 용이합니다.

## 🔄 컴포넌트에서 페이지 기반으로 변경

이 프로젝트는 초기에 컴포넌트 기반으로 설계되었으나, 더 나은 사용자 경험과 직관적인
이해를 위해 페이지 기반 구조로 변경되었습니다. 각 화면(홈, 난이도 소개, 퀴즈, 결과)이
별도의 HTML 파일로 분리되어 있어, 더 전통적인 웹 사이트의 형태를 갖추게 되었습니다.

## 📁 프로젝트 구조

```
LegendTeam/
├── html/
│   ├── index.html        # 홈페이지
│   ├── difficulty.html   # 난이도 소개 페이지
│   ├── quiz.html         # 퀴즈 페이지
│   └── result.html       # 결과 페이지
├── css/
│   └── index.css         # 스타일시트
├── js/
│   ├── index.js          # 초기 페이지 스크립트
│   ├── difficulty.js     # 난이도 페이지 스크립트
│   ├── quiz.js           # 퀴즈 페이지 스크립트
│   └── result.js         # 결과 페이지 스크립트
└── JSON/
    └── quizList.json     # 퀴즈 데이터 파일
```

## 📝 페이지별 기능 설명

### 1. 홈페이지 (index.html)
- 퀴즈 소개 및 난이도 선택 기능 제공
- 세 가지 난이도(쉬움, 보통, 어려움) 선택 가능
- URL 매개변수를 통해 난이도 전달

### 2. 난이도 소개 페이지 (difficulty.html)
- 선택한 난이도에 대한 정보 표시
- URL 매개변수(`level`)를 통해 선택된 난이도 확인 
- 퀴즈 시작 및 홈으로 돌아가기 버튼 제공

### 3. 퀴즈 페이지 (quiz.html)
- 난이도별 퀴즈 문제 표시 (JSON 파일에서 로드)
- URL 매개변수(`level`, `question`)를 통해 난이도 및 문제 번호 관리
- 사용자 답변 입력 및 정답 확인 기능
- 애니메이션 효과로 정답/오답 시각적 피드백 제공
- 진행 상황 표시 (진행 바, 문제 번호)
- localStorage를 활용한 점수 관리

### 4. 결과 페이지 (result.html)
- 퀴즈 완료 후 결과 표시
- 정답/오답 개수 및 정답률 시각화
- 각 문제별 정답 여부 표시
- 애니메이션 효과 (60% 이상 득점 시 축하 효과)
- 홈으로 돌아가기 옵션 (localStorage 점수 초기화)

## 🛠️ 주요 기능 수정 방법

### 1. 퀴즈 문제 추가/수정

퀴즈 문제는 `JSON/quizList.json` 파일에서 관리됩니다. 이 파일을 수정하여 문제를 추가하거나 변경할 수 있습니다.

```json
{
  "easy": [
    {
      "question": "1. 새로운 문제?",
      "answer": "정답"
    },
    // 추가 문제...
  ]
}
```

### 2. 페이지 스타일 수정

각 페이지는 자체 스타일을 가지고 있습니다. HTML 파일 내의 `<style>` 태그를 수정하거나 외부 CSS 파일을 연결하여 스타일을 변경할 수 있습니다.

### 3. 점수 관리 시스템 수정

점수는 `localStorage`를 통해 관리됩니다. 점수 관리 방식을 수정하려면 `quiz.js`의 `initializeScore` 및 `updateScore` 함수를 수정하세요.

```javascript
// 점수 초기화 함수
function initializeScore(level) {
  // 난이도별 점수 저장소 초기화
  if (!localStorage.getItem(`${level}_score`)) {
    localStorage.setItem(`${level}_score`, JSON.stringify({
      correct: 0,
      wrong: 0,
      answers: [0, 0, 0, 0, 0] // 0: 미응답, 1: 정답, 2: 오답
    }));
  }
}
```

### 4. 애니메이션 효과 수정

애니메이션 효과는 CSS와 JavaScript를 통해 구현됩니다. 정답/오답 애니메이션을 수정하려면 CSS의 애니메이션 정의와 관련 JavaScript 로직을 수정하세요.

```css
.correct-answer {
  animation: correctPulse 0.5s forwards;
}

@keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); background-color: rgba(33, 150, 243, 0.1); }
  100% { transform: scale(1); background-color: white; }
}
```

## 🔄 URL 매개변수 활용

이 프로젝트는 URL 매개변수를 통해 페이지 간 데이터를 전달합니다:

1. **난이도 페이지**: `difficulty.html?level=easy`
2. **퀴즈 페이지**: `quiz.html?level=normal&question=2`
3. **결과 페이지**: `result.html?level=hard`

이 구조를 통해 페이지 새로고침 후에도 상태가 유지되며, 북마크나 공유가 가능합니다.

## 💾 데이터 관리

### JSON 데이터 관리

퀴즈 데이터는 `JSON/quizList.json` 파일에 저장되어 있습니다. 데이터를 비동기적으로 로드하여 사용합니다:

```javascript
async function fetchQuizData() {
  try {
    const response = await fetch('../JSON/quizList.json');
    if (!response.ok) {
      throw new Error('퀴즈 데이터를 불러오는데 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    alert('퀴즈 데이터를 불러오는데 실패했습니다.');
    window.location.href = 'index.html';
    return null;
  }
}
```

### localStorage를 활용한 점수 관리

사용자의 퀴즈 결과는 `localStorage`에 저장되어 세션 간에도 유지됩니다:

- 각 난이도별 별도의 저장소 (`easy_score`, `normal_score`, `hard_score`)
- 정답/오답 개수 및 각 문제별 정답 여부 추적
- 결과 페이지에서 홈으로 이동 시 초기화 옵션 제공

## 🎮 애니메이션 및 시각적 효과

- 퀴즈 페이지에서 정답/오답 시 다른 애니메이션 효과
- 결과 페이지에서 점수에 따른 축하 효과 (60% 이상)
- 진행 바를 통한 진행 상황 시각화
- 문제별 정답/오답 표시기

## 🚀 시작하기

1. 프로젝트를 웹 서버에 업로드하거나 로컬 서버를 실행
2. 브라우저에서 `index.html` 파일 열기
3. 퀴즈 난이도 선택 후 문제 풀기 시작!

## ⚠️ 주의사항

- JSON 파일 로드를 위해 웹 서버(로컬 개발 서버 포함)에서 실행해야 합니다.
- 최신 브라우저에서만 정상적으로 작동합니다.
- 모바일 환경에서도 반응형으로 제작되었습니다.

## 📝 추가 개발 아이디어

- 타이머 기능 추가하기
- 다양한 테마 지원하기
- 사용자 프로필 및 점수 저장 기능 확장
- 더 많은 퀴즈 카테고리와 난이도 추가하기
- 소셜 미디어 공유 기능 추가

---

이 프로젝트는 HTML, CSS, JavaScript 학습을 위한 예제입니다. 자유롭게 수정하고 확장하여 사용해보세요!
