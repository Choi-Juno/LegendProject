# 상식퀴즈 프로젝트 - 컴포넌트 구조 가이드

## 📚 소개

이 프로젝트는 HTML, CSS, JavaScript를 활용한 간단한 상식 퀴즈 웹 애플리케이션입니다. 코드는 **컴포넌트 기반 구조**로 설계되어 있어 유지보수와 확장이 용이합니다.

## 🧩 컴포넌트란?

컴포넌트는 웹 페이지의 독립적인 부분으로, 재사용 가능한 코드 블록입니다. 이 프로젝트에서는 각 기능별로 HTML 파일을 분리하여 컴포넌트화했습니다.

## 📁 프로젝트 구조

```
LegendTeam/
├── html/
│   ├── index.html          # 메인 HTML 파일
│   └── components/         # 컴포넌트 폴더
│       ├── header.html     # 헤더 컴포넌트
│       ├── home.html       # 홈 페이지 컴포넌트
│       ├── difficulty-intro.html  # 난이도 소개 페이지
│       ├── quiz-template.html     # 퀴즈 템플릿
│       ├── easy-quizzes.html      # 쉬움 난이도 퀴즈
│       ├── normal-quizzes.html    # 보통 난이도 퀴즈
│       ├── hard-quizzes.html      # 어려움 난이도 퀴즈
│       ├── end.html         # 종료 페이지
│       └── footer.html      # 푸터 컴포넌트
├── css/
│   └── index.css           # 스타일시트
└── js/
    ├── index.js            # 메인 자바스크립트
    └── component-loader.js # 컴포넌트 로딩 스크립트
```

## 🔄 컴포넌트 작동 방식

1. **메인 HTML (index.html)**:
   - 컴포넌트를 담을 컨테이너만 포함
   - 각 컨테이너는 해당 컴포넌트를 로드하는 역할

2. **컴포넌트 로더 (component-loader.js)**:
   - 페이지 로드 시 각 컴포넌트 파일을 불러옴
   - Fetch API를 사용하여 HTML 파일을 비동기적으로 로드

3. **메인 로직 (index.js)**:
   - 페이지 전환 및 퀴즈 기능 구현
   - 컴포넌트 로드 후 초기화 함수 실행

## 🛠️ 컴포넌트 수정 방법

### 1. 컴포넌트 내용 수정하기

특정 페이지나 기능을 수정하려면 해당 컴포넌트 파일만 수정하면 됩니다.

**예시: 홈 페이지 제목 변경**
```html
<!-- html/components/home.html -->
<div id="home-page">
  <div class="mainbox">
    <h1>새로운 제목으로 변경!</h1>
    <!-- 나머지 내용 -->
  </div>
</div>
```

### 2. 새 컴포넌트 추가하기

1. `html/components/` 폴더에 새 HTML 파일 생성
2. `index.html`에 컨테이너 추가
3. `component-loader.js`에 로딩 코드 추가

**예시: 도움말 페이지 추가**
```html
<!-- html/components/help.html -->
<div id="help-page" class="hidden">
  <div class="mainbox">
    <h1>도움말</h1>
    <p>퀴즈 사용 방법에 대한 설명...</p>
    <button class="btn" onclick="showHomePage()">홈으로</button>
  </div>
</div>
```

```html
<!-- index.html에 컨테이너 추가 -->
<div id="help-container"></div>
```

```javascript
// component-loader.js에 로딩 코드 추가
const helpContainer = document.getElementById("help-container");
// ...
loadComponent(helpContainer, "./components/help.html")
```

### 3. 페이지 전환 기능 추가하기

`index.js`에 새 함수를 추가하여 페이지 전환 기능을 구현할 수 있습니다.

```javascript
// 도움말 페이지 표시 함수
function showHelpPage() {
  hideAllPages(); // 모든 페이지 숨기기
  document.getElementById("help-page").classList.remove("hidden"); // 도움말 페이지만 표시
}
```

## 🎯 퀴즈 추가 방법

새로운 퀴즈를 추가하려면 해당 난이도의 퀴즈 컴포넌트 파일을 수정합니다.

**예시: 쉬움 난이도에 퀴즈 추가**
```html
<!-- html/components/easy-quizzes.html에 추가 -->
<div id="easy-quiz-6" class="hidden">
  <div class="quiz-box">
    <div>
      <p>6. 새로운 퀴즈 질문?</p>
    </div>
    <div class="answer-section">
      <input type="checkbox" id="show-easy-6" class="check-box" />
      <label for="show-easy-6" class="ckbtn">정답 확인</label>
      <div class="answer">
        <p>정답: 새 정답</p>
        <button class="nxtbtn" onclick="showQuiz('easy', 7)">다음 문제</button>
      </div>
    </div>
  </div>
</div>
```

## 💡 컴포넌트 구조의 장점

1. **모듈화**: 각 기능이 독립적인 파일로 분리되어 유지보수가 용이
2. **재사용성**: 동일한 컴포넌트를 여러 곳에서 재사용 가능
3. **가독성**: 코드가 기능별로 분리되어 이해하기 쉬움
4. **협업**: 팀원들이 서로 다른 컴포넌트를 동시에 작업 가능
5. **확장성**: 새로운 기능이나 페이지를 쉽게 추가 가능

## 🚀 시작하기

1. 프로젝트를 웹 서버에 업로드하거나 로컬 서버를 실행
2. 브라우저에서 `index.html` 파일 열기
3. 퀴즈 난이도 선택 후 문제 풀기 시작!

## ⚠️ 주의사항

- 컴포넌트 로더는 보안상의 이유로 로컬 파일 시스템(`file://`)에서는 작동하지 않을 수 있습니다. 웹 서버(로컬 개발 서버 포함)에서 실행해주세요.
- 모든 컴포넌트 파일은 `html/components/` 폴더에 위치해야 합니다.
- 컴포넌트 ID는 고유해야 하며, CSS 선택자와 JavaScript 코드에서 참조됩니다.

## 📝 추가 개발 아이디어

- 점수 시스템 추가하기
- 타이머 기능 추가하기
- 다양한 테마 지원하기
- 사용자 프로필 및 점수 저장 기능
- 더 많은 난이도와 카테고리 추가하기

---

이 프로젝트는 HTML, CSS, JavaScript 학습을 위한 예제입니다. 자유롭게 수정하고 확장하여 사용해보세요!
