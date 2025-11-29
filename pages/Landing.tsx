import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Coffee, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full space-y-12">
        <div className="space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-surface rounded-2xl mb-4 border border-slate-700">
            <Coffee className="text-primary mr-2" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Workdate.dev</h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Find your productivity soulmate.
          </h2>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            The co-working platform for developers. Join with your partner or find a coding buddy to crush your goals together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          <Link to="/couple" className="group">
            <div className="h-full bg-surface border border-slate-700 hover:border-secondary/50 rounded-2xl p-8 transition-all hover:bg-slate-800 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart size={120} className="text-secondary" />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-4 bg-secondary/10 rounded-full mb-6">
                  <Heart className="text-secondary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Couple Mode</h3>
                <p className="text-slate-400 mb-6">For partners who want to work together.</p>
                <Button variant="secondary" className="w-full">
                  Enter Room <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </Link>

          <Link to="/solo" className="group">
            <div className="h-full bg-surface border border-slate-700 hover:border-primary/50 rounded-2xl p-8 transition-all hover:bg-slate-800 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={120} className="text-primary" />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-6">
                  <Users className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Solo Mode</h3>
                <p className="text-slate-400 mb-6">Match with other devs for a session.</p>
                <Button variant="primary" className="w-full">
                  Find a Match <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="pt-8 text-slate-500 text-sm">
          MVP Demo Version &copy; 2024 Workdate.dev
        </div>
      </div>
    </div>
  );
};