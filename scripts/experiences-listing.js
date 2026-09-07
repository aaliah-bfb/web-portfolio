function experienceCardTemplate(exp) {
  const skills = exp.skills
    .map((skill) => `<li>${skill}</li>`)
    .join('');

  const hasLink = exp.companyLink && exp.companyLink !== '#';

  const companyMarkup = hasLink
    ? `<a class="company-link" href="${exp.companyLink}" target="_blank" rel="noopener">${exp.company} ↗</a>`
    : `<span class="company-link company-link--plain">${exp.company}</span>`;

  return `
    <div class="card">
      <div class="card-tags">
        <span>${exp.year}</span>
      </div>
      <h5>${exp.title}</h5>
      <div class="cert-body">
        <div class="company">
          <img class="cert-icon" src="${exp.companyLogo}" alt="${exp.company} logo">
          ${companyMarkup}
        </div>
        <p class="exp-description">${exp.description || ''}</p>
        <ul class="skill-list">${skills}</ul>
      </div>
    </div>
  `;
}

function timelineItemTemplate(exp, index) {
  const side = index % 2 === 0 ? 'left' : 'right';

  return `
    <div class="timeline-item timeline-item--${side}">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        ${experienceCardTemplate(exp)}
      </div>
    </div>
  `;
}

function renderExperiences() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = EXPERIENCES
    .map((exp, index) => timelineItemTemplate(exp, index))
    .join('');
}

document.addEventListener('DOMContentLoaded', renderExperiences);