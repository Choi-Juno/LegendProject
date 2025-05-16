// 컴포넌트 로더 - HTML 컴포넌트를 동적으로 로드하는 스크립트

// 컴포넌트를 로드하는 함수
async function loadComponent(targetElement, componentPath) {
  try {
    // fetch API를 사용하여 컴포넌트 HTML 파일 로드
    const response = await fetch(componentPath);

    if (!response.ok) {
      throw new Error(`Failed to load component: ${componentPath}`);
    }

    // HTML 텍스트 가져오기
    const html = await response.text();

    // 대상 요소에 HTML 삽입
    targetElement.innerHTML = html;

    return true;
  } catch (error) {
    console.error("컴포넌트 로드 오류:", error);
    return false;
  }
}

// 모든 컴포넌트 로드 함수
async function loadAllComponents() {
  // 컴포넌트 컨테이너 요소들
  const homeContainer = document.getElementById("home-container");
  const difficultyContainer = document.getElementById("difficulty-container");
  const easyQuizzesContainer = document.getElementById(
    "easy-quizzes-container"
  );
  const normalQuizzesContainer = document.getElementById(
    "normal-quizzes-container"
  );
  const hardQuizzesContainer = document.getElementById(
    "hard-quizzes-container"
  );
  const endContainer = document.getElementById("end-container");
  const footerContainer = document.getElementById("footer-container");

  // 컴포넌트 로드
  await Promise.all([
    loadComponent(homeContainer, "./components/home.html"),
    loadComponent(difficultyContainer, "./components/difficulty-intro.html"),
    loadComponent(easyQuizzesContainer, "./components/easy-quizzes.html"),
    loadComponent(normalQuizzesContainer, "./components/normal-quizzes.html"),
    loadComponent(hardQuizzesContainer, "./components/hard-quizzes.html"),
    loadComponent(endContainer, "./components/end.html"),
    loadComponent(footerContainer, "./components/footer.html"),
  ]);

  // 컴포넌트 로드 후 초기화
  console.log("모든 컴포넌트 로드 완료");

  // 기존 스크립트 초기화 함수 호출
  if (typeof initializeApp === "function") {
    initializeApp();
  }
}

// 페이지 로드 시 모든 컴포넌트 로드
document.addEventListener("DOMContentLoaded", loadAllComponents);
