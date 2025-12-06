import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { LogIn, Loader2 } from 'lucide-react';

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
        <div className="neu-card p-8 flex flex-col items-center gap-4">
          <div className="neu-icon-wrap p-4 rounded-full">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt instead of redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-primary-light/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-secondary-light/20 rounded-full blur-3xl"></div>
        
        <div className="neu-card p-10 max-w-md w-full text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 neu-icon-wrap rounded-2xl mb-5">
            <LogIn className="text-primary" size={28} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Login Required</h2>
          <p className="text-text-secondary mb-8">
            Bạn cần đăng nhập để truy cập trang này.
          </p>
          <div className="flex flex-col gap-4">
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
            <Link to="/" className="text-text-muted hover:text-primary text-sm mt-2 transition-colors">
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
