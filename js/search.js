/**
 * Search Module
 * 클라이언트 사이드 검색 기능
 */

(function() {
  'use strict';

  // 검색용 게시글 목록 (전역 변수 충돌 방지를 위해 고유한 이름 사용)
  let searchPosts = [];
  let filteredSearchPosts = [];
  let searchTimeout = null;

  // 설정
  const DEBOUNCE_DELAY = 300; // ms

  // DOM 요소
  let searchInput = null;
  let postsList = null;

  /**
   * DOM 요소 초기화
   */
  function initElements() {
    searchInput = document.getElementById('searchInput');
    postsList = document.getElementById('postsList');
  }

  /**
   * 검색어 정규화 (소문자 변환, 공백 정리)
   */
  function normalizeQuery(query) {
    return query.toLowerCase().trim();
  }

  /**
   * 게시글이 검색어와 일치하는지 확인
   */
  function matchesQuery(post, query) {
    if (!query) return true;

    const normalizedQuery = normalizeQuery(query);

    // 제목 검색
    if (post.title && post.title.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 설명 검색
    if (post.description && post.description.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 발췌문 검색
    if (post.excerpt && post.excerpt.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 태그 검색
    if (post.tags && Array.isArray(post.tags)) {
      const tagMatch = post.tags.some(tag => 
        tag.toLowerCase().includes(normalizedQuery)
      );
      if (tagMatch) return true;
    }

    // 카테고리 검색
    if (post.category && post.category.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    return false;
  }

  /**
   * 검색 실행
   */
  function performSearch(query) {
    // 필터링된 목록이 있으면 그 안에서 검색, 없으면 전체에서 검색
    const postsToSearch = filteredSearchPosts.length > 0 ? filteredSearchPosts : searchPosts;
    
    const results = postsToSearch.filter(post => matchesQuery(post, query));

    // appModule의 renderPosts 사용
    if (window.appModule && window.appModule.renderPosts) {
      window.appModule.renderPosts(results);
    }

    return results;
  }

  /**
   * 디바운스된 검색
   */
  function debouncedSearch(query) {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, DEBOUNCE_DELAY);
  }

  /**
   * 검색 입력 이벤트 핸들러
   */
  function handleSearchInput(event) {
    const query = event.target.value;
    debouncedSearch(query);
  }

  /**
   * 검색어 클리어
   */
  function clearSearch() {
    if (searchInput) {
      searchInput.value = '';
    }
    performSearch('');
  }

  /**
   * 게시글 목록 설정 (app.js에서 호출)
   */
  function setPosts(posts) {
    searchPosts = posts || [];
    filteredSearchPosts = [];
  }

  /**
   * 필터링된 게시글 목록 설정 (태그 필터 적용 시)
   */
  function setFilteredPosts(posts) {
    filteredSearchPosts = posts || [];
    
    // 검색 입력이 있으면 다시 검색 실행
    if (searchInput && searchInput.value) {
      performSearch(searchInput.value);
    }
  }

  /**
   * 초기화
   */
  function init() {
    initElements();

    if (searchInput) {
      searchInput.addEventListener('input', handleSearchInput);

      // Enter 키 처리 (폼 제출 방지)
      searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          performSearch(searchInput.value);
        }
      });

      // ESC 키로 검색어 클리어
      searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          clearSearch();
          searchInput.blur();
        }
      });
    }
  }

  // DOM 준비되면 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 전역으로 함수 노출
  window.searchModule = {
    setPosts: setPosts,
    setFilteredPosts: setFilteredPosts,
    search: performSearch,
    clear: clearSearch
  };
})();

