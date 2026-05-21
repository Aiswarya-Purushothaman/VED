// Browser: use the same-origin /api proxy (Next.js rewrites to backend → no CORS).
// Server (SSR): go directly to the backend since there is no browser CORS restriction.
const API_BASE =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api")
    : "/api";

// ── Token helpers ──────────────────────────────────────────────────────────
export function getAccessToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("ved_access_token")
    : null;
}
export function getRefreshToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("ved_refresh_token")
    : null;
}
export function setTokens(access: string, refresh: string) {
  localStorage.setItem("ved_access_token", access);
  localStorage.setItem("ved_refresh_token", refresh);
}
export function clearTokens() {
  localStorage.removeItem("ved_access_token");
  localStorage.removeItem("ved_refresh_token");
}

// ── Single in-flight refresh promise (prevents thundering-herd on 401) ────
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

// ── Core fetch wrapper ─────────────────────────────────────────────────────
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getAccessToken();
  const method = (options.method ?? "GET").toUpperCase();
  const isReadOnly = method === "GET" || method === "HEAD";
  const headers: Record<string, string> = {
    ...(isReadOnly ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshTokens().finally(
        () => (refreshPromise = null)
      );
    }
    const refreshed = await refreshPromise;
    if (refreshed) return apiFetch<T>(path, options, false);

    // Refresh failed — notify AuthContext to clear state
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:logout"));
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      Array.isArray(body?.message)
        ? body.message[0]
        : body?.message ?? `Request failed: ${res.status}`;
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ── Domain types ───────────────────────────────────────────────────────────
export interface ServicePackage {
  id: string;
  planType: "basic" | "premium" | "luxury";
  name: string;
  description: string;
  items: string[];
  price: number | null;
}

export interface ServiceAddon {
  id: string;
  name: string;
}

// Lean type returned by GET /services (list) — no heavy relations
export interface ServiceSummary {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  shortDesc: string;
  image: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

// Full type returned by GET /services/:slug (detail page)
export interface Service extends ServiceSummary {
  longDesc: string;
  included: string[];
  packages: ServicePackage[];
  addons: ServiceAddon[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string;
  venue: string;
  requestedAddons: string[];
  specialNotes: string | null;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  quotedPrice: number | null;
  adminNotes: string | null;
  service: Service;
  package: ServicePackage | null;
  user: AuthUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  customerEmail: string | null;
  rating: number;
  reviewText: string;
  serviceSlug: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  category: string | null;
  alt: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
}

// ── Auth API convenience methods ───────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }, false),

  login: (data: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }, false),

  logout: () => apiFetch("/auth/logout", { method: "POST" }),

  me: () => apiFetch<AuthUser>("/auth/me"),
};

// ── Services write payload (packages/addons don't need id) ─────────────────
export interface ServicePayload {
  name?: string; slug?: string; emoji?: string; category?: string;
  shortDesc?: string; longDesc?: string; image?: string;
  included?: string[]; isActive?: boolean; sortOrder?: number;
  packages?: { planType: string; name: string; description: string; items: string[]; price?: number }[];
  addons?: string[];
}

// ── Upload API ─────────────────────────────────────────────────────────────
export const uploadApi = {
  image: async (file: File): Promise<{ url: string }> => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${typeof window === "undefined" ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api") : "/api"}/uploads/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Upload failed: ${res.status}`);
    }
    return res.json();
  },
};

// ── Services API ───────────────────────────────────────────────────────────
export const servicesApi = {
  list: (category?: string) =>
    apiFetch<ServiceSummary[]>(`/services${category ? `?category=${category}` : ""}`),
  get: (slug: string) => apiFetch<Service>(`/services/${slug}`),
  adminList: () => apiFetch<Service[]>("/services/admin/all"),
  create: (data: ServicePayload) =>
    apiFetch<Service>("/services/admin", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: ServicePayload) =>
    apiFetch<Service>(`/services/admin/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch(`/services/admin/${id}`, { method: "DELETE" }),
  updatePackagePrice: (packageId: string, price: number) =>
    apiFetch<ServicePackage>(`/services/admin/packages/${packageId}/price`, {
      method: "PATCH",
      body: JSON.stringify({ price }),
    }),
};

// ── Bookings API ───────────────────────────────────────────────────────────
export const bookingsApi = {
  create: (data: {
    serviceId: string;
    packageId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    eventDate: string;
    venue: string;
    requestedAddons?: string[];
    specialNotes?: string;
  }) => apiFetch<Booking>("/bookings", { method: "POST", body: JSON.stringify(data) }),
  myBookings: () => apiFetch<Booking[]>("/bookings/my"),
  track: (bookingNumber: string) => apiFetch<Booking>(`/bookings/track/${bookingNumber}`),
  adminList: (status?: string) =>
    apiFetch<Booking[]>(`/bookings/admin/all${status ? `?status=${status}` : ""}`),
  adminStats: () => apiFetch<BookingStats>("/bookings/admin/stats"),
  adminGet: (id: string) => apiFetch<Booking>(`/bookings/admin/${id}`),
  adminUpdate: (id: string, data: { status?: string; quotedPrice?: number; adminNotes?: string }) =>
    apiFetch<Booking>(`/bookings/admin/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ── Reviews API ────────────────────────────────────────────────────────────
export const reviewsApi = {
  list: () => apiFetch<Review[]>("/reviews"),
  create: (data: { customerName: string; customerEmail?: string; rating: number; reviewText: string; serviceSlug?: string }) =>
    apiFetch<Review>("/reviews", { method: "POST", body: JSON.stringify(data) }),
  adminList: () => apiFetch<Review[]>("/reviews/admin/all"),
  approve: (id: string) => apiFetch<Review>(`/reviews/admin/${id}/approve`, { method: "PATCH" }),
  delete: (id: string) => apiFetch(`/reviews/admin/${id}`, { method: "DELETE" }),
};

// ── Gallery API ────────────────────────────────────────────────────────────
export const galleryApi = {
  list: (category?: string) =>
    apiFetch<GalleryImage[]>(`/gallery${category ? `?category=${category}` : ""}`),
  adminList: () => apiFetch<GalleryImage[]>("/gallery/admin/all"),
  create: (data: { src: string; category?: string; alt?: string }) =>
    apiFetch<GalleryImage>("/gallery/admin", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<GalleryImage>) =>
    apiFetch<GalleryImage>(`/gallery/admin/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/gallery/admin/${id}`, { method: "DELETE" }),
};

// ── Users API (admin) ──────────────────────────────────────────────────────
export const usersApi = {
  list: () => apiFetch<AuthUser[]>("/users"),
  update: (id: string, data: { name?: string; role?: string; isActive?: boolean }) =>
    apiFetch<AuthUser>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deactivate: (id: string) => apiFetch<AuthUser>(`/users/${id}`, { method: "DELETE" }),
};
