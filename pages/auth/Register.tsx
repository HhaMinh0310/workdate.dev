import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { UserPlus, Mail, Lock, User, Heart, AlertCircle, Sparkles } from 'lucide-react';
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
      if (inviteUserId && result?.user) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          await partnershipService.createPartnership(inviteUserId, result.user.id);
          navigate('/dashboard');
          return;
        } catch (partnerErr: any) {
          console.error('Failed to create partnership:', partnerErr);
          localStorage.setItem('pending_partner_invite', inviteUserId);
        }
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-primary-light/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary-light/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="neu-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 neu-icon-wrap rounded-2xl mb-4">
              {inviteUserId ? (
                <Heart className="text-primary" size={28} />
              ) : (
                <UserPlus className="text-primary" size={28} />
              )}
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              {inviteUserId ? 'Join Your Partner' : 'Create Account'}
            </h1>
            <p className="text-text-secondary">
              {inviteUserId && inviterName
                ? `${inviterName} invited you to be their work partner!`
                : 'Join Workdate.dev and start productive sessions'}
            </p>
          </div>

          {/* Partner invite banner */}
          {inviteUserId && inviterName && (
            <div className="mb-6 p-4 bg-primary-light/20 border border-primary-light/30 rounded-neu">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full neu-icon-wrap flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {inviterName[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Partner Invite From</p>
                  <p className="text-text-primary font-semibold">{inviterName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-neu flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Supabase Warning */}
          {!import.meta.env.VITE_SUPABASE_URL && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-neu flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-warning text-sm">
                Database chưa được cấu hình. Vui lòng thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào Environment Variables.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full neu-input pl-12 pr-4 py-3.5 text-text-primary placeholder:text-text-muted"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full neu-input pl-12 pr-4 py-3.5 text-text-primary placeholder:text-text-muted"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full neu-input pl-12 pr-4 py-3.5 text-text-primary placeholder:text-text-muted"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-text-muted">At least 6 characters</p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant={inviteUserId ? 'secondary' : 'primary'}
                className="w-full font-bold"
                size="lg"
                disabled={loading}
                icon={inviteUserId ? <Heart size={18} /> : <Sparkles size={18} />}
              >
                {loading 
                  ? 'Creating account...' 
                  : inviteUserId 
                    ? 'Join & Connect'
                    : 'Sign Up'}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
