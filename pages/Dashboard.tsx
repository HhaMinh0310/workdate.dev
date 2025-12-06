import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { DashboardLayout } from '../components/DashboardLayout';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary">Manage your profile and account</p>
        </div>

        {/* Profile Card */}
        <div className="neu-card p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile?.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.displayName}
                  className="w-20 h-20 rounded-2xl shadow-neu border-2 border-white object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl neu-icon-wrap flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">
                    {profile?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Display Name</label>
                <div className="flex items-center gap-2 mt-1">
                  <User size={16} className="text-text-muted" />
                  <p className="text-text-primary font-medium">{profile?.displayName || 'Not set'}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={16} className="text-text-muted" />
                  <p className="text-text-primary font-medium">{user?.email || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="neu-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-text-primary">Sign Out</h3>
              <p className="text-sm text-text-secondary">Sign out of your account</p>
            </div>
            <Button 
              variant="danger" 
              onClick={handleSignOut}
              icon={<LogOut size={16} />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
