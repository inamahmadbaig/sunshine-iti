import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, FileText, Landmark, Calendar, ShieldAlert, Download, Loader, Eye } from 'lucide-react';
import axios from 'axios';

// Layout Subcomponents
import TopBar from './TopBar';
import Header from './Header';
import NavigationBar from './NavigationBar';
import TickerTape from './TickerTape';
import Footer from './Footer';

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api`;

const translateTrade = (trade, isHindi) => {
  if (!isHindi) return trade;
  const translations = {
    'All Trades': 'सभी ट्रेड्स',
    'Electrician': 'इलेक्ट्रीशियन',
    'DCA': 'डीसीए (DCA)',
    'PGDCA': 'पीजीडीसीए (PGDCA)',
    'Health Sanitary Inspector': 'स्वास्थ्य स्वच्छता निरीक्षक',
    'General': 'सामान्य'
  };
  return translations[trade] || trade;
};

const translateTitle = (title, isHindi) => {
  if (!isHindi) return title;
  const translations = {
    "Electrician Syllabus NCVT 2026": "इलेक्ट्रीशियन पाठ्यक्रम एनसीवीटी 2026",
    "DCA Course Scheme and Syllabus": "डीसीए कोर्स स्कीम और पाठ्यक्रम",
    "Health Sanitary Inspector Syllabus": "स्वास्थ्य स्वच्छता निरीक्षक पाठ्यक्रम",
    "PGDCA Course Scheme and Syllabus": "पीजीडीसीए कोर्स स्कीम और पाठ्यक्रम",
    "Electrician Theory Paper 2025": "इलेक्ट्रीशियन थ्योरी पेपर 2025",
    "DCA Computer Fundamentals 2025": "डीसीए कंप्यूटर फंडामेंटल्स 2025",
    "HSI Workshop Calculation Paper 2024": "स्वास्थ्य स्वच्छता निरीक्षक वर्कशॉप कैलकुलेशन पेपर 2024",
    "MP Post Matric Scholarship Form": "मध्य प्रदेश पोस्ट मैट्रिक छात्रवृत्ति फॉर्म",
    "National Scholarship Portal (NSP) Manual": "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) नियमावली",
    "Academic Calendar 2026-27 (Sunshine ITI)": "शैक्षणिक कैलेंडर 2026-27 (सनशाइन आईटीआई)",
    "Examination & Practical Training Schedule 2026": "परीक्षा और व्यावहारिक प्रशिक्षण समय सारणी 2026",
    "Sunshine ITI Code of Conduct & Rules": "सनशाइन आईटीआई आचार संहिता और नियम",
    "Anti-Ragging Affidavits & Guidelines": "एंटी-रैगिंग शपथ पत्र और दिशानिर्देश"
  };
  return translations[title] || title;
};

const translateFileName = (fileName, isHindi) => {
  if (!isHindi) return fileName;
  const translations = {
    "electrician_syllabus_2026.pdf": "इलेक्ट्रीशियन_पाठ्यक्रम_2026.pdf",
    "dca_syllabus_scheme.pdf": "डीसीए_पाठ्यक्रम_योजना.pdf",
    "hsi_syllabus_2026.pdf": "एचएसआई_पाठ्यक्रम_2026.pdf",
    "pgdca_syllabus_scheme.pdf": "पीजीडीसीए_पाठ्यक्रम_योजना.pdf",
    "electrician_theory_2025.pdf": "इलेक्ट्रीशियन_थ्योरी_2025.pdf",
    "dca_fundamentals_2025.pdf": "डीसीए_फंडामेंटल्स_2025.pdf",
    "hsi_workshop_calc_2024.pdf": "एचएसआई_वर्कशॉप_कैलकुलेशन_2024.pdf",
    "mp_scholarship_form_2026.pdf": "एमपी_छात्रवृत्ति_फॉर्म_2026.pdf",
    "nsp_user_manual.pdf": "एनएसपी_उपयोगकर्ता_पुस्तिका.pdf",
    "academic_calendar_2026_27.pdf": "शैक्षणिक_कैलेंडर_2026_27.pdf",
    "exam_training_calendar_2026.pdf": "परीक्षा_प्रशिक्षण_कैलेंडर_2026.pdf",
    "college_rules_and_regulations.pdf": "कॉलेज_नियम_और_विनियम.pdf",
    "anti_ragging_rules.pdf": "रैगिंग_विरोधी_नियम.pdf"
  };
  return translations[fileName] || fileName;
};

const SECTIONS = [
  { id: 'syllabus',      type: 'SYLLABUS',        icon: BookOpen,    titleEn: 'Syllabus & Course Scheme',     titleHn: 'पाठ्यक्रम एवं कोर्स स्कीम',           color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  { id: 'papers',        type: 'PREVIOUS_PAPER',  icon: FileText,    titleEn: 'Previous Year Papers',          titleHn: 'पिछले वर्षों के प्रश्न पत्र',          color: '#d97706', bg: 'rgba(245,158,11,0.08)' },
  { id: 'scholarships',  type: 'SCHOLARSHIP',     icon: Landmark,    titleEn: 'Scholarship Forms',             titleHn: 'छात्रवृत्ति फॉर्म',                    color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  { id: 'calendar',      type: 'CALENDAR',        icon: Calendar,    titleEn: 'Academic Calendar',             titleHn: 'शैक्षणिक कैलेंडर',                    color: '#7c3aed', bg: 'rgba(139,92,246,0.08)' },
  { id: 'rules',         type: 'RULES',           icon: ShieldAlert, titleEn: 'Rules & Regulations',           titleHn: 'नियम एवं विनियम',                      color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
];

export default function StudentCornerPage({ baseFontSize, setBaseFontSize, notices }) {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const { itemId } = useParams();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFileId, setExpandedFileId] = useState(null);

  const section = SECTIONS.find(s => s.id === itemId) || SECTIONS[0];
  const IconComponent = section.icon;
  const isHindi = lang === 'HN';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemId]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/study-materials?type=${section.type}`)
      .then(res => setMaterials(res.data))
      .catch(err => { console.error(err); setMaterials([]); })
      .finally(() => setLoading(false));
  }, [section.type]);

  const handleAdminClick = () => {
    const isLogged = localStorage.getItem("adminUser");
    if (isLogged) navigate("/admin/dashboard");
    else navigate("/admin/login");
  };

  const tradeGroups = materials.reduce((acc, m) => {
    const key = m.trade || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div>
      <TopBar t={t} setBaseFontSize={setBaseFontSize} setShowAdminModal={handleAdminClick} setLang={setLang} lang={lang} />
      <Header t={t} />
      <NavigationBar t={t} setShowApplyModal={() => navigate('/apply')} />
      <TickerTape t={t} notices={notices} />

      <main className="container" style={{ minHeight: '60vh', padding: '3rem 1rem' }}>

        {/* Section Header */}
        <div className="trades-section-header" style={{ marginBottom: '2rem' }}>
          <div className="trades-section-icon" style={{ background: `linear-gradient(135deg, ${section.color} 0%, ${section.color}cc 100%)` }}>
            <IconComponent size={28} style={{ color: '#fff' }} />
          </div>
          <h2>{isHindi ? section.titleHn : section.titleEn}</h2>
          <p>{isHindi ? 'सनशाइन आईटीआई कॉलेज के छात्रों के लिए आवश्यक शैक्षणिक सामग्री।' : 'Important academic resources for Sunshine ITI College students.'}</p>
        </div>

        {/* Sidebar Tabs + Content */}
        <div className="student-corner-layout">

          {/* Left: Navigation Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {SECTIONS.map(s => {
              const SIcon = s.icon;
              const isActive = s.id === itemId || (s.id === 'syllabus' && !itemId);
              return (
                <button
                  key={s.id}
                  onClick={() => navigate(`/student-corner/${s.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.7rem',
                    padding: '0.85rem 1rem', borderRadius: '10px', border: 'none',
                    textAlign: 'left', cursor: 'pointer', fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    backgroundColor: isActive ? s.bg : 'transparent',
                    color: isActive ? s.color : '#475569',
                    borderLeft: isActive ? `4px solid ${s.color}` : '4px solid transparent',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? `0 2px 8px ${s.color}22` : 'none',
                  }}
                >
                  <SIcon size={16} />
                  {isHindi ? s.titleHn : s.titleEn}
                </button>
              );
            })}
          </div>

          {/* Right: Files Content */}
          <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', overflow: 'hidden', borderTop: `5px solid ${section.color}` }}>
            
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: section.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconComponent size={22} style={{ color: section.color }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{isHindi ? section.titleHn : section.titleEn}</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>{loading ? 'Loading...' : `${materials.length} ${isHindi ? 'फ़ाइलें उपलब्ध' : 'file(s) available'}`}</p>
              </div>
            </div>

            {/* Files Body */}
            <div style={{ padding: '1.5rem 2rem' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <Loader size={36} style={{ margin: '0 auto 1rem', display: 'block', animation: 'spin 1s linear infinite' }} />
                  <p>Loading files...</p>
                </div>
              ) : materials.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
                  <IconComponent size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
                  <p style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{isHindi ? 'अभी कोई फ़ाइल उपलब्ध नहीं है' : 'No files available yet'}</p>
                  <p style={{ fontSize: '0.85rem' }}>{isHindi ? 'जल्द ही अपलोड की जाएगी।' : 'Check back later or contact administration.'}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {Object.entries(tradeGroups).map(([trade, files]) => (
                    <div key={trade}>
                      {/* Trade group header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: section.color, backgroundColor: section.bg, padding: '3px 10px', borderRadius: '20px' }}>
                          {isHindi ? (files[0]?.tradeHn || translateTrade(trade, true)) : trade}
                        </span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                      </div>

                      {/* Files under this trade */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {files.map(m => (
                          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.8rem' }}>
                            <div className="student-material-row">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: section.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <FileText size={18} style={{ color: section.color }} />
                                </div>
                                <div>
                                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: '#1e293b' }}>
                                    {isHindi ? (m.titleHn || translateTitle(m.title, true)) : m.title}
                                  </p>
                                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                                    {isHindi ? translateFileName(m.fileName, true) : m.fileName}
                                  </p>
                                </div>
                              </div>
                              <a
                                href={`${API_BASE}/study-materials/${m.id}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '6px',
                                  padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                                  backgroundColor: section.color, color: '#fff', textDecoration: 'none',
                                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                                  whiteSpace: 'nowrap', flexShrink: 0,
                                }}
                              >
                                <Download size={14} />
                                {isHindi ? 'डाउनलोड' : 'Download'}
                              </a>
                            </div>
                            {((isHindi && m.descriptionHn) ? m.descriptionHn : m.description) && (
                              <div style={{
                                padding: '1.25rem 1.5rem', borderRadius: '10px',
                                backgroundColor: '#fff', borderLeft: `4px solid ${section.color}`,
                                border: '1px solid #e2e8f0', fontSize: '0.88rem', color: '#334155',
                                lineHeight: '1.6', whiteSpace: 'pre-wrap',
                                textAlign: 'left', marginTop: '2px'
                              }}>
                                {((isHindi && m.descriptionHn) ? m.descriptionHn : m.description).split('\n').map((line, idx) => {
                                  if (line.trim().startsWith('### ')) {
                                    return <h4 key={idx} style={{ margin: '1rem 0 0.5rem 0', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>{line.trim().substring(4)}</h4>;
                                  }
                                  return <p key={idx} style={{ margin: '0 0 0.5rem 0' }}>{line}</p>;
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}
