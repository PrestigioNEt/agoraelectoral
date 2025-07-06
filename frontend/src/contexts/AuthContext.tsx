import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const { user, profile } = await response.json();
            setUser(user);
            setProfile(profile);
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const { user, profile } = await response.json();
        setUser(user);
        setProfile(profile);
      }
    } catch (error) {
      console.error('Failed to fetch user after login', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};