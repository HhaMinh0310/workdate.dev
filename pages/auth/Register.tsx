import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { UserPlus, Mail, Lock, User, Heart } from 'lucide-react';
import { partnershipService } from '../../services/partnership.service';
import { supabase } from '../../services/supabase';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteUserId = searchParams.get('invite');
  
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviterName, setInviterName] = useState<string | null>(null);

  // Load inviter info if invite param exists
  useEffect(() => {
    const loadInviter = async () => {
      if (inviteUserId) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', inviteUserId)
            .single();
          if (data) {
            setInviterName(data.display_name);
          }
        } catch (err) {
          console.error('Failed to load inviter:', err);
        }
      }
    };
    loadInviter();
  }, [inviteUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signUp(email, password, displayName);
      
      // If there's an invite, create partnership after a short delay
      // (to ensure profile trigger has completed)
      if (inviteUserId && result?.user) {
        // Wait for profile to be created by trigger
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          await partnershipService.createPartnership(inviteUserId, result.user.id);
          navigate('/couple');
          return;
        } catch (partnerErr: any) {
          console.error('Failed to create partnership:', partnerErr);
          // Store invite in localStorage to retry later
          localStorage.setItem('pending_partner_invite', inviteUserId);
        }
      }
      
      // After successful registration, redirect to home
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
              {inviteUserId ? (
                <Heart className="text-secondary" size={32} />
              ) : (
                <UserPlus className="text-primary" size={32} />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {inviteUserId ? 'Join Your Partner' : 'Create Account'}
            </h1>
            <p className="text-slate-400">
              {inviteUserId && inviterName
                ? `${inviterName} invited you to be their work partner!`
                : 'Join Workdate.dev and start productive sessions'}
            </p>
          </div>

          {/* Partner invite banner */}
          {inviteUserId && inviterName && (
            <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-secondary font-bold">
                  {inviterName[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Partner Invite From</p>
                  <p className="text-white font-medium">{inviterName}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Check if Supabase is configured */}
          {!import.meta.env.VITE_SUPABASE_URL && (
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
              ⚠️ Database chưa được cấu hình. Vui lòng thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào Vercel Environment Variables.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-primary"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">At least 6 characters</p>
            </div>

            <Button
              type="submit"
              variant={inviteUserId ? 'secondary' : 'primary'}
              className="w-full font-bold"
              size="lg"
              disabled={loading}
            >
              {loading 
                ? 'Creating account...' 
                : inviteUserId 
                  ? 'Join & Connect'
                  : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
