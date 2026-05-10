import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [token, setToken] = useState(null);
  const [billingStatus, setBillingStatus] = useState(null);

  useEffect(() => {
    // 1. Resolve initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        localStorage.setItem('token', session.access_token);
        // Fetch billing status
        api.get('/billing/status').then(({ data }) => {
          setUser({ ...session.user, ...data });
          setBillingStatus(data);
        }).catch(err => {
          setUser(session.user);
        });
      } else {
        setUser(null); // confirmed not logged in
        setBillingStatus(null);
      }
    });

    // 2. Listen for all auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth Context Event]:', event, session?.user?.email);
      
      if (session) {
        setToken(session.access_token);
        localStorage.setItem('token', session.access_token);
        api.get('/billing/status').then(({ data }) => {
          setUser({ ...session.user, ...data });
          setBillingStatus(data);
        }).catch(err => {
          setUser(session.user);
        });
      }

      if (event === 'TOKEN_REFRESHED' && session) {
        setToken(session.access_token);
        localStorage.setItem('token', session.access_token);
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        setBillingStatus(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email/Password Login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // Email/Password Signup
  const signup = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    return data;
  };

  // Google OAuth Login
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' }
      }
    });
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    token,
    loading: user === undefined,
    isAuthenticated: !!user,
    login,
    signup,
    loginWithGoogle,
    signInWithGoogle: loginWithGoogle, // Alias
    logout,
    signOut: logout // Alias
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
