import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Plus, ArrowRight, MapPin, Laptop, UserPlus, Heart } from 'lucide-react';
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
        // First, get partnership
        const partnerships = await partnershipService.getPartnerships(user.id);
        console.log('📋 Partnerships loaded:', partnerships);
        
        if (partnerships && partnerships.length > 0) {
          const partnership = partnerships[0];
          console.log('✅ Using partnership:', partnership);
          setPartnershipId(partnership.id);
          
          // Determine partner
          const partnerData = partnership.user1?.id === user.id 
            ? partnership.user2 
            : partnership.user1;
          console.log('👥 Partner:', partnerData);
          setPartner(partnerData);

          // Load sessions for this partnership
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  // No partnership - show invite UI
  if (!partnershipId) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Couple Mode</h1>
          <p className="text-slate-400">Work sessions with your partner</p>
        </div>

        <div className="bg-surface border border-slate-700 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Find Your Partner</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Couple Mode lets you and your partner track work sessions together, 
            set tasks, and reward each other for productivity!
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/couple/create')}
            >
              <UserPlus size={18} className="mr-2" />
              Invite Partner
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/solo/browse')}
            >
              Find Partner in Solo Mode
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Don't have a partner yet? Browse Solo Mode to find someone to work with!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Couple Dashboard</h1>
          <p className="text-slate-400">
            Working with {partner?.display_name || 'your partner'}
          </p>
        </div>
        <Link to="/couple/create" className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors">
          <Plus size={18} />
          <span>New Date</span>
        </Link>
      </div>

      {/* Partner card */}
      {partner && (
        <div className="bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary/30 flex items-center justify-center text-secondary text-xl font-bold">
              {partner.display_name?.[0]?.toUpperCase() || 'P'}
            </div>
            <div>
              <p className="text-sm text-slate-400">Your Partner</p>
              <p className="text-xl font-semibold text-white">{partner.display_name}</p>
              <p className="text-xs text-slate-500 capitalize">{partner.status || 'offline'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
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
              <div className="bg-surface border border-slate-700 rounded-xl p-6 hover:border-secondary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-secondary transition-colors">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formattedDateTime}</span>
                      </div>
                      {session.mode === 'offline' ? (
                         <div className="flex items-center gap-1 text-slate-300">
                            <MapPin size={14} />
                            <span>{session.location || 'Offline'}</span>
                         </div>
                      ) : (
                         <div className="flex items-center gap-1 text-slate-300">
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
                              className="w-10 h-10 rounded-full border-2 border-surface bg-primary/30 flex items-center justify-center text-primary font-medium"
                          >
                            {p.displayName?.[0]?.toUpperCase() || '?'}
                          </div>
                      ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                   <div className="text-sm text-slate-400">
                      <span className="text-white font-medium">{session.tasks?.filter(t => t.done).length || 0}</span> tasks completed
                   </div>
                   <span className="text-secondary font-medium text-sm flex items-center">
                      Join Room <ArrowRight size={14} className="ml-1" />
                   </span>
                </div>
              </div>
            </Link>
          )
        })}

        {sessions.length === 0 && (
            <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-slate-700">
                <Heart className="w-12 h-12 text-secondary/50 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No scheduled sessions yet.</p>
                <Link to="/couple/create" className="text-secondary hover:underline font-medium">
                  Plan your first date →
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};
