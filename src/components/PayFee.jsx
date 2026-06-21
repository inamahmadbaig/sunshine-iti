import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, IndianRupee, UploadCloud, CheckCircle, FileText, ChevronRight, Calendar, ArrowLeft, ShieldAlert, User, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../index.css';

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api`;

const PayFee = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    link.id = 'bootstrap-fee-css';
    document.head.appendChild(link);
    return () => {
      const el = document.getElementById('bootstrap-fee-css');
      if (el) el.remove();
    };
  }, []);

  const [searchMode, setSearchMode] = useState('appNo'); // 'appNo' or 'personal'
  const [admissionId, setAdmissionId] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [feeAmount, setFeeAmount] = useState('');
  const [feeMethod, setFeeMethod] = useState('UPI');
  const [feeTxnId, setFeeTxnId] = useState('');
  const [feeReceipt, setFeeReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStudent(null);
    setSuccess('');

    try {
      let url = `${API_BASE}/admissions/search?dob=${dob}`;
      if (searchMode === 'appNo') {
        const numericId = admissionId.replace(/\D/g, '');
        url += `&id=${numericId}`;
      } else {
        url += `&fullName=${encodeURIComponent(fullName)}&mobile=${encodeURIComponent(mobile)}`;
      }
      
      const res = await axios.get(url);
      if (res.data) {
        setStudent(res.data);
      } else {
        setError(searchMode === 'appNo' 
          ? 'No student found with this Application No and DOB.'
          : 'No student found with these personal details and DOB.'
        );
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch student details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!feeAmount || Number(feeAmount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if ((feeMethod === 'UPI' || feeMethod === 'Bank Transfer') && !feeTxnId) {
      setError('Transaction ID / UTR is required for online payments.');
      return;
    }
    if (feeMethod !== 'Cash' && !feeReceipt) {
      setError('Please upload the payment receipt / screenshot.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append("admissionId", student.id);
    formData.append("amount", feeAmount);
    formData.append("paymentMethod", feeMethod);
    formData.append("transactionId", feeTxnId);
    formData.append("paymentDate", new Date().toISOString().split('T')[0]);
    if (feeReceipt) {
      formData.append("receipt", feeReceipt);
    }

    try {
      await axios.post(`${API_BASE}/fees`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Payment details submitted successfully! Your payment is pending admin approval.');
      setFeeAmount('');
      setFeeTxnId('');
      setFeeReceipt(null);
      // Refresh student details
      const refreshRes = await axios.get(`${API_BASE}/admissions/search?id=${student.id}&dob=${student.dob}`);
      if (refreshRes.data) {
        setStudent(refreshRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit payment details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fee-portal-wrapper">
      {/* Animated Glowing Ambient Shapes */}
      <div className="fee-portal-bg">
        <div className="fee-shape fee-shape-1"></div>
        <div className="fee-shape fee-shape-2"></div>
      </div>

      <div className="container py-5 position-relative" style={{ zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            
            {/* Premium Navigation Back-Link */}
            <div className="mb-4">
              <Link 
                to="/" 
                className="d-inline-flex align-items-center text-decoration-none text-secondary fw-semibold" 
                style={{ 
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#2648d4'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >
                <ArrowLeft size={16} className="me-2" /> Back to College Portal
              </Link>
            </div>

            {/* Portal Title Section */}
            <div className="text-center mb-5">
              <h1 className="fw-bold display-5 mb-2"><span className="fee-gradient-text">Installment Portal</span></h1>
              <p className="lead text-secondary">Securely track and submit your pending college fees online.</p>
            </div>

            <div className="fee-glass-card shadow-lg mb-4">
              <div className="card-body p-3 p-sm-4 p-md-5">
                
                {/* Search Form */}
                {!student && (
                  <div className="fade-in">
                    <h3 className="mb-4 text-center fw-bold text-dark">Find Your Record</h3>
                    
                    {/* Premium Toggle for Search Mode */}
                    <div className="d-flex justify-content-center mb-4">
                      <div className="btn-group p-1 bg-secondary bg-opacity-10 rounded-pill" role="group" style={{ maxWidth: '400px', width: '100%' }}>
                        <button
                          type="button"
                          className={`btn rounded-pill border-0 py-2 px-3 w-50 fw-semibold text-nowrap ${searchMode === 'appNo' ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                          onClick={() => { setSearchMode('appNo'); setError(''); }}
                          style={{ transition: 'all 0.3s ease', fontSize: '0.9rem' }}
                        >
                          <FileText size={16} className="me-2" /> Application No.
                        </button>
                        <button
                          type="button"
                          className={`btn rounded-pill border-0 py-2 px-3 w-50 fw-semibold text-nowrap ${searchMode === 'personal' ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                          onClick={() => { setSearchMode('personal'); setError(''); }}
                          style={{ transition: 'all 0.3s ease', fontSize: '0.9rem' }}
                        >
                          <User size={16} className="me-2" /> Personal Details
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSearch}>
                      <div className="row g-4">
                        {searchMode === 'appNo' ? (
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary">Application No.</label>
                            <div className="position-relative">
                              <span 
                                className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary"
                                style={{ pointerEvents: 'none' }}
                              >
                                <FileText size={18} />
                              </span>
                              <input 
                                type="text" 
                                className="form-control form-control-lg fee-input ps-5" 
                                value={admissionId} 
                                onChange={e => setAdmissionId(e.target.value)} 
                                placeholder="e.g. 15" 
                                required 
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold text-secondary">Full Name</label>
                              <div className="position-relative">
                                <span 
                                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary"
                                  style={{ pointerEvents: 'none' }}
                                >
                                  <User size={18} />
                                </span>
                                <input 
                                  type="text" 
                                  className="form-control form-control-lg fee-input ps-5" 
                                  value={fullName} 
                                  onChange={e => setFullName(e.target.value)} 
                                  placeholder="e.g. Rahul Sharma" 
                                  required 
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold text-secondary">Mobile Number</label>
                              <div className="position-relative">
                                <span 
                                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary"
                                  style={{ pointerEvents: 'none' }}
                                >
                                  <Smartphone size={18} />
                                </span>
                                <input 
                                  type="tel" 
                                  className="form-control form-control-lg fee-input ps-5" 
                                  value={mobile} 
                                  onChange={e => setMobile(e.target.value)} 
                                  placeholder="e.g. 9876543210" 
                                  required 
                                />
                              </div>
                            </div>
                          </>
                        )}
                        <div className={searchMode === 'appNo' ? "col-md-6" : "col-md-12"}>
                          <label className="form-label fw-semibold text-secondary">Date of Birth</label>
                          <div className="position-relative">
                            <span 
                              className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary"
                              style={{ pointerEvents: 'none' }}
                            >
                              <Calendar size={18} />
                            </span>
                            <input 
                              type="date" 
                              className="form-control form-control-lg fee-input ps-5" 
                              value={dob} 
                              onChange={e => setDob(e.target.value)} 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="alert alert-danger mt-4 d-flex align-items-center mb-0 bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger" role="alert">
                          <ShieldAlert size={20} className="me-2 flex-shrink-0" />
                          <div>{error}</div>
                        </div>
                      )}
                      
                      <div className="text-center mt-5">
                        <button type="submit" className="btn btn-lg fee-primary-btn w-100" disabled={loading}>
                          {loading ? (
                            <div className="spinner-border spinner-border-sm text-white" role="status" />
                          ) : (
                            <><Search size={20} className="me-2"/> Locate Details <ChevronRight size={20} className="ms-1" /></>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Student Dashboard */}
                {student && (
                  <div className="fade-in fee-dashboard">
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-10">
                      <div>
                        <h4 className="fw-bold mb-1 text-dark">{student.fullName}</h4>
                        <div className="text-secondary small">
                          Application ID: <span className="fw-bold text-dark">ITI/2026/{student.id}</span> | Trade: <span className="badge bg-primary text-white ms-1">{student.trade}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setStudent(null); setError(''); setSuccess(''); }} 
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      >
                        Switch Student
                      </button>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <div className="fee-stat-card-total text-center p-3 h-100">
                          <div className="mb-1 small fw-bold text-uppercase" style={{ color: '#1e3cba' }}>Total Fee</div>
                          <h4 className="fw-bold text-dark mb-0">₹ {(student.courseFee || 0).toLocaleString('en-IN')}</h4>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="fee-stat-card-paid text-center p-3 h-100">
                          <div className="mb-1 small fw-bold text-uppercase" style={{ color: '#0f766e' }}>Total Paid</div>
                          <h4 className="fw-bold text-dark mb-0">₹ {(student.amountPaid || 0).toLocaleString('en-IN')}</h4>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="fee-stat-card-balance text-center p-3 h-100">
                          <div className="mb-1 small fw-bold text-uppercase" style={{ color: '#be123c' }}>Pending Balance</div>
                          <h4 className="fw-bold text-dark mb-0">₹ {(student.outstandingBalance || 0).toLocaleString('en-IN')}</h4>
                        </div>
                      </div>
                    </div>

                    {student.outstandingBalance <= 0 ? (
                      <div className="alert alert-success text-center p-5 rounded-4 border-0 bg-success bg-opacity-10 shadow-sm text-success">
                        <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-success bg-opacity-25 p-3 mb-3">
                          <CheckCircle size={40} className="text-success" />
                        </div>
                        <h4 className="fw-bold text-success mb-2">No Dues Pending</h4>
                        <p className="mb-0 text-secondary">You have successfully cleared all your course fees. Thank you!</p>
                      </div>
                    ) : (
                      <div className="fee-payment-box p-4 rounded-4 mt-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center text-dark">
                          <IndianRupee size={20} className="me-2 text-primary" /> Record New Installment
                        </h5>
                        
                        {success && (
                          <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success d-flex align-items-center rounded-3">
                            <CheckCircle size={20} className="me-2 flex-shrink-0" />
                            <div>{success}</div>
                          </div>
                        )}
                        {error && (
                          <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3">
                            {error}
                          </div>
                        )}

                        {/* Dynamic Payment Instruction Panel */}
                        {feeMethod !== 'Cash' && (
                          <div className="row g-4 mb-4 fade-in">
                            <div className="col-md-6">
                              <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <h6 className="fw-bold mb-2 text-primary" style={{ fontSize: '0.9rem' }}>Scan QR to Pay</h6>
                                <div className="bg-white p-2 d-inline-block rounded-3 shadow-sm mb-2" style={{ maxWidth: '140px', margin: '0 auto' }}>
                                  <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sarfaraj.baig2@axl%26pn=SARFARAJ%20AHMED%20BAIG%26mc=0000%26tr=SUNSHINE`} 
                                    alt="UPI QR Code" 
                                    style={{ width: '120px', height: '120px' }} 
                                  />
                                </div>
                                <div className="small fw-bold text-dark mb-1" style={{ fontSize: '0.8rem' }}>SARFARAJ AHMED BAIG</div>
                                <div className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>UPI ID: <strong className="text-dark">sarfaraj.baig2@axl</strong></div>
                                <div className="d-flex gap-2">
                                  <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-primary w-50 rounded-pill py-1" 
                                    onClick={() => { navigator.clipboard.writeText("sarfaraj.baig2@axl"); alert("UPI ID copied!"); }}
                                    style={{ fontSize: '0.75rem' }}
                                  >
                                    Copy ID
                                  </button>
                                  <a 
                                    href={`upi://pay?pa=sarfaraj.baig2@axl&pn=SARFARAJ%20AHMED%20BAIG&am=${feeAmount || ''}&cu=INR&tn=Sunshine%20ITI%20Fee`}
                                    className="btn btn-sm text-white w-50 rounded-pill py-1 fw-bold text-center d-flex align-items-center justify-content-center" 
                                    style={{ backgroundColor: '#5f259f', fontSize: '0.75rem' }}
                                  >
                                    Pay via UPI App
                                  </a>
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-md-6">
                              <div className="card border-0 shadow-sm p-3 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <h6 className="fw-bold mb-3 text-primary" style={{ fontSize: '0.9rem' }}>Bank Account Details</h6>
                                <table className="table table-borderless table-sm mb-0 text-start" style={{ fontSize: '0.8rem' }}>
                                  <tbody>
                                    <tr><th className="py-1 text-secondary" style={{ fontWeight: 600 }}>Holder:</th><td className="py-1 text-dark">SARFARAJ AHMED BAIG</td></tr>
                                    <tr><th className="py-1 text-secondary" style={{ fontWeight: 600 }}>A/C No:</th><td className="py-1 fw-bold text-primary">50100676012097</td></tr>
                                    <tr><th className="py-1 text-secondary" style={{ fontWeight: 600 }}>IFSC:</th><td className="py-1 fw-bold text-dark">HDFC0005405</td></tr>
                                    <tr><th className="py-1 text-secondary" style={{ fontWeight: 600 }}>Branch:</th><td className="py-1 text-dark">CHHINDWARA CHOWK SEONI</td></tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {feeMethod === 'Cash' && (
                          <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning-emphasis rounded-3 mb-4 text-center py-2" style={{ fontSize: '0.85rem' }}>
                            ℹ️ Please deposit cash at the college office counter and enter the deposit details below.
                          </div>
                        )}

                        <form onSubmit={handlePaymentSubmit}>
                          <div className="row g-4 mb-4">
                            <div className="col-md-6">
                              <label className="form-label fw-semibold text-secondary small">Paying Amount (₹)</label>
                              <div className="input-group input-group-lg fee-input-group">
                                <span className="input-group-text bg-transparent border-end-0 text-secondary">
                                  <IndianRupee size={18} />
                                </span>
                                <input 
                                  type="number" 
                                  className="form-control border-start-0 ps-0" 
                                  value={feeAmount} 
                                  onChange={e => setFeeAmount(e.target.value)} 
                                  placeholder="e.g. 5000" 
                                  required 
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold text-secondary small">Payment Method</label>
                              <select className="form-select form-select-lg fee-input" value={feeMethod} onChange={e => setFeeMethod(e.target.value)}>
                                <option value="UPI">UPI App (PhonePe/GPay/Paytm)</option>
                                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS/RTGS)</option>
                                <option value="Cash">Cash (Office Deposit)</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold text-secondary small">Transaction / UTR ID</label>
                              <input 
                                type="text" 
                                className="form-control form-control-lg fee-input" 
                                value={feeTxnId} 
                                onChange={e => setFeeTxnId(e.target.value)} 
                                placeholder="Mandatory for Online" 
                                required={feeMethod !== 'Cash'}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold text-secondary small">
                                Upload Receipt Screenshot {feeMethod !== 'Cash' ? '*' : '(Optional)'}
                              </label>
                              <input 
                                type="file" 
                                className="form-control form-control-lg fee-input" 
                                accept="image/*,.pdf" 
                                onChange={e => setFeeReceipt(e.target.files[0])} 
                                required={feeMethod !== 'Cash'}
                              />
                            </div>
                          </div>

                          <div className="text-end">
                            <button type="submit" className="btn btn-lg fee-submit-btn px-5 w-100" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <div className="spinner-border spinner-border-sm text-white" role="status" />
                              ) : 'Submit Payment Details'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
            
            <div className="text-center text-secondary small mt-4">
              Need help? Contact the accounts department at <a href="tel:+917415491034" className="text-primary text-decoration-none border-bottom border-primary border-opacity-50">+91-7415491034</a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PayFee;
