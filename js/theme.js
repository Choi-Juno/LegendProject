// 다크모드 상태 관리 (페이지 간 유지)
document.addEventListener("DOMContentLoaded", function () {
  const themeCheckbox = document.getElementById("dark-mode-toggle");

  // 저장된 테마 상태 로드
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme === "enabled") {
    themeCheckbox.checked = true;
  }

  // 테마 변경 시 상태 저장
  themeCheckbox.addEventListener("change", function () {
    if (this.checked) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });
});
