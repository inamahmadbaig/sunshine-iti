import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, Lock, User, ArrowLeft } from 'lucide-react';

const StudentLogin = ({ darkMode }) => {
  const [appId, setAppId] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Extract the actual ID (the last numeric part of the input)
    // Supports formats like "APP-2026-12", "ITI/2026/12", or just "12"
    let rawId = appId.trim();
    const parts = rawId.split(/[-/]/);
    rawId = parts[parts.length - 1].trim();

    if (!/^\d+$/.test(rawId)) {
      setError(`Invalid Application Number format. Please enter a valid number (e.g. ITI${new Date().getFullYear()}/01).`);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8081/api/admissions/search?id=${rawId}&dob=${dob}`);
      
      if (response.data && response.data.id) {
        // Login successful
        localStorage.setItem("studentAuth", JSON.stringify(response.data));
        navigate('/student/dashboard');
      } else {
        setError('Invalid Application Number or Date of Birth.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid Credentials or Student not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: darkMode ? '#1e293b' : 'white',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
        position: 'relative'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'none',
            border: 'none',
            color: 'gray',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.85rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-color)', 
            width: '60px', height: '60px', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 1rem auto',
            color: 'white'
          }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ color: darkMode ? 'white' : '#1e293b', margin: 0 }}>Student Portal</h2>
          <p style={{ color: 'gray', marginTop: '0.5rem' }}>Login to view your fees, attendance, and results.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: darkMode ? '#cbd5e1' : '#475569', fontSize: '0.9rem' }}>Application Number</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'gray' }} />
              <input 
                type="text" 
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="e.g. APP-2026-1"
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px', border: '1px solid #cbd5e1',
                  backgroundColor: darkMode ? '#334155' : 'white',
                  color: darkMode ? 'white' : 'black'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: darkMode ? '#cbd5e1' : '#475569', fontSize: '0.9rem' }}>Date of Birth (Password)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'gray' }} />
              <input 
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px', border: '1px solid #cbd5e1',
                  backgroundColor: darkMode ? '#334155' : 'white',
                  color: darkMode ? 'white' : 'black'
                }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              padding: '0.8rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '1rem'
            }}
          >
            {loading ? 'Authenticating...' : 'Login to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
