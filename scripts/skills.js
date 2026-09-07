// Requires skills/manifest.js to be loaded first.

const SKILL_CATEGORY_LABELS = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  databases: 'Databases',
  'digital-forensics': 'Digital Forensics',
};

function skillLabelFor(category) {
  return SKILL_CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

function skillCardTemplate(skill) {
  return `
    <div class="card skill-card">
      <span class="skill-icon">${skill.icon}</span>
      <h5>${skill.name}</h5>
    </div>
  `;
}

function renderSkillGrid(category) {
  const gridContainer = document.getElementById('skills-grid');
  if (!gridContainer) return;

  const filtered = SKILLS.filter((s) => s.category === category);
  gridContainer.innerHTML = filtered.map(skillCardTemplate).join('');
}

function setActiveSkillTab(category) {
  const tabsContainer = document.getElementById('skills-tabs');
  if (!tabsContainer) return;

  tabsContainer.querySelectorAll('.skills-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  renderSkillGrid(category);
}

function renderSkills() {
  const tabsContainer = document.getElementById('skills-tabs');
  const gridContainer = document.getElementById('skills-grid');
  if (!tabsContainer || !gridContainer) return;

  const categories = [...new Set(SKILLS.map((s) => s.category))];

  tabsContainer.innerHTML = categories
    .map((cat, i) => `<button class="skills-tab${i === 0 ? ' active' : ''}" data-category="${cat}">${skillLabelFor(cat)}</button>`)
    .join('');

  tabsContainer.querySelectorAll('.skills-tab').forEach((btn) => {
    btn.addEventListener('click', () => setActiveSkillTab(btn.dataset.category));
  });

  if (categories.length) renderSkillGrid(categories[0]);
}

document.addEventListener('DOMContentLoaded', renderSkills);