async function renderProjectPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('project');

  if (!slug || !PROJECTS.includes(slug)) {
    document.querySelector('.project-page').innerHTML =
      '<p>Project not found.</p>';
    return;
  }

  const { data, content } = await loadPost(`content/${slug}.md`);

  document.title = data.title || 'Project';
  document.getElementById('project-title').textContent = data.title || '';

  const tagsEl = document.getElementById('project-tags');
  tagsEl.innerHTML = (data.tags || [])
    .map((tag) => `<span>${tag}</span>`)
    .join('');

  const statusEl = document.getElementById('project-status');
  if (data.status) {
    statusEl.textContent = data.status;
    statusEl.hidden = false;
  }

  const bannerEl = document.getElementById('project-banner');
  bannerEl.src = data.banner || '';
  bannerEl.alt = `${data.title || 'Project'} banner`;

  const techEl = document.getElementById('project-tech-stack');
  techEl.innerHTML = (data.techStack || [])
    .map((tech) => `<li>${tech}</li>`)
    .join('');

  const linksEl = document.getElementById('project-links');
  const links = [];
  if (data.repo) links.push(`<a href="${data.repo}" target="_blank" rel="noopener">Repository ↗</a>`);
  if (data.demo) links.push(`<a href="${data.demo}" target="_blank" rel="noopener">Live Demo ↗</a>`);
  linksEl.innerHTML = links.join('');
  linksEl.hidden = links.length === 0;

  const separatorEl = document.getElementById('project-meta-separator');
  const linksSeparatorEl = document.getElementById('project-links-separator');
  const hasTags = (data.tags || []).length > 0;
  const hasTech = (data.techStack || []).length > 0;
  const hasMeta = hasTags || hasTech;
  const hasLinks = links.length > 0;

  separatorEl.hidden = !(hasTags && hasTech);
  linksSeparatorEl.hidden = !(hasMeta && hasLinks);

  const descriptionEl = document.getElementById('project-description');
  descriptionEl.textContent = data.description || '';
  descriptionEl.hidden = !data.description;

  document.getElementById('project-content').innerHTML = marked.parse(content);

  // Prev / next navigation based on position in the PROJECTS manifest.
  const index = PROJECTS.indexOf(slug);
  const prevLink = document.getElementById('prev-link');
  const nextLink = document.getElementById('next-link');

  if (index > 0) {
    prevLink.href = `project.html?project=${PROJECTS[index - 1]}`;
  } else {
    prevLink.style.visibility = 'hidden';
  }

  if (index < PROJECTS.length - 1) {
    nextLink.href = `project.html?project=${PROJECTS[index + 1]}`;
  } else {
    nextLink.style.visibility = 'hidden';
  }
}

document.addEventListener('DOMContentLoaded', renderProjectPost);