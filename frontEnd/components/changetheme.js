const toggleContainers = document.querySelectorAll(".changeTheme");
const themeCardsContainer = document.getElementById("changeTheme2");
const statusTheme = document.getElementById("statusTheme");

toggleContainers.forEach((el, index) => {
  const checkboxId = `theme-checkbox-${index}`;
  el.innerHTML = `
<input type="checkbox" id="${checkboxId}" style="display: none;">
<label for="${checkboxId}" class="theme-toggle-label shadow-sm">
    <div class="toggle-circle">
        <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f1c40f" viewBox="0 0 16 16">
            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
        </svg>
        <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#f1c40f" viewBox="0 0 16 16">
            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        </svg>
    </div>
</label>
`;
});

function applyTheme(mode) {
  const isDark = mode === "dark";
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
  document.querySelectorAll(".theme-toggle-label").forEach(el => el.classList.toggle("dark-mode", isDark));
  document.querySelectorAll('[id^="theme-checkbox-"]').forEach(cb => { cb.checked = isDark; });
  if (statusTheme) statusTheme.innerText = isDark ? "Mode Gelap" : "Mode Terang";
}

const currentTheme = localStorage.getItem("theme") || "light";

if (themeCardsContainer) {
  const lightBgBody = "#f8fafc";
  const lightCardBg = "#ffffff";
  const darkBgBody = "#0f172a";
  const darkCardBg = "#1e293b";

  themeCardsContainer.innerHTML = `
<div class="theme-cards-container">
  <button class="theme-card ${currentTheme === "light" ? "active" : ""}" data-mode="light" onclick="selectTheme(this, 'light')">
    <div class="theme-preview">
      <div class="preview-sidebar" style="background: #1e293b;"></div>
      <div class="preview-content" style="background: ${lightBgBody};">
        <div class="preview-header" style="background: ${lightCardBg};"></div>
        <div class="preview-badge" style="background: #0f172a;"></div>
      </div>
    </div>
    <span class="theme-label">Mode Terang</span>
  </button>
  <button class="theme-card ${currentTheme === "dark" ? "active" : ""}" data-mode="dark" onclick="selectTheme(this, 'dark')">
    <div class="theme-preview">
      <div class="preview-sidebar" style="background: ${darkBgBody};"></div>
      <div class="preview-content" style="background: ${darkCardBg};">
        <div class="preview-header" style="background: ${darkBgBody};"></div>
        <div class="preview-badge" style="background: #ffffff;"></div>
      </div>
    </div>
    <span class="theme-label">Mode Gelap</span>
  </button>
</div>
`;
}

function selectTheme(btn, mode) {
  document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  applyTheme(mode);
}

if (currentTheme === "dark") {
  applyTheme("dark");
}

const labels = document.querySelectorAll(".theme-toggle-label");
labels.forEach(label => {
  const checkbox = document.getElementById(label.getAttribute("for"));
  if (!checkbox) return;
  checkbox.addEventListener("change", () => {
    const mode = checkbox.checked ? "dark" : "light";
    document.querySelectorAll(".theme-card").forEach(c => c.classList.toggle("active", c.dataset.mode === mode));
    applyTheme(mode);
  });
});
