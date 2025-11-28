---
title: "GitHub Pages 블로그에 오신 것을 환영합니다!"
date: 2025-11-28
tags: ["블로그", "GitHub Pages", "JavaScript"]
category: "소개"
description: "GitHub Pages와 Vanilla JavaScript로 만든 정적 블로그입니다."
---

# GitHub Pages 블로그에 오신 것을 환영합니다! 🎉

이 블로그는 **GitHub Pages**와 **Vanilla JavaScript**만을 사용하여 구축되었습니다. 별도의 빌드 도구나 프레임워크 없이 순수 웹 기술만으로 마크다운 기반 블로그를 운영할 수 있습니다.

## 주요 기능

- 📝 **마크다운 지원**: marked.js를 사용한 마크다운 렌더링
- 🌙 **다크/라이트 모드**: 시스템 테마 자동 감지 및 수동 전환
- 🔍 **검색 기능**: 클라이언트 사이드 검색
- 🏷️ **태그 필터링**: 태그별 게시글 분류
- 💬 **Giscus 댓글**: GitHub Discussions 기반 댓글 시스템
- ⚡ **자동 배포**: GitHub Actions를 통한 자동 빌드 및 배포

## 코드 하이라이팅

Prism.js를 사용하여 다양한 언어의 코드 하이라이팅을 지원합니다.

### JavaScript 예시

```javascript
// 게시글 목록 로드
async function loadPosts() {
  const response = await fetch('posts.json');
  const posts = await response.json();
  
  posts.forEach(post => {
    console.log(`제목: ${post.title}`);
    console.log(`날짜: ${post.date}`);
  });
}

loadPosts();
```

### Python 예시

```python
def greet(name: str) -> str:
    """인사말을 반환하는 함수"""
    return f"안녕하세요, {name}님!"

# 함수 호출
message = greet("kimtu00")
print(message)
```

### CSS 예시

```css
/* 다크 모드 변수 */
[data-theme="dark"] {
  --color-bg: #0f0f1a;
  --color-text: #f0f0f5;
  --color-primary: #818cf8;
}

.post-card {
  padding: 1.5rem;
  border-radius: 16px;
  transition: transform 0.25s ease;
}

.post-card:hover {
  transform: translateY(-2px);
}
```

## 인용문

> "단순함은 궁극의 정교함이다."
> — 레오나르도 다 빈치

## 목록

### 순서 없는 목록

- GitHub Pages는 무료로 정적 사이트를 호스팅할 수 있습니다
- Jekyll 없이도 순수 HTML/CSS/JS로 블로그 구축 가능
- GitHub Actions로 자동 배포 파이프라인 구성

### 순서 있는 목록

1. `pages/` 폴더에 마크다운 파일 작성
2. Front Matter로 메타데이터 설정
3. `git push`로 변경사항 푸시
4. GitHub Actions가 자동으로 배포

## 테이블

| 기능 | 설명 | 상태 |
|------|------|------|
| 마크다운 렌더링 | marked.js 사용 | ✅ |
| 코드 하이라이팅 | Prism.js 사용 | ✅ |
| 다크 모드 | CSS 변수 기반 | ✅ |
| 검색 | 클라이언트 사이드 | ✅ |
| 댓글 | Giscus | ✅ |

## 이미지

이미지는 마크다운 문법으로 쉽게 추가할 수 있습니다:

```markdown
![대체 텍스트](이미지_URL)
```

## 링크

- [GitHub 저장소](https://github.com/kimtu00/kimtu00.github.io)
- [marked.js 문서](https://marked.js.org/)
- [Prism.js 문서](https://prismjs.com/)
- [Giscus 설정](https://giscus.app/ko)

---

새 게시글을 작성하려면 `pages/` 폴더에 `.md` 파일을 추가하고 Front Matter를 작성하세요. GitHub에 푸시하면 자동으로 배포됩니다! 🚀

