/**
 * Theme Toggle Module
 * 다크/라이트 모드 전환 기능
 */

(function() {
  'use strict';

  const THEME_KEY = 'blog-theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  /**
   * 시스템 테마 감지
   */
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK_THEME;
    }
    return LIGHT_THEME;
  }

  /**
   * 저장된 테마 가져오기
   */
  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      console.warn('localStorage 접근 실패:', e);
      return null;
    }
  }

  /**
   * 테마 저장
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('테마 저장 실패:', e);
    }
  }

  /**
   * 테마 적용
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Giscus 테마 업데이트 (댓글 시스템)
    updateGiscusTheme(theme);
  }

  /**
   * Giscus 테마 동기화
   */
  function updateGiscusTheme(theme) {
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame) {
      const giscusTheme = theme === DARK_THEME ? 'dark' : 'light';
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        'https://giscus.app'
      );
    }
  }

  /**
   * 현재 테마 가져오기
   */
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
  }

  /**
   * 테마 토글
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    
    applyTheme(newTheme);
    saveTheme(newTheme);
    
    return newTheme;
  }

  /**
   * 초기화
   */
  function initTheme() {
    // 저장된 테마 또는 시스템 테마 적용
    const savedTheme = getSavedTheme();
    const initialTheme = savedTheme || getSystemTheme();
    applyTheme(initialTheme);

    // 테마 토글 버튼 이벤트 리스너
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function() {
        toggleTheme();
      });
    }

    // 시스템 테마 변경 감지
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // 사용자가 직접 테마를 설정하지 않은 경우에만 시스템 테마 따름
        if (!getSavedTheme()) {
          applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
      });
    }
  }

  // DOM 준비되면 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // 전역으로 함수 노출 (필요시 외부에서 사용 가능)
  window.themeModule = {
    toggle: toggleTheme,
    get: getCurrentTheme,
    set: applyTheme
  };
})();

