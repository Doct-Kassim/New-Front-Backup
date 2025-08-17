// src/App.js
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import LoginPage from './Auth/LoginPage';
import RegisterPage from './Auth/RegisterPage';
import { AuthProvider } from './context/AuthContext'; 
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import EditProfilePage from './pages/EditProfilePage';
import Forum from './pages/Forum';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import PestsandDiseasesPage from './pages/PestsandDisease';
import TipsPage from './pages/TipsPage';
import TrainingTutorials from './pages/TrainingTutorials';  // Hii ndio import mpya
import AppLayout from './components/layout/AppLayout';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Pages zenye layout */}
          <Route path="/HomePage" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
          <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
          <Route path="/tips" element={<AppLayout><TipsPage /></AppLayout>} />
          <Route path="/pests-and-diseases" element={<AppLayout><PestsandDiseasesPage /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><UserProfilePage /></AppLayout>} />
          <Route path="/edit-profile" element={<AppLayout><EditProfilePage /></AppLayout>} />
          <Route path="/forum" element={<Forum />} />

          {/* Route mpya kwa Training Tutorials */}
          <Route path="/training-videos" element={<AppLayout><TrainingTutorials /></AppLayout>} />

          {/* Login & Register nazo ziwe ndani ya layout */}
          <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
          <Route path="/register" element={<AppLayout><RegisterPage /></AppLayout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
