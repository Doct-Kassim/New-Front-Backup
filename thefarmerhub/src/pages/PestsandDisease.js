// src/pages/PestsandDiseasesPage.js
// src/pages/TipsPage.js
import React, { useEffect, useState, useRef } from 'react';

import './TipsPage.css';

const PestsandDiseasesPage = () => {
  const [pestsAndDiseases, setPestsAndDiseases] = useState([]);
  const [filteredPestsAndDiseases, setFilteredPestsAndDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '' });

  const [selectedPestOrDisease, setSelectedPestOrDisease] = useState(null);

  const allCategories = [...new Set(pestsAndDiseases.map(item => item.category))];

  useEffect(() => {
    const fetchPestsAndDiseases = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/pests-and-diseases/');
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

  useEffect(() => {
    const filtered = pestsAndDiseases.filter(item => {
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filters.category === '' || item.category === filters.category;

      return matchesSearch && matchesCategory;
    });

    setFilteredPestsAndDiseases(filtered);
  }, [pestsAndDiseases, searchTerm, filters]);

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

  const closeDetail = () => {
    setSelectedPestOrDisease(null);
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
    <div className="pests-and-diseases-container container py-4">
      {!selectedPestOrDisease && (
        <>
          <div className="pests-and-diseases-header mb-4">
            <h2>Pests and Diseases</h2>
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
            Showing {filteredPestsAndDiseases.length} of {pestsAndDiseases.length} entries
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
              {filteredPestsAndDiseases.length > 0 ? (
                filteredPestsAndDiseases.map((item) => {
                  let imgSrc = 'https://via.placeholder.com/300x200?text=No+Image';
                  if (
                    item.media &&
                    item.media.type === 'photos' &&
                    item.media.urls.length > 0
                  ) {
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
                  <i className="bi bi-exclamation-circle"></i> No pests or diseases found matching your search criteria.
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
      {selectedPestOrDisease && (
        <div className="pest-disease-detail-fullscreen">
          <div className="pest-disease-detail-content container py-4">
            <button
              className="btn btn-outline-primary mb-4"
              onClick={closeDetail}
              aria-label="Back to list"
            >
              ← Back
            </button>

            {/* Media */}
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  ))}
                </div>
                {selectedPestOrDisease.media.urls.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#detailCarousel${selectedPestOrDisease.id}`}
                      data-bs-slide="prev"
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#detailCarousel${selectedPestOrDisease.id}`}
                      data-bs-slide="next"
                    >
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
              dangerouslySetInnerHTML={{ __html: selectedPestOrDisease.description }}
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



// // src/pages/TipsPage.js
// import React, { useEffect, useState, useRef } from 'react';

// import './TipsPage.css';

// const PestsandDiseasesPage = () => {
//   const [tips, setTips] = useState([]);
//   const [filteredTips, setFilteredTips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedDescriptions, setExpandedDescriptions] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     category: '',
//     author: '',
//     crop: '',
//     livestock: '',
//     equipment: ''
//   });
//   const videoRefs = useRef({});

//   // Extract all unique values for filters
//   const allCategories = [...new Set(tips.map(tip => tip.category))];
//   const allAuthors = [...new Set(tips.map(tip => tip.author_name))];
//   const allCrops = [...new Set(tips.map(tip => tip.crop).filter(Boolean))];
//   const allLivestock = [...new Set(tips.map(tip => tip.livestock).filter(Boolean))];

//   useEffect(() => {
//     const fetchTips = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/pests-and-diseases/');
//         const data = await response.json();
//         setTips(data);
//         setFilteredTips(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching tips:', error);
//         setLoading(false);
//       }
//     };

//     fetchTips();
//   }, []);

//   useEffect(() => {
//     const filtered = tips.filter(tip => {
//       // Search term filter (title and description)
//       const matchesSearch = searchTerm === '' || 
//         tip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         tip.description.toLowerCase().includes(searchTerm.toLowerCase());
      
//       // Category filter
//       const matchesCategory = filters.category === '' || 
//         tip.category === filters.category;
      
//       // Author filter
//       const matchesAuthor = filters.author === '' || 
//         tip.author_name === filters.author;
      
//       // Crop filter
//       const matchesCrop = filters.crop === '' || 
//         (tip.crop && tip.crop === filters.crop);
      
//       // Livestock filter
//       const matchesLivestock = filters.livestock === '' || 
//         (tip.livestock && tip.livestock === filters.livestock);
      
//       // Equipment filter
//       const matchesEquipment = filters.equipment === '' || 
//         (tip.equipment && tip.equipment === filters.equipment);
      
//       return matchesSearch && matchesCategory && matchesAuthor && 
//              matchesCrop && matchesLivestock && matchesEquipment;
//     });
    
//     setFilteredTips(filtered);
//   }, [tips, searchTerm, filters]);

//   const formatDate = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleDateString('en-GB', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const toggleDescription = (tipId) => {
//     setExpandedDescriptions(prev => ({
//       ...prev,
//       [tipId]: !prev[tipId]
//     }));
//   };

//   const truncateDescription = (text, isExpanded) => {
//     if (!text) return '';
//     return isExpanded ? text : `${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`;
//   };

//   const handleVideoClick = (tipId) => {
//     const video = videoRefs.current[tipId];
//     if (video) {
//       video.muted = !video.muted;
//       if (video.paused) {
//         video.play().catch(e => console.log("Autoplay prevented:", e));
//       }
//     }
//   };

//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterName]: value
//     }));
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilters({
//       category: '',
//       author: '',
//       crop: '',
//       livestock: '',
//       equipment: ''
//     });
//   };

//   return (
//     <div className="tips-container">
//       <div className="tips-header">
//         <h2>Pests and Diseases</h2>
//       </div>

//       {/* Search and Filter Section */}
//       <div className="search-filters">
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search pests and diseases..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <i className="bi bi-search"></i>
//         </div>

//         <div className="filter-section">
//           <select
//             value={filters.category}
//             onChange={(e) => handleFilterChange('category', e.target.value)}
//           >
//             <option value="">All Categories</option>
//             {allCategories.map(category => (
//               <option key={category} value={category}>{category}</option>
//             ))}
//           </select>

//           <select
//             value={filters.author}
//             onChange={(e) => handleFilterChange('author', e.target.value)}
//           >
//             <option value="">All Authors</option>
//             {allAuthors.map(author => (
//               <option key={author} value={author}>{author}</option>
//             ))}
//           </select>

//           <select
//             value={filters.crop}
//             onChange={(e) => handleFilterChange('crop', e.target.value)}
//           >
//             <option value="">All Crops</option>
//             {allCrops.map(crop => (
//               <option key={crop} value={crop}>{crop}</option>
//             ))}
//           </select>

//           <select
//             value={filters.livestock}
//             onChange={(e) => handleFilterChange('livestock', e.target.value)}
//           >
//             <option value="">All Livestock</option>
//             {allLivestock.map(livestock => (
//               <option key={livestock} value={livestock}>{livestock}</option>
//             ))}
//           </select>


//           <button onClick={clearFilters} className="clear-filters">
//             Clear Filters
//           </button>
//         </div>

//         <div className="results-count">
//           Showing {filteredTips.length} of {tips.length} tips
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-spinner">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <div className="tips-feed">
//           {filteredTips.length > 0 ? (
//             filteredTips.map((tip) => (
//               <div className="tip-card" key={tip.id}>
//                 {/* Tip card content remains the same as before */}
//                 {/* Header with author and category */}
//                 <div className="tip-header">
//                   <div className="author-info">
//                     <strong>{tip.author_name}</strong>
//                   </div>
//                   <span className="category-badge">{tip.category}</span>
//                 </div>

//                 {/* Media Section */}
//                 {tip.media && tip.media.type === 'photos' && tip.media.urls.length > 0 && (
//                   <div id={`carouselTip${tip.id}`} className="carousel slide" data-bs-ride="carousel">
//                     {/* Carousel content remains the same */}
//                      {tip.media.urls.length > 1 && (
//                     <div className="carousel-indicators">
//                       {tip.media.urls.map((_, index) => (
//                         <button
//                           key={index}
//                           type="button"
//                           data-bs-target={`#carouselTip${tip.id}`}
//                           data-bs-slide-to={index}
//                           className={index === 0 ? 'active' : ''}
//                           aria-current={index === 0 ? 'true' : 'false'}
//                         />
//                       ))}
//                     </div>
//                   )}
                  
//                   <div className="carousel-inner">
//                     {tip.media.urls.map((url, index) => (
//                       <div
//                         key={index}
//                         className={`carousel-item ${index === 0 ? 'active' : ''}`}
//                       >
//                         <img
//                           src={url}
//                           className="d-block w-100"
//                           alt={`${tip.title} - image ${index + 1}`}
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Available';
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
                  
//                   {tip.media.urls.length > 1 && (
//                     <>
//                       <button
//                         className="carousel-control-prev"
//                         type="button"
//                         data-bs-target={`#carouselTip${tip.id}`}
//                         data-bs-slide="prev"
//                       >
//                         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                         <span className="visually-hidden">Previous</span>
//                       </button>
//                       <button
//                         className="carousel-control-next"
//                         type="button"
//                         data-bs-target={`#carouselTip${tip.id}`}
//                         data-bs-slide="next"
//                       >
//                         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                         <span className="visually-hidden">Next</span>
//                       </button>
//                     </>
//                   )}
//                   </div>
//                 )}

//                 {tip.media && tip.media.type === 'video' && (
//                   <div className="video-wrapper">
//                     <video
//                       ref={el => videoRefs.current[tip.id] = el}
//                       controls
//                       className="tip-video"
//                       onClick={() => handleVideoClick(tip.id)}
//                       playsInline
//                     >
//                       <source src={tip.media.url} type="video/mp4" />
//                       Your browser does not support the video tag.
//                     </video>
//                     <div className="volume-control" onClick={() => handleVideoClick(tip.id)}>
//                       {videoRefs.current[tip.id]?.muted ? (
//                         <i className="bi bi-volume-mute"></i>
//                       ) : (
//                         <i className="bi bi-volume-up"></i>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Content Section */}
//                 <div className="tip-content">
//                   <h3 className="tip-title">{tip.title}</h3>
                  
//                   <div className="tip-description">
//                     <p>{truncateDescription(tip.description, expandedDescriptions[tip.id])}</p>
//                     {tip.description.length > 50 && (
//                       <button 
//                         onClick={() => toggleDescription(tip.id)}
//                         className="see-more-btn"
//                       >
//                         {expandedDescriptions[tip.id] ? 'See Less' : 'See More'}
//                       </button>
//                     )}
//                   </div>

//                   <div className="tip-details">
//                     {tip.crop && <div className="detail-item"><strong>Crop:</strong> {tip.crop}</div>}
//                     {tip.livestock && <div className="detail-item"><strong>Livestock:</strong> {tip.livestock}</div>}
//                     {tip.equipment && <div className="detail-item"><strong>Equipment:</strong> {tip.equipment}</div>}
//                   </div>

//                   <div className="tip-dates">
//                     <span>Posted: {formatDate(tip.date_posted)}</span>
//                     <span>Updated: {formatDate(tip.last_updated)}</span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-results">
//               <i className="bi bi-exclamation-circle"></i>
//               <p>No tips found matching your search criteria</p>
//               <button onClick={clearFilters} className="clear-filters">
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PestsandDiseasesPage;