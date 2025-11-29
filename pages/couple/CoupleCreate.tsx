import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Laptop, MapPin, Clock, Heart } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { coupleSessionService } from '../../services/coupleSession.service';

export const CoupleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1 Hour');
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime) {
      setError('Please provide a title and a start time.');
      return;
    }

<<<<<<< HEAD
    if (!user) {
      setError('You must be logged in to create a session.');
      return;
=======
    const startDate = new Date(startTime);
    
    // Validate the date object
    if (isNaN(startDate.getTime())) {
      alert('The selected start time is invalid. Please check your input.');
      return;
    }

    let endDate = new Date(startDate);
    switch (duration) {
      case '1 Hour':
        endDate.setHours(startDate.getHours() + 1);
        break;
      case '2 Hours':
        endDate.setHours(startDate.getHours() + 2);
        break;
      case '3 Hours':
        endDate.setHours(startDate.getHours() + 3);
        break;
      case 'Until Done':
        endDate.setHours(startDate.getHours() + 8); // A long session
        break;
      default:
        endDate.setHours(startDate.getHours() + 1);
>>>>>>> 706330ff6bc09eb9130c489da1ce015ec9816e14
    }

    setLoading(true);
    setError(null);

    try {
      const startDate = new Date(startTime);
      let endDate = new Date(startDate);
      switch (duration) {
        case '1 Hour':
          endDate.setHours(startDate.getHours() + 1);
          break;
        case '2 Hours':
          endDate.setHours(startDate.getHours() + 2);
          break;
        case '3 Hours':
          endDate.setHours(startDate.getHours() + 3);
          break;
        case 'Until Done':
          endDate.setHours(startDate.getHours() + 8);
          break;
        default:
          endDate.setHours(startDate.getHours() + 1);
      }

      // TODO: Get partnership_id - you'll need to implement partnership lookup
      // For now, this will fail without a partnership_id
      const partnershipId = ''; // This needs to be retrieved from user's partnerships
      
      if (!partnershipId) {
        setError('No partnership found. Please create a partnership first.');
        setLoading(false);
        return;
      }

      await coupleSessionService.createCoupleSession({
        partnership_id: partnershipId,
        title,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        mode,
        location: mode === 'offline' ? location : undefined,
      });

      navigate('/couple');
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/couple')} className="flex items-center text-slate-400 hover:text-white mb-6">
          <ChevronLeft size={20} /> Back to dashboard
        </button>

        <div className="bg-surface border border-slate-700 rounded-2xl p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Heart className="text-secondary" /> Plan a Date
            </h1>
            <p className="text-slate-400">Schedule a productive session with your partner.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Basics */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock size={18} className="text-primary" /> Session Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Sunday Morning Code & Coffee" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
                    <input 
                      required
                      type="datetime-local" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Duration</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                        <option>1 Hour</option>
                        <option>2 Hours</option>
                        <option>3 Hours</option>
                        <option>Until Done</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mode</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setMode('online')}
                    className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${mode === 'online' ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    <Laptop size={18} /> Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('offline')}
                    className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${mode === 'offline' ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    <MapPin size={18} /> Offline
                  </button>
                </div>
              </div>

              {mode === 'offline' && (
                  <div className="animate-fade-in-up">
                    <label className="block text-sm font-medium text-slate-300 mb-1">Location / Place</label>
                    <input 
                      type="text" 
                      placeholder="e.g. The Library Cafe, Living Room" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
              )}
            </section>

            <div className="pt-6">
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="w-full font-bold text-lg" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Schedule Date'}
                </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
