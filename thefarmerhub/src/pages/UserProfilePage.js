// src/pages/UserProfilePage.js
import React, { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const UserProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <div className="container mt-5"><h4>You are not logged in.</h4></div>;
  }

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">{user.first_name} {user.last_name}</h5>
          <p className="card-text"><strong>Username:</strong> {user.username}</p>
          <p className="card-text"><strong>Email:</strong> {user.email}</p>
          <p className="card-text"><strong>Phone:</strong> {user.phone}</p>
          <p className="card-text"><strong>Address:</strong> {user.address}</p>
          <p className="card-text"><strong>Gender:</strong> {user.gender}</p>
          <p className="card-text"><strong>Role:</strong> {user.role}</p>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
