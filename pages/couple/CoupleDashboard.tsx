import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Plus, ArrowRight, MapPin, Laptop } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { coupleSessionService } from '../../services/coupleSession.service';
import { CoupleSession } from '../../types';

export const CoupleDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<CoupleSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // TODO: Get partnership_id from user's partnerships
    // For now, we'll need to handle this - you may need to create a partnership first
    // This is a placeholder - you'll need to implement partnership lookup
    const loadSessions = async () => {
      try {
        // This assumes you have a way to get the partnership_id
        // You might need to create a partnership service or get it from user context
        // For MVP, you could hardcode a partnership_id or create one on first login
        setError('Partnership not set up. Please create a partnership first.');
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center text-slate-400">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Couple Dashboard</h1>
          <p className="text-slate-400">Your shared work sessions</p>
        </div>
        <Link to="/couple/create" className="flex items-center gap-2 bg-surface hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 transition-colors">
          <Plus size={18} />
          <span>New Session</span>
        </Link>
      </div>

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
                      {session.partners.map(p => (
                          <img 
                              key={p.id}
                              src={p.avatarUrl} 
                              alt={p.displayName} 
                              className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                          />
                      ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                   <div className="text-sm text-slate-400">
                      <span className="text-white font-medium">{session.tasks.filter(t => t.done).length}</span> tasks completed total
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
                <p className="text-slate-400 mb-4">No scheduled sessions.</p>
                <Link to="/couple/create" className="text-primary hover:underline">Create your first date</Link>
            </div>
        )}
      </div>
    </div>
  );
};