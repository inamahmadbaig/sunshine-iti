import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Image as ImageIcon } from 'lucide-react';

const Gallery = ({ darkMode }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Dynamically inject Bootstrap CSS for grid support
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    link.id = 'bootstrap-gallery-css';
    document.head.appendChild(link);

    axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/gallery`)
      .then(res => {
        setImages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading gallery:", err);
        setLoading(false);
      });

    return () => {
      const el = document.getElementById('bootstrap-gallery-css');
      if (el) el.remove();
    };
  }, []);

  const categories = ['All', ...new Set(images.map(img => img.category))];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className={`gallery-page ${darkMode ? 'dark-theme' : ''}`} style={{ minHeight: '100vh', padding: '4rem 0', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <div className="container-fluid px-3 px-md-5">
        
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold d-inline-flex align-items-center justify-content-center gap-2 mb-3" style={{ fontSize: '3rem', color: 'var(--primary-color)', fontFamily: "'Outfit', sans-serif" }}>
            <Camera size={44} className="text-warning" /> Campus Photo Gallery
          </h1>
          <p className="lead mx-auto" style={{ maxWidth: '700px', color: 'var(--text-color)', opacity: 0.85, fontSize: '1.2rem', lineHeight: '1.6' }}>
            Explore our state-of-the-art facilities, modern practical labs, mechanical workshops, and vibrant student activities.
          </p>
          <div className="mx-auto mt-2" style={{ width: '80px', height: '4px', backgroundColor: 'var(--primary-color)', borderRadius: '2px' }}></div>
        </div>

        {/* Filter Buttons */}
        {categories.length > 1 && (
          <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="btn px-4 py-2 fw-semibold"
                style={{
                  borderRadius: '50px',
                  border: filter === cat ? 'none' : `1.5px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
                  backgroundColor: filter === cat ? 'var(--primary-color)' : 'transparent',
                  color: filter === cat ? 'white' : 'var(--text-color)',
                  boxShadow: filter === cat ? '0 10px 20px rgba(37, 99, 235, 0.2)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (filter !== cat) {
                    e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== cat) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Image Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading Gallery...</span>
            </div>
            <p className="mt-3 fs-5">Loading Gallery...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <ImageIcon size={64} className="mx-auto mb-3 opacity-50" />
            <p className="fs-5">No photos available yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredImages.map(img => (
              <div key={img.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div 
                  className="card border-0 h-100 shadow-lg overflow-hidden" 
                  style={{
                    borderRadius: '16px',
                    backgroundColor: darkMode ? '#1e293b' : 'white',
                    color: 'var(--text-color)',
                    transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    const image = e.currentTarget.querySelector('img');
                    if (image) image.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    const image = e.currentTarget.querySelector('img');
                    if (image) image.style.transform = 'scale(1)';
                  }}
                >
                  <div className="position-relative overflow-hidden" style={{ height: '260px' }}>
                    <img 
                      src={img.imageUrl} 
                      alt={img.title} 
                      className="w-100 h-100" 
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease-out'
                      }} 
                    />
                    <div 
                      className="position-absolute top-3 end-3 badge px-3 py-2 text-uppercase font-semibold tracking-wider text-white" 
                      style={{ 
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '30px',
                        fontSize: '0.75rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {img.category}
                    </div>
                  </div>
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <h3 className="card-title h5 fw-bold mb-0" style={{ 
                      fontFamily: "'Outfit', sans-serif", 
                      fontSize: '1.2rem',
                      lineHeight: '1.4',
                      color: darkMode ? '#f8fafc' : '#1e293b'
                    }}>
                      {img.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
