import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Layout Subcomponents
import TopBar from './TopBar';
import Header from './Header';
import NavigationBar from './NavigationBar';
import TickerTape from './TickerTape';
import ContactUs from './ContactUs';
import Footer from './Footer';

export default function ContactPage({
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

      <main style={{ minHeight: '60vh', paddingBottom: '3rem' }}>
        <ContactUs t={t} lang={lang} />
      </main>

      <Footer t={t} />
    </div>
  );
}
