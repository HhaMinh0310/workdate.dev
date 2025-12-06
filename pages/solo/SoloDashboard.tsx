import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SoloDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Solo Mode</h1>
        <p className="text-text-secondary">Find or host work sessions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/solo/browse" className="group">
          <div className="neu-card p-8 h-full flex flex-col items-center text-center transition-all hover:shadow-neu-hover">
            <div className="neu-icon-wrap p-5 rounded-2xl mb-6 group-hover:shadow-neu transition-shadow">
              <Users size={32} className="text-primary" />
            </div>
            <h3 className="font-heading font-bold text-text-primary text-xl mb-2">Browse Sessions</h3>
            <p className="text-text-secondary mb-6">Search and filter work sessions by tech stack, level, and vibe. Find your perfect coding buddy.</p>
            <Button variant="primary" className="mt-auto" icon={<ArrowRight size={16} />}>
              Explore Sessions
            </Button>
          </div>
        </Link>

        <Link to="/solo/create" className="group">
          <div className="neu-card p-8 h-full flex flex-col items-center text-center transition-all hover:shadow-neu-hover">
            <div className="neu-icon-wrap p-5 rounded-2xl mb-6 group-hover:shadow-neu transition-shadow">
              <Calendar size={32} className="text-secondary" />
            </div>
            <h3 className="font-heading font-bold text-text-primary text-xl mb-2">Host a Session</h3>
            <p className="text-text-secondary mb-6">Create a public listing with your schedule, tech stack, and work preferences. Attract compatible partners.</p>
            <Button variant="secondary" className="mt-auto" icon={<ArrowRight size={16} />}>
              Create Session
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

