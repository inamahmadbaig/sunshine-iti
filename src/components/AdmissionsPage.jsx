import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FileSpreadsheet, CheckCircle2, AlertTriangle, Phone, ArrowRight } from 'lucide-react';

// Layout Subcomponents
import TopBar from './TopBar';
import Header from './Header';
import NavigationBar from './NavigationBar';
import TickerTape from './TickerTape';
import ContactUs from './ContactUs';
import Footer from './Footer';

export default function AdmissionsPage({
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

  const steps = [
    {
      num: '01',
      titleEn: 'Fill Online Application',
      titleHn: 'ऑनलाइन आवेदन पत्र भरें',
      descEn: 'Click the Apply Now button and enter your personal, academic, and address details accurately.',
      descHn: 'अभी आवेदन करें बटन पर क्लिक करें और अपने व्यक्तिगत, शैक्षणिक और पते का विवरण सही-सही दर्ज करें।'
    },
    {
      num: '02',
      titleEn: 'Upload Documents',
      titleHn: 'दस्तावेज अपलोड करें',
      descEn: 'Upload scanned copies of required documents including passport size photo, signature, Aadhar card, and marksheet.',
      descHn: 'पासपोर्ट आकार की फोटो, हस्ताक्षर, आधार कार्ड और अंकसूची सहित आवश्यक दस्तावेजों की स्कैन की गई प्रतियां अपलोड करें।'
    },
    {
      num: '03',
      titleEn: 'Verify & Preview',
      titleHn: 'सत्यापित करें और पूर्वावलोकन करें',
      descEn: 'Review the details entered in the application form carefully in the preview modal before final submission.',
      descHn: 'अंतिम रूप से जमा करने से पहले पूर्वावलोकन मोड में आवेदन पत्र में दर्ज किए गए विवरणों की ध्यानपूर्वक समीक्षा करें।'
    },
    {
      num: '04',
      titleEn: 'Submit & Print Form',
      titleHn: 'जमा करें और प्रिंट लें',
      descEn: 'Submit your form and print out a hard copy. Bring this copy along with original documents for verification at the college.',
      descHn: 'अपना फॉर्म सबमिट करें और एक हार्ड कॉपी प्रिंट करें। कॉलेज में सत्यापन के लिए मूल दस्तावेजों के साथ इस प्रति को साथ लाएं।'
    }
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
          <div className="trades-section-icon" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
            <FileSpreadsheet size={28} style={{ color: '#fff' }} />
          </div>
          <h2>{isHindi ? 'प्रवेश प्रक्रिया एवं दिशानिर्देश' : 'Admission Guidelines & Process'}</h2>
          <p>
            {isHindi 
              ? 'सत्र 2026-27 के लिए हमारे विभिन्न पाठ्यक्रमों/ट्रेडों में प्रवेश प्रक्रिया की पूरी जानकारी नीचे दी गई है।' 
              : 'Detailed step-by-step guidelines for admission into various trades for the session 2026-27.'
            }
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
          
          {/* Apply Now Call-to-Action */}
          <section style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #111827 100%)', padding: '3rem 2rem', borderRadius: '16px', color: '#fff', textAlign: 'center', boxShadow: '0 10px 25px rgba(30, 58, 95, 0.15)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: '#fb923c' }}>
              {isHindi ? 'प्रवेश सत्र 2026-27 के लिए आवेदन खुले हैं!' : 'Admissions Open for Session 2026-27!'}
            </h3>
            <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem', color: '#e5e7eb', lineHeight: '1.6' }}>
              {isHindi
                ? 'इलेक्ट्रीशियन, फिटर, DCA और PGDCA में अपनी सीट सुरक्षित करने के लिए आज ही ऑनलाइन आवेदन करें।'
                : 'Apply online today to secure your seat in Electrician, Fitter, DCA, or PGDCA course.'
              }
            </p>
            <Link 
              to="/apply" 
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem', padding: '0.8rem 2.2rem', borderRadius: '30px', fontWeight: 'bold', background: '#f97316', borderColor: '#f97316', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              {isHindi ? 'अभी ऑनलाइन आवेदन करें' : 'Apply Online Now'}
              <ArrowRight size={20} />
            </Link>
          </section>

          {/* Step-by-Step Flow */}
          <section>
            <h3 style={{ color: '#1e3a5f', fontSize: '1.4rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>
              {isHindi ? 'प्रवेश प्रक्रिया के चरण' : 'Steps in the Admission Process'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {steps.map((step, idx) => (
                <div key={idx} style={{ background: '#fff', padding: '2rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #1e3a5f', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', fontSize: '2rem', fontWeight: '900', color: '#e5e7eb' }}>{step.num}</div>
                  <h4 style={{ color: '#1e3a5f', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem', marginTop: '0.5rem' }}>
                    {isHindi ? step.titleHn : step.titleEn}
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {isHindi ? step.descHn : step.descEn}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Two-Column Grid: Documents & Eligibility */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Required Documents */}
            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#1e3a5f', fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={22} style={{ color: '#10b981' }} />
                {isHindi ? 'आवश्यक दस्तावेज सूची' : 'Required Documents Checklist'}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { en: '10th / 12th Class Marksheet (Original + Copies)', hn: '10वीं / 12वीं की मूल अंकसूची और फोटोकॉपी' },
                  { en: 'Aadhar Card of Candidate', hn: 'उम्मीदवार का आधार कार्ड' },
                  { en: 'Samagra ID Card (9 Digit)', hn: '9 अंकों की समग्र आईडी' },
                  { en: 'Passport Size Photographs (4 Copies)', hn: 'पासपोर्ट आकार के रंगीन फोटो (4 प्रतियां)' },
                  { en: 'Cast Certificate (SC/ST/OBC - if applicable)', hn: 'जाति प्रमाण पत्र (SC/ST/OBC - यदि लागू हो)' },
                  { en: 'Income Certificate / Domicile Certificate', hn: 'आय प्रमाण पत्र / मूल निवासी प्रमाण पत्र' },
                  { en: 'Transfer Certificate (TC) & Character Certificate', hn: 'स्थानांतरण प्रमाण पत्र (TC) और चरित्र प्रमाण पत्र' }
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '0.95rem', color: '#4b5563' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '-2px' }}>✓</span>
                    <span>{isHindi ? item.hn : item.en}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* General Rules / Important Note */}
            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '6px solid #f97316' }}>
              <h3 style={{ color: '#1e3a5f', fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={22} style={{ color: '#f97316' }} />
                {isHindi ? 'महत्वपूर्ण निर्देश' : 'Important Note & Guidelines'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: '#4b5563', lineHeight: '1.6', fontSize: '0.95rem' }}>
                <p>
                  {isHindi
                    ? '* सीटों का आवंटन मेरिट और "पहले आओ, पहले पाओ" के आधार पर किया जाएगा।'
                    : '* Seat allocation is strictly based on merit lists and a "first-come, first-served" basis.'
                  }
                </p>
                <p>
                  {isHindi
                    ? '* आरक्षित श्रेणी (SC/ST/OBC) के छात्रों के लिए शासन के नियमानुसार छात्रवृत्ति की व्यवस्था उपलब्ध है।'
                    : '* Scholarships are available for SC/ST/OBC category candidates as per state government policies.'
                  }
                </p>
                <p>
                  {isHindi
                    ? '* कृपया फॉर्म सबमिट करने के बाद रसीद / ड्राफ्ट कॉपी संभाल कर रखें और कॉलेज हेल्पडेस्क पर रिपोर्ट करें।'
                    : '* Keep your printed form draft copy safe and report to the college administration for document verification.'
                  }
                </p>
                <div style={{ background: '#eff6ff', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #bfdbfe', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Phone size={18} style={{ color: '#2563eb' }} />
                  <div>
                    <div style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '0.85rem' }}>{isHindi ? 'प्रवेश हेल्पडेस्क' : 'ADMISSION HELPDESK'}</div>
                    <div style={{ fontWeight: 'bold', color: '#f97316', fontSize: '1.05rem', marginTop: '2px' }}>+91-7415491034</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}
