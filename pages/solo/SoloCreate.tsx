import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Laptop, MapPin, Code, User, Clock, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { soloSessionService } from '../../services/soloSession.service';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper to get current time rounded to next hour
const getDefaultTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  now.setMinutes(0);
  return `${now.getHours().toString().padStart(2, '0')}:00`;
};

export const SoloCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [startTime, setStartTime] = useState(getDefaultTime());
  const [duration, setDuration] = useState('1 Hour');
  const [location, setLocation] = useState('');
  const [techStack, setTechStack] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Anyone');
  const [vibe, setVibe] = useState('Silent Work');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          role: [],
          vibe: vibeArray
        }
      });

      navigate('/solo/browse');
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto pt-4">
        <button onClick={() => navigate('/solo')} className="flex items-center text-text-secondary hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={20} /> Back to dashboard
        </button>

        <div className="neu-card p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2 flex items-center gap-3">
              <Sparkles className="text-primary" /> Host a Workdate
            </h1>
            <p className="text-text-secondary">Create a session listing for other developers to find.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-neu text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Basics */}
            <section className="space-y-5">
              <h2 className="text-lg font-heading font-semibold text-text-primary flex items-center gap-2">
                <Clock size={18} className="text-primary" /> Session Details
              </h2>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Session Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Late Night Rust Debugging" 
                  className="w-full neu-input p-4 text-text-primary placeholder:text-text-muted"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        required
                        min={getTodayDate()}
                        className="w-full neu-input p-4 pr-10 text-text-primary cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Start Time</label>
                    <div className="relative">
                      <input 
                        type="time" 
                        required
                        className="w-full neu-input p-4 pr-10 text-text-primary cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                      <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Duration</label>
                <select 
                  className="w-full neu-input p-4 text-text-primary cursor-pointer"
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
                <label className="block text-sm font-semibold text-text-primary mb-3">Mode</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setMode('online')}
                    className={`flex-1 py-4 px-4 rounded-neu flex items-center justify-center gap-2 transition-all ${
                      mode === 'online' 
                        ? 'neu-btn-primary text-white shadow-neu' 
                        : 'neu-btn text-text-secondary'
                    }`}
                  >
                    <Laptop size={18} /> Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('offline')}
                    className={`flex-1 py-4 px-4 rounded-neu flex items-center justify-center gap-2 transition-all ${
                      mode === 'offline' 
                        ? 'neu-btn-primary text-white shadow-neu' 
                        : 'neu-btn text-text-secondary'
                    }`}
                  >
                    <MapPin size={18} /> Offline
                  </button>
                </div>
              </div>

              {mode === 'offline' && (
                  <div className="animate-fade-in-up">
                    <label className="block text-sm font-semibold text-text-primary mb-2">Location / Cafe</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Starbucks, 3rd Ave" 
                      className="w-full neu-input p-4 text-text-primary placeholder:text-text-muted"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
              )}
            </section>

            {/* 2. Tech Stack */}
            <section className="space-y-5 pt-6 border-t border-border-soft">
               <h2 className="text-lg font-heading font-semibold text-text-primary flex items-center gap-2">
                <Code size={18} className="text-secondary" /> What are you working on?
              </h2>
               <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Tech Stack (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="React, Node.js, TypeScript..." 
                  className="w-full neu-input p-4 text-text-primary placeholder:text-text-muted"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Quick Bio / Goal</label>
                <textarea 
                  rows={3}
                  placeholder="I'm trying to finish a hackathon project. Need focus." 
                  className="w-full neu-input p-4 text-text-primary placeholder:text-text-muted resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </section>

             {/* 3. Partner Prefs */}
             <section className="space-y-5 pt-6 border-t border-border-soft">
               <h2 className="text-lg font-heading font-semibold text-text-primary flex items-center gap-2">
                <User size={18} className="text-primary" /> Partner Preferences
              </h2>
               <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">Level</label>
                        <select 
                          className="w-full neu-input p-4 text-text-primary cursor-pointer"
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
                         <label className="block text-sm font-semibold text-text-primary mb-2">Vibe</label>
                        <select 
                          className="w-full neu-input p-4 text-text-primary cursor-pointer"
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

            <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full font-bold text-lg" 
                  size="lg"
                  disabled={loading}
                  icon={<Sparkles size={18} />}
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
