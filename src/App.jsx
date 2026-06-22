import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';

// Subcomponents
import TopBar from './components/TopBar';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import TickerTape from './components/TickerTape';
import Hero from './components/Hero';
import LeftColumn from './components/LeftColumn';
import CenterColumn from './components/CenterColumn';
import RightColumn from './components/RightColumn';
import Footer from './components/Footer';
import AdmissionForm from './components/AdmissionForm';

// Authentication Pages
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ForgotUsername from './components/ForgotUsername';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';
import TradesPage from './components/TradesPage';
import AboutPage from './components/AboutPage';
import AdmissionsPage from './components/AdmissionsPage';
import PlacementsPage from './components/PlacementsPage';
import ContactPage from './components/ContactPage';
import PolicyPage from './components/PolicyPage';
import StudentCornerPage from './components/StudentCornerPage';
import PayFee from './components/PayFee';
import Gallery from './components/Gallery';
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard';

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api`;

const fallbackNotices = [
  { id: 1, title: "NCVT Main Examination Schedule August 2026 Released", date: "2026-06-14", isNew: true, link: "#" },
  { id: 2, title: "Admissions Open for Session 2026-27 in Electrician & Fitter Trades", date: "2026-06-13", isNew: true, link: "#" },
  { id: 3, title: "Campus Placement Drive by Suzuki Motors on 25th June 2026", date: "2026-06-12", isNew: true, link: "#" },
  { id: 4, title: "Scholarship Portal Open for SC/ST/OBC Students - Apply Online", date: "2026-06-10", isNew: false, link: "#" },
  { id: 5, title: "List of Shortlisted Candidates for Apprenticeship Program", date: "2026-06-08", isNew: false, link: "#" }
];

function PortalHome({
  baseFontSize,
  setBaseFontSize,
  notices
}) {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrollTo state when navigating back to home from another page
  useEffect(() => {
    if (location.state?.scrollTo) {
      // Small delay to let the DOM render
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      // Clear the state so it doesn't re-scroll on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle hash-based scrolling on initial page load
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

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

      {/* 5. Hero Section */}
      <Hero t={t} setShowApplyModal={() => navigate('/apply')} />

      {/* 6. Main Body (Three-Column Layout) */}
      <main className="container main-body">
        <div className="three-column-grid">
          {/* Left Column */}
          <LeftColumn t={t} />

          {/* Center Column */}
          <CenterColumn t={t} />

          {/* Right Column */}
          <RightColumn t={t} notices={notices} />
        </div>
      </main>

      {/* 8. Footer Section */}
      <Footer t={t} />
    </div>
  );
}

export default function App() {
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [notices, setNotices] = useState([]);
  
  // Font resizer logic
  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', `${baseFontSize}px`);
  }, [baseFontSize]);

  // Fetch notices
  const loadNotices = () => {
    fetch(`${API_BASE}/notices`)
      .then(res => {
        if (!res.ok) throw new Error("API Offline");
        return res.json();
      })
      .then(data => {
        const mappedData = data.map(n => ({ ...n, isNew: n.isNew !== undefined ? n.isNew : n.new }));
        const sorted = mappedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotices(sorted);
      })
      .catch(() => {
        console.log("Using fallback notices.");
        setNotices(fallbackNotices);
      });
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // Disable scroll wheel modifications on number inputs globally
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target && e.target.type === 'number') {
        e.target.blur();
      } else if (document.activeElement && document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    };
    document.addEventListener('wheel', handleWheel);
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PortalHome 
            baseFontSize={baseFontSize}
            setBaseFontSize={setBaseFontSize}
            notices={notices}
          />
        } />
        <Route path="/apply" element={<AdmissionForm />} />
        <Route path="/pay-fee" element={<PayFee />} />
        <Route path="/trades" element={
          <TradesPage 
            baseFontSize={baseFontSize}
            setBaseFontSize={setBaseFontSize}
            notices={notices}
          />
        } />
        <Route path="/about" element={
          <AboutPage 
            baseFontSize={baseFontSize}
            setBaseFontSize={setBaseFontSize}
            notices={notices}
          />
        } />
        <Route path="/admissions" element={
          <AdmissionsPage 
            baseFontSize={baseFontSize}
            setBaseFontSize={setBaseFontSize}
            notices={notices}
          />
        } />
        <Route path="/placements" element={
          <PlacementsPage 
            baseFontSize={baseFontSize}
            setBaseFontSize={setBaseFontSize}
            notices={notices}
          />
        } />
        <Route path="/contact" element={
          <ContactPage 
            baseFontSize={baseFontSize}
            setBaseFontSize={setBaseFontSize}
            notices={notices}
          />
        } />
        <Route path="/policies/:policyId" element={
          <PolicyPage 
            baseFontSize={baseFontSize}
            setBaseFontSize={setBaseFontSize}
            notices={notices}
          />
        } />
        <Route path="/student-corner/:itemId" element={
          <StudentCornerPage 
            baseFontSize={baseFontSize}
            setBaseFontSize={setBaseFontSize}
            notices={notices}
          />
        } />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/forgot-username" element={<ForgotUsername />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard activeTab="dashboard" />} />
        <Route path="/admin/all-payments" element={<AdminDashboard activeTab="all-payments" />} />
        <Route path="/admin/pending-payments" element={<AdminDashboard activeTab="pending-payments" />} />
        <Route path="/admin/pending-installments" element={<AdminDashboard activeTab="pending-installments" />} />
        <Route path="/admin/all-students" element={<AdminDashboard activeTab="all-students" />} />
        <Route path="/admin/offline-admission" element={<AdminDashboard activeTab="offline-admission" />} />
        <Route path="/admin/notifications" element={<AdminDashboard activeTab="notifications" />} />
        <Route path="/admin/manage-notices" element={<AdminDashboard activeTab="manage-notices" />} />
        <Route path="/admin/manage-gallery" element={<AdminDashboard activeTab="manage-gallery" />} />
        <Route path="/admin/manage-results" element={<AdminDashboard activeTab="manage-results" />} />
        <Route path="/admin/study-materials" element={<AdminDashboard activeTab="study-materials" />} />
        <Route path="/admin/inquiries" element={<AdminDashboard activeTab="inquiries" />} />
        <Route path="/admin/profile" element={<AdminDashboard activeTab="profile" />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
