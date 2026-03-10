'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { apiFetch, clearTokens, getTokens, refreshAccessToken } from './api';
import type { User, AuthResponse } from './types';
import { buildNutritionProfileFromUser, saveNutritionProfile } from './nutri-profile';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function storeTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const applyUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    const nutritionProfile = buildNutritionProfileFromUser(nextUser);
    if (nutritionProfile) {
      saveNutritionProfile(nutritionProfile);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { access, refresh } = getTokens();
      if (!access && !refresh) {
        applyUser(null);
        return;
      }
      if (!access && refresh) {
        const renewed = await refreshAccessToken();
        if (!renewed) {
          applyUser(null);
          return;
        }
      }
      const u = await apiFetch<User>('/user');
      applyUser(u);
    } catch {
      applyUser(null);
      clearTokens();
    }
  }, [applyUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const at = params.get('access_token');
    const rt = params.get('refresh_token');
    if (at && rt) {
      storeTokens(at, rt);
      window.history.replaceState({}, '', window.location.pathname);
    }
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'access_token' && event.key !== 'refresh_token') return;
      refreshUser().finally(() => setLoading(false));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    storeTokens(data.access_token, data.refresh_token);
    applyUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    storeTokens(data.access_token, data.refresh_token);
    applyUser(data.user);
  };

  const logout = () => {
    clearTokens();
    applyUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
