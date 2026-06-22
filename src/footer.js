// footer.js
class PortfolioFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
  }

  set data(value) {
    this._data = value;
    this.render();
  }

  render() {
    if (!this._data || !this._data.personal_information) return;
    const info = this._data.personal_information;

    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: #090d16;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          padding: 3rem 2rem;
          margin-top: auto;
          position: relative;
          z-index: 3;
        }
        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
            align-items: center;
          }
        }
        .footer-brand h4 {
          color: #ffffff;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .footer-brand p {
          font-size: 0.9rem;
          max-width: 400px;
          line-height: 1.5;
        }
        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.9rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-item a {
          color: #06b6d4;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .contact-item a:hover {
          color: #a855f7;
        }
        .footer-bottom {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          font-size: 0.8rem;
          color: #64748b;
        }
      </style>
      <footer>
        <div class="footer-container">
          <div class="footer-brand">
            <h4>${info.name}</h4>
            <p>${info.title}</p>
          </div>
          <div class="footer-contact">
            <div class="contact-item">
              <span>📍 Location:</span> <span>${info.location}</span>
            </div>
            <div class="contact-item">
              <span>📞 Phone:</span> <a href="tel:${info.phone}">${info.phone}</a>
            </div>
            <div class="contact-item">
              <span>✉️ Email:</span> <a href="mailto:${info.email}">${info.email}</a>
            </div>
            <div class="contact-item">
              <span>🔗 LinkedIn:</span> <a href="https://${info.linkedin}" target="_blank">Connect Profile</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; ${new Date().getFullYear()} ${info.name}. All rights reserved.
        </div>
      </footer>
    `;
  }
}

customElements.define('portfolio-footer', PortfolioFooter);