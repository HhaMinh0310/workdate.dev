import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Coffee, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-light/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-light/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-2xl w-full space-y-12 relative z-10">
        {/* Logo & Title */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center justify-center gap-3 neu-card px-6 py-3 mb-4">
            <div className="neu-icon-wrap p-2.5 rounded-xl">
              <Coffee className="text-primary" size={28} />
            </div>
            <h1 className="text-3xl font-heading font-bold gradient-text">Workdate.dev</h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-text-primary leading-tight">
            Find your productivity 
            <span className="block gradient-text">soulmate.</span>
          </h2>
          
          <p className="text-lg text-text-secondary max-w-lg mx-auto leading-relaxed">
            The co-working platform for developers. Join with your partner or find a coding buddy to crush your goals together.
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* Couple Mode Card */}
          <Link to="/couple" className="group">
            <div className="h-full neu-card p-8 transition-all duration-300 hover:shadow-neu-hover cursor-pointer relative overflow-hidden">
              {/* Decorative background icon */}
              <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300">
                <Heart size={120} className="text-primary" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="neu-icon-wrap p-5 rounded-2xl mb-6 group-hover:shadow-neu transition-shadow">
                  <Heart className="text-primary" size={32} />
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  Couple Mode
                </h3>
                <p className="text-text-secondary mb-6">
                  For partners who want to work together.
                </p>
                
                <Button variant="primary" className="w-full group-hover:shadow-neu-hover">
                  Enter Room <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Solo Mode Card */}
          <Link to="/solo" className="group">
            <div className="h-full neu-card p-8 transition-all duration-300 hover:shadow-neu-hover cursor-pointer relative overflow-hidden">
              {/* Decorative background icon */}
              <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300">
                <Users size={120} className="text-secondary" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="neu-icon-wrap p-5 rounded-2xl mb-6 group-hover:shadow-neu transition-shadow">
                  <Users className="text-secondary" size={32} />
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  Solo Mode
                </h3>
                <p className="text-text-secondary mb-6">
                  Match with other devs for a session.
                </p>
                
                <Button variant="secondary" className="w-full group-hover:shadow-neu-hover">
                  Find a Match <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Footer Section */}
        <div className="pt-8 flex flex-col items-center gap-6">
          {/* Auth Buttons */}
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" icon={<Sparkles size={14} />}>
                Get Started
              </Button>
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-text-muted text-sm flex items-center gap-2">
            <span>Made with</span>
            <Heart size={14} className="text-primary fill-primary animate-pulse-soft" />
            <span>by Workdate.dev © 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};
