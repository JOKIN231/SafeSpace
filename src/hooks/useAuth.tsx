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
      // 1. Check session storage for persisted session
      const saved = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id && parsed.active) {
            setUser(parsed);
            setLoading(false);
            return;
          }
        } catch {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      // 2. Check Supabase session if configured
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
            sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
          } else {
            // Deactivated or missing profile -> revoke session immediately
            await supabase.auth.signOut();
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Basic format validation
    if (!email || !password) {
      return { success: false, error: 'Username/Email and password are required.' };
    }

    // Demo Mode Credentials Check: "1234 up and 1234 down"
    const trimmedInput = email.trim();
    const isDemoCredential =
      (trimmedInput === '1234' && password === '1234') ||
      (trimmedInput.toLowerCase() === 'counselor@ame.edu.lr' && password === '1234') ||
      (trimmedInput.toLowerCase() === 'admin' && password === '1234');

    if (isDemoCredential) {
      const demoProfile: CounselorProfile = {
        id: 'counselor-001',
        email: 'counselor@ame.edu.lr',
        display_name: 'Lead Peer Counselor',
        role: 'administrator',
        active: true,
        department: 'AMEU Student Safeguarding & Peer Wellbeing',
        specialty: 'Cyberbullying, Harassment & Student Support',
        phone: '+231 77 123 4567',
        available_today: true,
        created_at: '2026-09-01T08:00:00Z',
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoProfile));
      setUser(demoProfile);
      return { success: true };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Invalid credentials. For the active demo, enter 1234 for Username and 1234 for Password.',
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
