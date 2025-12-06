import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Laptop, MapPin, Clock, Heart, UserPlus, Copy, Check, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { coupleSessionService } from '../../services/coupleSession.service';
import { partnershipService } from '../../services/partnership.service';

// Helper to get default datetime (next hour from now)
// Returns both date and time from the same Date object to avoid rollover inconsistency
const getDefaultDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  
  // Extract date (YYYY-MM-DD)
  const date = now.toISOString().split('T')[0];
  
  // Extract time (HH:MM)
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;
  
  return { date, time };
};

// Get defaults once to ensure consistency
const defaults = getDefaultDateTime();

// Helper to get min date (today)
const getMinDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const CoupleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(defaults.date);
  const [startTime, setStartTime] = useState(defaults.time);
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
    if (!title.trim() || !startDate || !startTime) {
      setError('Please provide a title, date, and time.');
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
      // Combine date and time
      const startDateTime = new Date(`${startDate}T${startTime}`);
      let endDateTime = new Date(startDateTime);
      
      switch (duration) {
        case '1 Hour':
          endDateTime.setHours(startDateTime.getHours() + 1);
          break;
        case '2 Hours':
          endDateTime.setHours(startDateTime.getHours() + 2);
          break;
        case '3 Hours':
          endDateTime.setHours(startDateTime.getHours() + 3);
          break;
        case 'Until Done':
          endDateTime.setHours(startDateTime.getHours() + 8);
          break;
        default:
          endDateTime.setHours(startDateTime.getHours() + 1);
      }

      await coupleSessionService.createCoupleSession({
        partnership_id: partnershipId,
        title,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
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

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
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
                  className="w-full neu-input p-4 text-text-primary placeholder:text-text-muted rounded-neu"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Date and Time - Separate inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Date</label>
                  <div className="relative">
                    <input 
                      required
                      type="date"
                      min={getMinDate()}
                      className="w-full neu-input p-4 pr-12 text-text-primary cursor-pointer rounded-neu appearance-none"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ colorScheme: 'light' }}
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                  </div>
                  {startDate && (
                    <p className="text-xs text-text-muted mt-1.5">{formatDateDisplay(startDate)}</p>
                  )}
                </div>

                {/* Time Input */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Time</label>
                  <div className="relative">
                    <input 
                      required
                      type="time"
                      className="w-full neu-input p-4 pr-12 text-text-primary cursor-pointer rounded-neu appearance-none"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      style={{ colorScheme: 'light' }}
                    />
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                  </div>
                  {startTime && (
                    <p className="text-xs text-text-muted mt-1.5">{formatTimeDisplay(startTime)}</p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Duration</label>
                  <select 
                    className="w-full neu-input p-4 text-text-primary cursor-pointer rounded-neu appearance-none bg-no-repeat"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23E91E63' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.25rem',
                      paddingRight: '3rem'
                    }}
                  >
                    <option value="1 Hour">1 Hour</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="3 Hours">3 Hours</option>
                    <option value="Until Done">Until Done</option>
                  </select>
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-3">Mode</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setMode('online')}
                    className={`flex-1 py-4 px-4 rounded-neu flex items-center justify-center gap-2 transition-all ${
                      mode === 'online' 
                        ? 'neu-btn-primary text-white shadow-neu' 
                        : 'neu-btn text-text-secondary hover:text-primary'
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
                        : 'neu-btn text-text-secondary hover:text-primary'
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
                    className="w-full neu-input p-4 text-text-primary placeholder:text-text-muted rounded-neu"
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