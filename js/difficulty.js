// 페이지 로드 시 URL에서 난이도 매개변수 읽기
document.addEventListener("DOMContentLoaded", function () {
  // URL에서 난이도 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get("level") || "easy"; // 기본값은 'easy'

  // 페이지 제목 설정
  const titleMap = {
    easy: "쉬움 난이도",
    normal: "보통 난이도",
    hard: "어려움 난이도",
  };

  document.getElementById("difficulty-title").textContent =
    titleMap[level] || "난이도 소개";

  // 배경색 설정
  const container = document.getElementById("difficulty-container");
  container.classList.add(`${level}-bg`);

  // 시작 버튼 링크 설정
  const startBtn = document.getElementById("start-btn");
  startBtn.href = `quiz.html?level=${level}&question=1`;
});
