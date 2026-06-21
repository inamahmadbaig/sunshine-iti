import React from 'react';
import { Shield, X, Trash, Plus } from 'lucide-react';

export default function AdminModal({
  setShowAdminModal,
  adminTab,
  setAdminTab,
  applications,
  notices,
  handleDeleteNotice,
  noticeFormData,
  handleNoticeChange,
  handleCreateNotice
}) {
  return (
    <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
      <div className="modal-container modal-container-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield /> College Administration Panel</h3>
          <button className="close-btn" onClick={() => setShowAdminModal(false)}><X /></button>
        </div>
        <div className="modal-body">
          <div className="admin-tabs">
            <button 
              className={`admin-tab ${adminTab === 'applications' ? 'active' : ''}`}
              onClick={() => setAdminTab('applications')}
            >
              Admission Applications ({applications.length})
            </button>
            <button 
              className={`admin-tab ${adminTab === 'notices' ? 'active' : ''}`}
              onClick={() => setAdminTab('notices')}
            >
              Manage Notices ({notices.length})
            </button>
          </div>

          {adminTab === 'applications' ? (
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Submitted Admission Applications</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Trade</th>
                      <th>Qualification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No applications received yet.</td>
                      </tr>
                    ) : (
                      applications.map(app => (
                        <tr key={app.id}>
                          <td>{app.id}</td>
                          <td style={{ fontWeight: '600' }}>{app.name}</td>
                          <td>{app.email}</td>
                          <td>{app.phone}</td>
                          <td><span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>{app.trade}</span></td>
                          <td>{app.qualification}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
                {/* List and Delete Notices */}
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Existing Notices</h4>
                  <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Notice</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notices.map(notice => (
                          <tr key={notice.id}>
                            <td>
                              {notice.title}{" "}
                              {notice.isNew && (
                                <span className="badge badge-red" style={{ fontSize: '0.6rem', padding: '0.1rem 0.25rem' }}>NEW</span>
                              )}
                            </td>
                            <td>{notice.date}</td>
                            <td>
                              <button className="btn-delete" onClick={() => handleDeleteNotice(notice.id)}><Trash size={12} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Notice Form */}
                <div style={{ backgroundColor: 'var(--light-grey)', padding: '1.2rem', borderRadius: '8px', height: 'fit-content' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Create New Notice</h4>
                  <form onSubmit={handleCreateNotice}>
                    <div className="form-group">
                      <label>Notice Title</label>
                      <textarea 
                        name="title" 
                        className="form-control" 
                        required 
                        rows="3"
                        style={{ resize: 'none' }}
                        value={noticeFormData.title}
                        onChange={handleNoticeChange}
                      ></textarea>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        name="isNew" 
                        id="isNew"
                        checked={noticeFormData.isNew}
                        onChange={handleNoticeChange}
                      />
                      <label htmlFor="isNew" style={{ margin: 0, cursor: 'pointer' }}>Mark as "NEW" badge</label>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      <Plus size={16} style={{ marginRight: '4px' }} /> Publish Notice
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
