// header.js
class PortfolioHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        header {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: 1px;
          background: linear-gradient(45deg, #00f2fe, #4facfe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          cursor: pointer;
        }
        nav {
          display: flex;
          gap: 2rem;
        }
        nav a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.3s ease;
          cursor: pointer;
        }
        nav a:hover, nav a.active {
          color: #06b6d4;
        }
        @media (max-width: 640px) {
          header {
            padding: 1rem;
          }
          nav {
            gap: 1.25rem;
          }
        }
      </style>
      <header>
        <div class="logo" id="logoBtn">NDP.Dev</div>
        <nav>
          <a id="portfolioNav" class="active">Portfolio</a>
          <a id="dashboardNav">Dashboard</a>
          <a id="contactNav">Contact</a>
        </nav>
      </header>
    `;
  }

  connectedCallback() {
    const portfolioNav = this.shadowRoot.getElementById('portfolioNav');
    const dashboardNav = this.shadowRoot.getElementById('dashboardNav');
    const contactNav = this.shadowRoot.getElementById('contactNav');
    const logoBtn = this.shadowRoot.getElementById('logoBtn');

    const updateActiveNav = (activeEl) => {
      [portfolioNav, dashboardNav].forEach(el => el.classList.remove('active'));
      if(activeEl) activeEl.classList.add('active');
    };

    portfolioNav.addEventListener('click', () => {
      updateActiveNav(portfolioNav);
      window.dispatchEvent(new CustomEvent('view-change', { detail: { view: 'portfolio' } }));
    });

    logoBtn.addEventListener('click', () => {
      updateActiveNav(portfolioNav);
      window.dispatchEvent(new CustomEvent('view-change', { detail: { view: 'portfolio' } }));
    });

    dashboardNav.addEventListener('click', () => {
      updateActiveNav(dashboardNav);
      window.dispatchEvent(new CustomEvent('view-change', { detail: { view: 'dashboard' } }));
    });

    contactNav.addEventListener('click', () => {
      // Broadcast contact action to trigger smooth scroll directly inside global context
      window.dispatchEvent(new CustomEvent('scroll-to-footer'));
    });
  }
}

customElements.define('portfolio-header', PortfolioHeader);