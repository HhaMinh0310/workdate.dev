import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Users, Coffee, ArrowRight, Search, Calendar, 
  CheckCircle, Gift, Target, Sparkles, Code, MessageCircle 
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'solo-mode', 'couple-mode', 'cta'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header/Navigation */}
      <header className="neu-navbar sticky top-4 mx-4 z-50 rounded-neu-lg">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="neu-icon-wrap p-2 rounded-xl">
                <Coffee className="text-primary" size={22} />
              </div>
              <span className="font-heading font-bold text-lg text-text-primary">Workdate.dev</span>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('solo-mode')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'solo-mode' ? 'text-primary' : 'text-text-secondary hover:text-primary'
                }`}
              >
                Solo Mode
              </button>
              <button 
                onClick={() => scrollToSection('couple-mode')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'couple-mode' ? 'text-primary' : 'text-text-secondary hover:text-primary'
                }`}
              >
                Couple Mode
              </button>
              <button 
                onClick={() => scrollToSection('cta')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'cta' ? 'text-primary' : 'text-text-secondary hover:text-primary'
                }`}
              >
                Get Started
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" icon={<Sparkles size={14} />}>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-light/20 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-light/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-5xl w-full relative z-10 text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 neu-card rounded-full mb-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-text-secondary font-medium">Platform for Productive Developers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary leading-tight">
            Your Productivity
            <span className="block gradient-text">Partner Awaits</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Co-working platform for developers who want to stay focused and achieve goals together. 
            Work with your partner or find a coding buddy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-8"
              onClick={() => scrollToSection('solo-mode')}
              icon={<Users size={20} />}
            >
              Explore Solo Mode
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto px-8"
              onClick={() => scrollToSection('couple-mode')}
              icon={<Heart size={20} />}
            >
              Try Couple Mode
            </Button>
          </div>

          <p className="text-sm text-text-muted pt-4">
            Free to start • No credit card required • Join 1000+ developers
          </p>
        </div>
      </section>

      {/* Solo Mode Feature Section */}
      <section id="solo-mode" className="py-24 px-6 bg-gradient-to-b from-transparent to-surface/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 neu-card rounded-full mb-2">
              <Users className="text-primary" size={18} />
              <span className="text-sm text-text-secondary font-semibold">FOR SOLO DEVELOPERS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
              Solo Mode - Find Your Coding Buddy
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Connect with other developers for focused work sessions. Browse sessions or host your own.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Browse Sessions */}
            <div className="neu-card p-8 hover:shadow-neu-hover transition-all group">
              <div className="neu-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-neu transition-shadow">
                <Search className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">Browse Sessions</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Search and filter work sessions by tech stack, experience level, and work style. Find the perfect match for your coding goals.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Filter by tech stack & skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>See host profiles & preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Online or offline options</span>
                </li>
              </ul>
            </div>

            {/* Host Your Session */}
            <div className="neu-card p-8 hover:shadow-neu-hover transition-all group">
              <div className="neu-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-neu transition-shadow">
                <Calendar className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">Host Your Session</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Create public listings with your schedule, tech stack, and work preferences. Attract compatible coding partners.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Set your schedule & duration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Define partner preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Choose work vibe & style</span>
                </li>
              </ul>
            </div>

            {/* Match & Connect */}
            <div className="neu-card p-8 hover:shadow-neu-hover transition-all group">
              <div className="neu-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-neu transition-shadow">
                <MessageCircle className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">Match & Connect</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Send session requests to developers you'd like to work with. Get matched with compatible partners and start coding together.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Send & receive requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Smart compatibility matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Build coding partnerships</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Visual Placeholder */}
          <div className="neu-card-inset p-12 rounded-neu-xl mb-8">
            <div className="aspect-video bg-gradient-to-br from-primary-light/20 to-secondary-light/20 rounded-neu flex items-center justify-center">
              <div className="text-center">
                <Code className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                <p className="text-text-muted">Solo Mode Interface Preview</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link to="/solo/browse">
              <Button size="lg" className="px-8" icon={<ArrowRight size={18} />}>
                Explore Solo Sessions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Couple Mode Feature Section */}
      <section id="couple-mode" className="py-24 px-6 bg-gradient-to-b from-surface/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 neu-card rounded-full mb-2">
              <Heart className="text-secondary" size={18} />
              <span className="text-sm text-text-secondary font-semibold">FOR COUPLES & PARTNERS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
              Couple Mode - Work Together, Grow Together
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Designed for partners who want a shared workspace. Track tasks together and reward each other for productivity.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Shared Workspace */}
            <div className="neu-card p-8 hover:shadow-neu-hover transition-all group">
              <div className="neu-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-neu transition-shadow">
                <Calendar className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">Shared Workspace</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Create joint work sessions with your partner. Schedule dates, set duration, and choose online or offline mode.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Schedule work dates together</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Online & offline sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Real-time session tracking</span>
                </li>
              </ul>
            </div>

            {/* Task Tracking */}
            <div className="neu-card p-8 hover:shadow-neu-hover transition-all group">
              <div className="neu-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-neu transition-shadow">
                <Target className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">Task Tracking</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Separate todo lists for you and your partner. Track progress, mark completion, and stay accountable together.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>My Focus & Partner's Focus</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Progress visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Difficulty level tracking</span>
                </li>
              </ul>
            </div>

            {/* Secret Rewards */}
            <div className="neu-card p-8 hover:shadow-neu-hover transition-all group">
              <div className="neu-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-neu transition-shadow">
                <Gift className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">Secret Rewards</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Set surprise rewards for your partner to unlock when they complete tasks. Add gamification to productivity!
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Hidden reward system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Motivation & gamification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Unlock on task completion</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Visual Placeholder */}
          <div className="neu-card-inset p-12 rounded-neu-xl mb-8">
            <div className="aspect-video bg-gradient-to-br from-secondary-light/20 to-primary-light/20 rounded-neu flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
                <p className="text-text-muted">Couple Mode Interface Preview</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link to="/couple">
              <Button size="lg" variant="secondary" className="px-8" icon={<ArrowRight size={18} />}>
                Try Couple Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section id="cta" className="py-24 px-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-light/10 to-secondary-light/10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="neu-card p-12 md:p-16 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
                Ready to Start Your
                <span className="block gradient-text">Productive Journey?</span>
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Join Workdate.dev today and transform how you work. Whether solo or with a partner, achieve your goals together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full px-10" icon={<Sparkles size={20} />}>
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full px-10">
                  Login
                </Button>
              </Link>
            </div>

            <p className="text-sm text-text-muted pt-2">
              No credit card required • Start working smarter today • Join 1000+ developers
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border-soft">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="neu-icon-wrap p-2 rounded-xl">
                <Coffee className="text-primary" size={20} />
              </div>
              <span className="font-heading font-bold text-text-primary">Workdate.dev</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
              <button className="hover:text-primary transition-colors">About</button>
              <button className="hover:text-primary transition-colors">Privacy</button>
              <button className="hover:text-primary transition-colors">Terms</button>
              <button className="hover:text-primary transition-colors">Contact</button>
            </div>

            <div className="text-sm text-text-muted flex items-center gap-2">
              <span>Made with</span>
              <Heart size={14} className="text-primary fill-primary" />
              <span>© 2024 Workdate.dev</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
