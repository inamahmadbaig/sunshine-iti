import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Layout Subcomponents
import TopBar from './TopBar';
import Header from './Header';
import NavigationBar from './NavigationBar';
import TickerTape from './TickerTape';
import TradesAndFees from './TradesAndFees';
import ContactUs from './ContactUs';
import Footer from './Footer';

export default function TradesPage({
  baseFontSize,
  setBaseFontSize,
  notices
}) {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on mount
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
      {/* 1. Top Bar */}
      <TopBar 
        t={t} 
        setBaseFontSize={setBaseFontSize} 
        setShowAdminModal={handleAdminClick} 
        setLang={setLang} 
        lang={lang} 
      />

      {/* 2. Main Header */}
      <Header t={t} />

      {/* 3. Navigation Bar */}
      <NavigationBar t={t} setShowApplyModal={() => navigate('/apply')} />

      {/* 4. Ticker Tape */}
      <TickerTape t={t} notices={notices} />

      {/* 5. Trades & Fees Section */}
      <main style={{ minHeight: '50vh', paddingBottom: '3rem' }}>
        <TradesAndFees t={t} lang={lang} />
      </main>

      {/* 7. Footer Section */}
      <Footer t={t} />
    </div>
  );
}
