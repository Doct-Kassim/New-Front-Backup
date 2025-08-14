// src/pages/PestsandDiseasesPage.js
import React, { useEffect, useState } from 'react';

import Fuse from 'fuse.js';

import 'bootstrap/dist/css/bootstrap.min.css';

import './TipsPage.css';

const PestsandDiseasesPage = () => {
  const [pestsAndDiseases, setPestsAndDiseases] = useState([]);
  const [filteredPestsAndDiseases, setFilteredPestsAndDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '' });
  const [selectedPestOrDisease, setSelectedPestOrDisease] = useState(null);

  const BASE_URL = "http://localhost:8000";

  // Helper to fix image URLs inside description HTML
  const fixImageUrls = (html) => {
    if (!html) return '';
    return html.replace(/<img\s+[^>]*src=["']([^"']+)["']/gi, (match, src) => {
      if (src.startsWith('http') || src.startsWith('data:')) return match;
      return match.replace(src, `${BASE_URL}${src}`);
    });
  };

  const allCategories = [...new Set(pestsAndDiseases.map(item => item.category))];

  const slides = [
    { image: '/images/desease2.webp', heading: 'LINDA NA LIPENDE SHAMBALAKO' },
    { image: '/images/disease1.jpg', heading: 'ZIFAHAMU TIBA NA MAGONJWA MBALIMBALI YA MIFUGO' },
    { image: '/images/desese.jpeg', heading: 'NJIA ZA KULINDA NA KUTUNZA UFUGAJI WA SAMAKI' }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchPestsAndDiseases = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/pests-and-diseases/`);
        const data = await response.json();
        setPestsAndDiseases(data);
        setFilteredPestsAndDiseases(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pests and diseases:', error);
        setLoading(false);
      }
    };
    fetchPestsAndDiseases();
  }, []);

  // Fuse.js options
  const fuse = new Fuse(pestsAndDiseases, {
    keys: ['title', 'description', 'crop', 'livestock', 'equipment', 'category'],
    threshold: 0.3, // lower is stricter, higher is fuzzier
  });

  useEffect(() => {
    let results = [];
    if (searchTerm.trim() === '') {
      results = pestsAndDiseases;
    } else {
      results = fuse.search(searchTerm).map(result => result.item);
    }
    // Apply category filter after Fuse search
    const filtered = results.filter(item =>
      filters.category === '' || item.category === filters.category
    );
    setFilteredPestsAndDiseases(filtered);
  }, [searchTerm, filters, pestsAndDiseases]); // Fuse re-runs when data or search changes

  // Background slideshow effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openDetail = (item) => {
    setSelectedPestOrDisease(item);
    window.scrollTo(0, 0);
  };

  const closeDetail = () => setSelectedPestOrDisease(null);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ category: '' });
  };

  return (
    <div className="pests-and-diseases-container container py-4">
      {!selectedPestOrDisease && (
        <>
          {/* HERO SECTION */}
          <div className="mb-4 position-relative w-100" style={{ height: '60vh' }}>
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].heading}
              className="w-100 h-100"
              style={{ objectFit: 'cover', transition: 'opacity 1s ease-in-out' }}
            />
            <div
              className="position-absolute top-50 start-50 translate-middle text-center text-white px-3"
              style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}
            >
              <h2 className="fw-bold mb-0">{slides[currentSlide].heading}</h2>
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="row g-2 mb-4">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search pests or diseases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3 text-muted small">
            Showing {filteredPestsAndDiseases.length} of {pestsAndDiseases.length} entries
            {(searchTerm || filters.category) && (
              <button onClick={clearFilters} className="btn btn-link btn-sm ms-2">
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {filteredPestsAndDiseases.length > 0 ? (
                filteredPestsAndDiseases.map((item) => {
                  let imgSrc = 'https://via.placeholder.com/300x200?text=No+Image';
                  if (item.media && item.media.type === 'photos' && item.media.urls.length > 0) {
                    imgSrc = item.media.urls[0];
                  }
                  const nameOnCard = item.crop || item.livestock || item.equipment || item.category || item.title;
                  return (
                    <div className="col-12 col-sm-6 col-md-4" key={item.id}>
                      <div
                        className="pest-disease-card d-flex flex-column align-items-center p-3 border rounded shadow-sm"
                        onClick={() => openDetail(item)}
                        style={{ cursor: 'pointer', minHeight: '250px' }}
                      >
                        <img
                          src={imgSrc}
                          alt={nameOnCard}
                          className="mb-3"
                          style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available'; }}
                        />
                        <div className="fw-bold text-center" style={{ fontSize: '1.1rem', userSelect: 'none' }}>
                          {nameOnCard}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-circle"></i> No pests or diseases found matching your search criteria.
                  <button onClick={clearFilters} className="btn btn-link btn-sm ms-2">Clear Filters</button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Fullscreen Detail Page */}
      {selectedPestOrDisease && (
        <div className="pest-disease-detail-fullscreen">
          <div className="pest-disease-detail-content container py-4">
            <button className="btn btn-outline-primary mb-4" onClick={closeDetail} aria-label="Back to list">
              ← Back
            </button>

            {selectedPestOrDisease.media && selectedPestOrDisease.media.type === 'photos' && selectedPestOrDisease.media.urls.length > 0 && (
              <div id={`detailCarousel${selectedPestOrDisease.id}`} className="carousel slide mb-4" data-bs-ride="carousel">
                {selectedPestOrDisease.media.urls.length > 1 && (
                  <div className="carousel-indicators">
                    {selectedPestOrDisease.media.urls.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target={`#detailCarousel${selectedPestOrDisease.id}`}
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                      />
                    ))}
                  </div>
                )}
                <div className="carousel-inner">
                  {selectedPestOrDisease.media.urls.map((url, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img
                        src={url}
                        className="d-block w-100 rounded"
                        alt={`${selectedPestOrDisease.title} - image ${index + 1}`}
                        style={{ maxHeight: '450px', objectFit: 'contain' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Available'; }}
                      />
                    </div>
                  ))}
                </div>
                {selectedPestOrDisease.media.urls.length > 1 && (
                  <>
                    <button className="carousel-control-prev" type="button" data-bs-target={`#detailCarousel${selectedPestOrDisease.id}`} data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target={`#detailCarousel${selectedPestOrDisease.id}`} data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {selectedPestOrDisease.media && selectedPestOrDisease.media.type === 'video' && (
              <video controls className="w-100 mb-4 rounded" playsInline>
                <source src={selectedPestOrDisease.media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <h3 className="mb-3">{selectedPestOrDisease.title}</h3>
            <div
              className="pest-disease-description"
              dangerouslySetInnerHTML={{ __html: fixImageUrls(selectedPestOrDisease.description) }}
            ></div>
            <div className="mb-3">
              {selectedPestOrDisease.crop && <div><strong>Crop:</strong> {selectedPestOrDisease.crop}</div>}
              {selectedPestOrDisease.livestock && <div><strong>Livestock:</strong> {selectedPestOrDisease.livestock}</div>}
              {selectedPestOrDisease.equipment && <div><strong>Equipment:</strong> {selectedPestOrDisease.equipment}</div>}
            </div>
            <div className="text-muted small">
              <span>Posted: {formatDate(selectedPestOrDisease.date_posted)}</span> |{' '}
              <span>Updated: {formatDate(selectedPestOrDisease.last_updated)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PestsandDiseasesPage;
