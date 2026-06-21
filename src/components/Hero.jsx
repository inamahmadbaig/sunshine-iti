import React from 'react';

export default function Hero({ t, setShowApplyModal }) {
  return (
    <section className="hero-section" id="home">
      <div className="container hero-content">
        <h2>{t.heroTitle} <span>{t.heroTitleHighlight}</span></h2>
        <p>{t.heroDesc}</p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
            {t.applyOnline}
          </button>
          <a 
            href={`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/public/prospectus`} 
            download="Sunshine_ITI_Prospectus_2025-26.pdf"
            className="btn btn-secondary"
          >
            {t.downloadProspectus}
          </a>
        </div>
      </div>
    </section>
  );
}
