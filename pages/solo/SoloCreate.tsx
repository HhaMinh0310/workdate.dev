import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Laptop, MapPin, Code, User, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SoloCreate: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'online' | 'offline'>('online');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API logic here
    navigate('/solo/browse');
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
                    <input type="time" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Duration</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary">
                        <option>1 Hour</option>
                        <option>2 Hours</option>
                        <option>3 Hours</option>
                        <option>Half Day</option>
                    </select>
                </div>
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Quick Bio / Goal</label>
                <textarea 
                  rows={3}
                  placeholder="I'm trying to finish a hackathon project. Need focus." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary resize-none"
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
                        <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary">
                            <option>Anyone</option>
                            <option>Student</option>
                            <option>Junior</option>
                            <option>Mid-Level</option>
                            <option>Senior</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-300 mb-1">Vibe</label>
                        <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-primary">
                            <option>Silent Work</option>
                            <option>Chatty / Social</option>
                            <option>Pomodoro Style</option>
                        </select>
                    </div>
               </div>
            </section>

            <div className="pt-6">
                <Button type="submit" className="w-full font-bold text-lg" size="lg">Create Workdate</Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};