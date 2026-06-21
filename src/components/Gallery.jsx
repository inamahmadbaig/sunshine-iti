import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Image as ImageIcon } from 'lucide-react';

const Gallery = ({ darkMode }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:8081/api/gallery')
      .then(res => {
        setImages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading gallery:", err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(images.map(img => img.category))];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className={`gallery-page ${darkMode ? 'dark-theme' : ''}`} style={{ minHeight: '100vh', padding: '4rem 2rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Camera size={40} /> Campus Photo Gallery
          </h1>
          <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '1.1rem' }}>
            Explore our state-of-the-art facilities, workshops, and vibrant campus life.
          </p>
        </div>

        {/* Filters */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '30px',
                  border: 'none',
                  backgroundColor: filter === cat ? 'var(--primary-color)' : (darkMode ? '#333' : '#eee'),
                  color: filter === cat ? 'white' : 'var(--text-color)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Image Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Gallery...</div>
        ) : filteredImages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'gray' }}>
            <ImageIcon size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
            <p>No photos available yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredImages.map(img => (
              <div key={img.id} style={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: darkMode ? '#1e293b' : 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src={img.imageUrl} alt={img.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{img.title}</h3>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '12px' }}>
                    {img.category}
                  </span>
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
