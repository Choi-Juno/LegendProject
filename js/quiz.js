// 점수 초기화 함수
function initializeScore(level) {
  // 난이도별 점수 저장소 초기화
  if (!localStorage.getItem(`${level}_score`)) {
    localStorage.setItem(
      `${level}_score`,
      JSON.stringify({
        correct: 0,
        wrong: 0,
        answers: [0, 0, 0, 0, 0], // 0: 미응답, 1: 정답, 2: 오답
      })
    );
  }
}

// 퀴즈 데이터를 가져오는 함수
async function fetchQuizData() {
  try {
    const response = await fetch("../JSON/quizList.json");
    if (!response.ok) {
      throw new Error("퀴즈 데이터를 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    alert("퀴즈 데이터를 불러오는데 실패했습니다.");
    window.location.href = "index.html";
    return null;
  }
}

// 점수 업데이트 함수
function updateScore(level, questionIndex, isCorrect) {
  const scoreData = JSON.parse(localStorage.getItem(`${level}_score`));
  if (isCorrect) {
    scoreData.correct += 1;
    scoreData.answers[questionIndex] = 1; // 정답
  } else {
    scoreData.wrong += 1;
    scoreData.answers[questionIndex] = 2; // 오답
  }
  localStorage.setItem(`${level}_score`, JSON.stringify(scoreData));
}

// 진행 바 업데이트 함수
function updateProgressBar(questionNum) {
  const progressPercent = ((questionNum - 1) / 5) * 100;
  document.getElementById("progress-bar").style.width = progressPercent + "%";
  document.getElementById("current-question").textContent = questionNum;
}

// 애니메이션 종료 후 처리 함수
function handleAnimationEnd(event) {
  // 애니메이션 클래스 유지 (클래스 제거 안함)
  // 마지막 프레임 상태 유지
  this.removeEventListener("animationend", handleAnimationEnd);
}

// 정답 확인 함수
function checkAnswer(level, questionIndex, quizData) {
  const userAnswer = document.getElementById("quiz-answer").value.trim();
  const correctAnswer = quizData[level][questionIndex].answer;
  const answerFeedback = document.getElementById("quiz-answer-feedback");
  const quizBox = document.querySelector(".quiz-box");

  // 이미 답변했는지 확인
  const resultElement = document.getElementById("quiz-answer-result");
  if (getComputedStyle(resultElement).display !== "none") {
    return; // 이미 정답을 확인한 경우 함수 종료
  }

  // 정답 일치 여부 확인 (대소문자 무시)
  const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

  // 점수 업데이트
  updateScore(level, questionIndex, isCorrect);

  // 깜빡임 방지를 위해 이전 클래스 제거 및 이벤트 리스너 제거
  quizBox.classList.remove("correct-answer", "wrong-answer");
  quizBox.removeEventListener("animationend", handleAnimationEnd);

  // 피드백 메시지 설정
  if (isCorrect) {
    answerFeedback.textContent = "정답입니다!";
    answerFeedback.style.color = "#2196F3"; // 파란색
    quizBox.classList.add("correct-answer");
  } else {
    answerFeedback.textContent = `오답입니다. 정답은 '${correctAnswer}'입니다.`;
    answerFeedback.style.color = "#f44336"; // 빨간색
    quizBox.classList.add("wrong-answer");
  }

  // animationend 이벤트로 애니메이션 끝난 후 클래스 제거 (깜빡임 방지)
  quizBox.addEventListener("animationend", handleAnimationEnd);

  // 결과 표시
  const container = document.getElementById("quiz-container");
  container.classList.add("show-result");
}

// 페이지 로드 시 실행 - 단일 이벤트 핸들러로 통합
document.addEventListener("DOMContentLoaded", async function () {
  // 퀴즈 데이터 가져오기
  const quizData = await fetchQuizData();
  if (!quizData) return;

  // URL에서 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get("level") || "easy"; // 기본값은 easy
  const questionNum = parseInt(urlParams.get("question") || "1"); // 기본값은 1

  // 점수 초기화
  initializeScore(level);

  // 배경색 설정
  const container = document.getElementById("quiz-container");
  container.classList.add(`${level}-bg`);

  // 진행 바 업데이트
  updateProgressBar(questionNum);

  // 문제 인덱스 (0부터 시작)
  const questionIndex = questionNum - 1;

  // 문제가 범위를 벗어나면 처리
  if (questionIndex < 0 || questionIndex >= quizData[level].length) {
    alert("존재하지 않는 문제입니다.");
    window.location.href = "index.html";
    return;
  }

  // 페이지 제목 업데이트
  document.title = `${level} 난이도 - 문제 ${questionNum} - 상식 퀴즈`;

  // 문제 내용 표시
  const questionElement = document.getElementById("quiz-question");
  questionElement.textContent = quizData[level][questionIndex].question;

  // 다음 문제 링크 설정
  const nextBtn = document.getElementById("quiz-answer-next");
  if (questionIndex < 4) {
    // 마지막 문제가 아니면 다음 문제로
    nextBtn.href = `quiz.html?level=${level}&question=${questionNum + 1}`;
  } else {
    // 마지막 문제면 결과 페이지로
    nextBtn.innerHTML = "결과 보기";
    nextBtn.href = "result.html?level=" + level;
  }

  // 정답 확인 버튼 이벤트
  const answerButton = document.getElementById("quiz-answer-button");
  answerButton.addEventListener("click", function () {
    checkAnswer(level, questionIndex, quizData);
  });

  // 입력 필드에 엔터키 이벤트
  const answerInput = document.getElementById("quiz-answer");
  answerInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkAnswer(level, questionIndex, quizData);
    }
  });

  // 포커스 설정
  setTimeout(() => answerInput.focus(), 100);
});
