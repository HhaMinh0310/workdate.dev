import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { CoupleDashboard } from './pages/couple/CoupleDashboard';
import { CoupleSessionRoom } from './pages/couple/CoupleSession';
import { CoupleCreate } from './pages/couple/CoupleCreate';
import { FindPartner } from './pages/couple/FindPartner';
import { SoloCreate } from './pages/solo/SoloCreate';
import { SoloBrowse } from './pages/solo/SoloBrowse';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Solo Browse is public - anyone can view sessions */}
          <Route 
            path="/solo/browse" 
            element={
              <>
                <Navbar />
                <SoloBrowse />
              </>
            } 
          />

          {/* Main Dashboard - Authenticated users land here */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Deep links for Couple Mode */}
          <Route 
            path="/couple" 
            element={
              <ProtectedRoute>
                <Navbar />
                <CoupleDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/couple/create" 
            element={
              <ProtectedRoute>
                <Navbar />
                <CoupleCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/couple/find-partner" 
            element={
              <ProtectedRoute>
                <Navbar />
                <FindPartner />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/couple/session/:id" 
            element={
              <ProtectedRoute>
                <CoupleSessionRoom />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Deep links for Solo Mode */}
          <Route 
            path="/solo/create" 
            element={
              <ProtectedRoute>
                <Navbar />
                <SoloCreate />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
