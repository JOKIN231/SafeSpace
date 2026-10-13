import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import React from 'react';
import { CounselorProfile } from '../types/database';
import { supabase, isSupabaseConfigured, DEFAULT_DEV_COUNSELOR } from '../lib/supabase';

interface AuthContextType {
  user: CounselorProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ameu_safespace_counselor_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CounselorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch counselor profile
          const { data: profile } = await supabase
            .from('counselor_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile && profile.active) {
            setUser(profile);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              display_name: session.user.user_metadata?.display_name || 'Counselor',
              role: 'peer_counselor',
              active: true,
              created_at: new Date().toISOString(),
            });
          }
        }
      } else {
        // Local preview session check
        const savedSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (savedSession) {
          try {
            setUser(JSON.parse(savedSession));
          } catch {
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Basic format validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: 'Invalid authorized email or password.' };
      }
      if (data.user) {
        const { data: profile } = await supabase
          .from('counselor_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile) {
          if (!profile.active) {
            await supabase.auth.signOut();
            return { success: false, error: 'Account access has been deactivated by administration.' };
          }
          setUser(profile);
          return { success: true };
        }

        const fallbackUser: CounselorProfile = {
          id: data.user.id,
          email: data.user.email || email,
          display_name: data.user.user_metadata?.display_name || 'Counselor',
          role: 'peer_counselor',
          active: true,
          created_at: new Date().toISOString(),
        };
        setUser(fallbackUser);
        return { success: true };
      }
    }

    // Local Authorized Access Mode
    // Validates against authorized campus domain or default approved counselor demo credentials
    if (email.endsWith('@ame.edu.lr') || email === 'counselor@ame.edu.lr' || email === 'admin@ame.edu.lr') {
      if (password.length >= 6) {
        const isAdmin = email.startsWith('admin');
        const loggedInUser: CounselorProfile = {
          id: isAdmin ? 'admin-001' : DEFAULT_DEV_COUNSELOR.id,
          email,
          display_name: isAdmin ? 'Rev. Dr. Administration' : DEFAULT_DEV_COUNSELOR.display_name,
          role: isAdmin ? 'administrator' : 'peer_counselor',
          active: true,
          created_at: '2026-09-01T08:00:00Z',
        };
        setUser(loggedInUser);
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
        return { success: true };
      }
    }

    return {
      success: false,
      error: 'Invalid credentials. Only approved AMEU counselors and administrators may sign in.',
    };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      },
    },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
