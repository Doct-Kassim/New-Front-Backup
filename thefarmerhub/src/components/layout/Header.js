import React from 'react';

import { FaBars, FaLeaf, FaHome, FaConciergeBell, FaEnvelope, FaInfoCircle, FaGlobe } from 'react-icons/fa';

import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = ({ toggleSidebar }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container fluid>
      
        <button className="btn btn-dark me-3" onClick={toggleSidebar}>
          <FaBars />
        </button>

       
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">
              <FaHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link href="/services">
              <FaConciergeBell className="me-1" /> Services / Features
            </Nav.Link>
            <Nav.Link href="/contact">
              <FaEnvelope className="me-1" /> Contact / Support
            </Nav.Link>
            <Nav.Link href="/about">
              <FaInfoCircle className="me-1" /> About
            </Nav.Link>
          </Nav>

          
          <Nav className="me-3">
            <NavDropdown
              title={
                <span>
                  <FaGlobe className="me-1" /> Language
                </span>
              }
              id="language-dropdown"
              align="end"
            >
              <NavDropdown.Item href="#lang-sw">Kiswahili</NavDropdown.Item>
              <NavDropdown.Item href="#lang-en">English</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <FaLeaf size={24} className="me-2 text-success" />
            <span className="fw-bold">FarmerHub</span>
          </Navbar.Brand>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
