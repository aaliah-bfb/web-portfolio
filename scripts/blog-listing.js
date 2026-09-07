function cardTemplate(slug, data) {
  const tags = (data.tags || [])
    .map((tag) => `<span>${tag}</span>`)
    .join('');

  return `
    <a class="card-link" href="post.html?post=${slug}">
      <div class="card">
        <div class="card-banner">
          <img src="${data.banner || ''}" alt="${data.title || 'Blog banner'}">
        </div>
        <div class="card-tags">${tags}</div>
        <h5>${data.title || 'Untitled post'}</h5>
      </div>
    </a>
  `;
}

async function renderBlogCards() {
  const container = document.querySelector('.card-container');
  if (!container) return;

  // Fetch every post's front matter in parallel.
  const posts = await Promise.all(
    POSTS.map(async (slug) => {
      try {
        const { data } = await loadPost(`content/${slug}.md`);
        return { slug, data };
      } catch (err) {
        console.error(`Skipping "${slug}":`, err);
        return null;
      }
    })
  );

  // Most recent first, based on datePublished.
  const sorted = posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.data.datePublished) - new Date(a.data.datePublished));

  container.innerHTML = sorted
    .map(({ slug, data }) => cardTemplate(slug, data))
    .join('');
}

document.addEventListener('DOMContentLoaded', renderBlogCards);