import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, FileText, Link2, Copyright, Accessibility } from 'lucide-react';

// Layout Subcomponents
import TopBar from './TopBar';
import Header from './Header';
import NavigationBar from './NavigationBar';
import TickerTape from './TickerTape';
import Footer from './Footer';

const policiesData = {
  terms: {
    icon: FileText,
    titleEn: 'Terms of Use',
    titleHn: 'उपयोग की शर्तें',
    contentEn: (
      <div>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using the Sunshine Pvt. ITI portal, you agree to comply with and be bound by these Terms of Use. If you do not agree, please refrain from using the website.</p>
        <h3>2. Educational Content</h3>
        <p>All information, syllabus outlines, fee structures, and notifications displayed on this website are for general guidance and informational purposes only. The college management reserves the right to modify admission criteria and course structures without prior notice.</p>
        <h3>3. User Conduct</h3>
        <p>You agree to use this portal only for lawful purposes related to admissions, training inquiries, and academic updates. Any unauthorized modification of database records or network disruption is strictly prohibited.</p>
        <h3>4. Intellectual Property</h3>
        <p>The logo, design assets, and content of this website are the property of Sunshine Pvt. ITI and may not be reproduced, copied, or modified without prior written consent.</p>
      </div>
    ),
    contentHn: (
      <div>
        <h3>1. शर्तों की स्वीकृति</h3>
        <p>सनशाइन प्राइवेट आईटीआई पोर्टल का उपयोग करके, आप इन उपयोग की शर्तों का पालन करने और उनसे बाध्य होने के लिए सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।</p>
        <h3>2. शैक्षणिक सामग्री</h3>
        <p>इस वेबसाइट पर प्रदर्शित सभी जानकारी, पाठ्यक्रम, शुल्क विवरण और सूचनाएं केवल सामान्य मार्गदर्शन और जानकारी के उद्देश्यों के लिए हैं। कॉलेज प्रबंधन बिना किसी पूर्व सूचना के प्रवेश मानदंडों और पाठ्यक्रम संरचनाओं को संशोधित करने का अधिकार सुरक्षित रखता है।</p>
        <h3>3. उपयोगकर्ता आचरण</h3>
        <p>आप प्रवेश, प्रशिक्षण पूछताछ और शैक्षणिक अपडेट से संबंधित वैध उद्देश्यों के लिए ही इस पोर्टल का उपयोग करने के लिए सहमत हैं। डेटाबेस रिकॉर्ड के अनधिकृत संशोधन या नेटवर्क व्यवधान सख्त वर्जित है।</p>
        <h3>4. बौद्धिक संपदा</h3>
        <p>इस वेबसाइट का लोगो, डिज़ाइन संपत्तियां और सामग्री सनशाइन प्राइवेट आईटीआई की संपत्ति हैं और बिना पूर्व लिखित सहमति के इन्हें पुनः प्रस्तुत, कॉपी या संशोधित नहीं किया जा सकता है।</p>
      </div>
    )
  },
  privacy: {
    icon: ShieldCheck,
    titleEn: 'Privacy Policy',
    titleHn: 'गोपनीयता नीति',
    contentEn: (
      <div>
        <h3>1. Information Collection</h3>
        <p>We collect personal details (such as name, Aadhar number, Samagra ID, academic qualification, and address) solely when submitted voluntarily through our online admission application form.</p>
        <h3>2. Data Usage</h3>
        <p>All gathered information is processed exclusively for administrative verification, merit listing, and compliance reporting required by the Directorate of Skill Development (M.P.) and NCVT portals.</p>
        <h3>3. Data Protection</h3>
        <p>We implement appropriate physical, technical, and security measures to protect your personal details against unauthorized access, loss, or misuse. We do not sell or trade user data to third-party marketing companies.</p>
        <h3>4. Cookie Settings</h3>
        <p>The portal stores a local preference cookie (`itiPortalLang`) to remember your preferred language selection between Hindi and English across different pages.</p>
      </div>
    ),
    contentHn: (
      <div>
        <h3>1. सूचना संग्रह</h3>
        <p>हम व्यक्तिगत विवरण (जैसे नाम, आधार नंबर, समग्र आईडी, शैक्षणिक योग्यता और पता) केवल तभी एकत्र करते हैं जब वे हमारे ऑनलाइन प्रवेश आवेदन पत्र के माध्यम से स्वेच्छा से जमा किए जाते हैं।</p>
        <h3>2. डेटा का उपयोग</h3>
        <p>एकत्र की गई सभी जानकारी विशेष रूप से प्रशासनिक सत्यापन, मेरिट सूची बनाने और कौशल विकास निदेशालय (म.प्र.) और NCVT पोर्टलों द्वारा आवश्यक अनुपालन रिपोर्टिंग के लिए संसाधित की जाती है।</p>
        <h3>3. डेटा सुरक्षा</h3>
        <p>हम आपके व्यक्तिगत विवरणों को अनधिकृत पहुंच, हानि या दुरुपयोग से बचाने के लिए उचित भौतिक, तकनीकी और सुरक्षा उपायों को लागू करते हैं। हम तृतीय-पक्ष विपणन कंपनियों को उपयोगकर्ता डेटा नहीं बेचते हैं।</p>
        <h3>4. कुकी सेटिंग्स</h3>
        <p>पोर्टल विभिन्न पृष्ठों पर हिंदी और अंग्रेजी के बीच आपकी पसंदीदा भाषा चयन को याद रखने के लिए एक स्थानीय प्राथमिकता कुकी (`itiPortalLang`) संग्रहीत करता है।</p>
      </div>
    )
  },
  hyperlinking: {
    icon: Link2,
    titleEn: 'Hyperlinking Policy',
    titleHn: 'हाइपरलिंकिंग नीति',
    contentEn: (
      <div>
        <h3>1. Links to External Websites</h3>
        <p>This portal features quick links to external national and state portals (like NCVT MIS, DGET, MP Skills). These links are provided solely for the convenience of candidates. Sunshine Pvt. ITI is not responsible for the content, availability, or privacy practices of those linked external resources.</p>
        <h3>2. Permission for Hyperlinks</h3>
        <p>Prior permission is not required to link directly to the home page of this portal. However, framing our pages or displaying our content inside external frames is not permitted without explicit written authorization.</p>
      </div>
    ),
    contentHn: (
      <div>
        <h3>1. बाहरी वेबसाइटों के लिंक</h3>
        <p>इस पोर्टल में बाहरी राष्ट्रीय और राज्य पोर्टलों (जैसे NCVT MIS, DGET, MP Skills) के त्वरित लिंक शामिल हैं। ये लिंक केवल उम्मीदवारों की सुविधा के लिए प्रदान किए गए हैं। सनशाइन प्राइवेट आईटीआई उन जुड़े हुए बाहरी संसाधनों की सामग्री, उपलब्धता या गोपनीयता प्रथाओं के लिए ज़िम्मेदार नहीं है।</p>
        <h3>2. हाइपरलिंक्स के लिए अनुमति</h3>
        <p>इस पोर्टल के होम पेज से सीधे जुड़ने के लिए पूर्व अनुमति की आवश्यकता नहीं है। हालांकि, हमारे पेजों को बाहरी फ्रेम के अंदर प्रदर्शित करने की अनुमति लिखित प्राधिकरण के बिना नहीं है।</p>
      </div>
    )
  },
  copyright: {
    icon: Copyright,
    titleEn: 'Copyright Policy',
    titleHn: 'कॉपीराइट नीति',
    contentEn: (
      <div>
        <h3>1. Ownership of Materials</h3>
        <p>All materials featured on this website, including text documents, graphics, logos, icons, and layout structures, are protected under national and international copyright laws.</p>
        <h3>2. Allowed Reproduction</h3>
        <p>Trainees are permitted to download and print copies of the online admission application form, syllabus guidelines, and college prospectuses for personal and non-commercial educational use only.</p>
        <h3>3. Restrictions</h3>
        <p>Any reproduction, redistribution, or republishing of media or layout code from this website onto other internet platforms without prior written authorization is strictly prohibited.</p>
      </div>
    ),
    contentHn: (
      <div>
        <h3>1. सामग्री का स्वामित्व</h3>
        <p>इस वेबसाइट पर प्रदर्शित सभी सामग्रियां, जिनमें पाठ दस्तावेज, ग्राफिक्स, लोगो, आइकन और लेआउट संरचनाएं शामिल हैं, राष्ट्रीय और अंतर्राष्ट्रीय कॉपीराइट कानूनों के तहत संरक्षित हैं।</p>
        <h3>2. अनुमति प्राप्त प्रजनन</h3>
        <p>प्रशिक्षुओं को केवल व्यक्तिगत और गैर-व्यावसायिक शैक्षिक उपयोग के लिए ऑनलाइन प्रवेश आवेदन पत्र, पाठ्यक्रम दिशानिर्देशों और कॉलेज विवरणिकाओं की प्रतियां डाउनलोड और प्रिंट करने की अनुमति है।</p>
        <h3>3. प्रतिबंध</h3>
        <p>पूर्व लिखित अनुमति के बिना इस वेबसाइट के मीडिया या लेआउट कोड को अन्य इंटरनेट प्लेटफॉर्म पर पुनः प्रस्तुत करना, पुनर्वितरित करना या पुनर्प्रकाशित करना सख्त वर्जित है।</p>
      </div>
    )
  },
  accessibility: {
    icon: Accessibility,
    titleEn: 'Accessibility Statement',
    titleHn: 'एक्सेसिबिलिटी स्टेटमेंट',
    contentEn: (
      <div>
        <h3>1. Commitment to Accessibility</h3>
        <p>Sunshine Pvt. ITI is committed to ensuring that its web portal is accessible to all individuals, including users with visual, hearing, cognitive, or physical disabilities.</p>
        <h3>2. Key Features</h3>
        <p>To assist users, we have integrated standard font resizing tools in our Top Bar (+ / - / A) to dynamically modify text sizes for optimal legibility.</p>
        <p>Our website layout is fully responsive, resizing content layouts dynamically to fit mobile devices, tablets, and desktop displays comfortably.</p>
      </div>
    ),
    contentHn: (
      <div>
        <h3>1. सुगम्यता के प्रति प्रतिबद्धता</h3>
        <p>सनशाइन प्राइवेट आईटीआई यह सुनिश्चित करने के लिए प्रतिबद्ध है कि उसका वेब पोर्टल सभी व्यक्तियों के लिए सुलभ हो, जिसमें दृष्टि, श्रवण, संज्ञानात्मक या शारीरिक रूप से दिव्यांग उपयोगकर्ता शामिल हैं।</p>
        <h3>2. मुख्य विशेषताएं</h3>
        <p>उपयोगकर्ताओं की सहायता के लिए, हमने पाठ आकारों को गतिशील रूप से संशोधित करने के लिए हमारे शीर्ष बार में मानक फ़ॉन्ट आकार बदलने वाले टूल (+ / - / A) को एकीकृत किया है।</p>
        <p>हमारी वेबसाइट का लेआउट पूरी तरह से प्रतिक्रियाशील (responsive) है, जो मोबाइल उपकरणों, टैबलेट और डेस्कटॉप डिस्प्ले पर सहजता से फिट होने के लिए सामग्री लेआउट को गतिशील रूप से बदलता है।</p>
      </div>
    )
  }
};

export default function PolicyPage({
  baseFontSize,
  setBaseFontSize,
  notices
}) {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const { policyId } = useParams();

  // Find policy config or fallback to terms
  const policy = policiesData[policyId] || policiesData.terms;
  const IconComponent = policy.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [policyId]);

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
            <IconComponent size={28} style={{ color: '#fff' }} />
          </div>
          <h2>{isHindi ? policy.titleHn : policy.titleEn}</h2>
          <p>
            {isHindi 
              ? 'सनशाइन प्राइवेट आईटीआई कॉलेज की आधिकारिक नीति विवरण।' 
              : 'Official policy statement of Sunshine Pvt. ITI College.'
            }
          </p>
        </div>

        <div className="policy-detail-card" style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '6px solid #1e3a5f', lineHeight: '1.8' }}>
          {isHindi ? policy.contentHn : policy.contentEn}
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}
