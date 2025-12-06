import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soloSessionService } from '../../services/soloSession.service';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { X, MapPin, Laptop, Briefcase, ChevronLeft, Clock, Calendar, CheckCircle, Plus, Loader2 } from 'lucide-react';
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
       <div className="p-4 md:p-6 neu-navbar sticky top-4 mx-4 z-10 rounded-neu-lg">
           <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/solo" className="neu-icon-wrap p-2.5 rounded-xl text-text-secondary hover:text-primary transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-heading font-bold text-text-primary">Explore Sessions</h1>
                        <p className="text-xs text-text-secondary">Find your perfect workdate partner</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Simple Filters */}
                    <div className="hidden md:flex gap-2">
                        <span className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-full shadow-neu-sm cursor-pointer">All</span>
                        <span className="px-4 py-2 neu-btn text-text-secondary text-xs font-medium rounded-full cursor-pointer hover:shadow-neu transition-all">Online</span>
                        <span className="px-4 py-2 neu-btn text-text-secondary text-xs font-medium rounded-full cursor-pointer hover:shadow-neu transition-all">Offline</span>
                    </div>
                    {/* Create Session Button */}
                    <Link to="/solo/create" className="hidden md:flex">
                        <Button variant="outline" size="sm" icon={<Plus size={16} />}>
                            Create Session
                        </Button>
                    </Link>
                </div>
           </div>
       </div>

       {/* Grid Content */}
       <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="neu-card p-8 flex flex-col items-center gap-4">
                  <div className="neu-icon-wrap p-4 rounded-full">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="text-text-secondary">Loading sessions...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                    <motion.div 
                        key={session.id}
                        layoutId={`card-${session.id}`}
                        onClick={() => setSelectedSession(session)}
                        whileHover={{ y: -4 }}
                        className="neu-card overflow-hidden cursor-pointer hover:shadow-neu-hover transition-all group"
                    >
                        {/* Card Header */}
                        <div className="h-24 bg-gradient-to-r from-primary-light/30 to-secondary-light/30 relative p-4">
                             <div className="absolute -bottom-6 left-4">
                                <div className="w-16 h-16 rounded-full neu-icon-wrap flex items-center justify-center border-4 border-background text-2xl font-bold text-primary">
                                  {session.hostUser.displayName?.[0]?.toUpperCase() || '?'}
                                </div>
                             </div>
                             <div className="absolute top-4 right-4">
                                {session.mode === 'online' ? (
                                    <span className="bg-success/20 text-success px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-neu-sm">
                                        <Laptop size={12}/> Online
                                    </span>
                                ) : (
                                    <span className="bg-warning/20 text-warning px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-neu-sm">
                                        <MapPin size={12}/> Offline
                                    </span>
                                )}
                             </div>
                        </div>

                        {/* Card Body */}
                        <div className="pt-10 p-5">
                            <h3 className="font-heading font-bold text-text-primary text-lg truncate pr-2 group-hover:text-primary transition-colors">{session.title}</h3>
                            <p className="text-text-secondary text-sm mb-4">{session.hostUser.displayName}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {session.techStack.slice(0, 3).map(t => (
                                    <span key={t} className="text-[10px] bg-surface-dark text-text-secondary px-2.5 py-1 rounded-full font-medium">
                                        {t}
                                    </span>
                                ))}
                                {session.techStack.length > 3 && (
                                    <span className="text-[10px] bg-surface-dark text-text-secondary px-2.5 py-1 rounded-full font-medium">+{session.techStack.length - 3}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-text-muted border-t border-border-soft pt-4 mt-auto">
                                <span className="flex items-center gap-1.5"><Calendar size={12}/> {session.date}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12}/> {session.startTime}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
              </div>
            )}
            {!loading && sessions.length === 0 && (
              <div className="text-center py-16">
                <div className="neu-card-inset p-10 max-w-md mx-auto">
                  <div className="neu-icon-wrap w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary/50" />
                  </div>
                  <p className="text-text-secondary mb-4">No sessions available.</p>
                  <Link to="/solo/create">
                    <Button icon={<Plus size={16} />}>Create First Session</Button>
                  </Link>
                </div>
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
                className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
            />
            
            <motion.div 
                layoutId={`card-${selectedSession.id}`}
                className="bg-surface w-full max-w-lg rounded-neu-xl shadow-neu relative overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Close Button */}
                <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-10 neu-icon-wrap p-2.5 rounded-xl text-text-secondary hover:text-primary transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Modal Header */}
                <div className="relative h-48 bg-gradient-to-b from-primary-light/30 to-surface">
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-24 h-24 rounded-full neu-icon-wrap flex items-center justify-center border-4 border-surface text-3xl font-bold text-primary shadow-neu">
                          {selectedSession.hostUser.displayName?.[0]?.toUpperCase() || '?'}
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="pt-14 p-8 overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-text-primary">{selectedSession.hostUser.displayName}</h2>
                            <h3 className="text-primary text-lg font-medium">{selectedSession.title}</h3>
                        </div>
                        {selectedSession.mode === 'online' ? (
                            <span className="bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                                <Laptop size={14}/> Online
                            </span>
                        ) : (
                            <div className="text-right">
                                <span className="bg-warning/10 text-warning px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 justify-end">
                                    <MapPin size={14}/> Offline
                                </span>
                                <p className="text-xs text-text-muted mt-1">{selectedSession.location}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 text-sm text-text-secondary mb-6">
                        <span className="flex items-center gap-1.5"><Calendar size={14}/> {selectedSession.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14}/> {selectedSession.startTime} - {selectedSession.endTime}</span>
                    </div>

                    <div className="space-y-6">
                        <div className="neu-card-inset p-5">
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Briefcase size={14} /> About Session
                            </h4>
                            <p className="text-text-primary text-sm leading-relaxed">
                                "{selectedSession.description}"
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Tools & Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedSession.techStack.map(tech => (
                                    <span key={tech} className="text-sm neu-btn px-4 py-2 rounded-full text-text-primary font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Looking For</h4>
                             <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
                                <span className="px-3 py-1.5 neu-btn rounded-full">Level: {selectedSession.partnerPreferences.level}</span>
                                {selectedSession.partnerPreferences.role.map(r => (
                                     <span key={r} className="px-3 py-1.5 neu-btn rounded-full">{r}</span>
                                ))}
                                {selectedSession.partnerPreferences.vibe.map(v => (
                                     <span key={v} className="px-3 py-1.5 neu-btn rounded-full">{v}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-border-soft mt-auto">
                    {requestStatus === 'sent' ? (
                        <Button className="w-full bg-success hover:bg-success cursor-default" size="lg" icon={<CheckCircle size={20} />}>
                            Request Sent!
                        </Button>
                    ) : (
                        <Button 
                            className="w-full font-bold text-lg" 
                            size="lg" 
                            onClick={handleRequest}
                            disabled={requestStatus === 'sending'}
                        >
                            {requestStatus === 'sending' ? (
                              <><Loader2 size={18} className="animate-spin mr-2" /> Sending...</>
                            ) : 'Request Workdate'}
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
