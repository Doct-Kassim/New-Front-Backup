// src/pages/HomePage.js
import React from 'react';

import { Container, Row, Col, Carousel } from 'react-bootstrap';

import WeatherWidget from '../components/WeatherWidget';

const HomePage = () => {
  // Picha na header zao
  const slides = [
    { src: '/images/background3.webp', header: 'Planting Season' },
    { src: '/images/farming2.jpeg', header: 'Irrigation Techniques' },
    { src: '/images/livestock1.jpeg', header: 'Healthy Livestock' },
    { src: '/images/livestock2.jpeg', header: 'Cattle Feeding' },
    { src: '/images/images.jpeg', header: 'Harvest Time' },
    { src: '/images/images (1).jpeg', header: 'Fertilizer Application' },
    { src: '/images/images (2).jpeg', header: 'Organic Farming' },
    { src: '/images/images (3).jpeg', header: 'Crop Protection' },
    { src: '/images/images (5).jpeg', header: 'Farm Machinery' },
    { src: '/images/images (6).jpeg', header: 'Market Ready Produce' },
  ];

  return (
    <Container fluid className="px-4 py-4">
      <h2 className="mb-4">Farmer Dashboard</h2>

      {/* Weather widget full width on top */}
      <Row className="mb-4">
        <Col>
          <WeatherWidget />
        </Col>
      </Row>

      {/* Carousel below weather */}
      <Row>
        <Col>
          <Carousel controls={true} indicators={false} fade interval={3000}>
            {slides.map((slide, index) => (
              <Carousel.Item key={index}>
                <img
                  src={slide.src}
                  alt={`slide-${index}`}
                  className="d-block w-100"
                  style={{
                    maxHeight: '500px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
                {/* Caption overlay */}
                <Carousel.Caption
                  style={{
                    bottom: '20%',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    borderRadius: '8px',
                    padding: '10px 20px'
                  }}
                >
                  <h3>{slide.header}</h3>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
