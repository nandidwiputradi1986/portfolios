class PortfolioSPA extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
    this.selectedSkill = null;

    // Inject styles and core structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --bg-main: #0f172a;
          --bg-card: rgba(30, 41, 59, 0.7);
          --accent-purple: #a855f7;
          --accent-cyan: #06b6d4;
          --text-primary: #f8fafc;
          --text-muted: #94a3b8;
          --border-color: rgba(255, 255, 255, 0.1);
          --glass-blur: blur(12px);
          
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: transparent;
          color: var(--text-primary);
          min-height: 100vh;
          padding: 2rem;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        :host([loaded]) {
          opacity: 1;
          transform: translateY(0);
        }

        .portfolio-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          pointer-events: auto;
        }

        @media (min-width: 992px) {
          .portfolio-container {
            grid-template-columns: 4fr 6fr;
            align-items: start;
          }
          .left-column {
            position: sticky;
            top: 2rem;
            max-height: calc(100vh - 4rem);
            overflow-y: auto;
            padding-right: 1rem;
          }
          .left-column::-webkit-scrollbar {
            width: 6px;
          }
          .left-column::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 3px;
          }
        }

        /* Profile & Summary Section */
        .profile-header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }
        .profile-text {
          flex: 1;
        }
        .profile-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(to right, var(--accent-cyan), var(--accent-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .profile-header h2 {
          font-size: 1.2rem;
          font-weight: 400;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
        }
        .profile-pic {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-cyan);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
          flex-shrink: 0;
        }
        
        /* Summary Accordion Card */
        .summary-card {
          background: var(--bg-card);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .summary-accordion {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .summary-card.expanded .summary-accordion {
          grid-template-rows: 1fr;
        }
        
        .summary-content {
          overflow: hidden;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-muted);
        }

        .summary-preview {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .toggle-summary-btn {
          background: none;
          border: none;
          color: var(--accent-cyan);
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0;
          margin-top: 0.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          transition: color 0.2s ease;
        }

        .toggle-summary-btn:hover {
          color: var(--accent-purple);
          text-decoration: underline;
        }

        /* Skills Layout */
        .skills-section h3, .experience-column h3, .education-section h3 {
          font-size: 1.3rem;
          margin: 0 0 1.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-primary);
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0.5rem;
        }

        .skills-category {
          margin-bottom: 1.5rem;
        }

        .category-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--accent-cyan);
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* Interactive Skill Badges */
        .skill-badge {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          padding: 0.5rem 0.85rem;
          border-radius: 20px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .skill-badge:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--text-muted);
          transform: translateY(-2px);
        }

        .skill-badge.active {
          background: var(--accent-purple);
          border-color: var(--accent-purple);
          color: white;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
          transform: translateY(-2px) scale(1.05);
        }

        /* Experience Timeline Layout */
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Interactive Experience Card */
        .exp-card, .edu-card {
          background: var(--bg-card);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .exp-card {
          cursor: pointer;
        }

        .exp-card::before, .edu-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: transparent;
          transition: background 0.3s ease;
        }

        .edu-card::before {
          background: var(--accent-cyan);
        }

        .exp-header, .edu-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          width: 100%;
        }

        .exp-role-info h4, .edu-info h4 {
          font-size: 1.25rem;
          margin: 0 0 0.25rem 0;
          color: var(--text-primary);          
        }

        .exp-role-info, .edu-info {
        flex: 1; /* Allows the left side to safely take up available space */
        }

        .exp-company, .edu-institution {
          font-weight: 500;
          color: var(--accent-cyan);
          font-size: 0.95rem;
        }

        .edu-gpa {
          display: inline-block;
          margin-left: 0.75rem;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          color: var(--accent-cyan);
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .exp-meta, .edu-meta {
        display: flex;
  flex-direction: column;
  align-items: flex-end;
          text-align: right;
          font-size: 0.85rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .exp-location, .edu-location {
          margin-top: 0.25rem;
          font-style: italic;
        }

        /* Accordion Structure */
        .exp-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .exp-card.expanded .exp-body {
          grid-template-rows: 1fr;
        }

        .exp-content, .edu-content {
          overflow: hidden;
        }

        .responsibilities-list, .thesis-list {
          margin: 1.25rem 0 0 0;
          padding-left: 1.25rem;
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .responsibilities-list li, .thesis-list li {
          margin-bottom: 0.75rem;
        }

        /* Tag cloud within experience/education cards */
        .exp-tags, .edu-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 1rem;
        }

        .exp-tag, .edu-chip {
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          color: var(--text-muted);
          transition: all 0.3s ease;
        }

        .edu-chip {
          background: rgba(168, 85, 247, 0.05);
          border-color: rgba(168, 85, 247, 0.15);
          color: #d8b4fe;
        }

        /* Thesis Sub block */
        .edu-thesis-section {
          margin-top: 1.25rem;
          border-top: 1px dashed var(--border-color);
          padding-top: 1rem;
        }

        .edu-thesis-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .edu-thesis-title span {
          color: var(--accent-purple);
          font-size: 0.85rem;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.25rem;
          letter-spacing: 0.05em;
        }

        /* Cross-highlighting Utility Modifiers */
        .exp-card.highlighted, .edu-card.highlighted {
          transform: scale(1.02);
          border-color: var(--accent-purple);
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
        }

        .exp-card.highlighted::before, .edu-card.highlighted::before {
          background: var(--accent-purple);
        }

        .exp-card.highlighted .exp-tag.match, .edu-card.highlighted .exp-tag.match {
          background: rgba(168, 85, 247, 0.2);
          border-color: var(--accent-purple);
          color: var(--text-primary);
        }

        .exp-card.dimmed, .edu-card.dimmed {
          opacity: 0.25;
          transform: scale(0.98);
        }

        /* Arrow indicator for accordion */
        .accordion-arrow {
          margin-top: 0.3rem;
          width: 18px;
          height: 18px;
          fill: var(--text-muted);
          transition: transform 0.3s ease;
        }

        .exp-card.expanded .accordion-arrow {
          transform: rotate(180deg);
          fill: var(--accent-cyan);
        }

        .education-section {
          margin-top: 2.5rem;
        }
        .white-bold-text {
          color: #FFFFFF !important;
          font-weight: bold !important;
          display: inline-block;
        }
      </style>
      
        <div class="portfolio-container">
          <div class="left-column">
            <div id="profile-area"></div>
            <div class="skills-section">
              <h3>Skills & Expertise</h3>
              <div id="skills-area"></div>
            </div>
          </div>
          <div class="experience-column">
            <h3>Professional Experience</h3>
            <div id="experience-area" class="timeline"></div>
            
            <div class="education-section">
              <h3>Education</h3>
              <div id="education-area"></div>
            </div>
          </div>
        </div>      
    `;
  }

  // Reactive data setter option
  set data(value) {
    this._data = value;
    this.render();
  }

  connectedCallback() {
    // Trigger entrance animation delay
    setTimeout(() => this.setAttribute('loaded', ''), 50);
  }

  // Normalize ID generation for robust cross-referencing
  _slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9+#.\-]/g, '').replace(/[\s+]/g, '-');
  }

  render() {
    if (!this._data) return;

    this.renderProfile();
    this.renderSkills();
    this.renderExperience();
    this.renderEducation();
    this.setupListeners();
  }

  renderProfile() {
    const info = this._data.personal_information;
    const summary = this._data.professional_summary;
    const profileArea = this.shadowRoot.getElementById('profile-area');
    
    // Slice the first sentence out as a non-hidden preview segment
    const firstPeriodIndex = summary.indexOf('.');
    const previewText = firstPeriodIndex !== -1 ? summary.substring(0, firstPeriodIndex + 1) : summary;
    const dynamicRemainingText = firstPeriodIndex !== -1 ? summary.substring(firstPeriodIndex + 1).trim() : '';

    profileArea.innerHTML = `
      <div class="profile-header">
        <div class="profile-text">
          <h1>${info.name}</h1>
          <h2>${info.title}</h2>
        </div>
        ${info.photo ? `<img class="profile-pic" src="${info.photo}" alt="${info.name}">` : ''}
      </div>
      <div class="summary-card" id="summaryCard">
        <div class="summary-preview">${previewText}</div>
        
        ${dynamicRemainingText ? `
          <div class="summary-accordion">
            <div class="summary-content">
              ${dynamicRemainingText}
            </div>
          </div>
          <button class="toggle-summary-btn" id="toggleSummaryBtn">read more...</button>
        ` : ''}
      </div>
    `;
  }

  renderSkills() {
    const skillsArea = this.shadowRoot.getElementById('skills-area');
    
    // Group skills by category safely
    const categories = {};
    this._data.skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill.keyword);
    });

    skillsArea.innerHTML = Object.keys(categories).map(cat => `
      <div class="skills-category">
        <div class="category-title">${cat}</div>
        <div class="skills-grid">
          ${categories[cat].map(skill => `
            <span class="skill-badge" data-skill-id="${this._slugify(skill)}">${skill}</span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  renderExperience() {
    const expArea = this.shadowRoot.getElementById('experience-area');
    
    expArea.innerHTML = this._data.experiences.map((exp, idx) => {
      // Map related skill IDs as space-separated tokens for direct selection matching
      const skillTokens = (exp.related_skills_keywords || [])
        .map(s => this._slugify(s))
        .join(' ');

      return `
        <div class="exp-card" data-skills="${skillTokens}" data-index="${idx}">
          <div class="exp-header">
            <div class="exp-role-info">
              <h4>${exp.role}</h4>
              <span class="exp-company">${exp.company}</span>
            </div>
            <div class="exp-meta">
              <div>${exp.period}</div>
              <div class="exp-location">${exp.location}</div>
            </div>
            <svg class="accordion-arrow" viewBox="0 0 24 24">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
            </svg>
          </div>
          
          <div class="exp-body">
            <div class="exp-content">
            <div class="exp-description">
                ${exp.description}
            </div>
              <ul class="responsibilities-list">
                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
              </ul>
              ${exp.related_skills_keywords && exp.related_skills_keywords.length ? `
                <div class="exp-tags">
                  ${exp.related_skills_keywords.map(s => `
                    <span class="exp-tag" data-tag-id="${this._slugify(s)}">${s}</span>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderEducation() {
    const eduArea = this.shadowRoot.getElementById('education-area');
    if (!this._data.education) return;

    const edu = this._data.education;
    const skillTokens = (edu.related_skills_keywords || [])
      .map(s => this._slugify(s))
      .join(' ');

    eduArea.innerHTML = `
      <div class="edu-card" data-skills="${skillTokens}">
        <div class="edu-header">
          <div class="edu-info">
            <h4>${edu.degree}</h4>
            <span class="edu-institution">${edu.institution}</span>
            <span class="edu-gpa">GPA: ${edu.gpa}</span>
          </div>
          <div class="edu-meta">
            <div>${edu.period}</div>
            <div class="edu-location">${edu.location}</div>
          </div>
        </div>
        
        <div class="edu-content">
          <div class="edu-chips">
            ${edu.core_competencies_and_coursework.map(course => `
              <span class="edu-chip">${course}</span>
            `).join('')}
          </div>

          ${edu.academic_project_and_thesis ? `
            <div class="edu-thesis-section">
              <div class="edu-thesis-title">
                <span>Academic Project & Thesis</span>
                ${edu.academic_project_and_thesis.title}
              </div>
              <ul class="thesis-list">
                ${edu.academic_project_and_thesis.details.map(detail => `<li>${detail}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${edu.related_skills_keywords && edu.related_skills_keywords.length ? `
            <div class="exp-tags">
              ${edu.related_skills_keywords.map(s => `
                <span class="exp-tag" data-tag-id="${this._slugify(s)}">${s}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  setupListeners() {
    const skillBadges = this.shadowRoot.querySelectorAll('.skill-badge');
    const expCards = this.shadowRoot.querySelectorAll('.exp-card');
    const eduCard = this.shadowRoot.querySelectorAll('.edu-card');
    const toggleSummaryBtn = this.shadowRoot.getElementById('toggleSummaryBtn');
    const summaryCard = this.shadowRoot.getElementById('summaryCard');

    // Combine elements for interactive highlight filtration rules
    const filterableCards = [...expCards, ...eduCard];

    // Professional Summary Accordion Toggle Link
    if (toggleSummaryBtn && summaryCard) {
      toggleSummaryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = summaryCard.classList.contains('expanded');
        summaryCard.classList.toggle('expanded', !isExpanded);
        toggleSummaryBtn.textContent = isExpanded ? "read more..." : "read less";
      });
    }

    // 1. Accordion Interactivity
    expCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent accordion toggling if clicking a nested interactive tag element
        if (e.target.classList.contains('exp-tag')) return;
        
        const isExpanded = card.classList.contains('expanded');
        // Optional: Close other open cards for an exclusive accordion block feel
        this.shadowRoot.querySelectorAll('.exp-card.expanded').forEach(openCard => {
          if (openCard !== card) openCard.classList.remove('expanded');
        });

        card.classList.toggle('expanded', !isExpanded);
      });
    });

    // 2. Cross-Highlighting Interactivity Logic
    skillBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        const skillId = badge.getAttribute('data-skill-id');

        if (this.selectedSkill === skillId) {
          // Deselect strategy
          this.selectedSkill = null;
          badge.classList.remove('active');
          this._clearFilters(filterableCards);
        } else {
          // Select system strategy
          skillBadges.forEach(b => b.classList.remove('active'));
          badge.classList.add('active');
          this.selectedSkill = skillId;
          this._applyFilters(skillId, filterableCards);
        }
      });
    });
  }

  _applyFilters(skillId, cards) {
    cards.forEach(card => {
      const associatedSkills = card.getAttribute('data-skills').split(' ');
      const isMatched = associatedSkills.includes(skillId);

      if (isMatched) {
        card.classList.remove('dimmed');
        card.classList.add('highlighted');
        
        // Target contextual sub-tags for high-fidelity highlighting matches
        card.querySelectorAll('.exp-tag').forEach(tag => {
          if (tag.getAttribute('data-tag-id') === skillId) {
            tag.classList.add('match');
          } else {
            tag.classList.remove('match');
          }
        });
      } else {
        card.classList.remove('highlighted');
        card.classList.add('dimmed');
      }
    });
  }

  _clearFilters(cards) {
    cards.forEach(card => {
      card.classList.remove('highlighted', 'dimmed');
      card.querySelectorAll('.exp-tag').forEach(tag => tag.classList.remove('match'));
    });
  }
}

customElements.define('portfolio-spa', PortfolioSPA);