import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading for max 3 seconds
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt instead of redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <LogIn className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-slate-400 mb-6">
            Bạn cần đăng nhập để truy cập trang này.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/login" state={{ from: location }}>
              <Button className="w-full">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="w-full">
                Tạo tài khoản mới
              </Button>
            </Link>
            <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm mt-2">
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

