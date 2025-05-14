// Hide all pages
function hideAllPages() {
  const pages = document.querySelectorAll(
    'div[id$="-page"], div[id^="easy-quiz-"], div[id^="normal-quiz-"], div[id^="hard-quiz-"]'
  );
  pages.forEach((page) => {
    page.classList.add("hidden");
  });
}

// Show home page
function showHomePage() {
  hideAllPages();
  document.getElementById("home-page").classList.remove("hidden");

  // Reset all checkboxes
  const checkboxes = document.querySelectorAll(".check-box");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

// Show difficulty page
function showDifficultyPage(difficulty) {
  hideAllPages();
  document.getElementById(`${difficulty}-page`).classList.remove("hidden");
}

// Show quiz page
function showQuiz(difficulty, number) {
  hideAllPages();
  document
    .getElementById(`${difficulty}-quiz-${number}`)
    .classList.remove("hidden");
}

// Show end page
function showEndPage() {
  hideAllPages();
  document.getElementById("end-page").classList.remove("hidden");
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  showHomePage();
});
