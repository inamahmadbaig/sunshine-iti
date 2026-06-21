import React from 'react';
import { User } from 'lucide-react';

export default function CenterColumn({ t }) {
  return (
    <section id="about">
      <div className="welcome-section">
        <h3>{t.welcomeTitle}</h3>
        <p>{t.welcomeText1}</p>
        <p>{t.welcomeText2}</p>
      </div>

      {/* Principal's Message Card */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header card-header-blue">
          <User size={16} /> {t.principalTitle}
        </div>
        <div className="card-content">
          <div className="principal-card">
            <div className="principal-avatar">
              <User size={48} />
            </div>
            <div className="principal-text">
              <blockquote>"{t.principalQuote}"</blockquote>
              <div className="principal-name">{t.principalName}</div>
              <div className="principal-designation">{t.principalDesg}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
