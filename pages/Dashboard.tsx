import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Heart, UserMinus, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { DashboardLayout } from '../components/DashboardLayout';
import { partnershipService } from '../services/partnership.service';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [partner, setPartner] = useState<any>(null);
  const [partnershipId, setPartnershipId] = useState<string | null>(null);
  const [loadingPartner, setLoadingPartner] = useState(true);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Load partnership info
  useEffect(() => {
    const loadPartnership = async () => {
      if (!user) {
        setLoadingPartner(false);
        return;
      }

      try {
        const partnerships = await partnershipService.getPartnerships(user.id);
        if (partnerships && partnerships.length > 0) {
          const partnership = partnerships[0];
          setPartnershipId(partnership.id);
          const partnerData = partnership.user1?.id === user.id 
            ? partnership.user2 
            : partnership.user1;
          setPartner(partnerData);
        }
      } catch (err) {
        console.error('Failed to load partnership:', err);
      } finally {
        setLoadingPartner(false);
      }
    };

    loadPartnership();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleRemovePartner = async () => {
    if (!partnershipId) return;

    setRemoving(true);
    try {
      await partnershipService.deactivatePartnership(partnershipId);
      setPartner(null);
      setPartnershipId(null);
      setShowRemoveConfirm(false);
    } catch (error) {
      console.error('Error removing partner:', error);
      alert('Failed to remove partner. Please try again.');
    } finally {
      setRemoving(false);
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

        {/* Partner Card */}
        <div className="neu-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={18} className="text-primary" />
            <h3 className="font-heading font-semibold text-text-primary">Partner</h3>
          </div>

          {loadingPartner ? (
            <div className="flex items-center gap-3 text-text-muted">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : partner ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 neu-card-inset rounded-neu">
                <div className="w-12 h-12 rounded-full neu-icon-wrap flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {partner.display_name?.[0]?.toUpperCase() || 'P'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-medium">{partner.display_name}</p>
                  <p className="text-xs text-text-muted capitalize flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${partner.status === 'online' ? 'bg-success' : 'bg-text-muted'}`}></span>
                    {partner.status || 'offline'}
                  </p>
                </div>
              </div>

              {!showRemoveConfirm ? (
                <button
                  onClick={() => setShowRemoveConfirm(true)}
                  className="text-sm text-error/70 hover:text-error transition-colors flex items-center gap-1.5"
                >
                  <UserMinus size={14} />
                  Remove Partner
                </button>
              ) : (
                <div className="p-4 bg-error/10 border border-error/20 rounded-neu">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle size={18} className="text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-error font-medium">Remove Partner?</p>
                      <p className="text-xs text-error/70">This will end your partnership. All shared sessions will remain but you won't be able to create new ones together.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={handleRemovePartner}
                      disabled={removing}
                    >
                      {removing ? 'Removing...' : 'Yes, Remove'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setShowRemoveConfirm(false)}
                      disabled={removing}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-text-secondary text-sm mb-3">No partner connected</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/couple/find-partner')}
              >
                Find Partner
              </Button>
            </div>
          )}
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
