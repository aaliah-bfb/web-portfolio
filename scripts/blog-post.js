function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; 
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderLearningCallouts(content) {
  return content.replace(/LEARNING\[([\s\S]*?)\]/g, (match, text) => {
    return `<div class="callout callout--learning">
      <svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4 2.3 5.1.9.9 1.4 1.5 1.6 2.4.1.5.1.5.1 1.5h6c0-1 0-1 .1-1.5.2-.9.7-1.5 1.6-2.4C17.8 13 19 11.4 19 9a7 7 0 0 0-7-7z"></path>
      </svg>
      <div class="callout-text">${text.trim()}</div>
    </div>`;
  });
}

async function renderBlogPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('post');

  if (!slug || !POSTS.includes(slug)) {
    document.querySelector('.blog-page').innerHTML =
      '<p>Post not found.</p>';
    return;
  }

  const { data, content } = await loadPost(`content/${slug}.md`);

  document.title = data.title || 'Blog';
  document.getElementById('post-title').textContent = data.title || '';
  document.getElementById('post-meta').textContent =
    `${formatDate(data.dateWritten)} • ${formatDate(data.datePublished)}`;

  const descriptionEl = document.getElementById('post-description');
  if (descriptionEl) {
    descriptionEl.textContent = data.description || '';
    descriptionEl.hidden = !data.description;
  }

  const tagsEl = document.getElementById('post-tags');
  tagsEl.innerHTML = (data.tags || [])
    .map((tag) => `<span>${tag}</span>`)
    .join('');

  const bannerEl = document.getElementById('post-banner');
  bannerEl.src = data.banner || '';
  bannerEl.alt = `${data.title || 'Blog'} banner`;

  const processedContent = renderLearningCallouts(renderSpoilers(content));
  document.getElementById('post-content').innerHTML = marked.parse(processedContent);

  const index = POSTS.indexOf(slug);
  const prevLink = document.getElementById('prev-link');
  const nextLink = document.getElementById('next-link');

  if (index > 0) {
    prevLink.href = `post.html?post=${POSTS[index - 1]}`;
  } else {
    prevLink.style.visibility = 'hidden';
  }

  if (index < POSTS.length - 1) {
    nextLink.href = `post.html?post=${POSTS[index + 1]}`;
  } else {
    nextLink.style.visibility = 'hidden';
  }
}

document.addEventListener('DOMContentLoaded', renderBlogPost);