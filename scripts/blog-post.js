function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; 
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
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

  const tagsEl = document.getElementById('post-tags');
  tagsEl.innerHTML = (data.tags || [])
    .map((tag) => `<span>${tag}</span>`)
    .join('');

  const bannerEl = document.getElementById('post-banner');
  bannerEl.src = data.banner || '';
  bannerEl.alt = `${data.title || 'Blog'} banner`;

  document.getElementById('post-content').innerHTML = marked.parse(content);

  // Prev / next navigation based on position in the POSTS manifest.
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