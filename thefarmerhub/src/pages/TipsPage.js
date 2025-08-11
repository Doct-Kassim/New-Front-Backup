// src/pages/TipsPage.js
import React, { useEffect, useState } from 'react';

import './TipsPage.css';

const TipsPage = () => {
  const [tips, setTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '' });

  // For full screen detail page
  const [selectedTip, setSelectedTip] = useState(null);

  const allCategories = [...new Set(tips.map(tip => tip.category))];

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tips/');
        const data = await response.json();
        setTips(data);
        setFilteredTips(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tips:', error);
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  useEffect(() => {
    const filtered = tips.filter(tip => {
      const matchesSearch =
        searchTerm === '' ||
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filters.category === '' || tip.category === filters.category;

      return matchesSearch && matchesCategory;
    });

    setFilteredTips(filtered);
  }, [tips, searchTerm, filters]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openTip = (tip) => {
    setSelectedTip(tip);
    window.scrollTo(0, 0); // Scroll top on open
  };

  const closeTip = () => {
    setSelectedTip(null);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ category: '' });
  };

  return (
    <div className="tips-container container py-4">
      {!selectedTip && (
        <>
          <div className="tips-header mb-4">
            <h2>Farming Tips</h2>
          </div>

          {/* Search and Category Filter */}
          <div className="row g-2 mb-4">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search knowledge base..."
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
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3 text-muted small">
            Showing {filteredTips.length} of {tips.length} tips
            {(searchTerm || filters.category) && (
              <button
                onClick={clearFilters}
                className="btn btn-link btn-sm ms-2"
              >
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
              {filteredTips.length > 0 ? (
                filteredTips.map((tip) => {
                  let imgSrc = 'https://via.placeholder.com/300x200?text=No+Image';
                  if (
                    tip.media &&
                    tip.media.type === 'photos' &&
                    tip.media.urls.length > 0
                  ) {
                    imgSrc = tip.media.urls[0];
                  }

                  // Name to show on card is whichever of crop/livestock/equipment exists, fallback to category or title
                  const nameOnCard = tip.crop || tip.livestock || tip.equipment || tip.category || tip.title;

                  return (
                    <div className="col-12 col-sm-6 col-md-4" key={tip.id}>
                      <div
                        className="tip-card d-flex flex-column align-items-center p-3 border rounded shadow-sm"
                        onClick={() => openTip(tip)}
                        style={{ cursor: 'pointer', minHeight: '250px' }}
                      >
                        <img
                          src={imgSrc}
                          alt={nameOnCard}
                          className="mb-3"
                          style={{
                            width: '100%',
                            height: '160px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                          }}
                        />
                        <div
                          className="fw-bold text-center"
                          style={{ fontSize: '1.1rem', userSelect: 'none' }}
                        >
                          {nameOnCard}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-circle"></i> No tips found matching your search criteria.
                  <button onClick={clearFilters} className="btn btn-link btn-sm ms-2">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Fullscreen Detail Page */}
      {selectedTip && (
        <div className="tip-detail-fullscreen">
          <div className="tip-detail-content container py-4">
            <button
              className="btn btn-outline-primary mb-4"
              onClick={closeTip}
              aria-label="Back to tips list"
            >
              ← Back
            </button>

            {/* Media */}
            {selectedTip.media && selectedTip.media.type === 'photos' && selectedTip.media.urls.length > 0 && (
              <div id={`detailCarousel${selectedTip.id}`} className="carousel slide mb-4" data-bs-ride="carousel">
                {selectedTip.media.urls.length > 1 && (
                  <div className="carousel-indicators">
                    {selectedTip.media.urls.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target={`#detailCarousel${selectedTip.id}`}
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                      />
                    ))}
                  </div>
                )}
                <div className="carousel-inner">
                  {selectedTip.media.urls.map((url, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img
                        src={url}
                        className="d-block w-100 rounded"
                        alt={`${selectedTip.title} - image ${index + 1}`}
                        style={{ maxHeight: '450px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  ))}
                </div>
                {selectedTip.media.urls.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#detailCarousel${selectedTip.id}`}
                      data-bs-slide="prev"
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#detailCarousel${selectedTip.id}`}
                      data-bs-slide="next"
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {selectedTip.media && selectedTip.media.type === 'video' && (
              <video controls className="w-100 mb-4 rounded" playsInline>
                <source src={selectedTip.media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <h3 className="mb-3">{selectedTip.title}</h3>

            <p style={{ whiteSpace: 'pre-wrap' }}>{selectedTip.description}</p>

            <div className="mb-3">
              {selectedTip.crop && <div><strong>Crop:</strong> {selectedTip.crop}</div>}
              {selectedTip.livestock && <div><strong>Livestock:</strong> {selectedTip.livestock}</div>}
              {selectedTip.equipment && <div><strong>Equipment:</strong> {selectedTip.equipment}</div>}
            </div>

            <div className="text-muted small">
              <span>Posted: {formatDate(selectedTip.date_posted)}</span> |{' '}
              <span>Updated: {formatDate(selectedTip.last_updated)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipsPage;
