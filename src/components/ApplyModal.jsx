import React from 'react';
import { X } from 'lucide-react';

export default function ApplyModal({ 
  setShowApplyModal, 
  formData, 
  handleApplyChange, 
  handleApplySubmit, 
  submitting, 
  submitSuccess 
}) {
  return (
    <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Admission Application Form</h3>
          <button className="close-btn" onClick={() => setShowApplyModal(false)}><X /></button>
        </div>
        <div className="modal-body">
          {submitSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ color: 'var(--success-color)', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Application Submitted Successfully!</h4>
              <p style={{ color: 'var(--text-muted)' }}>Our admissions officer will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  required 
                  value={formData.name}
                  onChange={handleApplyChange}
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control" 
                  required 
                  value={formData.email}
                  onChange={handleApplyChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-control" 
                  required 
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={handleApplyChange}
                />
              </div>
              <div className="form-group">
                <label>Preferred Trade *</label>
                <select 
                  name="trade" 
                  className="form-control" 
                  value={formData.trade}
                  onChange={handleApplyChange}
                >
                  <option value="Electrician">Electrician (2 Years)</option>
                  <option value="Fitter">Fitter (2 Years)</option>
                  <option value="COPA">Computer Operator & Programming Assistant (COPA) (1 Year)</option>
                  <option value="Welder">Welder (1 Year)</option>
                  <option value="Diesel Mechanic">Diesel Mechanic (1 Year)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Highest Qualification *</label>
                <select 
                  name="qualification" 
                  className="form-control" 
                  value={formData.qualification}
                  onChange={handleApplyChange}
                >
                  <option value="8th Pass">8th Pass</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={submitting}
              >
                {submitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
