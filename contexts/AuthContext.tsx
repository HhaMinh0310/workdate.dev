import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { authService } from '../services/auth.service';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let subscription: any = null;

    const initAuth = async () => {
      try {
        // Check initial session
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          if (currentUser) {
            await loadProfile(currentUser.id);
          }
        }
      } catch (err) {
        console.error('Error getting current user:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }

      // Listen for auth changes
      try {
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!isMounted) return;
            
            if (session?.user) {
              setUser(session.user);
              await loadProfile(session.user.id);
            } else {
              setUser(null);
              setProfile(null);
            }
            setLoading(false);
          }
        );
        subscription = data?.subscription;
      } catch (err) {
        console.error('Error setting up auth listener:', err);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await authService.getProfile(userId);
      setProfile({
        id: profileData.id,
        displayName: profileData.display_name,
        avatarUrl: profileData.avatar_url || undefined,
        status: profileData.status as 'online' | 'offline' | 'focus'
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const data = await authService.signIn(email, password);
    setUser(data.user);
    if (data.user) {
      await loadProfile(data.user.id);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const data = await authService.signUp(email, password, displayName);
    setUser(data.user);
    if (data.user) {
      await loadProfile(data.user.id);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

