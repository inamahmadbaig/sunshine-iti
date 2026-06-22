import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, Award, Users, TrendingUp, Handshake } from 'lucide-react';

// Layout Subcomponents
import TopBar from './TopBar';
import Header from './Header';
import NavigationBar from './NavigationBar';
import TickerTape from './TickerTape';
import ContactUs from './ContactUs';
import Footer from './Footer';

export default function PlacementsPage({
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

  const stats = [
    { icon: TrendingUp, val: '92%', labelEn: 'Placement Rate', labelHn: 'प्लेसमेंट दर' },
    { icon: Users, val: '400+', labelEn: 'Placed Students', labelHn: 'चयनित छात्र' },
    { icon: Handshake, val: '25+', labelEn: 'Recruiting Partners', labelHn: 'भर्ती पार्टनर्स' },
    { icon: Award, val: '₹3.6 LPA', labelEn: 'Highest Package', labelHn: 'उच्चतम पैकेज' }
  ];

  const recruiters = [
    'Suzuki Motors Gujarat', 'Tata Motors Ltd.', 'Larsen & Toubro (L&T)',
    'Gabriel India Ltd.', 'HEG India Ltd.', 'Varroc Engineering',
    'John Deere India', 'JBM Group', 'Yazaki India Ltd.'
  ];

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
        {/* Page Header */}
        <div className="trades-section-header" style={{ marginBottom: '3rem' }}>
          <div className="trades-section-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <Briefcase size={28} style={{ color: '#fff' }} />
          </div>
          <h2>{isHindi ? 'प्लेसमेंट सेल एवं करियर' : 'Placement Cell & Careers'}</h2>
          <p>
            {isHindi 
              ? 'हमारे कुशल छात्रों को अग्रणी उद्योगों में उत्कृष्ट रोजगार के अवसर प्रदान करने का हमारा निरंतर प्रयास।' 
              : 'Our dedicated efforts in providing excellent career opportunities to our skilled trainees in leading industries.'
            }
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
          
          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', background: '#eff6ff', padding: '2rem', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} style={{ textAlign: 'center', background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <div style={{ color: '#2563eb', display: 'inline-flex', marginBottom: '0.8rem', padding: '0.6rem', background: '#eff6ff', borderRadius: '50%' }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: '850', color: '#1e3a5f', margin: '0 0 0.3rem 0' }}>{stat.val}</h3>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '600' }}>
                    {isHindi ? stat.labelHn : stat.labelEn}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Description & Prep Area */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ color: '#1e3a5f', fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.2rem' }}>
                {isHindi ? 'प्लेसमेंट सेल का मुख्य उद्देश्य' : 'About Placement Cell'}
              </h3>
              <p style={{ lineHeight: '1.7', color: '#4b5563', fontSize: '0.98rem', marginBottom: '1rem' }}>
                {isHindi
                  ? 'सनशाइन प्राइवेट आईटीआई में एक सक्रिय और समर्पित प्लेसमेंट सेल है जो छात्रों को औद्योगिक आवश्यकताओं के अनुरूप प्रशिक्षित करने और देश की प्रतिष्ठित कंपनियों में नौकरी दिलाने के लिए काम करता है।'
                  : 'At SUNSHINE, our highly proactive Training and Placement Cell bridges the gap between academics and industry, facilitating lucrative job placements for our trainees.'
                }
              </p>
              <p style={{ lineHeight: '1.7', color: '#4b5563', fontSize: '0.98rem' }}>
                {isHindi
                  ? 'हम नियमित रूप से कैंपस रिक्रूटमेंट ड्राइव, उद्योगों का दौरा, और ऑन-द-जॉब ट्रेनिंग (OJT) कार्यक्रमों का आयोजन करते हैं ताकि छात्र वास्तविक कार्य परिस्थितियों से परिचित हो सकें।'
                  : 'We conduct regular campus recruitment drives, industry-institution interactions, mock interviews, and specialized soft skill programs to prepare our candidates for competitive hiring procedures.'
                }
              </p>
            </div>

            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#1e3a5f', fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                {isHindi ? 'छात्रों की तैयारी के कार्यक्रम' : 'Training & Preparation Features'}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { en: 'Regular Industrial Visits to manufacturing plants.', hn: 'विभिन्न उत्पादन संयंत्रों में नियमित औद्योगिक यात्राएं।' },
                  { en: 'Pre-placement talks and mock interview sessions.', hn: 'प्लेसमेंट से पूर्व चर्चा और मॉक इंटरव्यू अभ्यास।' },
                  { en: 'Soft skills, communication, and personality development classes.', hn: 'सॉफ्ट स्किल्स, संचार कौशल और व्यक्तित्व विकास कक्षाएं।' },
                  { en: 'Direct links with National Career Service (NCS) portal.', hn: 'राष्ट्रीय करियर सेवा (NCS) पोर्टल के साथ सीधा जुड़ाव।' },
                  { en: 'Apprenticeship assistance in government and public sectors.', hn: 'सरकारी और सार्वजनिक क्षेत्रों में शिक्षुता (Apprenticeship) सहायता।' }
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.5' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>✔</span>
                    <span>{isHindi ? item.hn : item.en}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Top Recruiting Partners Section */}
          <section style={{ background: '#f9fafb', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <h3 style={{ color: '#1e3a5f', fontSize: '1.4rem', fontWeight: '700', marginBottom: '2rem' }}>
              {isHindi ? 'हमारे प्रमुख भर्ती सहयोगी (Recruiters)' : 'Our Top Recruiting Partners'}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              {recruiters.map((rec, idx) => (
                <div 
                  key={idx} 
                  style={{ background: '#fff', padding: '1rem 1.8rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontWeight: '700', color: '#4b5563', fontSize: '0.95rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', minWidth: '160px', textAlign: 'center' }}
                >
                  {rec}
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
