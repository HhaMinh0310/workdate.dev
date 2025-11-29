import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Plus, ArrowRight, MapPin, Laptop } from 'lucide-react';
import { MOCK_COUPLE_SESSIONS } from '../../services/mockData';

export const CoupleDashboard: React.FC = () => {
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
        {MOCK_COUPLE_SESSIONS.map((session) => (
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
                      <span>Today</span>
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
        ))}

        {MOCK_COUPLE_SESSIONS.length === 0 && (
            <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-slate-700">
                <p className="text-slate-400 mb-4">No scheduled sessions.</p>
                <Link to="/couple/create" className="text-primary hover:underline">Create your first date</Link>
            </div>
        )}
      </div>
    </div>
  );
};