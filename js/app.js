/**
 * Main Application Module
 * 게시글 목록 렌더링, 태그/카테고리 필터링
 */

(function() {
  'use strict';

  // 전역 상태
  let allPosts = [];
  let currentFilter = {
    tag: null,
    category: null
  };

  // DOM 요소 캐싱
  const elements = {
    postsList: null,
    tagsContainer: null,
    loading: null,
    noPosts: null
  };

  /**
   * DOM 요소 초기화
   */
  function initElements() {
    elements.postsList = document.getElementById('postsList');
    elements.tagsContainer = document.getElementById('tagsContainer');
    elements.loading = document.getElementById('loading');
    elements.noPosts = document.getElementById('noPosts');
  }

  /**
   * 로딩 상태 표시
   */
  function showLoading(show) {
    if (elements.loading) {
      elements.loading.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * 빈 상태 표시
   */
  function showNoPosts(show) {
    if (elements.noPosts) {
      elements.noPosts.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * 날짜 포맷팅
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  }

  /**
   * 게시글 카드 HTML 생성
   */
  function createPostCard(post) {
    const tagsHtml = post.tags && post.tags.length > 0
      ? post.tags.map(tag => `<span class="post-card-tag">${escapeHtml(tag)}</span>`).join('')
      : '';

    const categoryHtml = post.category
      ? `<span class="post-card-category">${escapeHtml(post.category)}</span>`
      : '';

    return `
      <article class="post-card">
        <a href="post.html?file=${encodeURIComponent(post.file)}" class="post-card-link">
          <div class="post-card-meta">
            ${categoryHtml}
            <span class="post-card-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${formatDate(post.date)}
            </span>
          </div>
          <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
          ${post.excerpt ? `<p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
          ${tagsHtml ? `<div class="post-card-tags">${tagsHtml}</div>` : ''}
        </a>
      </article>
    `;
  }

  /**
   * HTML 이스케이프
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 게시글 목록 렌더링
   */
  function renderPosts(posts) {
    if (!elements.postsList) return;

    if (posts.length === 0) {
      elements.postsList.innerHTML = '';
      showNoPosts(true);
      return;
    }

    showNoPosts(false);
    elements.postsList.innerHTML = posts.map(createPostCard).join('');
  }

  /**
   * 태그 목록 추출 및 중복 제거
   */
  function extractAllTags(posts) {
    const tagSet = new Set();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }

  /**
   * 태그 필터 버튼 생성
   */
  function createTagButton(tag, isActive) {
    const button = document.createElement('button');
    button.className = `tag-btn${isActive ? ' active' : ''}`;
    button.textContent = tag;
    button.addEventListener('click', () => handleTagFilter(tag));
    return button;
  }

  /**
   * 태그 필터 UI 렌더링
   */
  function renderTagsFilter(tags) {
    if (!elements.tagsContainer) return;

    elements.tagsContainer.innerHTML = '';

    // "전체" 버튼
    const allButton = document.createElement('button');
    allButton.className = `tag-btn${currentFilter.tag === null ? ' active' : ''}`;
    allButton.textContent = '전체';
    allButton.addEventListener('click', () => handleTagFilter(null));
    elements.tagsContainer.appendChild(allButton);

    // 태그 버튼들
    tags.forEach(tag => {
      const isActive = currentFilter.tag === tag;
      elements.tagsContainer.appendChild(createTagButton(tag, isActive));
    });
  }

  /**
   * 태그 필터 처리
   */
  function handleTagFilter(tag) {
    currentFilter.tag = tag;
    
    // 필터링된 게시글
    const filteredPosts = tag
      ? allPosts.filter(post => post.tags && post.tags.includes(tag))
      : allPosts;

    // UI 업데이트
    renderPosts(filteredPosts);
    
    // 태그 버튼 활성 상태 업데이트
    const tagButtons = elements.tagsContainer.querySelectorAll('.tag-btn');
    tagButtons.forEach(btn => {
      if (tag === null && btn.textContent === '전체') {
        btn.classList.add('active');
      } else if (btn.textContent === tag) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 검색 모듈에 필터링된 목록 전달
    if (window.searchModule && window.searchModule.setFilteredPosts) {
      window.searchModule.setFilteredPosts(filteredPosts);
    }
  }

  /**
   * posts.json 로드
   */
  async function loadPosts() {
    showLoading(true);
    
    try {
      const response = await fetch('posts.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      allPosts = await response.json();
      
      // 태그 필터 렌더링
      const allTags = extractAllTags(allPosts);
      renderTagsFilter(allTags);
      
      // 게시글 목록 렌더링
      renderPosts(allPosts);
      
      // 검색 모듈에 게시글 목록 전달
      if (window.searchModule && window.searchModule.setPosts) {
        window.searchModule.setPosts(allPosts);
      }
      
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      
      if (elements.postsList) {
        elements.postsList.innerHTML = `
          <div class="no-posts">
            <p>게시글을 불러오는데 실패했습니다.</p>
            <p style="font-size: 0.875rem; margin-top: 0.5rem; color: var(--color-text-muted);">
              posts.json 파일이 존재하는지 확인해주세요.
            </p>
          </div>
        `;
      }
    } finally {
      showLoading(false);
    }
  }

  /**
   * 초기화
   */
  function init() {
    initElements();
    
    // 인덱스 페이지에서만 실행
    if (elements.postsList) {
      loadPosts();
    }
  }

  // DOM 준비되면 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 전역으로 함수 노출
  window.appModule = {
    getPosts: () => allPosts,
    renderPosts: renderPosts,
    filterByTag: handleTagFilter
  };
})();

