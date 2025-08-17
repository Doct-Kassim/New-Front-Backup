import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize tokens and user from localStorage
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  // Login function
  const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.status === 200) {
        const data = await response.json();
        const { access, refresh } = data;

        // Save tokens
        const authData = { access, refresh };
        localStorage.setItem('authTokens', JSON.stringify(authData));
        setAuthTokens(authData);

        // Extract user info from token (or backend response)
        const userInfo = parseJwt(access);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);

        return { access, refresh }; // return tokens for usage in Forum
      } else {
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  // Logout function
  const logoutUser = () => {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('user');
    setAuthTokens(null);
    setUser(null);
  };

  // Update profile function
  const updateUser = async (formData) => {
    if (!authTokens) return { success: false, message: 'Not authenticated' };

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

  // Axios-like fetch wrapper with Authorization header
  const authFetch = async (url, options = {}) => {
    if (!authTokens) throw new Error('No auth token available');

    const headers = options.headers ? { ...options.headers } : {};
    headers['Authorization'] = `Bearer ${authTokens.access}`;

    const opts = { ...options, headers };
    return fetch(url, opts);
  };

  // Helper to parse JWT token for user info
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      return {};
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        loginUser,
        logoutUser,
        updateUser,
        authFetch // <== use this for Forum or any API request
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
