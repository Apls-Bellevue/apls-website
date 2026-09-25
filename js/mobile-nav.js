(function () {
  "use strict";

  function initLanguageSelector() {
    var utilityInner = document.querySelector(".utility-inner");
    if (!utilityInner) return;

    var existingLanguageLink = utilityInner.querySelector('a[href="japanese.html"], a[href="index.html"]');
    if (!existingLanguageLink) return;

    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var languages = [
      { href: "index.html", label: "English", lang: "en" },
      { href: "japanese.html", label: "日本語", lang: "ja" },
      { href: "chinese.html", label: "简体中文", lang: "zh-Hans" },
      { href: "spanish.html", label: "Español", lang: "es" }
    ];
    var selector = document.createElement("details");
    selector.className = "language-selector";

    var summary = document.createElement("summary");
    summary.className = "utility-item";
    summary.textContent = "Language";
    summary.setAttribute("aria-label", "Choose language");
    selector.appendChild(summary);

    var menu = document.createElement("div");
    menu.className = "language-menu";
    languages.forEach(function (language) {
      var link = document.createElement("a");
      link.href = language.href;
      link.lang = language.lang;
      link.textContent = language.label;
      if (currentPage === language.href) link.setAttribute("aria-current", "page");
      menu.appendChild(link);
    });
    selector.appendChild(menu);
    existingLanguageLink.replaceWith(selector);

    document.addEventListener("click", function (event) {
      if (!selector.contains(event.target)) selector.removeAttribute("open");
    });
    selector.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        selector.removeAttribute("open");
        summary.focus();
      }
    });
  }

  function initMobileNav() {
    initLanguageSelector();
    var toggle = document.querySelector(".nav-toggle");
    if (!toggle) return;

    var navId = toggle.getAttribute("aria-controls");
    var nav = navId ? document.getElementById(navId) : null;
    if (!nav) return;
    var openLabel = toggle.getAttribute("data-open-label") || "Open menu";
    var closeLabel = toggle.getAttribute("data-close-label") || "Close menu";
    var mobileQuery = window.matchMedia("(max-width: 1220px)");
    var groups = Array.prototype.slice.call(nav.querySelectorAll(".nav-programs"));
    var pageLanguage = document.documentElement.lang;
    var overviewLabels = {
      "zh-Hans": ["所有课程", "报名概览"],
      es: ["Todos los programas", "Resumen de inscripción"]
    };

    function setSubmenuOpen(group, isOpen) {
      var link = group.querySelector(":scope > a");
      group.classList.toggle("is-open", isOpen);
      if (link) link.setAttribute("aria-expanded", String(isOpen));
    }

    function closeSubmenus(except) {
      groups.forEach(function (group) {
        if (group !== except) setSubmenuOpen(group, false);
      });
    }

    groups.forEach(function (group, index) {
      var link = group.querySelector(":scope > a");
      var submenu = group.querySelector(":scope > .submenu");
      if (!link || !submenu) return;

      if (!submenu.id) submenu.id = "site-nav-submenu-" + index;
      link.setAttribute("aria-haspopup", "true");
      link.setAttribute("aria-controls", submenu.id);
      link.setAttribute("aria-expanded", "false");

      var overview = document.createElement("a");
      overview.className = "submenu-overview";
      overview.href = link.href;
      overview.textContent = overviewLabels[pageLanguage]
        ? overviewLabels[pageLanguage][index]
        : (link.textContent.trim() === "Programs" ? "All Programs" : "Enrollment Overview");
      submenu.insertBefore(overview, submenu.firstChild);

      link.addEventListener("click", function (event) {
        if (!mobileQuery.matches) return;
        event.preventDefault();
        var shouldOpen = !group.classList.contains("is-open");
        closeSubmenus(group);
        setSubmenuOpen(group, shouldOpen);
      });
    });

    function setOpen(isOpen) {
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
      nav.classList.toggle("is-open", isOpen);
      if (!isOpen) {
        closeSubmenus();
      } else {
        var currentGroup = groups.find(function (group) {
          return group.querySelector('[aria-current="page"]');
        });
        if (currentGroup) setSubmenuOpen(currentGroup, true);
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      if (mobileQuery.matches && link.parentElement && link.parentElement.classList.contains("nav-programs")) return;
      setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    mobileQuery.addEventListener("change", function (event) {
      setOpen(false);
      if (!event.matches) closeSubmenus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileNav);
  } else {
    initMobileNav();
  }
})();
