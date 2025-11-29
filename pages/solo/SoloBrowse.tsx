import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soloSessionService } from '../../services/soloSession.service';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { X, MapPin, Laptop, Briefcase, ChevronLeft, Clock, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SoloSession } from '../../types';

export const SoloBrowse: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SoloSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SoloSession | null>(null);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await soloSessionService.getSoloSessions({ status: 'open' });
        setSessions(data);
      } catch (err: any) {
        console.error('Failed to load sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const handleRequest = async () => {
    if (!selectedSession || !user) {
      alert('Please log in to request a workdate');
      return;
    }

    setRequestStatus('sending');
    try {
      await soloSessionService.requestWorkdate(selectedSession.id, user.id);
      setRequestStatus('sent');
    } catch (err: any) {
      alert('Failed to send request: ' + err.message);
      setRequestStatus('idle');
    }
  };

  const closeModal = () => {
    setSelectedSession(null);
    setRequestStatus('idle');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
       {/* Header */}
       <div className="p-4 md:p-6 bg-surface/50 sticky top-0 z-10 backdrop-blur-md border-b border-slate-700">
           <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/solo" className="p-2 bg-surface rounded-full text-slate-400 hover:text-white border border-slate-700">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">Explore Sessions</h1>
                        <p className="text-xs text-slate-400">Find your perfect workdate partner</p>
                    </div>
                </div>
                {/* Simple Filters Placeholder */}
                <div className="hidden md:flex gap-2">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full border border-primary/30">All</span>
                    <span className="px-3 py-1 bg-surface text-slate-400 text-xs font-medium rounded-full border border-slate-700">Online</span>
                    <span className="px-3 py-1 bg-surface text-slate-400 text-xs font-medium rounded-full border border-slate-700">Offline</span>
                </div>
           </div>
       </div>

       {/* Grid Content */}
       <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
            {loading ? (
              <div className="text-center text-slate-400 py-12">Loading sessions...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                    <motion.div 
                        key={session.id}
                        layoutId={`card-${session.id}`}
                        onClick={() => setSelectedSession(session)}
                        whileHover={{ y: -5 }}
                        className="bg-surface border border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
                    >
                        {/* Card Header */}
                        <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 relative p-4">
                             <div className="absolute -bottom-6 left-4">
                                <img 
                                    src={session.hostUser.avatarUrl} 
                                    alt={session.hostUser.displayName}
                                    className="w-16 h-16 rounded-full border-4 border-surface object-cover"
                                />
                             </div>
                             <div className="absolute top-4 right-4">
                                {session.mode === 'online' ? (
                                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                                        <Laptop size={12}/> Online
                                    </span>
                                ) : (
                                    <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                                        <MapPin size={12}/> Offline
                                    </span>
                                )}
                             </div>
                        </div>

                        {/* Card Body */}
                        <div className="pt-8 p-5">
                            <h3 className="font-bold text-white text-lg truncate pr-2">{session.title}</h3>
                            <p className="text-slate-400 text-sm mb-4">{session.hostUser.displayName}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {session.techStack.slice(0, 3).map(t => (
                                    <span key={t} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                                        {t}
                                    </span>
                                ))}
                                {session.techStack.length > 3 && (
                                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">+{session.techStack.length - 3}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-700/50 pt-4 mt-auto">
                                <span className="flex items-center gap-1"><Calendar size={12}/> {session.date}</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {session.startTime}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
              </div>
            )}
            {!loading && sessions.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                No sessions available. Be the first to create one!
              </div>
            )}
       </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
                layoutId={`card-${selectedSession.id}`}
                className="bg-surface w-full max-w-lg rounded-3xl border border-slate-600 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Close Button */}
                <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Modal Header */}
                <div className="relative h-48 bg-gradient-to-b from-primary/20 to-surface">
                    <img 
                        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                        className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                        alt="cover"
                    />
                    <div className="absolute -bottom-10 left-8">
                        <img 
                            src={selectedSession.hostUser.avatarUrl} 
                            alt={selectedSession.hostUser.displayName}
                            className="w-24 h-24 rounded-full border-4 border-surface shadow-xl object-cover"
                        />
                    </div>
                </div>

                {/* Modal Content */}
                <div className="pt-12 p-8 overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedSession.hostUser.displayName}</h2>
                            <h3 className="text-primary text-lg font-medium">{selectedSession.title}</h3>
                        </div>
                        {selectedSession.mode === 'online' ? (
                            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Laptop size={14}/> Online
                            </span>
                        ) : (
                            <div className="text-right">
                                <span className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 justify-end">
                                    <MapPin size={14}/> Offline
                                </span>
                                <p className="text-xs text-slate-400 mt-1">{selectedSession.location}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 text-sm text-slate-400 mb-6">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {selectedSession.date}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {selectedSession.startTime} - {selectedSession.endTime}</span>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Briefcase size={14} /> About Session
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                "{selectedSession.description}"
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tools & Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedSession.techStack.map(tech => (
                                    <span key={tech} className="text-sm bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Looking For</h4>
                             <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                                <span className="px-2 py-1 bg-surface border border-slate-700 rounded">Level: {selectedSession.partnerPreferences.level}</span>
                                {selectedSession.partnerPreferences.role.map(r => (
                                     <span key={r} className="px-2 py-1 bg-surface border border-slate-700 rounded">{r}</span>
                                ))}
                                {selectedSession.partnerPreferences.vibe.map(v => (
                                     <span key={v} className="px-2 py-1 bg-surface border border-slate-700 rounded">{v}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-slate-700 bg-surface mt-auto">
                    {requestStatus === 'sent' ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700 cursor-default" size="lg">
                            <CheckCircle className="mr-2" size={20} /> Request Sent!
                        </Button>
                    ) : (
                        <Button 
                            className="w-full font-bold text-lg" 
                            size="lg" 
                            onClick={handleRequest}
                            disabled={requestStatus === 'sending'}
                        >
                            {requestStatus === 'sending' ? 'Sending...' : 'Request Workdate'}
                        </Button>
                    )}
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};