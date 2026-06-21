import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Lock, User, Mail } from 'lucide-react';

export default function Signup() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    axios.post("http://localhost:8081/api/admin/signup", formData)
      .then(res => {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/admin/login");
        }, 2500);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Registration failed. Try again.");
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
          <h2>Admin Sign Up</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Register new administrator credentials
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} /> Username *
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} /> Email Address *
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} /> Password *
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link to="/admin/login" style={{ color: 'var(--accent-color)', fontWeight: '700' }}>
            Sign In
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
