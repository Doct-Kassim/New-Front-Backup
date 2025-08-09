import React, { useContext } from 'react';

import { Nav } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import {
  FaLeaf,
  FaUsers,
  FaChartLine,
  FaBook,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';

import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user, logoutUser } = useContext(AuthContext);

  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : '';

  const sidebarStyle = {
    position: 'fixed',
    top: '56px', // under header height
    left: 0,
    width: isOpen ? '280px' : '0',
    height: 'calc(100vh - 56px - 40px)', // leave 40px margin bottom
    marginBottom: '40px',
    backgroundColor: 'transparent',  // transparent background
    color: '#000', // black text
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    padding: isOpen ? '1rem 1.25rem 0.75rem 1.25rem' : '0',
    overflowX: 'hidden',
    overflowY: isOpen ? 'auto' : 'hidden',
    transition: 'width 0.3s ease, padding 0.3s ease',
    boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.2)' : 'none', // subtle shadow
    zIndex: 1030,
  };

  const userInfoStyle = {
    marginBottom: '1.2rem',
    cursor: 'pointer',
    color: '#000',  // black user text
  };

  const linkStyle = { 
    color: '#000',  // black text for links
    padding: '0.6rem 0',
    display: 'flex', 
    alignItems: 'center', 
    fontSize: '1rem',
    textDecoration: 'none',
  };

  const iconStyle = { 
    marginRight: '10px', 
    minWidth: '20px', 
    color: '#003366'  // dark blue icons
  };

  return (
    <div style={sidebarStyle}>
      {isOpen && (
        <>
          <div style={userInfoStyle}>
            {user ? (
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: '40px', height: '40px', fontWeight: 'bold' }}
                >
                  {initials}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div style={{ fontSize: '0.85em', color: '#555' }}>
                    {user.role}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{color: '#555'}}>Not logged in</div>
            )}
          </div>

          <Nav className="flex-column" style={{ fontSize: '1rem' }}>
            <Nav.Link as={Link} to="/HomePage" style={linkStyle}>
              <FaLeaf style={iconStyle} /> Dashboard
            </Nav.Link>

            <Nav.Link as={Link} to="/tips" style={linkStyle}>
              <FaBook style={iconStyle} /> Knowledge Hub
            </Nav.Link>

            <Nav.Link as={Link} to="/pests-and-diseases" style={linkStyle}>
              <FaUsers style={iconStyle} /> Pests & Diseases
            </Nav.Link>

            <Nav.Link as={Link} to="/market" style={linkStyle}>
              <FaChartLine style={iconStyle} /> Market Prices
            </Nav.Link>

            <Nav.Link as={Link} to="/forum" style={linkStyle}>
              <FaUsers style={iconStyle} /> Community Forum
            </Nav.Link>

            {!user && (
              <>
                <Nav.Link as={Link} to="/login" style={linkStyle}>
                  <FaSignInAlt style={iconStyle} /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" style={linkStyle}>
                  <FaUserPlus style={iconStyle} /> Register
                </Nav.Link>
              </>
            )}
          </Nav>

          {user && (
            <div className="mt-auto pt-3 border-top border-secondary">
              <button className="btn btn-outline-dark w-100" onClick={logoutUser}>
                Logout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
