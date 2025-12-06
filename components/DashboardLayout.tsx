import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Users, Settings, Coffee, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  // Determine active tab based on current route
  const getActiveTab = (): 'couple' | 'solo' | 'settings' => {
    if (location.pathname.startsWith('/couple')) return 'couple';
    if (location.pathname.startsWith('/solo')) return 'solo';
    if (location.pathname === '/dashboard') return 'settings';
    return 'couple';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab: 'couple' | 'solo' | 'settings') => {
    if (tab === 'couple') {
      navigate('/couple');
    } else if (tab === 'solo') {
      navigate('/solo');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Tabs */}
      <header className="neu-navbar sticky top-4 mx-4 z-50 rounded-neu-lg">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/couple" className="flex items-center gap-2.5">
              <div className="neu-icon-wrap p-2 rounded-xl">
                <Coffee className="text-primary" size={22} />
              </div>
              <span className="font-heading font-bold text-lg text-text-primary hidden sm:block">Workdate.dev</span>
            </Link>

            {/* Tab Navigation */}
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handleTabClick('couple')}
                className={`flex items-center gap-2 px-4 py-2 rounded-neu text-sm font-semibold transition-all ${
                  activeTab === 'couple'
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-neu-sm'
                    : 'neu-btn text-text-secondary hover:text-primary'
                }`}
              >
                <Heart size={16} />
                <span className="hidden sm:inline">Couple</span>
              </button>
              <button
                onClick={() => handleTabClick('solo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-neu text-sm font-semibold transition-all ${
                  activeTab === 'solo'
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-neu-sm'
                    : 'neu-btn text-text-secondary hover:text-primary'
                }`}
              >
                <Users size={16} />
                <span className="hidden sm:inline">Solo</span>
              </button>
              <button
                onClick={() => handleTabClick('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-neu text-sm font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-neu-sm'
                    : 'neu-btn text-text-secondary hover:text-primary'
                }`}
              >
                <Settings size={16} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </nav>

            {/* User Info */}
            <div className="flex items-center gap-3">
              {profile?.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.displayName}
                  className="w-9 h-9 rounded-full shadow-neu-sm border-2 border-white"
                />
              ) : (
                <div className="w-9 h-9 rounded-full neu-icon-wrap flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {profile?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-8">
        {children}
      </main>
    </div>
  );
};

