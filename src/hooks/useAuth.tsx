import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { CounselorProfile } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
          // Strictly verify counselor profile in database
          const { data: profile, error } = await supabase
            .from('counselor_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!error && profile && profile.active) {
            setUser(profile);
          } else {
            // Deactivated or missing profile -> revoke session immediately
            await supabase.auth.signOut();
            setUser(null);
          }
        }
      } else {
        // When backend is not configured, fail closed: no unauthorized session access
        setUser(null);
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

    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Backend authentication service is not configured. Please configure Supabase credentials.',
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { success: false, error: 'Invalid authorized email or password.' };
    }

    // Require verified active row in counselor_profiles
    const { data: profile, error: profileErr } = await supabase
      .from('counselor_profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileErr || !profile) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Access denied. Account is not registered on the authorized counselor roster.',
      };
    }

    if (!profile.active) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Account access has been deactivated by administration.',
      };
    }

    setUser(profile);
    return { success: true };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
