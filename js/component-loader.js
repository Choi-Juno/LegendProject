// 컴포넌트 로더 - HTML 컴포넌트를 동적으로 로드하는 스크립트

// 컴포넌트를 로드하는 함수
async function loadComponent(targetElement, componentPath, isFullHtml = false) {
  try {
    // fetch API를 사용하여 컴포넌트 HTML 파일 로드
    const response = await fetch(componentPath);

    if (!response.ok) {
      throw new Error(`Failed to load component: ${componentPath}`);
    }

    // HTML 텍스트 가져오기
    const html = await response.text();

    // 전체 HTML 파일인 경우 body 내용만 추출
    if (isFullHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // 스타일 태그 추출 및 적용
      const styles = doc.querySelectorAll("head style");
      styles.forEach((style) => {
        // 컴포넌트 고유 식별자 (파일 경로에서 파일명 추출)
        const componentName = componentPath.split("/").pop().split(".")[0];

        // 새 스타일 요소 생성
        const newStyle = document.createElement("style");
        newStyle.textContent = style.textContent;
        newStyle.setAttribute("data-component", componentName);

        // 기존에 같은 컴포넌트에서 온 스타일이 있으면 제거
        const existingStyles = document.querySelectorAll(
          `style[data-component="${componentName}"]`
        );
        existingStyles.forEach((s) => s.remove());

        // 문서 헤드에 스타일 추가
        document.head.appendChild(newStyle);
      });

      // body 내용만 추출하거나 특정 컨테이너의 내용 추출
      const bodyContent = doc.querySelector("body")
        ? doc.querySelector("body").innerHTML
        : html;

      // 대상 요소에 HTML 삽입
      targetElement.innerHTML = bodyContent;

      // 스크립트 태그 처리 (전체 HTML에서 추출한 스크립트는 자동으로 실행되지 않음)
      const scripts = doc.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");

        // 스크립트 속성 복사
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // 인라인 스크립트 내용 복사
        newScript.textContent = script.textContent;

        // 문서에 추가하여 실행되도록 함
        document.body.appendChild(newScript);
      });
    } else {
      // 기존 방식대로 HTML 삽입
      targetElement.innerHTML = html;
    }

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
  const quizTemplateContainer = document.getElementById(
    "quiz-template-container"
  );
  const endContainer = document.getElementById("end-container");
  const footerContainer = document.getElementById("footer-container");

  // 존재하지 않는 컨테이너 확인
  if (!homeContainer) console.warn("홈 컨테이너를 찾을 수 없습니다.");
  if (!difficultyContainer) console.warn("난이도 컨테이너를 찾을 수 없습니다.");
  if (!quizTemplateContainer)
    console.warn("퀴즈 템플릿 컨테이너를 찾을 수 없습니다.");
  if (!endContainer) console.warn("종료 페이지 컨테이너를 찾을 수 없습니다.");
  if (!footerContainer) console.warn("푸터 컨테이너를 찾을 수 없습니다.");

  // 컴포넌트 로드 - 세 번째 매개변수는 전체 HTML 여부
  await Promise.all([
    homeContainer
      ? loadComponent(homeContainer, "./components/home.html", true)
      : Promise.resolve(),
    difficultyContainer
      ? loadComponent(
          difficultyContainer,
          "./components/difficulty-intro.html",
          true
        )
      : Promise.resolve(),
    quizTemplateContainer
      ? loadComponent(
          quizTemplateContainer,
          "./components/quiz-template.html",
          true
        )
      : Promise.resolve(),
    endContainer
      ? loadComponent(endContainer, "./components/end.html", true)
      : Promise.resolve(),
    footerContainer
      ? loadComponent(footerContainer, "./components/footer.html", true)
      : Promise.resolve(),
  ]);

  // 컴포넌트 로드 후 초기화
  console.log("모든 컴포넌트 로드 완료");

  // 페이지 초기화 실행 (타이밍 보장을 위해 setTimeout 사용)
  setTimeout(() => {
    // 컴포넌트 초기 상태 설정 - 필요한 페이지만 표시하고 나머지는 숨김
    setupInitialVisibility();

    // 퀴즈 템플릿 초기화 함수 호출
    if (typeof initQuizTemplate === "function") {
      initQuizTemplate();
    }

    // 기존 스크립트 초기화 함수 호출
    if (typeof initializeApp === "function") {
      initializeApp();
    }

    // 강제로 한번 더 초기 가시성 적용
    setTimeout(() => {
      setupInitialVisibility();
      if (typeof initializeApp === "function") {
        initializeApp();
      }
    }, 100);
  }, 0);
}

// 컴포넌트 초기 가시성 설정 - 로드 후 호출되어 필요한 페이지만 표시
function setupInitialVisibility() {
  console.log("페이지 초기 가시성 설정 중...");

  // 모든 페이지 요소 숨기기 (id가 "-page"로 끝나는 모든 div)
  const allPages = document.querySelectorAll('div[id$="-page"]');
  allPages.forEach((page) => {
    page.classList.add("hidden");
  });

  // 모든 템플릿 요소 숨기기
  const templates = document.querySelectorAll("#quiz-template");
  templates.forEach((template) => {
    template.classList.add("hidden");
  });

  // 홈 페이지만 표시
  const homePage = document.getElementById("home-page");
  if (homePage) {
    homePage.classList.remove("hidden");
  } else {
    console.warn("홈 페이지 요소를 찾을 수 없습니다.");
  }

  // 모든 컴포넌트 컨테이너의 내부 요소들을 검사하여 숨기기
  const containerIds = ["quiz-template-container", "end-container"];
  containerIds.forEach((containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      const divElements = container.querySelectorAll("div");
      divElements.forEach((div) => {
        if (div.id && div.id !== "home-page") {
          // home-page가 아닌 경우에만 hidden 추가
          div.classList.add("hidden");
        }
      });
    }
  });
}

// 특정 페이지를 전체 HTML 컴포넌트로 로드하는 함수
async function loadFullPageComponent(containerId, componentPath) {
  const container = document.getElementById(containerId);
  if (container) {
    return await loadComponent(container, componentPath, true); // true = 전체 HTML
  }
  return false;
}

// 페이지 로드 시 모든 컴포넌트 로드
document.addEventListener("DOMContentLoaded", loadAllComponents);
