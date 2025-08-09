import React, { useState, useContext } from 'react';

import { Modal, Form, Button } from 'react-bootstrap';

import { FaUser, FaLock } from 'react-icons/fa';

import { useNavigate, Link } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const LoginPage = ({ show = true, onHide }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(username, password);
    if (success) {
      navigate('/');
      if (onHide) onHide();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide || (() => {})}
      centered
      size="md"
      backdrop="static"
      keyboard={false}
      contentClassName="border-0 bg-transparent"
    >
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#1e1e1e'
        }}
      >
        {/* Close Button */}
        {onHide && (
          <div className="d-flex justify-content-end">
            <Button
              variant="dark"
              size="sm"
              onClick={onHide}
              className="rounded-end px-2 py-1"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Login Header */}
        <h3 className="text-center fw-bold mb-4">Login</h3>

        {error && (
          <div className="alert alert-danger py-1 text-center">{error}</div>
        )}

        {/* Login Form */}
        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="input-group-text bg-white">
                <FaUser />
              </span>
            </div>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-white">
                <FaLock />
              </span>
            </div>
          </Form.Group>

          {/* Submit */}
          <Button type="submit" className="w-100 bg-success border-success">
            Login
          </Button>
        </Form>

        {/* Register Link */}
        <div className="text-center mt-3">
          Don’t have an account?{' '}
          <Link to="/register" className="fw-semibold text-decoration-none">
            Register
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default LoginPage;
