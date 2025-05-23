// 현재 퀴즈 상태 관리 변수
let currentDifficulty = "";
let currentQuestionIndex = 0;

// 컨테이너와 내부 요소들 참조 캐싱 - 페이지 로드 후 사용
let quizTemplateContainer = null;
let quizTemplate = null;

// DOM 요소들 초기화 (페이지 로드 후 실행)
function initDOMReferences() {
  // 컨테이너들
  quizTemplateContainer = document.getElementById("quiz-template-container");

  // 템플릿 내부 요소들
  if (quizTemplateContainer) {
    quizTemplate = quizTemplateContainer.querySelector("#quiz-template");
  }
}

// 모든 페이지 숨기기 함수
function hideAllPages() {
  // 모든 페이지 숨기기 (id가 "-page"로 끝나는 모든 div)
  const allPages = document.querySelectorAll('div[id$="-page"]');
  allPages.forEach((page) => {
    page.classList.add("hidden");
  });

  // 퀴즈 템플릿 숨기기
  if (quizTemplate) {
    quizTemplate.classList.add("hidden");
  } else {
    // DOM에서 직접 찾아서 숨기기 (백업 방법)
    const quizTemplateElement = document.getElementById("quiz-template");
    if (quizTemplateElement) {
      quizTemplateElement.classList.add("hidden");
    }
  }

  // 모든 컴포넌트 컨테이너의 내부 요소들 숨기기
  const containers = [
    "home-container",
    "difficulty-container",
    "quiz-template-container",
    "end-container",
  ];

  containers.forEach((containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      const visibleElements = container.querySelectorAll("div:not(.hidden)");
      visibleElements.forEach((element) => {
        if (element.id && element.id !== "home-page") {
          element.classList.add("hidden");
        }
      });
    }
  });
}

// 홈 페이지 표시 함수
function showHomePage() {
  hideAllPages(); // 모든 페이지 숨기기
  const homePage = document.getElementById("home-page");
  if (homePage) {
    homePage.classList.remove("hidden"); // 홈 페이지만 표시
  }

  // 퀴즈 상태 초기화
  currentDifficulty = "";
  currentQuestionIndex = 0;
}

// 난이도 페이지 표시 함수
function showDifficultyPage(difficulty) {
  hideAllPages(); // 모든 페이지 숨기기
  const difficultyPage = document.getElementById(`${difficulty}-page`);
  if (difficultyPage) {
    difficultyPage.classList.remove("hidden"); // 선택한 난이도의 소개 페이지만 표시
  }
  currentDifficulty = difficulty; // 현재 난이도 설정
}

// 퀴즈 페이지 표시 함수
function showQuiz(difficulty, number) {
  hideAllPages(); // 모든 페이지 숨기기

  // 퀴즈 템플릿이 존재하는지 확인
  if (!quizTemplate) {
    quizTemplate = document.getElementById("quiz-template");
    if (!quizTemplate) {
      console.error("퀴즈 템플릿을 찾을 수 없습니다.");
      return;
    }
  }

  const questionIndex = number - 1; // 배열 인덱스는 0부터 시작

  // 난이도 및 현재 상태 설정
  currentDifficulty = difficulty;
  currentQuestionIndex = questionIndex;

  // 템플릿의 배경색 클래스 설정 (난이도별 색상)
  quizTemplate.className = "difficulty-" + difficulty; // 클래스 초기화 및 난이도 클래스 추가
  quizTemplate.classList.remove("hidden"); // 템플릿 표시
  quizTemplate.classList.remove("show-result"); // 결과 표시 제거

  // 퀴즈 내용 설정
  const questionElement = quizTemplate.querySelector("#quiz-question");
  if (questionElement) {
    questionElement.textContent = quizData[difficulty][questionIndex].question;
  }

  // 입력 필드 초기화
  const answerInput = quizTemplate.querySelector("#quiz-answer");
  if (answerInput) {
    answerInput.value = "";
    // 포커스 설정으로 바로 입력 가능하게 함
    setTimeout(() => answerInput.focus(), 100);
  }

  // 정답 버튼 이벤트 재설정
  const answerButton = quizTemplate.querySelector("#quiz-answer-button");
  const answerFeedback = quizTemplate.querySelector("#quiz-answer-feedback");
  const nextButton = quizTemplate.querySelector("#quiz-answer-next");

  // 이전 이벤트 리스너 제거 (여러 번 등록 방지)
  if (answerButton) {
    const newAnswerButton = answerButton.cloneNode(true);
    answerButton.parentNode.replaceChild(newAnswerButton, answerButton);

    // 새 이벤트 리스너 설정
    newAnswerButton.addEventListener("click", function () {
      checkAnswer(difficulty, questionIndex);
    });
  }

  // 다음 문제 버튼 설정
  if (nextButton) {
    const newNextButton = nextButton.cloneNode(true);
    nextButton.parentNode.replaceChild(newNextButton, nextButton);

    newNextButton.addEventListener("click", function () {
      if (questionIndex < 4) {
        // 0부터 시작이므로 4는 5번째 문제
        showQuiz(difficulty, questionIndex + 2); // 다음 문제로 (인덱스 + 1, 문제 번호 + 1)
      } else {
        showEndPage(); // 마지막 문제면 종료 페이지로
      }
    });
  }
}

// 정답 확인 함수
function checkAnswer(difficulty, questionIndex) {
  if (!quizTemplate) return;

  const userAnswer = quizTemplate.querySelector("#quiz-answer").value.trim();
  const correctAnswer = quizData[difficulty][questionIndex].answer;
  const answerFeedback = quizTemplate.querySelector("#quiz-answer-feedback");

  if (!answerFeedback) return;

  // 정답 일치 여부 확인 (대소문자 무시)
  const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

  // 피드백 메시지 설정
  if (isCorrect) {
    answerFeedback.textContent = "정답입니다!";
    answerFeedback.style.color = "#4caf50"; // 초록색
  } else {
    answerFeedback.textContent = `오답입니다. 정답은 '${correctAnswer}'입니다.`;
    answerFeedback.style.color = "#f44336"; // 빨간색
  }

  // 정답 결과 표시
  quizTemplate.classList.add("show-result");
}

// 종료 페이지 표시 함수
function showEndPage() {
  hideAllPages(); // 모든 페이지 숨기기
  const endPage = document.getElementById("end-page");
  if (endPage) {
    endPage.classList.remove("hidden"); // 종료 페이지만 표시
  }

  // 종료 페이지 표시 함수가 있으면 호출
  if (typeof endPageShown === "function") {
    endPageShown();
  }
}

// 앱 초기화 함수
function initializeApp() {
  // DOM 요소 참조 초기화
  initDOMReferences();

  // 페이지 로드 시 홈 페이지 표시
  showHomePage();

  // 퀴즈 입력 폼에서 엔터키 처리
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Enter" &&
      document.activeElement &&
      document.activeElement.id === "quiz-answer"
    ) {
      // 활성화된 요소가 quiz-answer인 경우에만 처리
      event.preventDefault();
      // 현재 난이도와 문제 인덱스로 정답 확인
      if (currentDifficulty && currentQuestionIndex >= 0) {
        checkAnswer(currentDifficulty, currentQuestionIndex);
      }
    }
  });

  // 마지막으로 모든 모든 복구
  hideAllPages();
  showHomePage();
}
