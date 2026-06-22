import React, { useState } from 'react';
import axios from '../axiosInstance';
import { Shield, UploadCloud } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api`;

export default function AdminOfflineAdmission({ onSuccess }) {
  const [formData, setFormData] = useState({
    trade: 'ELECTRICIAN',
    fullName: '',
    fatherName: '',
    motherName: '',
    aadharNo: '',
    samagraId: '',
    dob: '',
    category: 'UR',
    gender: 'MALE',
    religion: 'Hindu',
    mobile: '',
    email: '',
    address: '',
    courseFee: '',
    amountPaid: '',
    paymentMethod: 'Cash',
    transactionId: '',
    paymentStatus: 'COMPLETED'
  });

  const [files, setFiles] = useState({
    photo: null,
    signature: null,
    tenthDocument: null,
    twelfthDocument: null,
    aadharDocument: null,
    samagraDocument: null
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create FormData object for multipart submission (documents are empty)
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });
    
    // Append files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });

    axios.post(`${API_BASE}/admissions`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      alert(`Offline Admission added successfully! Application Number is: ITI/2026/${res.data.id}`);
      if (onSuccess) onSuccess();
      // Reset form
      setFormData({
        ...formData,
        fullName: '', fatherName: '', motherName: '', aadharNo: '', samagraId: '', dob: '', mobile: '', email: '', address: '', amountPaid: '', transactionId: ''
      });
      setFiles({
        photo: null, signature: null, tenthDocument: null, twelfthDocument: null, aadharDocument: null, samagraDocument: null
      });
      // Clear file inputs visually
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
    })
    .catch(err => {
      alert("Error adding admission: " + err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div>
      <h2 className="admin-page-title">Add Offline Admission</h2>
      <div className="admin-card" style={{ maxWidth: '800px' }}>
        <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Shield size={24} style={{ color: '#2563eb' }} />
          <div>
            <h4 style={{ margin: 0, color: '#2563eb', fontWeight: 700 }}>Direct Entry Mode</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>This form bypasses document upload requirements and immediately creates an application record.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Trade Preference *</label>
              <select name="trade" className="admin-form-control" value={formData.trade} onChange={handleChange} required>
                <option value="ELECTRICIAN">ELECTRICIAN</option>
                <option value="FITTER">FITTER</option>
                <option value="COPA">COPA</option>
                <option value="WELDER">WELDER</option>
                <option value="DIESEL MECHANIC">DIESEL MECHANIC</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Candidate Name *</label>
              <input type="text" name="fullName" className="admin-form-control" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>Father's Name *</label>
              <input type="text" name="fatherName" className="admin-form-control" value={formData.fatherName} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>Mother's Name *</label>
              <input type="text" name="motherName" className="admin-form-control" value={formData.motherName} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>Aadhar No *</label>
              <input type="text" name="aadharNo" className="admin-form-control" value={formData.aadharNo} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>DOB *</label>
              <input type="date" name="dob" className="admin-form-control" value={formData.dob} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>Mobile Number *</label>
              <input type="text" name="mobile" className="admin-form-control" value={formData.mobile} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>Email Address</label>
              <input type="email" name="email" className="admin-form-control" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <h4 style={{ fontSize: '1.1rem', marginTop: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', color: '#10b981' }}>Initial Payment Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Total Course Fee (₹) (Leave empty for default)</label>
              <input type="number" min="0" name="courseFee" className="admin-form-control" value={formData.courseFee} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label>Amount Paid (₹) *</label>
              <input type="number" min="0" name="amountPaid" className="admin-form-control" value={formData.amountPaid} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>Payment Method *</label>
              <select name="paymentMethod" className="admin-form-control" value={formData.paymentMethod} onChange={handleChange} required>
                <option value="Cash">Cash (Offline)</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Payment Status</label>
              <select name="paymentStatus" className="admin-form-control" value={formData.paymentStatus} onChange={handleChange} required>
                <option value="COMPLETED">COMPLETED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Transaction ID / UTR No.</label>
              <input type="text" name="transactionId" className="admin-form-control" value={formData.transactionId} onChange={handleChange} />
            </div>
          </div>

          <hr style={{ margin: '1rem 0', borderColor: 'var(--admin-border)' }} />
            
          <h4 style={{ color: 'var(--admin-text-main)', marginBottom: '1rem' }}><UploadCloud size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} /> Documents (Optional in Offline Mode)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Passport Photo</label>
              <input type="file" className="admin-form-control" accept="image/*" onChange={(e) => setFiles({...files, photo: e.target.files[0]})} />
            </div>
            <div className="admin-form-group">
              <label>Signature</label>
              <input type="file" className="admin-form-control" accept="image/*" onChange={(e) => setFiles({...files, signature: e.target.files[0]})} />
            </div>
            <div className="admin-form-group">
              <label>10th Marksheet</label>
              <input type="file" className="admin-form-control" accept="image/*,.pdf" onChange={(e) => setFiles({...files, tenthDocument: e.target.files[0]})} />
            </div>
            <div className="admin-form-group">
              <label>12th Marksheet (Optional)</label>
              <input type="file" className="admin-form-control" accept="image/*,.pdf" onChange={(e) => setFiles({...files, twelfthDocument: e.target.files[0]})} />
            </div>
            <div className="admin-form-group">
              <label>Aadhar Card</label>
              <input type="file" className="admin-form-control" accept="image/*,.pdf" onChange={(e) => setFiles({...files, aadharDocument: e.target.files[0]})} />
            </div>
            <div className="admin-form-group">
              <label>Samagra ID</label>
              <input type="file" className="admin-form-control" accept="image/*,.pdf" onChange={(e) => setFiles({...files, samagraDocument: e.target.files[0]})} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#2563eb', border: 'none', padding: '1rem', fontWeight: 700, fontSize: '1.1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Complete Offline Admission'}
          </button>
        </form>
      </div>
    </div>
  );
}
