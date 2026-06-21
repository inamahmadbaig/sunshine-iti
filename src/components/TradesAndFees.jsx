import React, { useState } from 'react';
import { 
  GraduationCap, 
  IndianRupee, 
  Clock, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Monitor, 
  Zap, 
  HeartPulse, 
  Laptop,
  CheckCircle,
  Users
} from 'lucide-react';

const tradesData = [
  {
    id: 'electrician',
    name: 'Electrician',
    nameHn: 'इलेक्ट्रीशियन',
    fee: 40000,
    duration: '2 Years (4 Semesters)',
    durationHn: '2 वर्ष (4 सेमेस्टर)',
    eligibility: '10th Pass (with Science & Maths)',
    eligibilityHn: '10वीं पास (विज्ञान और गणित सहित)',
    seats: 42,
    icon: Zap,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accentColor: '#4facfe',
    syllabus: [
      'Electrical Fundamentals & Safety Practices',
      'AC & DC Theory and Circuits',
      'Domestic & Industrial Wiring Installation',
      'Electrical Measuring Instruments',
      'Transformer – Construction, Testing & Maintenance',
      'AC & DC Motors and Generators',
      'Electrical Drawing & Estimation',
      'Power Distribution & Transmission Systems',
      'PLC (Programmable Logic Controller) Basics',
      'Batteries – Types, Charging & Maintenance',
      'Earthing, Lightning Protection & IE Rules',
      'Workshop Practice & On-the-Job Training'
    ],
    syllabusHn: [
      'विद्युत के मूल सिद्धांत एवं सुरक्षा',
      'AC एवं DC सिद्धांत और परिपथ',
      'घरेलू एवं औद्योगिक वायरिंग',
      'विद्युत मापन उपकरण',
      'ट्रांसफॉर्मर – निर्माण, परीक्षण एवं रखरखाव',
      'AC एवं DC मोटर तथा जनरेटर',
      'इलेक्ट्रिकल ड्राइंग एवं अनुमान',
      'विद्युत वितरण एवं संचरण प्रणाली',
      'PLC (प्रोग्रामेबल लॉजिक कंट्रोलर) मूल सिद्धांत',
      'बैटरी – प्रकार, चार्जिंग एवं रखरखाव',
      'अर्थिंग, तड़ित संरक्षण एवं IE नियम',
      'कार्यशाला अभ्यास एवं ऑन-द-जॉब प्रशिक्षण'
    ]
  },
  {
    id: 'hsi',
    name: 'Health Sanitary Inspector',
    nameHn: 'स्वास्थ्य सेनेटरी इंस्पेक्टर',
    fee: 28000,
    duration: '1 Year (2 Semesters)',
    durationHn: '1 वर्ष (2 सेमेस्टर)',
    eligibility: '12th Pass (Science – Biology)',
    eligibilityHn: '12वीं पास (विज्ञान – जीव विज्ञान)',
    seats: 26,
    icon: HeartPulse,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    accentColor: '#43e97b',
    syllabus: [
      'Introduction to Public Health & Hygiene',
      'Anatomy & Physiology – Human Body Systems',
      'Microbiology & Communicable Diseases',
      'Environmental Sanitation & Waste Management',
      'Water Supply, Purification & Quality Testing',
      'Food Safety, Adulteration & FSSAI Standards',
      'Epidemiology & Disease Surveillance',
      'Maternal & Child Health Care (MCH)',
      'First Aid & Emergency Medical Response',
      'Health Education & Community Medicine',
      'Public Health Laws & Acts (Pollution, Sanitation)',
      'Field Visit, Practical Training & Project Report'
    ],
    syllabusHn: [
      'जन स्वास्थ्य एवं स्वच्छता का परिचय',
      'शरीर रचना विज्ञान एवं शरीर क्रिया विज्ञान',
      'सूक्ष्मजीव विज्ञान एवं संचारी रोग',
      'पर्यावरणीय स्वच्छता एवं कचरा प्रबंधन',
      'जल आपूर्ति, शुद्धिकरण एवं गुणवत्ता परीक्षण',
      'खाद्य सुरक्षा, मिलावट एवं FSSAI मानक',
      'महामारी विज्ञान एवं रोग निगरानी',
      'मातृ एवं शिशु स्वास्थ्य देखभाल (MCH)',
      'प्राथमिक चिकित्सा एवं आपातकालीन चिकित्सा',
      'स्वास्थ्य शिक्षा एवं सामुदायिक चिकित्सा',
      'जन स्वास्थ्य कानून (प्रदूषण, स्वच्छता अधिनियम)',
      'क्षेत्र भ्रमण, व्यावहारिक प्रशिक्षण एवं प्रोजेक्ट रिपोर्ट'
    ]
  },
  {
    id: 'dca',
    name: 'DCA (Diploma in Computer Application)',
    nameHn: 'DCA (कंप्यूटर एप्लीकेशन में डिप्लोमा)',
    fee: 11000,
    duration: '1 Year',
    durationHn: '1 वर्ष',
    eligibility: '10th / 12th Pass',
    eligibilityHn: '10वीं / 12वीं पास',
    seats: 60,
    icon: Monitor,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accentColor: '#667eea',
    syllabus: [
      'Computer Fundamentals & Operating Systems',
      'MS Office (Word, Excel, PowerPoint, Access)',
      'Internet & Email Applications',
      'Hindi & English Typing (Mangal / Kruti Dev)',
      'Tally ERP 9 / Tally Prime – Accounting',
      'Basic Hardware & Networking',
      'Desktop Publishing (DTP) – Photoshop, CorelDRAW',
      'Introduction to Programming (C Language)',
      'Database Management Systems (DBMS)',
      'Project Work & Practical Examination'
    ],
    syllabusHn: [
      'कंप्यूटर के मूल सिद्धांत एवं ऑपरेटिंग सिस्टम',
      'एमएस ऑफिस (वर्ड, एक्सेल, पावरपॉइंट, एक्सेस)',
      'इंटरनेट और ईमेल एप्लीकेशन',
      'हिंदी और अंग्रेजी टाइपिंग (मंगल / कृति देव)',
      'टैली ERP 9 / टैली प्राइम – लेखांकन',
      'बेसिक हार्डवेयर और नेटवर्किंग',
      'डेस्कटॉप पब्लिशिंग (DTP) – फ़ोटोशॉप, कोरल ड्रा',
      'प्रोग्रामिंग का परिचय (C भाषा)',
      'डेटाबेस प्रबंधन प्रणाली (DBMS)',
      'परियोजना कार्य एवं प्रायोगिक परीक्षा'
    ]
  },
  {
    id: 'pgdca',
    name: 'PGDCA (Post Graduate Diploma in Computer Application)',
    nameHn: 'PGDCA (कंप्यूटर एप्लीकेशन में स्नातकोत्तर डिप्लोमा)',
    fee: 12000,
    duration: '1 Year',
    durationHn: '1 वर्ष',
    eligibility: 'Graduation (Any Stream)',
    eligibilityHn: 'स्नातक (कोई भी स्ट्रीम)',
    seats: 40,
    icon: Laptop,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accentColor: '#f5576c',
    syllabus: [
      'Advanced Computer Fundamentals & IT Concepts',
      'Programming with C & C++',
      'Data Structures & Algorithms',
      'Database Management System (SQL, Oracle)',
      'Web Development (HTML, CSS, JavaScript)',
      'Object-Oriented Programming with Java',
      'Software Engineering & SDLC',
      'Computer Network & Internet Technologies',
      'Tally Prime with GST Accounting',
      'Advanced MS Office & Cloud Computing Basics',
      'Python Programming Fundamentals',
      'Major Project & Viva-Voce'
    ],
    syllabusHn: [
      'उन्नत कंप्यूटर के मूल सिद्धांत एवं आईटी अवधारणाएँ',
      'C एवं C++ प्रोग्रामिंग',
      'डेटा स्ट्रक्चर एवं एल्गोरिदम',
      'डेटाबेस प्रबंधन प्रणाली (SQL, Oracle)',
      'वेब डेवलपमेंट (HTML, CSS, JavaScript)',
      'ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (Java)',
      'सॉफ्टवेयर इंजीनियरिंग एवं SDLC',
      'कंप्यूटर नेटवर्क एवं इंटरनेट तकनीक',
      'टैली प्राइम (GST लेखांकन सहित)',
      'एडवांस्ड एमएस ऑफिस एवं क्लाउड कंप्यूटिंग',
      'पायथन प्रोग्रामिंग के मूल सिद्धांत',
      'मेजर प्रोजेक्ट एवं मौखिक परीक्षा'
    ]
  }
];

export default function TradesAndFees({ t, lang }) {
  const [expandedTrade, setExpandedTrade] = useState(null);

  const toggleSyllabus = (id) => {
    setExpandedTrade(expandedTrade === id ? null : id);
  };

  const isHindi = lang === 'HN';

  return (
    <section className="trades-fees-section" id="trades">
      <div className="container">
        {/* Section Header */}
        <div className="trades-section-header">
          <div className="trades-section-icon">
            <GraduationCap size={28} />
          </div>
          <h2>{isHindi ? 'हमारे ट्रेड एवं शुल्क विवरण' : 'Our Trades & Fee Structure'}</h2>
          <p>{isHindi 
            ? 'Sunshine ITI College में उपलब्ध सभी ट्रेड, उनकी फीस, पात्रता और विस्तृत पाठ्यक्रम की जानकारी नीचे दी गई है।' 
            : 'Explore all trades offered at Sunshine ITI College with detailed fee structure, eligibility criteria, and comprehensive syllabus.'
          }</p>
        </div>

        {/* Trade Cards Grid */}
        <div className="trades-grid">
          {tradesData.map((trade) => {
            const IconComponent = trade.icon;
            const isExpanded = expandedTrade === trade.id;
            const syllabusList = isHindi ? trade.syllabusHn : trade.syllabus;

            return (
              <div className="trade-card" key={trade.id}>
                {/* Card Top Gradient Bar */}
                <div className="trade-card-accent" style={{ background: trade.gradient }} />
                
                {/* Card Body */}
                <div className="trade-card-body">
                  {/* Icon & Title */}
                  <div className="trade-card-header">
                    <div className="trade-icon" style={{ background: trade.gradient }}>
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h3 className="trade-title">{isHindi ? trade.nameHn : trade.name}</h3>
                      <span className="trade-affiliation">NCVT / SCVT {isHindi ? 'संबद्ध' : 'Affiliated'}</span>
                    </div>
                  </div>

                  {/* Key Info Pills */}
                  <div className="trade-info-grid">
                    <div className="trade-info-item">
                      <IndianRupee size={15} />
                      <div>
                        <span className="info-label">{isHindi ? 'वार्षिक शुल्क' : 'Annual Fee'}</span>
                        <span className="info-value fee-value">₹{trade.fee.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="trade-info-item">
                      <Clock size={15} />
                      <div>
                        <span className="info-label">{isHindi ? 'अवधि' : 'Duration'}</span>
                        <span className="info-value">{isHindi ? trade.durationHn : trade.duration}</span>
                      </div>
                    </div>
                    <div className="trade-info-item">
                      <BookOpen size={15} />
                      <div>
                        <span className="info-label">{isHindi ? 'पात्रता' : 'Eligibility'}</span>
                        <span className="info-value">{isHindi ? trade.eligibilityHn : trade.eligibility}</span>
                      </div>
                    </div>
                    <div className="trade-info-item">
                      <Users size={15} />
                      <div>
                        <span className="info-label">{isHindi ? 'सीटें' : 'Seats'}</span>
                        <span className="info-value">{trade.seats} {isHindi ? 'छात्र' : 'Students'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus Toggle Button */}
                  <button
                    className={`syllabus-toggle-btn ${isExpanded ? 'active' : ''}`}
                    onClick={() => toggleSyllabus(trade.id)}
                    style={{ '--accent': trade.accentColor }}
                  >
                    <BookOpen size={16} />
                    {isExpanded 
                      ? (isHindi ? 'पाठ्यक्रम छिपाएं' : 'Hide Syllabus') 
                      : (isHindi ? 'पाठ्यक्रम देखें' : 'View Syllabus')
                    }
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Expandable Syllabus */}
                  <div className={`syllabus-panel ${isExpanded ? 'expanded' : ''}`}>
                    <div className="syllabus-panel-inner">
                      <h4 className="syllabus-heading" style={{ color: trade.accentColor }}>
                        <BookOpen size={16} />
                        {isHindi ? 'विस्तृत पाठ्यक्रम' : 'Detailed Syllabus'}
                      </h4>
                      <ul className="syllabus-list">
                        {syllabusList.map((item, idx) => (
                          <li key={idx}>
                            <CheckCircle size={14} style={{ color: trade.accentColor }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fee Disclaimer */}
        <div className="fee-disclaimer">
          <p>
            {isHindi 
              ? '* उपरोक्त शुल्क में ट्यूशन फीस, प्रायोगिक शुल्क एवं परीक्षा शुल्क शामिल हैं। छात्रावास एवं परिवहन शुल्क अलग से लागू होंगे। SC/ST/OBC छात्रों के लिए छात्रवृत्ति उपलब्ध है।'
              : '* Fees include tuition, practical charges & examination fees. Hostel and transport charges applicable separately. Scholarships available for SC/ST/OBC students.'
            }
          </p>
        </div>
      </div>
    </section>
  );
}
