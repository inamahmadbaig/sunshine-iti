import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Lock, User } from 'lucide-react';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admin/login`, formData)
      .then(res => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("adminUser", JSON.stringify(res.data.user));
        navigate("/admin/dashboard");
      })
      .catch(err => {
        if (!err.response) {
          setError("Network Error: Cannot connect to the backend server. Please ensure the Java server is running on port 8081.");
        } else {
          setError(err.response.data?.error || "Invalid username or password");
        }
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
          <h2>Admin Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Sunshine Administration Portal
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} /> Username
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
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              required
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <Link to="/admin/forgot-password" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>
              Forgot Password?
            </Link>
            <Link to="/admin/forgot-username" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>
              Forgot Username?
            </Link>
          </div>
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
