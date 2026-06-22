import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  EN: {
    backToHome: "← Back to Home",
    printForm: "Print Application Form",
    verifyTitle: "Verify Your Details Before Submission",
    verifyNotice: "Please review all the information below carefully. Once submitted, changes cannot be made without contacting the administration.",
    tradeApplied: "Trade Applied",
    editForm: "Edit Form",
    confirmSubmit: "Confirm & Submit",
    submittedTitle: "Application Submitted Successfully!",
    submittedDesc: "Your admission application has been registered. Please print a copy of this form for verification during admissions.",
    applicationNumber: "Application Number",
    applicationNumNotice: "Please note down this application number for future monthly/installment fee payments.",
    printApp: "Print Application Form",
    date: "Date",
    personalDetails: "Personal Details",
    academicDetails: "Academic Qualification Details",
    declaration: "Declaration: I hereby declare that all statements made in this application are true, complete and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect, my candidature will be cancelled.",
    studentSignature: "Candidate's Signature",
    authority: "Authorized Signatory",
    tradeDetails: "Trade Preference Choice",
    tradeLabel: "Preferred Trade Name *",
    contactDetails: "Contact & Address Information",
    documentUpload: "Required Document Uploads",
    applicationStatus: "Application Status",
    underProcess: "Under Process",
    approved: "Approved",
    rejected: "Rejected",
    remainingPay: "Remaining Pay",
    
    // Homepage Translations
    phone: "Phone",
    email: "Email",
    ncvt: "NCVT Affiliated",
    admin: "Admin Portal",
    lang: "हिन्दी (HN)",
    title: "Sunshine",
    tagline: "Empowering Youth with Industrial Skills",
    mis: "MIS Code: PU23001071",
    home: "Home",
    about: "About Us",
    trades: "Trades",
    admissions: "Admissions",
    placement: "Placements",
    contact: "Contact Us",
    applyNow: "Apply Now",
    latestUpdates: "Latest Updates",
    heroTitle: "Empowering Youth with",
    heroTitleHighlight: "Industrial Skills",
    heroDesc: "A premier vocational training institute under the Directorate of Skill Development (M.P.), providing NCVT affiliated courses to build a skilled global workforce.",
    applyOnline: "Apply Online",
    downloadProspectus: "Download Prospectus",
    quickLinks: "Quick Links",
    studentCorner: "Student Corner",
    welcomeTitle: "Welcome to Sunshine",
    welcomeText1: "Sunshine is a leading vocational training institute established with the vision of imparting high-quality technical skills to the youth of Madhya Pradesh. Affiliated with the National Council for Vocational Training (NCVT), New Delhi, we adhere to global standards of training and skill development.",
    welcomeText2: "Our state-of-the-art workshops, highly experienced faculty, and strong industry placements ensure that our students are industry-ready and secure exceptional career opportunities in both public and private sectors.",
    principalTitle: "Principal's Message",
    principalQuote: "Education is not just about learning facts, but training the mind to think and the hands to create. At Sunshine, we strive to transform students into skilled professionals who drive industrial innovation and growth.",
    principalName: "Sarfaraj Ahmed Baig",
    principalDesg: "Principal, Sunshine",
    noticeBoard: "Notice Board",
    impLinks: "IMPORTANT LINKS",
    contactAddress: "CONTACT ADDRESS",
    location: "Kuldevi Marhai Mata Mandir, Barapatthar, Seoni, Madhya Pradesh - 480661",
    webPolicies: "WEBSITE POLICIES",
    visitorCount: "Visitor Count",
    locationTitle: "OUR LOCATION",
    getDirections: "Get Directions",
    copyright: "© 2026 Sunshine. All Rights Reserved.",
    credits: "Designed & Developed by Sunshine IT Team & Inam Ahmad Baig | AFFILIATION - DGT-12/1/18-TC"
  },
  HN: {
    backToHome: "← मुख्य पृष्ठ पर वापस जाएं",
    printForm: "आवेदन फॉर्म प्रिंट करें",
    verifyTitle: "जमा करने से पहले अपने विवरण सत्यापित करें",
    verifyNotice: "कृपया नीचे दी गई सभी जानकारी की ध्यानपूर्वक समीक्षा करें। एक बार जमा करने के बाद, प्रशासन से संपर्क किए बिना कोई बदलाव नहीं किया जा सकता है।",
    tradeApplied: "आवेदन किया गया ट्रेड",
    editForm: "फॉर्म संशोधित करें",
    confirmSubmit: "सत्यापित करें और जमा करें",
    submittedTitle: "आवेदन सफलता पूर्वक जमा हुआ!",
    submittedDesc: "आपका प्रवेश आवेदन पंजीकृत कर लिया गया है। कृपया प्रवेश के दौरान सत्यापन के लिए इस फॉर्म की एक प्रति प्रिंट करें।",
    applicationNumber: "आवेदन क्रमांक (Application ID)",
    applicationNumNotice: "भविष्य में मासिक किस्त या फीस भुगतान करने के लिए कृपया इस आवेदन क्रमांक को नोट कर लें।",
    printApp: "आवेदन फॉर्म प्रिंट करें",
    date: "दिनांक",
    personalDetails: "व्यक्तिगत विवरण",
    academicDetails: "शैक्षणिक योग्यता विवरण",
    declaration: "घोषणा: मैं एतद्द्वारा घोषित करता हूँ कि इस आवेदन में किए गए सभी विवरण मेरी सर्वोत्तम जानकारी और विश्वास के अनुसार सत्य, पूर्ण और सही हैं। मैं समझता हूँ कि किसी भी जानकारी के गलत या असत्य पाए जाने पर मेरी उम्मीदवारी रद्द कर दी जाएगी।",
    studentSignature: "उम्मीदवार के हस्ताक्षर",
    authority: "अधिकृत हस्ताक्षरकर्ता",
    tradeDetails: "ट्रेड प्राथमिकता विकल्प",
    tradeLabel: "पसंदीदा ट्रेड का नाम *",
    contactDetails: "संपर्क और पते की जानकारी",
    documentUpload: "आवश्यक दस्तावेज अपलोड",
    applicationStatus: "आवेदन की स्थिति",
    underProcess: "प्रक्रियाधीन (Under Process)",
    approved: "स्वीकृत (Approved)",
    rejected: "अस्वीकृत (Rejected)",
    remainingPay: "शेष शुल्क (Remaining Pay)",

    // Homepage Translations
    phone: "दूरभाष",
    email: "ईमेल",
    ncvt: "NCVT संबद्धता",
    admin: "एडमिन पोर्टल",
    lang: "English (EN)",
    title: "सनशाइन आईटीआई",
    tagline: "औद्योगिक कौशल के साथ युवाओं का सशक्तिकरण",
    mis: "MIS कोड: PU23001071",
    home: "होम",
    about: "हमारे बारे में",
    trades: "ट्रेड्स",
    admissions: "प्रवेश",
    placement: "प्लेसमेंट",
    contact: "संपर्क करें",
    applyNow: "अभी आवेदन करें",
    latestUpdates: "नवीनतम अपडेट",
    heroTitle: "युवाओं को सशक्त बनाना",
    heroTitleHighlight: "औद्योगिक कौशल से",
    heroDesc: "कौशल विकास निदेशालय (म.प्र.) के तहत एक प्रमुख व्यावसायिक प्रशिक्षण संस्थान, जो एक कुशल वैश्विक कार्यबल बनाने के लिए NCVT संबद्ध पाठ्यक्रम प्रदान करता है।",
    applyOnline: "ऑनलाइन आवेदन",
    downloadProspectus: "विवरणिका डाउनलोड करें",
    quickLinks: "त्वरित लिंक",
    studentCorner: "छात्र कोना",
    welcomeTitle: "सनशाइन आईटीआई में स्वागत है",
    welcomeText1: "सनशाइन आईटीआई मध्य प्रदेश के युवाओं को उच्च गुणवत्ता वाले तकनीकी कौशल प्रदान करने के दृष्टिकोण के साथ स्थापित एक अग्रणी व्यावसायिक प्रशिक्षण संस्थान है। राष्ट्रीय व्यावसायिक प्रशिक्षण परिषद (NCVT), नई दिल्ली से संबद्ध, हम प्रशिक्षण और कौशल विकास के वैश्विक मानकों का पालन करते हैं।",
    welcomeText2: "हमारी अत्याधुनिक कार्यशालाएं, अत्यधिक अनुभवी संकाय और मजबूत औद्योगिक प्लेसमेंट यह सुनिश्चित करते हैं कि हमारे छात्र उद्योग के लिए तैयार हैं और सरकारी और निजी दोनों क्षेत्रों में असाधारण करियर के अवसर सुरक्षित करते हैं।",
    principalTitle: "प्राचार्य का संदेश",
    principalQuote: "शिक्षा केवल तथ्यों को सीखने के बारे में नहीं है, बल्कि सोचने के लिए दिमाग और निर्माण करने के लिए हाथों को प्रशिक्षित करने के बारे में है। सनशाइन आईटीआई में, हम छात्रों को कुशल पेशेवरों में बदलने का प्रयास करते हैं जो औद्योगिक नवाचार और विकास को गति देते हैं।",
    principalName: "सरफराज अहमद बैग",
    principalDesg: "प्राचार्य, सनशाइन आईटीआई",
    noticeBoard: "सूचना पट्ट",
    impLinks: "महत्वपूर्ण लिंक",
    contactAddress: "संपर्क पता",
    location: "कुलदेवी मरहाई माता मंदिर, बारापत्थर, सिवनी, मध्य प्रदेश - 480661",
    webPolicies: "वेबसाइट नीतियां",
    visitorCount: "आगंतुक संख्या",
    locationTitle: "हमारा स्थान",
    getDirections: "दिशा-निर्देश प्राप्त करें",
    copyright: "© 2026 सनशाइन आईटीआई। सर्वाधिकार सुरक्षित।",
    credits: "डिज़ाइन और विकास: Sunshine IT Team और Inam Ahmad Baig | संबद्धता - DGT-12/1/18-TC"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('itiPortalLang') || 'EN';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('itiPortalLang', newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
