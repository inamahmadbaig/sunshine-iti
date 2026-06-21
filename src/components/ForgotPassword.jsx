import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Key, Mail, Lock } from 'lucide-react';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    axios.post("http://localhost:8081/api/admin/forgot-password", { email })
      .then(res => {
        setSuccess("OTP sent successfully. Please check your inbox!");
        setStep(2);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Failed to request OTP. Ensure email is correct.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        setError(err.response?.data?.error || "Failed to reset password. Check details.");
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
      backgroundColor: '#f1f5f9',
      padding: '1.5rem'
    }}>
      <div className="card custom-card" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            borderRadius: '50%',
            marginBottom: '1rem'
          }}>
            <Shield size={32} />
          </div>
          <h2>Reset Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {step === 1 ? "Request email verification code" : "Verify code and enter new credentials"}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(230, 57, 70, 0.1)',
            color: 'var(--danger-color)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: 'rgba(46, 196, 182, 0.1)',
            color: 'var(--success-color)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} /> Registered Email *
              </label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Request OTP Verification"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={14} /> OTP Verification Code *
              </label>
              <input
                type="text"
                className="form-control"
                required
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} /> New Password *
              </label>
              <input
                type="password"
                className="form-control"
                required
                minLength="6"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} /> Confirm New Password *
              </label>
              <input
                type="password"
                className="form-control"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Update Password"}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <Link to="/admin/login" style={{ color: 'var(--accent-color)', fontWeight: '700' }}>
            Back to Sign In
          </Link>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
              {t.backToHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
