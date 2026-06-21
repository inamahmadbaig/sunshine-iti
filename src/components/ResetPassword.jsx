import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Key, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Parse query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const usernameParam = params.get('username');
    if (emailParam) setEmail(emailParam);
    if (usernameParam) setUsername(usernameParam);
  }, [location]);

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    axios.post("http://localhost:8081/api/admin/reset-password", {
      email,
      otp,
      newPassword
    })
      .then(res => {
        setSuccess("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/admin/login");
        }, 2500);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Failed to reset password. Check OTP and details.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#070b13', // Matches dark theme in screenshot
      padding: '1.5rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '460px', 
        padding: '2.5rem 2rem', 
        backgroundColor: '#0a0e1a', 
        borderColor: '#1e293b',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        borderRadius: '12px',
        color: '#f1f5f9'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            backgroundColor: '#2563eb',
            color: '#fff',
            borderRadius: '50%',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <Shield size={32} />
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>Reset Password</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Verify OTP and update credentials
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            fontWeight: '600',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            color: '#22c55e',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            fontWeight: '600',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              <Mail size={14} /> Registered Email
            </label>
            <input
              type="email"
              className="admin-form-control"
              style={{ backgroundColor: '#1e293b', borderColor: '#374151', color: '#fff' }}
              required
              readOnly
              value={email}
            />
          </div>

          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              <User size={14} /> Username
            </label>
            <input
              type="text"
              className="admin-form-control"
              style={{ backgroundColor: '#1e293b', borderColor: '#374151', color: '#fff' }}
              required
              readOnly
              value={username}
            />
          </div>

          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              <Key size={14} /> OTP *
            </label>
            <input
              type="text"
              className="admin-form-control"
              style={{ backgroundColor: '#070b13', borderColor: '#374151', color: '#fff' }}
              required
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              <Lock size={14} /> New Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="admin-form-control"
                style={{ backgroundColor: '#070b13', borderColor: '#374151', color: '#fff', paddingRight: '2.5rem' }}
                required
                minLength="6"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              <Lock size={14} /> Confirm Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="admin-form-control"
              style={{ backgroundColor: '#070b13', borderColor: '#374151', color: '#fff' }}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', backgroundColor: '#2563eb', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
            disabled={loading}
          >
            <Key size={16} /> {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <Link to="/admin/login" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
