import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Heart, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
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
      // Search for user by email in auth.users (via profiles)
      const { data: users, error: searchError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, status')
        .limit(10);

      if (searchError) throw searchError;

      // We need to find the user by email - but profiles don't have email
      // So we search auth.users indirectly
      const { data: authUser, error: authError } = await supabase.rpc(
        'get_user_by_email',
        { user_email: email.trim().toLowerCase() }
      );

      // If RPC doesn't exist, try alternative approach
      if (authError) {
        // Fallback: Just show error that we can't search
        setError('Không tìm thấy người dùng với email này. Họ cần đăng ký tài khoản trước.');
        setLoading(false);
        return;
      }

      if (authUser && authUser.length > 0) {
        // Get profile info
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
      // Redirect to couple dashboard after 2 seconds
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
        <div className="bg-surface border border-green-500/30 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Kết nối thành công!</h2>
          <p className="text-slate-400 mb-4">
            Bạn và {foundUser?.display_name} giờ là partner. Đang chuyển hướng...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate('/couple')} className="flex items-center text-slate-400 hover:text-white mb-6">
          <ChevronLeft size={20} /> Quay lại
        </button>

        <div className="bg-surface border border-slate-700 rounded-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Tìm Partner</h1>
            <p className="text-slate-400">
              Nhập email của partner để kết nối và bắt đầu làm việc cùng nhau
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Search form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email của partner
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-secondary"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6"
                >
                  <Search size={18} />
                </Button>
              </div>
            </div>

            {/* Found user card */}
            {foundUser && (
              <div className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-xl animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/30 flex items-center justify-center text-secondary text-xl font-bold">
                    {foundUser.display_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{foundUser.display_name}</p>
                    <p className="text-sm text-slate-400">{foundUser.email}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full mt-4"
                  onClick={handleConnect}
                  disabled={loading}
                >
                  <UserPlus size={18} className="mr-2" />
                  {loading ? 'Đang kết nối...' : 'Kết nối làm Partner'}
                </Button>
              </div>
            )}

            {/* Alternative: Create partnership manually */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 text-center mb-4">
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
        <p className="text-red-400 text-xs">{error}</p>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          placeholder="Partner User ID (UUID)"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleConnect}
          disabled={loading || !partnerId.trim()}
        >
          {loading ? '...' : 'Connect'}
        </Button>
      </div>
      <p className="text-xs text-slate-500">
        User ID của bạn: <code className="bg-slate-800 px-1 rounded text-primary">{userId}</code>
      </p>
    </div>
  );
};

