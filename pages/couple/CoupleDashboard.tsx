import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Plus, ArrowRight, MapPin, Laptop, UserPlus, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { coupleSessionService } from '../../services/coupleSession.service';
import { partnershipService } from '../../services/partnership.service';
import { CoupleSession } from '../../types';
import { Button } from '../../components/ui/Button';

export const CoupleDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CoupleSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnershipId, setPartnershipId] = useState<string | null>(null);
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      console.log('❌ No user found');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      console.log('🔄 Loading data for user:', user.id);
      
      try {
        const partnerships = await partnershipService.getPartnerships(user.id);
        console.log('📋 Partnerships loaded:', partnerships);
        
        if (partnerships && partnerships.length > 0) {
          const partnership = partnerships[0];
          console.log('✅ Using partnership:', partnership);
          setPartnershipId(partnership.id);
          
          const partnerData = partnership.user1?.id === user.id 
            ? partnership.user2 
            : partnership.user1;
          console.log('👥 Partner:', partnerData);
          setPartner(partnerData);

          try {
            const sessionsData = await coupleSessionService.getCoupleSessions(partnership.id);
            console.log('📅 Sessions loaded:', sessionsData);
            setSessions(sessionsData || []);
          } catch (sessionErr) {
            console.error('Failed to load sessions:', sessionErr);
          }
        } else {
          console.log('⚠️ No partnerships found for this user');
        }
      } catch (err: any) {
        console.error('❌ Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
      <div className="p-6 max-w-4xl mx-auto animate-fade-in pt-8">
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
    <div className="p-6 max-w-4xl mx-auto animate-fade-in pt-8">
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
