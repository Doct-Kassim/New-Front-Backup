import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../context/AuthContext';

const EditProfilePage = () => {
  const { user, authTokens, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    new_password: '',
    verify_password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        new_password: '',
        verify_password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const result = await updateUser(formData);

  if (result.success) {
    setSuccess('Profile updated successfully.');
    setFormData(prev => ({
      ...prev,
      new_password: '',
      verify_password: ''
    }));
  } else {
    setError(result.message || 'Something went wrong.');
  }
};

  if (!user) {
    return <div className="container mt-5"><h4>You are not logged in.</h4></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Profile</h2>
      <div className="card mt-3">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Gender</label>
                <select
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label>New Password</label>
                <input
                  type="password"
                  name="new_password"
                  className="form-control"
                  value={formData.new_password}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Verify Password</label>
                <input
                  type="password"
                  name="verify_password"
                  className="form-control"
                  value={formData.verify_password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
