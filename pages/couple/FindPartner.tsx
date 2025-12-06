import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Heart, UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { partnershipService } from '../../services/partnership.service';

export const FindPartner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email của partner');
      return;
    }

    if (email.trim().toLowerCase() === user?.email?.toLowerCase()) {
      setError('Bạn không thể kết nối với chính mình!');
      return;
    }

    setLoading(true);
    setError(null);
    setFoundUser(null);

    try {
      const { data: users, error: searchError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, status')
        .limit(10);

      if (searchError) throw searchError;

      const { data: authUser, error: authError } = await supabase.rpc(
        'get_user_by_email',
        { user_email: email.trim().toLowerCase() }
      );

      if (authError) {
        setError('Không tìm thấy người dùng với email này. Họ cần đăng ký tài khoản trước.');
        setLoading(false);
        return;
      }

      if (authUser && authUser.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser[0].id)
          .single();

        setFoundUser({
          id: authUser[0].id,
          email: email,
          display_name: profileData?.display_name || 'User',
          avatar_url: profileData?.avatar_url
        });
      } else {
        setError('Không tìm thấy người dùng với email này. Họ cần đăng ký tài khoản trước.');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError('Không tìm thấy người dùng. Hãy chắc chắn họ đã đăng ký tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!foundUser || !user) return;

    setLoading(true);
    setError(null);

    try {
      await partnershipService.createPartnership(user.id, foundUser.id);
      setSuccess(true);
      setTimeout(() => {
        navigate('/couple');
      }, 2000);
    } catch (err: any) {
      console.error('Connect error:', err);
      if (err.message?.includes('duplicate') || err.code === '23505') {
        setError('Bạn đã kết nối với người này rồi!');
      } else {
        setError('Không thể kết nối: ' + (err.message || 'Lỗi không xác định'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="neu-card p-10 text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 neu-icon-wrap rounded-full flex items-center justify-center bg-success/10">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">Kết nối thành công!</h2>
          <p className="text-text-secondary">
            Bạn và {foundUser?.display_name} giờ là partner. Đang chuyển hướng...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-xl mx-auto pt-4">
        <button onClick={() => navigate('/couple')} className="flex items-center text-text-secondary hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={20} /> Quay lại
        </button>

        <div className="neu-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 neu-icon-wrap rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Tìm Partner</h1>
            <p className="text-text-secondary">
              Nhập email của partner để kết nối và bắt đầu làm việc cùng nhau
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-neu flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Search form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email của partner
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="flex-1 neu-input px-4 py-3.5 text-text-primary placeholder:text-text-muted"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                </Button>
              </div>
            </div>

            {/* Found user card */}
            {foundUser && (
              <div className="mt-6 p-5 bg-primary-light/20 border border-primary-light/30 rounded-neu animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full neu-icon-wrap flex items-center justify-center">
                    <span className="text-primary text-xl font-bold">
                      {foundUser.display_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary font-semibold">{foundUser.display_name}</p>
                    <p className="text-sm text-text-secondary">{foundUser.email}</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="w-full mt-5"
                  onClick={handleConnect}
                  disabled={loading}
                  icon={<UserPlus size={18} />}
                >
                  {loading ? 'Đang kết nối...' : 'Kết nối làm Partner'}
                </Button>
              </div>
            )}

            {/* Alternative: Create partnership manually */}
            <div className="mt-8 pt-6 border-t border-border-soft">
              <p className="text-sm text-text-secondary text-center mb-4">
                Hoặc nhập User ID của partner trực tiếp (nếu họ chia sẻ với bạn)
              </p>
              <ManualConnect userId={user?.id} onSuccess={() => navigate('/couple')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component để nhập User ID thủ công
const ManualConnect: React.FC<{ userId?: string; onSuccess: () => void }> = ({ userId, onSuccess }) => {
  const [partnerId, setPartnerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!partnerId.trim() || !userId) return;

    if (partnerId.trim() === userId) {
      setError('Không thể kết nối với chính mình!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await partnershipService.createPartnership(userId, partnerId.trim());
      onSuccess();
    } catch (err: any) {
      console.error('Manual connect error:', err);
      if (err.message?.includes('duplicate') || err.code === '23505') {
        setError('Bạn đã kết nối với người này rồi!');
      } else if (err.message?.includes('foreign key') || err.code === '23503') {
        setError('User ID không tồn tại. Kiểm tra lại!');
      } else {
        setError('Lỗi: ' + (err.message || 'Không xác định'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-error text-xs">{error}</p>
      )}
      <div className="flex gap-3">
        <input
          type="text"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          placeholder="Partner User ID (UUID)"
          className="flex-1 neu-input px-4 py-3 text-sm text-text-primary placeholder:text-text-muted"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleConnect}
          disabled={loading || !partnerId.trim()}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Connect'}
        </Button>
      </div>
      <p className="text-xs text-text-muted">
        User ID của bạn: <code className="bg-surface-dark px-2 py-1 rounded text-primary font-mono">{userId}</code>
      </p>
    </div>
  );
};
