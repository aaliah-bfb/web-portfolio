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
        <p class="card-description">${data.description || ''}</p>
      </div>
    </a>
  `;
}

let allPosts = [];
let activeCategory = 'CTF';
let activeTagFilter = null;

async function renderBlogCards() {
  const container = document.querySelector('.card-container');
  if (!container) return;

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

  allPosts = posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.data.datePublished) - new Date(a.data.datePublished));

  setupTabs();
  applyFilters();
}

function setupTabs() {
  const tabs = document.querySelectorAll('.blog-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      activeTagFilter = null;
      renderTagFilters();
      applyFilters();
    });
  });
  renderTagFilters();
}

function renderTagFilters() {
  const filterContainer = document.getElementById('tag-filters');
  if (!filterContainer) return;

  if (activeCategory !== 'Other') {
    filterContainer.hidden = true;
    filterContainer.innerHTML = '';
    return;
  }

  const tagSet = new Set();
  allPosts
    .filter((p) => (p.data.category || 'Other') === 'Other')
    .forEach((p) => (p.data.tags || []).forEach((tag) => tagSet.add(tag)));

  const tags = Array.from(tagSet).sort();

  if (tags.length === 0) {
    filterContainer.hidden = true;
    filterContainer.innerHTML = '';
    return;
  }

  filterContainer.hidden = false;
  filterContainer.innerHTML = `
    <button class="tag-filter${activeTagFilter === null ? ' active' : ''}" data-tag="">All</button>
    ${tags.map((tag) => `<button class="tag-filter${activeTagFilter === tag ? ' active' : ''}" data-tag="${tag}">${tag}</button>`).join('')}
  `;

  filterContainer.querySelectorAll('.tag-filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTagFilter = btn.dataset.tag || null;
      filterContainer.querySelectorAll('.tag-filter').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

function applyFilters() {
  const container = document.querySelector('.card-container');
  if (!container) return;

  let filtered = allPosts.filter((p) => (p.data.category || 'Other') === activeCategory);

  if (activeCategory === 'Other' && activeTagFilter) {
    filtered = filtered.filter((p) => (p.data.tags || []).includes(activeTagFilter));
  }

  container.innerHTML = filtered
    .map(({ slug, data }) => cardTemplate(slug, data))
    .join('');
}

document.addEventListener('DOMContentLoaded', renderBlogCards);