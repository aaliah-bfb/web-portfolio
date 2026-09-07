function projectCardTemplate(slug, data) {
  const tags = (data.tags || [])
    .map((tag) => `<span>${tag}</span>`)
    .join('');

  return `
    <a class="card-link" href="project.html?project=${slug}">
      <div class="card">
        <div class="card-banner">
          <img src="${data.banner || ''}" alt="${data.title || 'Project banner'}">
        </div>
        ${data.status ? `<span class="status-badge">${data.status}</span>` : ''}
        <div class="card-tags">${tags}</div>
        <h5>${data.title || 'Untitled project'}</h5>
      </div>
    </a>
  `;
}

async function renderProjectCards() {
  const container = document.querySelector('.card-container');
  if (!container) return;

  const projects = await Promise.all(
    PROJECTS.map(async (slug) => {
      try {
        const { data } = await loadPost(`content/${slug}.md`);
        return { slug, data };
      } catch (err) {
        console.error(`Skipping "${slug}":`, err);
        return null;
      }
    })
  );

  container.innerHTML = projects
    .filter(Boolean)
    .map(({ slug, data }) => projectCardTemplate(slug, data))
    .join('');
}

document.addEventListener('DOMContentLoaded', renderProjectCards);