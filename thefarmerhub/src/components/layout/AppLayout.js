import React, { useState, useEffect } from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Automatically close sidebar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSidebarOpen]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header toggleSidebar={toggleSidebar} />
      <Container fluid className="flex-grow-1" style={{ paddingTop: '56px' }}>
        <Row>
          <Sidebar isOpen={isSidebarOpen} />
          <Col
            className="p-4"
            style={{
              transition: 'margin-left 0.3s ease',
              marginLeft: isSidebarOpen ? '280px' : '0',
            }}
          >
            {children}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default AppLayout;
