import React, { useState } from 'react';
import axios from 'axios';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  User,
  FileText,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

export default function ContactUs({ t, lang }) {
  const isHindi = lang === 'HN';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/inquiries`, formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert(isHindi ? 'संदेश भेजने में त्रुटि हुई। कृपया बाद में प्रयास करें।' : 'Failed to send message. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-us-section" id="contact">
      <div className="container">

        {/* Section Header */}
        <div className="contact-section-header">
          <div className="contact-section-icon">
            <MessageSquare size={28} />
          </div>
          <h2>{isHindi ? 'हमसे संपर्क करें' : 'Contact Us'}</h2>
          <p>
            {isHindi
              ? 'किसी भी प्रश्न, प्रवेश संबंधी जानकारी, या सहायता के लिए हमसे संपर्क करें। हम आपकी सेवा में तत्पर हैं।'
              : 'Have questions about admissions, courses, or anything else? Reach out to us — we\'d love to hear from you.'
            }
          </p>
        </div>

        <div className="contact-layout">

          {/* Left: Contact Info Cards */}
          <div className="contact-info-col">

            {/* Phone Card */}
            <div className="contact-info-card">
              <div className="contact-info-card-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                <Phone size={20} />
              </div>
              <div className="contact-info-card-text">
                <h4>{isHindi ? 'फ़ोन नंबर' : 'Phone Numbers'}</h4>
                <a href="tel:+917415491034">+91-7415491034</a>
              </div>
            </div>

            {/* Email Card */}
            <div className="contact-info-card">
              <div className="contact-info-card-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                <Mail size={20} />
              </div>
              <div className="contact-info-card-text">
                <h4>{isHindi ? 'ईमेल पता' : 'Email Address'}</h4>
                <a href="mailto:sunshineiti8@gmail.com">sunshineiti8@gmail.com</a>
              </div>
            </div>

            {/* Address Card */}
            <div className="contact-info-card">
              <div className="contact-info-card-icon" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
                <MapPin size={20} />
              </div>
              <div className="contact-info-card-text">
                <h4>{isHindi ? 'पता' : 'Address'}</h4>
                <p>
                  {isHindi
                    ? 'कुलदेवी मरहाई माता मंदिर, बारापत्थर, सिवनी, मध्य प्रदेश - 480661'
                    : 'Kuldevi Marhai Mata Mandir, Barapatthar, Seoni, Madhya Pradesh - 480661'
                  }
                </p>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="contact-info-card">
              <div className="contact-info-card-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                <Clock size={20} />
              </div>
              <div className="contact-info-card-text">
                <h4>{isHindi ? 'कार्यालय समय' : 'Office Hours'}</h4>
                <p>{isHindi ? 'सोमवार - शनिवार: सुबह 9:00 - शाम 5:00' : 'Monday - Saturday: 9:00 AM - 5:00 PM'}</p>
                <p style={{ color: 'var(--danger-color)', fontWeight: 600, fontSize: '0.82rem' }}>
                  {isHindi ? 'रविवार: बंद' : 'Sunday: Closed'}
                </p>
              </div>
            </div>

            {/* Get Directions Button */}
            <a
              href="https://www.google.com/maps?q=22.096317,79.555284"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-directions-btn"
            >
              <ExternalLink size={16} />
              {isHindi ? 'गूगल मैप पर दिशा-निर्देश' : 'Get Directions on Google Maps'}
            </a>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <div className="contact-form-header">
                <Send size={20} />
                <h3>{isHindi ? 'हमें संदेश भेजें' : 'Send Us a Message'}</h3>
              </div>

              {submitted && (
                <div className="contact-success-msg">
                  <CheckCircle size={18} />
                  <span>
                    {isHindi
                      ? 'आपका संदेश सफलतापूर्वक भेज दिया गया है! हम जल्द ही आपसे संपर्क करेंगे।'
                      : 'Your message has been sent successfully! We\'ll get back to you soon.'
                    }
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label>
                      <User size={14} />
                      {isHindi ? 'पूरा नाम' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      required
                      placeholder={isHindi ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="contact-form-group">
                    <label>
                      <Phone size={14} />
                      {isHindi ? 'मोबाइल नंबर' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      required
                      placeholder={isHindi ? 'मोबाइल नंबर दर्ज करें' : 'Enter phone number'}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label>
                      <Mail size={14} />
                      {isHindi ? 'ईमेल' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      required
                      placeholder={isHindi ? 'ईमेल दर्ज करें' : 'Enter email address'}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="contact-form-group">
                    <label>
                      <FileText size={14} />
                      {isHindi ? 'विषय' : 'Subject'} *
                    </label>
                    <select
                      name="subject"
                      className="form-control"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">{isHindi ? '-- विषय चुनें --' : '-- Select Subject --'}</option>
                      <option value="admission">{isHindi ? 'प्रवेश संबंधी जानकारी' : 'Admission Inquiry'}</option>
                      <option value="fees">{isHindi ? 'शुल्क संबंधी जानकारी' : 'Fee Structure'}</option>
                      <option value="placement">{isHindi ? 'प्लेसमेंट' : 'Placement Information'}</option>
                      <option value="scholarship">{isHindi ? 'छात्रवृत्ति' : 'Scholarship'}</option>
                      <option value="complaint">{isHindi ? 'शिकायत' : 'Complaint / Grievance'}</option>
                      <option value="other">{isHindi ? 'अन्य' : 'Other'}</option>
                    </select>
                  </div>
                </div>

                <div className="contact-form-group">
                  <label>
                    <MessageSquare size={14} />
                    {isHindi ? 'आपका संदेश' : 'Your Message'} *
                  </label>
                  <textarea
                    name="message"
                    className="form-control"
                    required
                    rows="4"
                    placeholder={isHindi ? 'अपना संदेश यहाँ लिखें...' : 'Write your message here...'}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={sending}
                >
                  {sending ? (
                    <>{isHindi ? 'भेजा जा रहा है...' : 'Sending...'}</>
                  ) : (
                    <>
                      <Send size={16} />
                      {isHindi ? 'संदेश भेजें' : 'Send Message'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Embedded Map */}
        <div className="contact-map-section">
          <div className="contact-map-title">
            <span className="contact-map-line" />
            <h3>
              <MapPin size={18} />
              {isHindi ? 'हमारा स्थान' : 'Our Location'}
            </h3>
            <span className="contact-map-line" />
          </div>
          <div className="contact-map-wrapper">
            <iframe
              title="Sunshine Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.905!2d79.555284!3d22.096317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a27e9b0ec3f4a67%3A0x5b2a3d4e6f7c8d9e!2sKuldevi%20Marhai%20Mata%20Mandir%2C%20Barapatthar%2C%20Seoni%2C%20Madhya%20Pradesh%20480661!5e0!3m2!1sen!2sin!4v1718462000000!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
