/* =========================================================
   AI 교육 아카데미 - 내비게이션 렌더링 스크립트
   - fetch를 쓰지 않고 하드코딩된 배열로 그리기 때문에
     file:// 로 더블클릭해서 열어도 그대로 동작합니다.
   ========================================================= */

(function () {
  "use strict";

  // 8개 챕터 메타데이터 (순서 = 학습 순서)
  var CHAPTERS = [
    {
      id: "01",
      file: "01-ai-basics.html",
      title: "AI 기본적 이해",
      short: "AI란 무엇인가, 핵심 개념과 용어",
    },
    {
      id: "02",
      file: "02-ai-trends.html",
      title: "AI의 기술발전현황",
      short: "AI 발전 타임라인과 최신 트렌드",
    },
    {
      id: "03",
      file: "03-prompt-engineering.html",
      title: "프롬프트 기술",
      short: "AI에게 원하는 답을 얻는 질문법",
    },
    {
      id: "04",
      file: "04-ai-blog.html",
      title: "AI 블로그 제작활용",
      short: "AI로 블로그 글쓰기와 운영",
    },
    {
      id: "05",
      file: "05-video-shorts.html",
      title: "유튜브·숏폼 영상제작",
      short: "AI로 영상 기획부터 편집까지",
    },
    {
      id: "06",
      file: "06-google-business-profile.html",
      title: "구글 비즈니스 프로필",
      short: "내 가게를 구글에 예쁘게 등록하기",
    },
    {
      id: "07",
      file: "07-homepage-building.html",
      title: "홈페이지 제작",
      short: "노코드·AI로 나만의 홈페이지 만들기",
    },
    {
      id: "08",
      file: "08-work-automation.html",
      title: "업무자동화",
      short: "반복 업무를 AI와 자동화 도구로 줄이기",
    },
  ];

  function getPage() {
    return document.body.getAttribute("data-page") || "home";
  }

  function inChapter() {
    return getPage() !== "home";
  }

  function chapterHref(file) {
    return inChapter() ? file : "chapters/" + file;
  }

  function homeHref() {
    return inChapter() ? "../index.html" : "index.html";
  }

  function aboutHref() {
    return inChapter() ? "../index.html#about" : "#about";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
      );
    });
  }

  function renderSidebar() {
    var mount = document.getElementById("sidebar");
    if (!mount) return;

    var page = getPage();
    var html = "";

    html += '<button class="sidebar-close-btn" id="sidebar-close" aria-label="메뉴 닫기">✕</button>';

    html +=
      '<a class="sidebar-home-link' +
      (page === "home" ? " active" : "") +
      '" href="' +
      homeHref() +
      '">🏠 코스 홈 · 전체 목차</a>';

    html +=
      '<a class="sidebar-home-link" href="' +
      aboutHref() +
      '">👤 소개 (만든 사람)</a>';

    html += '<div class="sidebar-section-label">전체 8개 챕터</div>';
    html += '<ul class="sidebar-nav-list">';

    CHAPTERS.forEach(function (ch) {
      var isActive = ch.id === page;
      html +=
        '<li><a class="' +
        (isActive ? "active" : "") +
        '" href="' +
        chapterHref(ch.file) +
        '"><span class="chap-num">' +
        ch.id +
        "</span><span>" +
        escapeHtml(ch.title) +
        "</span></a></li>";
    });

    html += "</ul>";
    mount.innerHTML = html;
  }

  function renderPager() {
    var mount = document.getElementById("chapter-pager");
    if (!mount) return;

    var page = getPage();
    var idx = CHAPTERS.findIndex(function (ch) {
      return ch.id === page;
    });
    if (idx === -1) return;

    var prev = idx > 0 ? CHAPTERS[idx - 1] : null;
    var next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

    var html = '<div class="chapter-pager">';

    if (prev) {
      html +=
        '<a class="pager-link prev" href="' +
        chapterHref(prev.file) +
        '"><span class="pager-label">← 이전 챕터</span><span class="pager-title">' +
        prev.id +
        ". " +
        escapeHtml(prev.title) +
        "</span></a>";
    } else {
      html +=
        '<a class="pager-link prev" href="' +
        homeHref() +
        '"><span class="pager-label">← 코스 홈</span><span class="pager-title">전체 목차로 돌아가기</span></a>';
    }

    if (next) {
      html +=
        '<a class="pager-link next" href="' +
        chapterHref(next.file) +
        '"><span class="pager-label">다음 챕터 →</span><span class="pager-title">' +
        next.id +
        ". " +
        escapeHtml(next.title) +
        "</span></a>";
    } else {
      html +=
        '<a class="pager-link next" href="' +
        homeHref() +
        '"><span class="pager-label">🎉 마지막 챕터</span><span class="pager-title">전체 목차로 돌아가기</span></a>';
    }

    html += "</div>";
    mount.innerHTML = html;
  }

  function setupAboutToggle() {
    var about = document.getElementById("about");
    var homeView = document.getElementById("home-view");
    if (!about) return;

    function sync() {
      if (window.location.hash === "#about") {
        about.classList.remove("is-hidden");
        if (homeView) homeView.classList.add("is-hidden");
        setTimeout(function () {
          about.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      } else {
        about.classList.add("is-hidden");
        if (homeView) homeView.classList.remove("is-hidden");
      }
    }

    sync();
    window.addEventListener("hashchange", sync);
  }

  function setupMobileToggle() {
    var sidebar = document.getElementById("sidebar");
    var hamburger = document.getElementById("hamburger");
    var overlay = document.getElementById("sidebar-overlay");
    if (!sidebar || !hamburger || !overlay) return;

    function open() {
      sidebar.classList.add("open");
      overlay.classList.add("open");
    }
    function close() {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
    }

    hamburger.addEventListener("click", open);
    overlay.addEventListener("click", close);

    var closeBtn = document.getElementById("sidebar-close");
    if (closeBtn) closeBtn.addEventListener("click", close);
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderSidebar();
    renderPager();
    setupAboutToggle();
    setupMobileToggle();
  });
})();
