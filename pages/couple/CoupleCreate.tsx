import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Laptop, MapPin, Clock, Heart } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CoupleCreate: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'online' | 'offline'>('online');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would post to the API.
    // For MVP, we just navigate back to the dashboard.
    navigate('/couple');
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
                    <input type="datetime-local" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Duration</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary">
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
                    />
                  </div>
              )}
            </section>

            <div className="pt-6">
                <Button type="submit" variant="secondary" className="w-full font-bold text-lg" size="lg">Schedule Date</Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};