(function () {
  function initSidebarToggle() {
    const btn = document.getElementById("sidebarToggleBtn");
    const sidebar = document.querySelector(".sidebar");
    if (!btn || !sidebar) return;

    let mobileMenu = null;

    function openMobileMenu() {
      const menuEl = document.getElementById("mobileMenu");
      if (!menuEl) return;
      if (!mobileMenu) mobileMenu = new bootstrap.Offcanvas(menuEl);
      mobileMenu.show();
    }

    function closeDesktopSidebar() {
      sidebar.classList.remove("open");
    }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth >= 768) {
        sidebar.classList.toggle("open");
      } else {
        openMobileMenu();
      }
    });

    sidebar.querySelectorAll(".menu-icon").forEach(function (item) {
      item.addEventListener("click", function () {
        if (window.innerWidth >= 768) closeDesktopSidebar();
      });
    });

    document.addEventListener("click", function (e) {
      if (
        window.innerWidth >= 768 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        !btn.contains(e.target)
      ) {
        closeDesktopSidebar();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("open")) {
        closeDesktopSidebar();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth < 768) closeDesktopSidebar();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarToggle);
  } else {
    initSidebarToggle();
  }
})();
