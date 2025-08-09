// context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.status === 200) {
        const data = await response.json();
        const { access, refresh, ...userInfo } = data;

        const authData = { access, refresh };

        localStorage.setItem('authTokens', JSON.stringify(authData));
        localStorage.setItem('user', JSON.stringify(userInfo));

        setAuthTokens(authData);
        setUser(userInfo);

        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('user');
    setAuthTokens(null);
    setUser(null);
  };

  const updateUser = async (formData) => {
    const payload = {};
    for (const [key, value] of Object.entries(formData)) {
      if (value !== '') payload[key] = value;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/update-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('Content-Type');
      let data = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (response.ok && data) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true, data };
      } else {
        let message = 'Update failed.';
        if (data && typeof data === 'object') {
          message = Object.values(data).flat().join(' ');
        }
        return { success: false, message };
      }
    } catch (err) {
      console.error('Update error:', err);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        loginUser,
        logoutUser,
        updateUser, // <== add here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
