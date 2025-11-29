import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Laptop, MapPin, Clock, Heart, UserPlus, Copy, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { coupleSessionService } from '../../services/coupleSession.service';
import { partnershipService } from '../../services/partnership.service';

export const CoupleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1 Hour');
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPartnership, setLoadingPartnership] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnershipId, setPartnershipId] = useState<string | null>(null);
  const [partner, setPartner] = useState<any>(null);
  
  // For creating partnership
  const [showInvite, setShowInvite] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
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
          // Determine who is the partner
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  // Show invite UI if no partnership
  if (!partnershipId) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/couple')} className="flex items-center text-slate-400 hover:text-white mb-6">
            <ChevronLeft size={20} /> Back to dashboard
          </button>

          <div className="bg-surface border border-slate-700 rounded-2xl p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-secondary" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Find Your Partner</h1>
              <p className="text-slate-400">
                Couple Mode requires a partner. Invite someone to work together!
              </p>
            </div>

            <div className="space-y-6">
              {/* Option 1: Share invite link */}
              <div className="p-4 bg-slate-900 rounded-xl">
                <h3 className="font-medium text-white mb-2">Option 1: Share Invite Link</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Send this link to your partner so they can sign up and connect with you.
                </p>
                <button
                  onClick={copyInviteLink}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy Invite Link'}
                </button>
              </div>

              {/* Option 2: Use Solo Mode */}
              <div className="p-4 bg-slate-900 rounded-xl">
                <h3 className="font-medium text-white mb-2">Option 2: Try Solo Mode</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Don't have a partner yet? Find one through Solo Mode!
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate('/solo/create')}
                >
                  Create Solo Session Instead
                </Button>
              </div>

              {/* Info about how partnership works */}
              <div className="text-center text-sm text-slate-500 mt-6">
                <p>
                  Once your partner signs up using your invite link, 
                  you'll be automatically paired and can create couple sessions together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-slate-400">
              Schedule a productive session with {partner?.display_name || 'your partner'}.
            </p>
          </div>

          {/* Partner info */}
          {partner && (
            <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-secondary font-medium">
                {partner.display_name?.[0]?.toUpperCase() || 'P'}
              </div>
              <div>
                <p className="text-sm text-slate-400">Partner</p>
                <p className="text-white font-medium">{partner.display_name}</p>
              </div>
            </div>
          )}

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
