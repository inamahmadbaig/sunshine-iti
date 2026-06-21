import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { User, Award, ShieldCheck, Target, Eye } from 'lucide-react';

// Layout Subcomponents
import TopBar from './TopBar';
import Header from './Header';
import NavigationBar from './NavigationBar';
import TickerTape from './TickerTape';
import ContactUs from './ContactUs';
import Footer from './Footer';

export default function AboutPage({
  baseFontSize,
  setBaseFontSize,
  notices
}) {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAdminClick = () => {
    const isLogged = localStorage.getItem("adminUser");
    if (isLogged) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };

  const isHindi = lang === 'HN';

  return (
    <div>
      <TopBar 
        t={t} 
        setBaseFontSize={setBaseFontSize} 
        setShowAdminModal={handleAdminClick} 
        setLang={setLang} 
        lang={lang} 
      />
      <Header t={t} />
      <NavigationBar t={t} setShowApplyModal={() => navigate('/apply')} />
      <TickerTape t={t} notices={notices} />

      <main className="container" style={{ minHeight: '60vh', padding: '3rem 1rem' }}>
        <div className="trades-section-header" style={{ marginBottom: '3rem' }}>
          <div className="trades-section-icon" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%)' }}>
            <Award size={28} style={{ color: '#fff' }} />
          </div>
          <h2>{isHindi ? 'संस्थान के बारे में' : 'About Our Institute'}</h2>
          <p>
            {isHindi 
              ? 'सनशाइन प्राइवेट आईटीआई, सिवनी (म.प्र.) - तकनीकी शिक्षा और कौशल विकास का एक अग्रणी केंद्र।' 
              : 'Sunshine Pvt. ITI, Seoni (M.P.) - A premier center for technical education and vocational skill development.'
            }
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          {/* Main Welcome Message */}
          <section className="welcome-section" style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '6px solid #1e3a5f' }}>
            <h3 style={{ color: '#1e3a5f', fontSize: '1.6rem', marginBottom: '1.2rem', fontWeight: '700' }}>
              {t.welcomeTitle}
            </h3>
            <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#4b5563', marginBottom: '1rem' }}>{t.welcomeText1}</p>
            <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#4b5563' }}>{t.welcomeText2}</p>
          </section>

          {/* Vision & Mission Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', gap: '1.2rem' }}>
              <div style={{ background: '#eff6ff', color: '#3b82f6', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                <Target size={24} />
              </div>
              <div>
                <h4 style={{ color: '#1e3a5f', fontSize: '1.25rem', marginBottom: '0.6rem', fontWeight: '700' }}>
                  {isHindi ? 'हमारा उद्देश्य (Mission)' : 'Our Mission'}
                </h4>
                <p style={{ lineHeight: '1.6', color: '#4b5563', fontSize: '0.95rem' }}>
                  {isHindi 
                    ? 'अत्याधुनिक प्रशिक्षण, व्यावहारिक अनुभव और उद्योग-उन्मुख कौशल के माध्यम से युवाओं को आत्मनिर्भर और रोजगार के अनुकूल बनाना।'
                    : 'To empower youth by providing advanced technical training, hands-on experience, and industry-relevant skills that make them career-ready.'
                  }
                </p>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', gap: '1.2rem' }}>
              <div style={{ background: '#ecfdf5', color: '#10b981', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                <Eye size={24} />
              </div>
              <div>
                <h4 style={{ color: '#1e3a5f', fontSize: '1.25rem', marginBottom: '0.6rem', fontWeight: '700' }}>
                  {isHindi ? 'हमारी दृष्टि (Vision)' : 'Our Vision'}
                </h4>
                <p style={{ lineHeight: '1.6', color: '#4b5563', fontSize: '0.95rem' }}>
                  {isHindi 
                    ? 'व्यावसायिक प्रशिक्षण में उत्कृष्टता का केंद्र बनना जो औद्योगिक नवाचार को बढ़ावा देने वाले अत्यधिक कुशल तकनीशियन तैयार करता है।'
                    : 'To become a center of excellence in vocational training that produces highly competent and skilled technicians driving industrial innovation.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Principal's Message Section */}
          <div className="card" style={{ marginTop: '1rem', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header card-header-blue" style={{ fontSize: '1.1rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <User size={18} /> {t.principalTitle}
            </div>
            <div className="card-content" style={{ padding: '2.5rem' }}>
              <div className="principal-card" style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="principal-avatar" style={{ width: '120px', height: '120px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', border: '3px solid #e5e7eb' }}>
                  <User size={64} />
                </div>
                <div className="principal-text" style={{ flex: 1, minWidth: '250px' }}>
                  <blockquote style={{ fontSize: '1.15rem', fontStyle: 'italic', color: '#4b5563', borderLeft: '4px solid #3b82f6', paddingLeft: '1.2rem', margin: '0 0 1.2rem 0', lineHeight: '1.6' }}>
                    "{t.principalQuote}"
                  </blockquote>
                  <div className="principal-name" style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1e3a5f' }}>{t.principalName}</div>
                  <div className="principal-designation" style={{ color: '#f97316', fontWeight: '600', fontSize: '0.9rem', marginTop: '0.2rem' }}>{t.principalDesg}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Infrastructure Highlights */}
          <section style={{ background: '#f9fafb', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ color: '#1e3a5f', fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={22} style={{ color: '#f97316' }} />
              {isHindi ? 'हमारी मुख्य विशेषताएं एवं सुविधाएं' : 'Key Infrastructure & Facilities'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[
                { titleEn: 'Modern Workshops', titleHn: 'अत्याधुनिक कार्यशालाएं', descEn: 'Fully equipped practical labs with latest tools and machineries for Electrician and Fitter trades.', descHn: 'इलेक्ट्रीशियन और फिटर ट्रेडों के लिए आधुनिक उपकरणों और मशीनों से सुसज्जित प्रयोगशालाएं।' },
                { titleEn: 'Computer Lab', titleHn: 'कंप्यूटर लैब', descEn: 'High-speed internet enabled computers with advanced configurations for DCA and PGDCA applications.', descHn: 'DCA और PGDCA के लिए उच्च गति इंटरनेट और उन्नत कंप्यूटर प्रयोगशाला।' },
                { titleEn: 'Experienced Faculty', titleHn: 'अनुभवी शिक्षक', descEn: 'Dedicated trainers and instructors certified by Directorate of Skill Development.', descHn: 'कौशल विकास निदेशालय द्वारा प्रमाणित और समर्पित प्रशिक्षक।' },
                { titleEn: 'Placement Support', titleHn: 'प्लेसमेंट सहायता', descEn: 'Dedicated placement cell that organizes campus drives and industry visits regularly.', descHn: 'नियमित रूप से कैंपस ड्राइव और औद्योगिक दौरों का आयोजन करने वाला समर्पित सेल।' }
              ].map((item, idx) => (
                <div key={idx} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <h5 style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                    {isHindi ? item.titleHn : item.titleEn}
                  </h5>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {isHindi ? item.descHn : item.descEn}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}
