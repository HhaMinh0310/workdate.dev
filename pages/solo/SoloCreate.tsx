import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Laptop, MapPin, Code, User, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
<<<<<<< HEAD
import { useAuth } from '../../contexts/AuthContext';
import { soloSessionService } from '../../services/soloSession.service';

export const SoloCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1 Hour');
  const [location, setLocation] = useState('');
  const [techStack, setTechStack] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Anyone');
  const [vibe, setVibe] = useState('Silent Work');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
=======
import { addSoloSession, CURRENT_USER } from '../../services/mockData';
import { SoloSession } from '../../types';

export const SoloCreate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1 Hour');
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [location, setLocation] = useState('');
  const [techStack, setTechStack] = useState('');
  const [bio, setBio] = useState('');
  const [level, setLevel] = useState('Anyone');
  const [vibe, setVibe] = useState('Silent Work');
  
>>>>>>> 706330ff6bc09eb9130c489da1ce015ec9816e14

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    
    if (!user) {
      setError('Please log in to create a session');
      return;
    }

    if (!title.trim() || !date || !startTime) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate end time from duration
      const [hours, minutes] = startTime.split(':').map(Number);
      let endHours = hours;
      switch (duration) {
        case '1 Hour':
          endHours = hours + 1;
          break;
        case '2 Hours':
          endHours = hours + 2;
          break;
        case '3 Hours':
          endHours = hours + 3;
          break;
        case 'Half Day':
          endHours = hours + 4;
          break;
      }
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      // Parse tech stack
      const techStackArray = techStack.split(',').map(t => t.trim()).filter(t => t);

      // Parse vibe to array
      const vibeArray = [vibe];

      await soloSessionService.createSoloSession({
        host_user_id: user.id,
        title: title.trim(),
        date,
        start_time: startTime,
        end_time: endTime,
        mode,
        location: mode === 'offline' ? location : undefined,
        description: description.trim(),
        tech_stack: techStackArray,
        partner_prefs: {
          level,
          role: [], // You can add role selection later
          vibe: vibeArray
        }
      });

      navigate('/solo/browse');
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
=======
    if (!title.trim() || !startTime) {
        alert('Please provide a title and a start time.');
        return;
    }

    const today = new Date();
    const [hours, minutes] = startTime.split(':');
    today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    let durationHours = 1;
    if (duration.includes('Hours')) {
        durationHours = parseInt(duration.split(' ')[0], 10);
    } else if (duration === 'Half Day') {
        durationHours = 4;
    }
    const endTimeDate = new Date(today.getTime() + durationHours * 60 * 60 * 1000);

    const newSession: SoloSession = {
        id: `ss_${Date.now()}`,
        hostUserId: CURRENT_USER.id,
        hostUser: CURRENT_USER,
        title,
        date: today.toISOString().split('T')[0],
        startTime: startTime,
        endTime: `${endTimeDate.getHours().toString().padStart(2,'0')}:${endTimeDate.getMinutes().toString().padStart(2,'0')}`,
        mode,
        location: mode === 'offline' ? location : undefined,
        description: bio,
        techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
        partnerPreferences: {
            level,
            role: ['Any'], // Simplified for MVP
            vibe: [vibe],
        },
    };
    
    addSoloSession(newSession);
    navigate('/solo/browse');
>>>>>>> 706330ff6bc09eb9130c489da1ce015ec9816e14
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/solo')} className="flex items-center text-slate-400 hover:text-white mb-6">
          <ChevronLeft size={20} /> Back to dashboard
        </button>

        <div className="bg-surface border border-slate-700 rounded-2xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Host a Workdate</h1>
            <p className="text-slate-400">Create a session listing for other developers to find.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Basics */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Clock size={18} /> Session Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Session Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Late Night Rust Debugging" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
<<<<<<< HEAD
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
=======
                    <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
                    <input 
                      required
                      type="time" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
>>>>>>> 706330ff6bc09eb9130c489da1ce015ec9816e14
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
                    <input 
                      type="time" 
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
              </div>

              <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Duration</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                        <option>1 Hour</option>
                        <option>2 Hours</option>
                        <option>3 Hours</option>
                        <option>Half Day</option>
                    </select>
                </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mode</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setMode('online')}
                    className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${mode === 'online' ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    <Laptop size={18} /> Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('offline')}
                    className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${mode === 'offline' ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    <MapPin size={18} /> Offline
                  </button>
                </div>
              </div>

              {mode === 'offline' && (
                  <div className="animate-fade-in-up">
                    <label className="block text-sm font-medium text-slate-300 mb-1">Location / Cafe</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Starbucks, 3rd Ave" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
              )}
            </section>

            {/* 2. Tech Stack */}
            <section className="space-y-4 pt-4 border-t border-slate-700">
               <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Code size={18} /> What are you working on?
              </h2>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="React, Node.js, TypeScript..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Quick Bio / Goal</label>
                <textarea 
                  rows={3}
                  placeholder="I'm trying to finish a hackathon project. Need focus." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary resize-none"
<<<<<<< HEAD
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
=======
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
>>>>>>> 706330ff6bc09eb9130c489da1ce015ec9816e14
                />
              </div>
            </section>

             {/* 3. Partner Prefs */}
             <section className="space-y-4 pt-4 border-t border-slate-700">
               <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                <User size={18} /> Partner Preferences
              </h2>
               <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Level</label>
                        <select 
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary"
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                        >
                            <option>Anyone</option>
                            <option>Student</option>
                            <option>Junior</option>
                            <option>Mid-Level</option>
                            <option>Senior</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-300 mb-1">Vibe</label>
                        <select 
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary"
                          value={vibe}
                          onChange={(e) => setVibe(e.target.value)}
                        >
                            <option>Silent Work</option>
                            <option>Chatty / Social</option>
                            <option>Pomodoro Style</option>
                        </select>
                    </div>
               </div>
            </section>

            <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full font-bold text-lg" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Workdate'}
                </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};