// src/pages/TipsPage.js
import React, { useEffect, useState, useRef } from 'react';

import './TipsPage.css';

const PestsandDiseasesPage = () => {
  const [tips, setTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    crop: '',
    livestock: '',
    equipment: ''
  });
  const videoRefs = useRef({});

  // Extract all unique values for filters
  const allCategories = [...new Set(tips.map(tip => tip.category))];
  const allAuthors = [...new Set(tips.map(tip => tip.author_name))];
  const allCrops = [...new Set(tips.map(tip => tip.crop).filter(Boolean))];
  const allLivestock = [...new Set(tips.map(tip => tip.livestock).filter(Boolean))];

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/pests-and-diseases/');
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
      // Search term filter (title and description)
      const matchesSearch = searchTerm === '' || 
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tip.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = filters.category === '' || 
        tip.category === filters.category;
      
      // Author filter
      const matchesAuthor = filters.author === '' || 
        tip.author_name === filters.author;
      
      // Crop filter
      const matchesCrop = filters.crop === '' || 
        (tip.crop && tip.crop === filters.crop);
      
      // Livestock filter
      const matchesLivestock = filters.livestock === '' || 
        (tip.livestock && tip.livestock === filters.livestock);
      
      // Equipment filter
      const matchesEquipment = filters.equipment === '' || 
        (tip.equipment && tip.equipment === filters.equipment);
      
      return matchesSearch && matchesCategory && matchesAuthor && 
             matchesCrop && matchesLivestock && matchesEquipment;
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

  const toggleDescription = (tipId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [tipId]: !prev[tipId]
    }));
  };

  const truncateDescription = (text, isExpanded) => {
    if (!text) return '';
    return isExpanded ? text : `${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`;
  };

  const handleVideoClick = (tipId) => {
    const video = videoRefs.current[tipId];
    if (video) {
      video.muted = !video.muted;
      if (video.paused) {
        video.play().catch(e => console.log("Autoplay prevented:", e));
      }
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      author: '',
      crop: '',
      livestock: '',
      equipment: ''
    });
  };

  return (
    <div className="tips-container">
      <div className="tips-header">
        <h2>Pests and Diseases</h2>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search pests and diseases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search"></i>
        </div>

        <div className="filter-section">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {allCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
          >
            <option value="">All Authors</option>
            {allAuthors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>

          <select
            value={filters.crop}
            onChange={(e) => handleFilterChange('crop', e.target.value)}
          >
            <option value="">All Crops</option>
            {allCrops.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>

          <select
            value={filters.livestock}
            onChange={(e) => handleFilterChange('livestock', e.target.value)}
          >
            <option value="">All Livestock</option>
            {allLivestock.map(livestock => (
              <option key={livestock} value={livestock}>{livestock}</option>
            ))}
          </select>


          <button onClick={clearFilters} className="clear-filters">
            Clear Filters
          </button>
        </div>

        <div className="results-count">
          Showing {filteredTips.length} of {tips.length} tips
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="tips-feed">
          {filteredTips.length > 0 ? (
            filteredTips.map((tip) => (
              <div className="tip-card" key={tip.id}>
                {/* Tip card content remains the same as before */}
                {/* Header with author and category */}
                <div className="tip-header">
                  <div className="author-info">
                    <strong>{tip.author_name}</strong>
                  </div>
                  <span className="category-badge">{tip.category}</span>
                </div>

                {/* Media Section */}
                {tip.media && tip.media.type === 'photos' && tip.media.urls.length > 0 && (
                  <div id={`carouselTip${tip.id}`} className="carousel slide" data-bs-ride="carousel">
                    {/* Carousel content remains the same */}
                     {tip.media.urls.length > 1 && (
                    <div className="carousel-indicators">
                      {tip.media.urls.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          data-bs-target={`#carouselTip${tip.id}`}
                          data-bs-slide-to={index}
                          className={index === 0 ? 'active' : ''}
                          aria-current={index === 0 ? 'true' : 'false'}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="carousel-inner">
                    {tip.media.urls.map((url, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${index === 0 ? 'active' : ''}`}
                      >
                        <img
                          src={url}
                          className="d-block w-100"
                          alt={`${tip.title} - image ${index + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Available';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {tip.media.urls.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#carouselTip${tip.id}`}
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#carouselTip${tip.id}`}
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                  </div>
                )}

                {tip.media && tip.media.type === 'video' && (
                  <div className="video-wrapper">
                    <video
                      ref={el => videoRefs.current[tip.id] = el}
                      controls
                      className="tip-video"
                      onClick={() => handleVideoClick(tip.id)}
                      playsInline
                    >
                      <source src={tip.media.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="volume-control" onClick={() => handleVideoClick(tip.id)}>
                      {videoRefs.current[tip.id]?.muted ? (
                        <i className="bi bi-volume-mute"></i>
                      ) : (
                        <i className="bi bi-volume-up"></i>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className="tip-content">
                  <h3 className="tip-title">{tip.title}</h3>
                  
                  <div className="tip-description">
                    <p>{truncateDescription(tip.description, expandedDescriptions[tip.id])}</p>
                    {tip.description.length > 50 && (
                      <button 
                        onClick={() => toggleDescription(tip.id)}
                        className="see-more-btn"
                      >
                        {expandedDescriptions[tip.id] ? 'See Less' : 'See More'}
                      </button>
                    )}
                  </div>

                  <div className="tip-details">
                    {tip.crop && <div className="detail-item"><strong>Crop:</strong> {tip.crop}</div>}
                    {tip.livestock && <div className="detail-item"><strong>Livestock:</strong> {tip.livestock}</div>}
                    {tip.equipment && <div className="detail-item"><strong>Equipment:</strong> {tip.equipment}</div>}
                  </div>

                  <div className="tip-dates">
                    <span>Posted: {formatDate(tip.date_posted)}</span>
                    <span>Updated: {formatDate(tip.last_updated)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className="bi bi-exclamation-circle"></i>
              <p>No tips found matching your search criteria</p>
              <button onClick={clearFilters} className="clear-filters">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PestsandDiseasesPage;