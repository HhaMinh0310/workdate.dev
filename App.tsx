import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { CoupleDashboard } from './pages/couple/CoupleDashboard';
import { CoupleSessionRoom } from './pages/couple/CoupleSession';
import { CoupleCreate } from './pages/couple/CoupleCreate';
import { FindPartner } from './pages/couple/FindPartner';
import { SoloCreate } from './pages/solo/SoloCreate';
import { SoloBrowse } from './pages/solo/SoloBrowse';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Heart, Users, ArrowRight } from 'lucide-react';

const SoloDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-background p-6 pt-8">
            <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Solo Mode</h1>
                    <p className="text-text-secondary">Choose your path</p>
                </div>
                
                <div className="grid gap-5">
                    <Link to="/solo/browse" className="group">
                        <div className="neu-card p-6 flex items-center gap-4 transition-all hover:shadow-neu-hover">
                            <div className="neu-icon-wrap p-4 rounded-xl group-hover:shadow-neu transition-shadow">
                                <Users size={24} className="text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-heading font-bold text-text-primary text-lg">Browse Sessions</h3>
                                <p className="text-text-secondary text-sm">Find a partner nearby</p>
                            </div>
                            <ArrowRight size={20} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link to="/solo/create" className="group">
                        <div className="neu-card p-6 flex items-center gap-4 transition-all hover:shadow-neu-hover">
                            <div className="neu-icon-wrap p-4 rounded-xl group-hover:shadow-neu transition-shadow">
                                <Heart size={24} className="text-secondary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-heading font-bold text-text-primary text-lg">Host a Session</h3>
                                <p className="text-text-secondary text-sm">Create a listing</p>
                            </div>
                            <ArrowRight size={20} className="text-text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>

                <div className="text-center mt-8">
                    <Link to="/" className="text-text-muted hover:text-primary text-sm transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

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

          {/* Protected Routes - Require Authentication */}
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

          <Route 
            path="/solo" 
            element={
              <ProtectedRoute>
                <Navbar />
                <SoloDashboard />
              </ProtectedRoute>
            } 
          />
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
