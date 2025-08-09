import React, { useState } from 'react';

import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

import { FaUser, FaEnvelope, FaLock, FaUserTag, FaPhone, FaMapMarkerAlt, FaVenusMars } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

const RegisterPage = ({ show = true, onHide }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    gender: 'Male',
    role: 'Farmer',
    password: '',
    password2: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/register-user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.status === 201) {
        navigate('/login');
        if (onHide) onHide();
      } else {
        const data = await response.json();
        let message = 'Registration failed.';
        if (typeof data === 'object') {
          message = Object.values(data).flat().join(' ');
        }
        setError(message);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide || (() => {})}
      centered
      size="lg"
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
            <Button variant="dark" size="sm" onClick={onHide} className="rounded-end px-2 py-1">
              ✕
            </Button>
          </div>
        )}

        {/* Title */}
        <h3 className="text-center fw-bold mb-4">Register</h3>

        {error && (
          <div className="alert alert-danger py-1 text-center">{error}</div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>First Name</Form.Label>
              <div className="input-group">
                <Form.Control type="text" name="first_name" placeholder="First Name" required onChange={handleChange} />
                <span className="input-group-text bg-white"><FaUser /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <div className="input-group">
                <Form.Control type="text" name="last_name" placeholder="Last Name" required onChange={handleChange} />
                <span className="input-group-text bg-white"><FaUser /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Username</Form.Label>
              <div className="input-group">
                <Form.Control type="text" name="username" placeholder="Username" required onChange={handleChange} />
                <span className="input-group-text bg-white"><FaUser /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <Form.Control type="email" name="email" placeholder="Email" required onChange={handleChange} />
                <span className="input-group-text bg-white"><FaEnvelope /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Phone</Form.Label>
              <div className="input-group">
                <Form.Control type="text" name="phone" placeholder="Phone" required onChange={handleChange} />
                <span className="input-group-text bg-white"><FaPhone /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Address</Form.Label>
              <div className="input-group">
                <Form.Control type="text" name="address" placeholder="Address" required onChange={handleChange} />
                <span className="input-group-text bg-white"><FaMapMarkerAlt /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Gender</Form.Label>
              <div className="input-group">
                <Form.Select name="gender" onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
                <span className="input-group-text bg-white"><FaVenusMars /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Role</Form.Label>
              <div className="input-group">
                <Form.Select name="role" onChange={handleChange}>
                  <option value="Farmer">Farmer</option>
                  <option value="Expert">Expert</option>
                </Form.Select>
                <span className="input-group-text bg-white"><FaUserTag /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control type="password" name="password" placeholder="Password" required onChange={handleChange} />
                <span className="input-group-text bg-white"><FaLock /></span>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <Form.Control type="password" name="password2" placeholder="Confirm Password" required onChange={handleChange} />
                <span className="input-group-text bg-white"><FaLock /></span>
              </div>
            </Col>
          </Row>

          <Button type="submit" className="w-100 bg-success border-success">
            Register
          </Button>
        </Form>

        {/* Login link */}
        <div className="text-center mt-3">
          Already have an account?{' '}
          <a href="/login" className="fw-semibold text-decoration-none">
            Login
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterPage;
