import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { CoupleDashboard } from './pages/couple/CoupleDashboard';
import { CoupleSessionRoom } from './pages/couple/CoupleSession';
import { CoupleCreate } from './pages/couple/CoupleCreate';
import { SoloCreate } from './pages/solo/SoloCreate';
import { SoloBrowse } from './pages/solo/SoloBrowse';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Heart, Users } from 'lucide-react';

const SoloDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-md mx-auto space-y-8 mt-10">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Solo Mode</h1>
                    <p className="text-slate-400">Choose your path</p>
                </div>
                
                <div className="grid gap-4">
                    <Link to="/solo/browse" className="bg-surface border border-slate-700 hover:border-primary p-6 rounded-xl flex items-center gap-4 transition-all group">
                        <div className="p-3 bg-primary/20 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Browse Sessions</h3>
                            <p className="text-slate-400 text-sm">Find a partner nearby</p>
                        </div>
                    </Link>

                    <Link to="/solo/create" className="bg-surface border border-slate-700 hover:border-secondary p-6 rounded-xl flex items-center gap-4 transition-all group">
                         <div className="p-3 bg-secondary/20 text-secondary rounded-lg group-hover:bg-secondary group-hover:text-white transition-colors">
                            <Heart size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Host a Session</h3>
                            <p className="text-slate-400 text-sm">Create a listing</p>
                        </div>
                    </Link>
                </div>

                <div className="text-center mt-8">
                    <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm">Back to Home</Link>
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
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Couple Routes */}
          <Route path="/couple" element={<CoupleDashboard />} />
          <Route path="/couple/create" element={<CoupleCreate />} />
          <Route path="/couple/session/:id" element={<CoupleSessionRoom />} />

          {/* Solo Routes */}
          <Route path="/solo" element={<SoloDashboard />} />
          <Route path="/solo/create" element={<SoloCreate />} />
          <Route path="/solo/browse" element={<SoloBrowse />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;