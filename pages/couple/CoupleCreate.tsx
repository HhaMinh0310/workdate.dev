import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Laptop, MapPin, Clock, Heart, UserPlus, Copy, Check, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { coupleSessionService } from '../../services/coupleSession.service';
import { partnershipService } from '../../services/partnership.service';

// Helper to get default datetime (next hour from now)
const getDefaultDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  now.setMinutes(0);
  now.setSeconds(0);
  return now.toISOString().slice(0, 16);
};

// Helper to get min datetime (now)
const getMinDateTime = () => {
  return new Date().toISOString().slice(0, 16);
};

export const CoupleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(getDefaultDateTime());
  const [duration, setDuration] = useState('1 Hour');
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPartnership, setLoadingPartnership] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnershipId, setPartnershipId] = useState<string | null>(null);
  const [partner, setPartner] = useState<any>(null);
  
  const [copied, setCopied] = useState(false);

  // Load partnership on mount
  useEffect(() => {
    const loadPartnership = async () => {
      if (!user) {
        setLoadingPartnership(false);
        return;
      }

      try {
        const partnerships = await partnershipService.getPartnerships(user.id);
        if (partnerships && partnerships.length > 0) {
          const partnership = partnerships[0];
          setPartnershipId(partnership.id);
          const partnerData = partnership.user1.id === user.id 
            ? partnership.user2 
            : partnership.user1;
          setPartner(partnerData);
        }
      } catch (err: any) {
        console.error('Failed to load partnership:', err);
      } finally {
        setLoadingPartnership(false);
      }
    };

    loadPartnership();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime) {
      setError('Please provide a title and a start time.');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a session.');
      return;
    }

    if (!partnershipId) {
      setError('No partnership found. Please invite a partner first.');
      return;
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

  const copyInviteLink = () => {
    const link = `${window.location.origin}/register?invite=${user?.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show loading while checking partnership
  if (loadingPartnership) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="neu-card p-8 flex flex-col items-center gap-4">
          <div className="neu-icon-wrap p-4 rounded-full">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show invite UI if no partnership
  if (!partnershipId) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto pt-4">
          <button onClick={() => navigate('/couple')} className="flex items-center text-text-secondary hover:text-primary mb-6 transition-colors">
            <ChevronLeft size={20} /> Back to dashboard
          </button>

          <div className="neu-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 neu-icon-wrap rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Find Your Partner</h1>
              <p className="text-text-secondary">
                Couple Mode requires a partner. Invite someone to work together!
              </p>
            </div>

            <div className="space-y-6">
              {/* Option 1: Share invite link */}
              <div className="neu-card-inset p-5">
                <h3 className="font-semibold text-text-primary mb-2">Option 1: Share Invite Link</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Send this link to your partner so they can sign up and connect with you.
                </p>
                <button
                  onClick={copyInviteLink}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 neu-btn rounded-neu text-primary font-semibold hover:shadow-neu-hover transition-all"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy Invite Link'}
                </button>
              </div>

              {/* Option 2: Use Solo Mode */}
              <div className="neu-card-inset p-5">
                <h3 className="font-semibold text-text-primary mb-2">Option 2: Try Solo Mode</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Don't have a partner yet? Find one through Solo Mode!
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/solo/create')}
                >
                  Create Solo Session Instead
                </Button>
              </div>

              <p className="text-center text-sm text-text-muted pt-2">
                Once your partner signs up using your invite link, 
                you'll be automatically paired and can create couple sessions together.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto pt-4">
        <button onClick={() => navigate('/couple')} className="flex items-center text-text-secondary hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={20} /> Back to dashboard
        </button>

        <div className="neu-card p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2 flex items-center gap-3">
              <Heart className="text-primary" /> Plan a Date
            </h1>
            <p className="text-text-secondary">
              Schedule a productive session with {partner?.display_name || 'your partner'}.
            </p>
          </div>

          {/* Partner info */}
          {partner && (
            <div className="flex items-center gap-3 p-4 neu-card-inset rounded-neu mb-6">
              <div className="w-10 h-10 rounded-full neu-icon-wrap flex items-center justify-center">
                <span className="text-primary font-medium">
                  {partner.display_name?.[0]?.toUpperCase() || 'P'}
                </span>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Partner</p>
                <p className="text-text-primary font-medium">{partner.display_name}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-neu text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Session Details */}
            <section className="space-y-5">
              <h2 className="text-lg font-heading font-semibold text-text-primary flex items-center gap-2">
                <Clock size={18} className="text-primary" /> Session Details
              </h2>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Sunday Morning Code & Coffee" 
                  className="w-full neu-input p-4 text-text-primary placeholder:text-text-muted"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Start Time</label>
                    <div className="relative">
                      <input 
                        required
                        type="datetime-local"
                        min={getMinDateTime()}
                        className="w-full neu-input p-4 pr-10 text-text-primary cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
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
                        <option>Until Done</option>
                    </select>
                </div>
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
                    <label className="block text-sm font-semibold text-text-primary mb-2">Location / Place</label>
                    <input 
                      type="text" 
                      placeholder="e.g. The Library Cafe, Living Room" 
                      className="w-full neu-input p-4 text-text-primary placeholder:text-text-muted"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
              )}
            </section>

            <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full font-bold text-lg" 
                  size="lg"
                  disabled={loading}
                  icon={<Heart size={18} />}
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
