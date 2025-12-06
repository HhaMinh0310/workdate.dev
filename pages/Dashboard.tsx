import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Users, Settings, Coffee, LogOut, User, Mail, 
  Calendar, Plus, ArrowRight, MapPin, Laptop, UserPlus, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { coupleSessionService } from '../services/coupleSession.service';
import { partnershipService } from '../services/partnership.service';
import { CoupleSession } from '../types';

type TabType = 'couple' | 'solo' | 'settings';

const STORAGE_KEY = 'workdate_last_tab';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('couple');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved tab preference on mount
  useEffect(() => {
    const savedTab = localStorage.getItem(STORAGE_KEY) as TabType;
    if (savedTab && ['couple', 'solo', 'settings'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
    setIsLoading(false);
  }, []);

  // Save tab preference when changed
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    localStorage.setItem(STORAGE_KEY, tab);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="neu-card p-8 flex flex-col items-center gap-4">
          <div className="neu-icon-wrap p-4 rounded-full">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Tabs */}
      <header className="neu-navbar sticky top-4 mx-4 z-50 rounded-neu-lg">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="neu-icon-wrap p-2 rounded-xl">
                <Coffee className="text-primary" size={22} />
              </div>
              <span className="font-heading font-bold text-lg text-text-primary hidden sm:block">Workdate.dev</span>
            </Link>

            {/* Tab Navigation */}
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handleTabChange('couple')}
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
                onClick={() => handleTabChange('solo')}
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
                onClick={() => handleTabChange('settings')}
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

      {/* Tab Content */}
      <main className="pt-8">
        {activeTab === 'couple' && <CoupleTabContent />}
        {activeTab === 'solo' && <SoloTabContent />}
        {activeTab === 'settings' && <SettingsTabContent onSignOut={handleSignOut} />}
      </main>
    </div>
  );
};

// ============ COUPLE TAB CONTENT ============
const CoupleTabContent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CoupleSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnershipId, setPartnershipId] = useState<string | null>(null);
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const partnerships = await partnershipService.getPartnerships(user.id);
        
        if (partnerships && partnerships.length > 0) {
          const partnership = partnerships[0];
          setPartnershipId(partnership.id);
          
          const partnerData = partnership.user1?.id === user.id 
            ? partnership.user2 
            : partnership.user1;
          setPartner(partnerData);

          try {
            const sessionsData = await coupleSessionService.getCoupleSessions(partnership.id);
            setSessions(sessionsData || []);
          } catch (sessionErr) {
            console.error('Failed to load sessions:', sessionErr);
          }
        }
      } catch (err: any) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="neu-card p-8 flex flex-col items-center gap-4">
          <div className="neu-icon-wrap p-4 rounded-full animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-text-secondary">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // No partnership - show invite UI
  if (!partnershipId) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-text-primary">Couple Mode</h1>
          <p className="text-text-secondary">Work sessions with your partner</p>
        </div>

        <div className="neu-card p-10 text-center">
          <div className="w-20 h-20 neu-icon-wrap rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">Find Your Partner</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
            Couple Mode lets you and your partner track work sessions together, 
            set tasks, and reward each other for productivity!
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/couple/find-partner')}
              icon={<UserPlus size={18} />}
            >
              Connect Partner
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/solo/browse')}
            >
              Try Solo Mode
            </Button>
          </div>

          <p className="mt-8 text-sm text-text-muted">
            Don't have a partner yet? Browse Solo Mode to find someone to work with!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Couple Dashboard</h1>
          <p className="text-text-secondary">
            Working with {partner?.display_name || 'your partner'}
          </p>
        </div>
        <Link to="/couple/create">
          <Button icon={<Plus size={18} />}>
            New Date
          </Button>
        </Link>
      </div>

      {/* Partner card */}
      {partner && (
        <div className="neu-card p-5 mb-8 bg-gradient-to-r from-primary-light/20 to-secondary-light/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full neu-icon-wrap flex items-center justify-center">
              <span className="text-primary text-xl font-bold">
                {partner.display_name?.[0]?.toUpperCase() || 'P'}
              </span>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Your Partner</p>
              <p className="text-xl font-heading font-semibold text-text-primary">{partner.display_name}</p>
              <p className="text-xs text-text-muted capitalize flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${partner.status === 'online' ? 'bg-success' : 'bg-text-muted'}`}></span>
                {partner.status || 'offline'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-5">
        {sessions.map((session) => {
          const sessionDate = new Date(session.startTime);
          const formattedDateTime = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
          }).format(sessionDate);

          return (
            <Link to={`/couple/session/${session.id}`} key={session.id} className="block group">
              <div className="neu-card p-6 hover:shadow-neu-hover transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-text-secondary text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{formattedDateTime}</span>
                      </div>
                      {session.mode === 'offline' ? (
                         <div className="flex items-center gap-1.5 text-warning">
                            <MapPin size={14} />
                            <span>{session.location || 'Offline'}</span>
                         </div>
                      ) : (
                         <div className="flex items-center gap-1.5 text-success">
                            <Laptop size={14} />
                            <span>Online</span>
                         </div>
                      )}
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                      {session.partners?.map(p => (
                          <div 
                              key={p.id}
                              className="w-10 h-10 rounded-full neu-icon-wrap flex items-center justify-center text-primary font-medium border-2 border-background"
                          >
                            {p.displayName?.[0]?.toUpperCase() || '?'}
                          </div>
                      ))}
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-border-soft flex justify-between items-center">
                   <div className="text-sm text-text-secondary">
                      <span className="text-primary font-semibold">{session.tasks?.filter(t => t.done).length || 0}</span> tasks completed
                   </div>
                   <span className="text-primary font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      Join Room <ArrowRight size={14} className="ml-1" />
                   </span>
                </div>
              </div>
            </Link>
          )
        })}

        {sessions.length === 0 && (
            <div className="text-center py-16 neu-card-inset">
                <div className="neu-icon-wrap w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary/50" />
                </div>
                <p className="text-text-secondary mb-4">No scheduled sessions yet.</p>
                <Link to="/couple/create" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                  Plan your first date →
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

// ============ SOLO TAB CONTENT ============
const SoloTabContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Solo Mode</h1>
        <p className="text-text-secondary">Find or host work sessions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/solo/browse" className="group">
          <div className="neu-card p-8 h-full flex flex-col items-center text-center transition-all hover:shadow-neu-hover">
            <div className="neu-icon-wrap p-5 rounded-2xl mb-6 group-hover:shadow-neu transition-shadow">
              <Users size={32} className="text-primary" />
            </div>
            <h3 className="font-heading font-bold text-text-primary text-xl mb-2">Browse Sessions</h3>
            <p className="text-text-secondary mb-6">Search and filter work sessions by tech stack, level, and vibe. Find your perfect coding buddy.</p>
            <Button variant="primary" className="mt-auto" icon={<ArrowRight size={16} />}>
              Explore Sessions
            </Button>
          </div>
        </Link>

        <Link to="/solo/create" className="group">
          <div className="neu-card p-8 h-full flex flex-col items-center text-center transition-all hover:shadow-neu-hover">
            <div className="neu-icon-wrap p-5 rounded-2xl mb-6 group-hover:shadow-neu transition-shadow">
              <Calendar size={32} className="text-secondary" />
            </div>
            <h3 className="font-heading font-bold text-text-primary text-xl mb-2">Host a Session</h3>
            <p className="text-text-secondary mb-6">Create a public listing with your schedule, tech stack, and work preferences. Attract compatible partners.</p>
            <Button variant="secondary" className="mt-auto" icon={<Plus size={16} />}>
              Create Session
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

// ============ SETTINGS TAB CONTENT ============
interface SettingsTabContentProps {
  onSignOut: () => void;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({ onSignOut }) => {
  const { user, profile } = useAuth();

  return (
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
            onClick={onSignOut}
            icon={<LogOut size={16} />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

