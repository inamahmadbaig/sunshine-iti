import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, LogOut, BookOpen, CreditCard, Award, FileText, ArrowLeft, Home, Download } from 'lucide-react';

const StudentDashboard = ({ darkMode }) => {
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [results, setResults] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payForm, setPayForm] = useState({ amount: '', paymentMethod: 'UPI', transactionId: '', paymentDate: new Date().toISOString().split('T')[0], receipt: null });
  const [payLoading, setPayLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, [navigate]);

  const fetchStudentData = () => {
    const authData = localStorage.getItem("studentAuth");
    if (!authData) {
      navigate('/student-login');
      return;
    }
    const parsed = JSON.parse(authData);
    setStudent(parsed);

    axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}`}`/api/notices?target=ALL`)
      .then(res => setNotices(res.data))
      .catch(err => console.error(err));

    axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}`}`/api/fees/student/${parsed.id}`)
      .then(res => setFees(res.data))
      .catch(err => console.error(err));

    axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}`}`/api/results/student/${parsed.id}`)
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!payForm.amount || payForm.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    setPayLoading(true);
    const formData = new FormData();
    formData.append('admissionId', student.id);
    formData.append('amount', payForm.amount);
    formData.append('paymentMethod', payForm.paymentMethod);
    formData.append('transactionId', payForm.transactionId);
    formData.append('paymentDate', payForm.paymentDate);
    if (payForm.receipt) {
      formData.append('receipt', payForm.receipt);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/fees`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Payment submitted successfully! It will be reflected in your balance once approved by the administration.');
      setShowPaymentForm(false);
      setPayForm({ amount: '', paymentMethod: 'UPI', transactionId: '', paymentDate: new Date().toISOString().split('T')[0], receipt: null });
      fetchStudentData(); // Refresh history
    } catch (error) {
      console.error(error);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#e2e8f0' : '#1e293b',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Top Navbar */}
      <nav style={{
        backgroundColor: 'var(--primary-color)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s' }}
          >
            <ArrowLeft size={16} /> Home
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '15px' }}>
            <BookOpen size={24} />
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Student Portal</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontWeight: '500' }}>Hi, {student.fullName}</span>
          <button 
            onClick={() => { localStorage.removeItem('studentAuth'); navigate('/student-login'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="student-dashboard-layout">
        
        {/* Sidebar */}
        <div>
          <div style={{
          backgroundColor: darkMode ? '#1e293b' : 'white',
          borderRadius: '12px',
          padding: '1.5rem 0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          height: 'fit-content'
        }}>
          <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, marginBottom: '1rem' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
              <img 
                src={`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}`}`/api/admissions/${student.id}/files/photo`} 
                alt="Student Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'; }} 
              />
            </div>
            <h3 style={{ margin: 0 }}>APP-2026-{student.id}</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: 'gray', fontSize: '0.9rem' }}>{student.trade}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 1.5rem', border: 'none', backgroundColor: activeTab === 'profile' ? 'rgba(37, 99, 235, 0.1)' : 'transparent', color: activeTab === 'profile' ? 'var(--primary-color)' : (darkMode ? 'white' : '#475569'), textAlign: 'left', cursor: 'pointer', fontWeight: activeTab === 'profile' ? 'bold' : 'normal', borderRight: activeTab === 'profile' ? '4px solid var(--primary-color)' : '4px solid transparent' }}
            >
              <User size={18} /> My Profile
            </button>
            <button 
              onClick={() => setActiveTab('fees')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 1.5rem', border: 'none', backgroundColor: activeTab === 'fees' ? 'rgba(37, 99, 235, 0.1)' : 'transparent', color: activeTab === 'fees' ? 'var(--primary-color)' : (darkMode ? 'white' : '#475569'), textAlign: 'left', cursor: 'pointer', fontWeight: activeTab === 'fees' ? 'bold' : 'normal', borderRight: activeTab === 'fees' ? '4px solid var(--primary-color)' : '4px solid transparent' }}
            >
              <CreditCard size={18} /> Fee Details
            </button>
            <button 
              onClick={() => setActiveTab('results')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 1.5rem', border: 'none', backgroundColor: activeTab === 'results' ? 'rgba(37, 99, 235, 0.1)' : 'transparent', color: activeTab === 'results' ? 'var(--primary-color)' : (darkMode ? 'white' : '#475569'), textAlign: 'left', cursor: 'pointer', fontWeight: activeTab === 'results' ? 'bold' : 'normal', borderRight: activeTab === 'results' ? '4px solid var(--primary-color)' : '4px solid transparent' }}
            >
              <Award size={18} /> Exam Results
            </button>
          </div>
        </div>
        </div>

        {/* Content Area */}
        <div>
          <div style={{
            backgroundColor: darkMode ? '#1e293b' : 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            overflowX: 'auto'
          }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><User /> Personal Information</h2>
              <div className="student-profile-grid">
                <div>
                  <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Full Name</p>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{student.fullName}</p>
                </div>
                <div>
                  <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Father's Name</p>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{student.fatherName}</p>
                </div>
                <div>
                  <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Date of Birth</p>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{student.dob}</p>
                </div>
                <div>
                  <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Mobile Number</p>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{student.mobile}</p>
                </div>
                <div>
                  <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Trade</p>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{student.trade}</p>
                </div>
                <div>
                  <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Admission Status</p>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem', color: student.status === 'APPROVED' ? '#10b981' : '#f59e0b' }}>
                    {student.status || 'PENDING'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div>
              <h2 style={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard /> Fee Structure & Payments</h2>
              
              <div className="student-dashboard-fees">
                <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                  <p style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '600' }}>Total Course Fee</p>
                  <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', color: 'var(--primary-color)' }}>₹{student.courseFee || 0}</h3>
                </div>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <p style={{ margin: 0, color: '#10b981', fontWeight: '600' }}>Total Paid</p>
                  <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', color: '#10b981' }}>₹{student.amountPaid || 0}</h3>
                </div>
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <p style={{ margin: 0, color: '#ef4444', fontWeight: '600' }}>Outstanding Balance</p>
                  <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', color: '#ef4444' }}>₹{student.outstandingBalance || 0}</h3>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Payment History</h3>
                <button 
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  style={{ 
                    backgroundColor: showPaymentForm ? 'gray' : 'var(--accent-color)', 
                    color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
                  }}
                >
                  {showPaymentForm ? 'Cancel' : 'Pay Installment'}
                </button>
              </div>

              {showPaymentForm && (
                <div style={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                  <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)' }}>Submit New Payment</h4>
                  
                  {/* Payment Details Section */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', backgroundColor: darkMode ? '#0f172a' : '#fff', padding: '1.5rem', borderRadius: '8px', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <h5 style={{ color: '#f97316', borderBottom: '2px solid #f97316', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'inline-block' }}>Bank Account Details</h5>
                      <table style={{ width: '100%', fontSize: '0.9rem' }}>
                        <tbody>
                          <tr><td style={{ padding: '0.4rem 0', fontWeight: 'bold', width: '40%' }}>Bank Name:</td><td>HDFC Bank</td></tr>
                          <tr><td style={{ padding: '0.4rem 0', fontWeight: 'bold' }}>Account Name:</td><td>SARFARAJ AHMED BAIG</td></tr>
                          <tr><td style={{ padding: '0.4rem 0', fontWeight: 'bold' }}>Account Number:</td><td style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#2563eb' }}>50100676012097</td></tr>
                          <tr><td style={{ padding: '0.4rem 0', fontWeight: 'bold' }}>IFSC Code:</td><td>HDFC0005405</td></tr>
                          <tr><td style={{ padding: '0.4rem 0', fontWeight: 'bold' }}>Branch:</td><td>CHHINDWARA CHOWK SEONI</td></tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: `1px dashed ${darkMode ? '#334155' : '#ccc'}`, paddingLeft: '2rem' }}>
                      <h5 style={{ color: '#10b981', marginBottom: '1rem' }}>Scan or Click to Pay</h5>
                      <a href="upi://pay?pa=sarfaraj.baig2@axl&pn=SARFARAJ%20AHMED%20BAIG&cu=INR" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '0.5rem', cursor: 'pointer' }}>
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sarfaraj.baig2@axl&pn=SARFARAJ%20AHMED%20BAIG&cu=INR" alt="UPI QR Code" style={{ width: '120px', height: '120px' }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '0.5rem' }}>sarfaraj.baig2@axl</span>
                        <div className="d-block d-md-none mt-2">
                          <button type="button" className="btn btn-sm" style={{ backgroundColor: '#5f259f', color: '#fff', fontWeight: 'bold', padding: '0.4rem 1rem', borderRadius: '6px' }}>Open UPI App</button>
                        </div>
                      </a>
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Amount (₹)</label>
                      <input type="number" min="1" required value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Payment Method</label>
                      <select value={payForm.paymentMethod} onChange={e => setPayForm({...payForm, paymentMethod: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                        <option value="UPI">UPI</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash (Deposit at Office)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Transaction ID (Optional)</label>
                      <input type="text" value={payForm.transactionId} onChange={e => setPayForm({...payForm, transactionId: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Payment Date</label>
                      <input type="date" required value={payForm.paymentDate} onChange={e => setPayForm({...payForm, paymentDate: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Upload Receipt/Screenshot <span style={{ color: 'red' }}>*</span></label>
                      <input type="file" required accept="image/*,.pdf" onChange={e => setPayForm({...payForm, receipt: e.target.files[0]})} style={{ width: '100%', padding: '0.4rem' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                      <button type="submit" disabled={payLoading} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {payLoading ? 'Submitting...' : 'Submit Payment Details'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {fees.length === 0 ? (
                <p style={{ color: 'gray' }}>No payment records found.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: darkMode ? '#334155' : '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Amount</th>
                      <th style={{ padding: '1rem' }}>Method</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map(fee => (
                      <tr key={fee.id} style={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                        <td style={{ padding: '1rem' }}>{new Date(fee.paymentDate).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{fee.amount}</td>
                        <td style={{ padding: '1rem' }}>{fee.paymentMethod}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '0.3rem 0.8rem', 
                            borderRadius: '20px', 
                            fontSize: '0.8rem',
                            backgroundColor: fee.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : fee.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: fee.status === 'APPROVED' ? '#10b981' : fee.status === 'REJECTED' ? '#ef4444' : '#f59e0b'
                          }}>
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Award /> Exam Results & Marksheets</h2>
                {results.length > 0 && (
                  <button 
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}`}`/api/results/student/${student.id}/marksheet`, '_blank')}
                    className="btn btn-primary" 
                    style={{ backgroundColor: '#10b981', border: 'none', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                  >
                    <Download size={16} /> Download Marksheet (PDF)
                  </button>
                )}
              </div>
              
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'gray', border: `1px dashed ${darkMode ? '#475569' : '#cbd5e1'}`, borderRadius: '12px' }}>
                  <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>No results have been uploaded yet.</p>
                  <p style={{ fontSize: '0.9rem' }}>Check back later or contact administration.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {results.map(res => (
                    <div key={res.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                      backgroundColor: darkMode ? '#0f172a' : '#f8fafc'
                    }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>{res.subject}</h3>
                        <p style={{ margin: 0, color: 'gray', fontSize: '0.9rem' }}>{res.semesterOrYear}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                          <span style={{ color: res.status === 'PASS' ? '#10b981' : '#ef4444' }}>{res.marksObtained}</span> / {res.maxMarks}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>Grade: {res.grade}</span>
                          <span style={{ 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '4px', 
                            fontSize: '0.8rem',
                            backgroundColor: res.status === 'PASS' ? '#10b981' : '#ef4444',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {res.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
