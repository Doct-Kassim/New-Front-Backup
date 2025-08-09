import React, { useState } from 'react';

import LoginPage from '../Auth/LoginPage';
import RegisterPage from '../Auth/RegisterPage';

const AuthModals = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const closeAll = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <>
      {/* Buttons for demo — unaweza kuziweka kwenye navbar au popote */}
      <button className="btn btn-outline-primary me-2" onClick={openLogin}>Login</button>
      <button className="btn btn-outline-success" onClick={openRegister}>Register</button>

      {/* Login Modal */}
      {showLogin && (
        <LoginPage show={showLogin} onHide={closeAll} />
      )}

      {/* Register Modal */}
      {showRegister && (
        <RegisterPage show={showRegister} onHide={closeAll} />
      )}
    </>
  );
};

export default AuthModals;
