import { focusManager, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';

import {
  clearTokens,
  getProfile,
  login as apiLogin,
  register as apiRegister,
  storeTokens,
} from '../api/api';
import type { LoginRequest, RegisterRequest } from '../types/api';

interface SessionUser {
  username: string;
  email: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const logoutRef = useRef<(() => Promise<void>) | undefined>(undefined);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
        queryCache: new QueryCache({
          onError: (error: unknown) => {
            if (error instanceof Error && error.message === 'Session expired') {
              logoutRef.current?.();
            }
          },
        }),
      }),
  );

  const logout = useCallback(async () => {
    await clearTokens();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        const profile = await getProfile();
        setUser({ username: profile.username, email: profile.email });
      } catch {
        // Token missing, expired, or refresh failed — tokens already cleared by api.ts
      } finally {
        setIsLoading(false);
      }
    }
    bootstrap();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await apiLogin(data);
    await storeTokens(res.access, res.refresh);
    const profile = await getProfile();
    setUser({ username: profile.username, email: profile.email });
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await apiRegister(data);
    await storeTokens(res.access, res.refresh);
    setUser({ username: res.user.username, email: res.user.email });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
