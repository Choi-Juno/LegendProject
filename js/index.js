// JavaScript 코드 시작

// 모든 페이지 숨기기 함수
// 클래스 선택자와 정규 표현식을 사용하여 모든 페이지 요소를 선택한 후 hidden 클래스를 추가
function hideAllPages() {
  // div[id$="-page"] : id가 "-page"로 끝나는 모든 div 요소 선택
  // div[id^="easy-quiz-"] : id가 "easy-quiz-"로 시작하는 모든 div 요소 선택
  // 이런 방식으로 모든 페이지와 퀴즈 요소를 한 번에 선택
  const pages = document.querySelectorAll(
    'div[id$="-page"], div[id^="easy-quiz-"], div[id^="normal-quiz-"], div[id^="hard-quiz-"]'
  );
  pages.forEach((page) => {
    page.classList.add("hidden"); // 각 요소에 'hidden' 클래스 추가하여 화면에서 숨김
  });
}

// 홈 페이지 표시 함수
function showHomePage() {
  hideAllPages(); // 모든 페이지 숨기기
  document.getElementById("home-page").classList.remove("hidden"); // 홈 페이지만 표시

  // 모든 체크박스 초기화 (정답 확인 상태 리셋)
  const checkboxes = document.querySelectorAll(".check-box");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false; // 모든 체크박스의 체크 상태를 해제
  });
}

// 난이도 페이지 표시 함수
function showDifficultyPage(difficulty) {
  hideAllPages(); // 모든 페이지 숨기기
  document.getElementById(`${difficulty}-page`).classList.remove("hidden"); // 선택한 난이도의 소개 페이지만 표시
}

// 퀴즈 페이지 표시 함수
function showQuiz(difficulty, number) {
  hideAllPages(); // 모든 페이지 숨기기
  document
    .getElementById(`${difficulty}-quiz-${number}`)
    .classList.remove("hidden"); // 선택한 난이도와 번호의 퀴즈 페이지만 표시
}

// 종료 페이지 표시 함수
function showEndPage() {
  hideAllPages(); // 모든 페이지 숨기기
  document.getElementById("end-page").classList.remove("hidden"); // 종료 페이지만 표시
}

// 페이지 로드 시 초기화 함수
// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생
document.addEventListener("DOMContentLoaded", function () {
  showHomePage(); // 페이지 로드 시 홈 페이지 표시
});

// JavaScript 코드 끝
