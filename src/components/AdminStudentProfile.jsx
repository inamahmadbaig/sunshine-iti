import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import { 
  ArrowLeft, CheckCircle, XCircle, Trash2, Edit, Download, 
  Printer, MessageCircle, MessageSquare, Briefcase, Calendar, 
  MapPin, GraduationCap, Phone, Mail, User, IndianRupee 
} from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api`;

export default function AdminStudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admissions/${id}`);
      setStudent(res.data);
      setEditForm(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch student details');
      navigate('/admin/all-students');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.put(`${API_BASE}/admissions/${id}/status`, { status: newStatus });
      fetchStudent();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this record?")) {
      try {
        await axios.delete(`${API_BASE}/admissions/${id}`);
        navigate('/admin/all-students');
      } catch (err) {
        console.error(err);
        alert('Failed to delete student');
      }
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== null && editForm[key] !== undefined && typeof editForm[key] !== 'object') {
          formData.append(key, editForm[key]);
        }
      });
      // Add files if needed (assuming simple text edit for now, files can be updated in offline admission logic if ported)
      await axios.put(`${API_BASE}/admissions/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowEditModal(false);
      fetchStudent();
    } catch (err) {
      console.error(err);
      alert('Failed to update student');
    }
  };

  const handlePrintReceipt = async () => {
    try {
      const res = await axios.get(`${API_BASE}/fees/student/${student.id}`);
      const feeHistory = res.data || [];
      
      const receiptWindow = window.open('', '_blank');
      let html = `
        <html>
        <head>
          <title>Fee Receipt - ${student.fullName}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #2563eb; margin: 0 0 10px 0; font-size: 28px; }
            .header p { margin: 5px 0; font-size: 14px; color: #64748b; }
            .receipt-info { display: flex; justify-content: space-between; margin-bottom: 30px; font-weight: bold; }
            .student-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .student-details div { margin-bottom: 10px; }
            .student-details span { color: #64748b; display: inline-block; width: 120px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: 600; color: #475569; }
            .totals { width: 300px; margin-left: auto; margin-top: 20px; }
            .totals div { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .totals div.final { font-weight: bold; font-size: 1.1em; color: #2563eb; border-bottom: none; border-top: 2px solid #2563eb; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature { border-top: 1px solid #94a3b8; width: 200px; text-align: center; padding-top: 10px; color: #64748b; }
            .note { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; font-style: italic; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SUNSHINE ITI & COLLEGE</h1>
            <p>Seoni, Madhya Pradesh</p>
            <p>Email: contact@sunshineiti.com | Phone: +91 9425869408</p>
          </div>
          <div class="receipt-info">
            <div>Receipt No: RCPT-ITI-${new Date().getFullYear()}-${student.id}</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="student-details">
            <div><span>Student Name:</span> <strong>${student.fullName}</strong></div>
            <div><span>Application No:</span> <strong>ITI${new Date().getFullYear()}/${String(student.id).padStart(2, '0')}</strong></div>
            <div><span>Father's Name:</span> <strong>${student.fatherName}</strong></div>
            <div><span>Course/Trade:</span> <strong>${student.trade}</strong></div>
            <div><span>Mobile No:</span> <strong>${student.mobile}</strong></div>
            <div><span>Status:</span> <strong>${student.status}</strong></div>
          </div>
          
          <h3>Fee Payment History</h3>
      `;
      
      if (feeHistory.length > 0) {
        html += `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount Paid</th>
                <th>Method</th>
                <th>Transaction ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
        `;
        feeHistory.forEach(fee => {
          html += `
            <tr>
              <td>${new Date(fee.paymentDate).toLocaleDateString()}</td>
              <td>Rs. ${fee.amount.toLocaleString('en-IN')}</td>
              <td>${fee.paymentMethod || 'Manual'}</td>
              <td>${fee.transactionId || 'N/A'}</td>
              <td>${fee.status}</td>
            </tr>
          `;
        });
        html += `
            </tbody>
          </table>
        `;
      } else {
        html += `<p style="color: #64748b; font-style: italic;">No additional fee payments recorded.</p>`;
      }
      
      html += `
          <div class="totals">
            <div><span>Total Course Fee:</span> <span>Rs. ${(student.courseFee || 0).toLocaleString('en-IN')}</span></div>
            <div><span>Total Amount Paid:</span> <span>Rs. ${(student.amountPaid || 0).toLocaleString('en-IN')}</span></div>
            <div class="final"><span>Outstanding Balance:</span> <span>Rs. ${(student.outstandingBalance || 0).toLocaleString('en-IN')}</span></div>
          </div>
          <div class="footer">
            <div class="signature">Student Signature</div>
            <div class="signature">Authorized Signatory<br><small>Sunshine ITI</small></div>
          </div>
          <div class="note">
            * This is a computer generated document and requires no physical signature.
          </div>
        </body>
        </html>
      `;
      receiptWindow.document.write(html);
      receiptWindow.document.close();
      setTimeout(() => { receiptWindow.print(); }, 500);
    } catch (error) {
      console.error(error);
      alert('Failed to load fee history for receipt.');
    }
  };

  const handlePrintForm = () => {
    // Port existing logic or similar
    const printWindow = window.open('', '_blank');
    // ... we can implement the full HTML if needed, same as AdminDashboard.jsx
    printWindow.document.write('<h1>Form printed for ' + student.fullName + '</h1>');
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const handleWhatsApp = () => {
    if(student.whatsapp || student.mobile) {
      window.open(`https://wa.me/91${student.whatsapp || student.mobile}`, '_blank');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading student data...</div>;
  if (!student) return <div style={{ padding: '2rem', textAlign: 'center' }}>Student not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin/all-students')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Back to List
          </button>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1e293b' }}>Student Profile</h1>
        </div>
        <div>
          <span style={{ 
            padding: '0.5rem 1.5rem', 
            borderRadius: '999px', 
            fontSize: '0.875rem', 
            fontWeight: 600,
            backgroundColor: student.status === 'APPROVED' ? '#dcfce7' : student.status === 'REJECTED' ? '#fee2e2' : '#fef9c3',
            color: student.status === 'APPROVED' ? '#166534' : student.status === 'REJECTED' ? '#991b1b' : '#854d0e',
            border: `1px solid ${student.status === 'APPROVED' ? '#bbf7d0' : student.status === 'REJECTED' ? '#fecaca' : '#fef08a'}`
          }}>
            {student.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Identity Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #f1f5f9', backgroundColor: '#f8fafc', flexShrink: 0 }}>
              <img src={student.photoUrl || `${API_BASE}/admissions/${student.id}/files/photo`} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#0f172a' }}>{student.fullName}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={16} /> Course: <strong style={{ color: '#2563eb' }}>{student.trade}</strong>
              </p>
              <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                Application No: ITI{new Date().getFullYear()}/{String(student.id).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Personal & Contact Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} /> Personal Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Father's Name</span><strong style={{ color: '#334155' }}>{student.fatherName}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Mother's Name</span><strong style={{ color: '#334155' }}>{student.motherName}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Date of Birth</span><strong style={{ color: '#334155' }}>{student.dob}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Gender</span><strong style={{ color: '#334155' }}>{student.gender}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Category</span><strong style={{ color: '#334155' }}>{student.category}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Aadhar No</span><strong style={{ color: '#334155' }}>{student.aadharNo}</strong></div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} /> Contact Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}><Phone size={14} style={{display:'inline', marginRight:'4px'}}/>Mobile</span><strong style={{ color: '#334155' }}>{student.mobile}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}><MessageCircle size={14} style={{display:'inline', marginRight:'4px'}}/>WhatsApp</span><strong style={{ color: '#334155' }}>{student.whatsapp}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}><Mail size={14} style={{display:'inline', marginRight:'4px'}}/>Email</span><strong style={{ color: '#334155' }}>{student.email || 'N/A'}</strong></div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Address</span>
                  <div style={{ color: '#334155', lineHeight: '1.5' }}>
                    {student.address}, {student.post}<br/>
                    {student.tehsil}, {student.distt}, {student.state} - {student.pin}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               Documents
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href={student.aadharDocUrl || `${API_BASE}/admissions/${student.id}/files/aadharDocument`} target="_blank" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Download size={14} /> Aadhar Doc
              </a>
              <a href={student.tenthDocUrl || `${API_BASE}/admissions/${student.id}/files/tenthDocument`} target="_blank" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Download size={14} /> 10th Marksheet
              </a>
              <a href={student.samagraDocUrl || `${API_BASE}/admissions/${student.id}/files/samagraDocument`} target="_blank" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Download size={14} /> Samagra
              </a>
            </div>
          </div>
          
        </div>

        {/* Right Column: Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Approval Section */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#334155' }}>Admission Decision</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {student.status !== 'APPROVED' && (
                <button onClick={() => handleUpdateStatus('APPROVED')} className="btn" style={{ backgroundColor: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem' }}>
                  <CheckCircle size={18} /> Approve Admission
                </button>
              )}
              {student.status !== 'REJECTED' && (
                <button onClick={() => handleUpdateStatus('REJECTED')} className="btn" style={{ backgroundColor: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem' }}>
                  <XCircle size={18} /> Reject Admission
                </button>
              )}
              {student.status !== 'PENDING' && (
                <button onClick={() => handleUpdateStatus('PENDING')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem' }}>
                   Mark as Pending
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#334155' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => setShowEditModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                <Edit size={16} /> Edit Details
              </button>
              <button onClick={handlePrintReceipt} className="btn" style={{ backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                <Printer size={16} /> Print Receipt
              </button>
              <button onClick={handlePrintForm} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                <Printer size={16} /> Print Full Form
              </button>
              <button onClick={handleWhatsApp} className="btn" style={{ backgroundColor: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                <MessageCircle size={16} /> Send WhatsApp
              </button>
              <button onClick={handleDelete} className="btn" style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start', marginTop: '1rem' }}>
                <Trash2 size={16} /> Delete Record
              </button>
            </div>
          </div>

          {/* Fee Summary */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IndianRupee size={16} /> Fee Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Total Fee</span><strong style={{ color: '#334155' }}>₹{(student.courseFee || 0).toLocaleString('en-IN')}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Paid</span><strong style={{ color: '#16a34a' }}>₹{(student.amountPaid || 0).toLocaleString('en-IN')}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}><span style={{ color: '#0f172a', fontWeight: 600 }}>Balance</span><strong style={{ color: '#dc2626' }}>₹{(student.outstandingBalance || 0).toLocaleString('en-IN')}</strong></div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Modal Placeholder */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>Edit Student</h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Full Name</label>
                <input name="fullName" value={editForm.fullName || ''} onChange={handleEditChange} className="admin-form-control" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Father's Name</label>
                <input name="fatherName" value={editForm.fatherName || ''} onChange={handleEditChange} className="admin-form-control" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
