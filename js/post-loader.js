/**
 * Post Loader Module
 * 마크다운 로딩, Front Matter 파싱, Giscus 로드
 */

(function () {
  "use strict";

  // DOM 요소 캐싱
  const elements = {
    postTitle: null,
    postMeta: null,
    postTags: null,
    postContent: null,
    giscusContainer: null,
  };

  /**
   * DOM 요소 초기화
   */
  function initElements() {
    elements.postTitle = document.getElementById("postTitle");
    elements.postMeta = document.getElementById("postMeta");
    elements.postTags = document.getElementById("postTags");
    elements.postContent = document.getElementById("postContent");
    elements.giscusContainer = document.getElementById("giscusContainer");
  }

  /**
   * URL 쿼리 파라미터에서 파일명 추출
   */
  function getFileParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get("file");
  }

  /**
   * Front Matter 파싱
   */
  function parseFrontMatter(content) {
    // UTF-8 BOM 제거
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }

    const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
      return {
        metadata: {},
        content: content,
      };
    }

    const frontMatter = match[1];
    const postContent = match[2];
    const metadata = {};

    // Front Matter 라인 파싱
    const lines = frontMatter.split(/\r?\n/);
    lines.forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === "tags" && value.startsWith("[") && value.endsWith("]")) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value
              .slice(1, -1)
              .split(",")
              .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ""));
          }
        }

        metadata[key] = value;
      }
    });

    return {
      metadata,
      content: postContent,
    };
  }

  /**
   * 날짜 포맷팅
   */
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  }

  /**
   * HTML 이스케이프
   */
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 메타 정보 렌더링
   */
  function renderMeta(metadata) {
    if (!elements.postMeta) return;

    const parts = [];

    if (metadata.category) {
      parts.push(
        `<span class="post-category">${escapeHtml(metadata.category)}</span>`
      );
    }

    if (metadata.date) {
      parts.push(`
        <span class="post-date">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          ${formatDate(metadata.date)}
        </span>
      `);
    }

    elements.postMeta.innerHTML = parts.join("");
  }

  /**
   * 태그 렌더링
   */
  function renderTags(tags) {
    if (!elements.postTags || !tags || tags.length === 0) {
      if (elements.postTags) elements.postTags.innerHTML = "";
      return;
    }

    elements.postTags.innerHTML = tags
      .map(
        (tag) =>
          `<a href="index.html?tag=${encodeURIComponent(
            tag
          )}" class="post-tag">${escapeHtml(tag)}</a>`
      )
      .join("");
  }

  /**
   * Marked.js 설정
   */
  function configureMarked() {
    if (typeof marked === "undefined") {
      console.error("marked.js가 로드되지 않았습니다.");
      return;
    }

    marked.setOptions({
      highlight: function (code, lang) {
        // Prism.js 사용
        if (typeof Prism !== "undefined" && lang && Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
      breaks: true,
      gfm: true,
    });
  }

  /**
   * 마크다운을 HTML로 변환
   */
  function renderMarkdown(content) {
    if (typeof marked === "undefined") {
      console.error("marked.js가 로드되지 않았습니다.");
      return content;
    }

    return marked.parse(content);
  }

  /**
   * 코드 하이라이팅 재적용
   */
  function highlightCode() {
    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
    }
  }

  /**
   * Giscus 댓글 로드
   */
  function loadGiscus() {
    if (!elements.giscusContainer) return;

    // 이미 로드된 경우 스킵
    if (elements.giscusContainer.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "kimtu00/git_test");
    script.setAttribute("data-repo-id", "R_kgDOQedEPg"); // TODO: 실제 repo-id로 교체
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQedEPs4CzIzo"); // TODO: 실제 category-id로 교체
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    // 현재 테마에 맞춰 Giscus 테마 설정
    const currentTheme = document.documentElement.getAttribute("data-theme");
    script.setAttribute(
      "data-theme",
      currentTheme === "dark" ? "dark" : "light"
    );

    elements.giscusContainer.appendChild(script);
  }

  /**
   * 페이지 제목 업데이트
   */
  function updatePageTitle(title) {
    document.title = `${title} - kimtu00's Blog`;
  }

  /**
   * 에러 표시
   */
  function showError(message) {
    if (elements.postContent) {
      elements.postContent.innerHTML = `
        <div class="no-posts" style="text-align: center; padding: 3rem 0;">
          <p>${escapeHtml(message)}</p>
          <p style="margin-top: 1rem;">
            <a href="index.html">← 목록으로 돌아가기</a>
          </p>
        </div>
      `;
    }
    if (elements.postTitle) {
      elements.postTitle.textContent = "오류";
    }
  }

  /**
   * 게시글 로드
   */
  async function loadPost() {
    const filename = getFileParam();

    if (!filename) {
      showError("게시글 파일이 지정되지 않았습니다.");
      return;
    }

    try {
      const response = await fetch(`pages/${filename}`);

      if (!response.ok) {
        throw new Error(`게시글을 찾을 수 없습니다: ${filename}`);
      }

      const rawContent = await response.text();
      const { metadata, content } = parseFrontMatter(rawContent);

      // 제목 설정
      const title = metadata.title || filename.replace(".md", "");
      if (elements.postTitle) {
        elements.postTitle.textContent = title;
      }
      updatePageTitle(title);

      // 메타 정보 렌더링
      renderMeta(metadata);

      // 태그 렌더링
      renderTags(metadata.tags);

      // 마크다운 렌더링
      configureMarked();
      if (elements.postContent) {
        elements.postContent.innerHTML = renderMarkdown(content);
      }

      // 코드 하이라이팅
      highlightCode();

      // Giscus 댓글 로드
      loadGiscus();
    } catch (error) {
      console.error("게시글 로드 실패:", error);
      showError(error.message || "게시글을 불러오는데 실패했습니다.");
    }
  }

  /**
   * 초기화
   */
  function init() {
    initElements();

    // post.html 페이지에서만 실행
    if (elements.postContent) {
      loadPost();
    }
  }

  // DOM 준비되면 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
