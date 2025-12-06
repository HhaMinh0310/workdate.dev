import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { LogOut, User, Coffee } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="neu-navbar sticky top-4 mx-4 z-50 rounded-neu-lg">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5 text-text-primary hover:text-primary transition-colors group">
            <div className="neu-icon-wrap p-2 rounded-xl group-hover:shadow-neu transition-shadow">
              <Coffee className="text-primary" size={22} />
            </div>
            <span className="font-heading font-bold text-lg">Workdate.dev</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  {profile?.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.displayName}
                      className="w-9 h-9 rounded-full shadow-neu-sm border-2 border-white"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full neu-icon-wrap flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                  )}
                  <span className="text-text-primary text-sm font-medium hidden sm:block">
                    {profile?.displayName || user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
