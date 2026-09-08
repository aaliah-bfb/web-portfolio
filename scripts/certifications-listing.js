const CATEGORY_LABELS = {
  ongoing: 'Ongoing',
  cyber: 'Cyber Security',
  design: 'Design',
  other: 'Other',
};

function labelFor(category) {
  return CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

function certCardTemplate(cert) {
  const skills = cert.skills
    .map((skill) => `<li>${skill}</li>`)
    .join('');

  return `
    <div class="card">
      <div class="card-tags">
        <span>Issued ${cert.issued}</span>
        <span>Expires ${cert.expires}</span>
      </div>
      <h5>${cert.title}</h5>
      <div class="cert-body">
        <div class="company">
          <img class="cert-icon" src="${cert.companyLogo}" alt="${cert.company} logo">
          <a class="company-link" href="${cert.companyLink}" target="_blank" rel="noopener">${cert.company} ↗</a>
        </div>
        <ul class="skill-list">${skills}</ul>
      </div>
    </div>
  `;
}

function renderCertList(category) {
  const listContainer = document.getElementById('certs-list');
  if (!listContainer) return;

  const filtered = CERTS.filter((c) => c.category === category);
  listContainer.innerHTML = filtered.map(certCardTemplate).join('');
}

function setActiveTab(category) {
  const tabsContainer = document.getElementById('certs-tabs');
  if (!tabsContainer) return;

  tabsContainer.querySelectorAll('.cert-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  renderCertList(category);
}

function renderCertifications() {
  const tabsContainer = document.getElementById('certs-tabs');
  const listContainer = document.getElementById('certs-list');
  if (!tabsContainer || !listContainer) return;

  // Derive unique categories in first-seen order
  const categories = [...new Set(CERTS.map((c) => c.category))];

  tabsContainer.innerHTML = categories
    .map((cat, i) => `<button class="cert-tab${i === 0 ? ' active' : ''}" data-category="${cat}">${labelFor(cat)}</button>`)
    .join('');

  tabsContainer.querySelectorAll('.cert-tab').forEach((btn) => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.category));
  });

  // Render first category by default
  if (categories.length) renderCertList(categories[0]);
}

document.addEventListener('DOMContentLoaded', renderCertifications);