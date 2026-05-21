"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  authApi,
  setTokens,
  clearTokens,
  getAccessToken,
  type AuthUser,
} from "@/lib/api";

// ── State shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ user: AuthUser }>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Cookie helpers (Edge middleware signal) ────────────────────────────────
function setAuthCookie(role: string) {
  const age = 60 * 60 * 24 * 7;
  document.cookie = `ved_auth_hint=1; path=/; max-age=${age}; SameSite=Lax`;
  document.cookie = `ved_role_hint=${role}; path=/; max-age=${age}; SameSite=Lax`;
}
function clearAuthCookie() {
  document.cookie = "ved_auth_hint=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "ved_role_hint=; path=/; max-age=0; SameSite=Lax";
}

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate: validate stored access token on mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then((u) => {
        setUser(u);
        setAuthCookie(u.role);
      })
      .catch(() => {
        clearTokens();
        clearAuthCookie();
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Listen for forced logout (token refresh failure from apiFetch)
  useEffect(() => {
    const handle = () => {
      setUser(null);
      clearTokens();
      clearAuthCookie();
    };
    window.addEventListener("auth:logout", handle);
    return () => window.removeEventListener("auth:logout", handle);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, refreshToken, user: u } = await authApi.login({
      email,
      password,
    });
    setTokens(accessToken, refreshToken);
    setUser(u);
    setAuthCookie(u.role);
    return { user: u };
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { accessToken, refreshToken, user: u } = await authApi.register({
        name,
        email,
        password,
      });
      setTokens(accessToken, refreshToken);
      setUser(u);
      setAuthCookie(u.role);
    },
    []
  );

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    clearTokens();
    clearAuthCookie();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn: !!user, isAdmin: user?.role === "admin", login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
