// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  // URL에서 난이도 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get("level") || "easy"; // 기본값은 easy

  // 컨테이너에 난이도 클래스 추가
  const container = document.getElementById("result-container");
  container.classList.add(`${level}-bg`);

  // 점수 가져오기
  const scoreData = JSON.parse(
    localStorage.getItem(`${level}_score`) ||
      '{"correct":0,"wrong":0,"answers":[0,0,0,0,0]}'
  );

  // 결과 표시
  const correctCount = scoreData.correct;
  const wrongCount = scoreData.wrong;
  const totalAnswered = correctCount + wrongCount;
  const scorePercentage =
    totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  document.getElementById("correct-count").textContent = correctCount;
  document.getElementById("wrong-count").textContent = wrongCount;
  document.getElementById(
    "score-percentage"
  ).textContent = `${scorePercentage}%`;

  // 문제별 정답/오답 표시기 생성
  const indicatorsContainer = document.getElementById("question-indicators");
  scoreData.answers.forEach((result, index) => {
    const indicator = document.createElement("div");
    indicator.className = "question-indicator";

    // 0.2초 간격으로 애니메이션 적용
    setTimeout(() => {
      if (result === 1) {
        // 정답
        indicator.classList.add("correct");
      } else if (result === 2) {
        // 오답
        indicator.classList.add("wrong");
      }
    }, index * 200);

    indicatorsContainer.appendChild(indicator);
  });

  // 난이도별 메시지 설정
  const levelMessage = document.getElementById("level-message");
  switch (level) {
    case "easy":
      levelMessage.textContent =
        "쉬운 난이도를 완료했습니다! 다음엔 더 높은 난이도에 도전해보세요!";
      break;
    case "normal":
      levelMessage.textContent =
        "보통 난이도를 완료했습니다! 당신의 상식 수준은 꽤 괜찮네요!";
      break;
    case "hard":
      levelMessage.textContent =
        "어려운 난이도를 완료했습니다! 당신은 상식왕입니다!";
      break;
    default:
      levelMessage.textContent =
        "퀴즈를 모두 완료했습니다. 당신의 상식수준에 만족하시나요?";
  }

  // 축하 효과 생성
  if (scorePercentage >= 60) {
    // 60% 이상이면 축하 효과
    createConfetti();
  }

  // 홈으로 버튼에 점수 초기화 기능 추가
  const homeButton = document.getElementById("home-btn");
  homeButton.addEventListener("click", function (e) {
    // 현재 난이도의 점수 초기화
    localStorage.removeItem(`${level}_score`);

    // 다른 난이도의 점수도 초기화하고 싶다면 아래 주석을 해제
    // localStorage.removeItem("easy_score");
    // localStorage.removeItem("normal_score");
    // localStorage.removeItem("hard_score");

    // 기본 링크 동작은 그대로 유지 (홈으로 이동)
  });
});

// 축하 효과 함수
function createConfetti() {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];

  // 50개의 색종이 조각 생성
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 10 + 5 + "px";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s";

      document.body.appendChild(confetti);

      // 애니메이션 종료 후 제거
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }, Math.random() * 3000); // 0~3초 사이에 랜덤하게 생성
  }
}
