"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CalendarCheck, Layers, Star, Image, Users, LogOut, Menu, Bell, X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LogoMark from "@/components/ui/LogoMark";
import { getAccessToken } from "@/lib/api";
import {
  useAdminNotifications,
  type NewBookingPayload,
  type PendingReminderPayload,
} from "@/hooks/useAdminNotifications";

type AdminNotification =
  | { kind: "booking"; data: NewBookingPayload }
  | { kind: "reminder"; data: PendingReminderPayload };

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

const NAV = [
  { href: "/admin",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings",   icon: CalendarCheck   },
  { href: "/admin/services", label: "Services",   icon: Layers          },
  { href: "/admin/reviews",  label: "Reviews",    icon: Star            },
  { href: "/admin/gallery",  label: "Gallery",    icon: Image           },
  { href: "/admin/users",    label: "Users",      icon: Users           },
];

// ── Toast strip ─────────────────────────────────────────────────────────────
type Toast =
  | { id: number; kind: "booking"; data: NewBookingPayload }
  | { id: number; kind: "reminder"; data: PendingReminderPayload };

function BookingToast({ toast, onDismiss }: { toast: Toast & { kind: "booking" }; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="flex items-start gap-3 w-80 rounded-xl px-4 py-3 shadow-xl"
      style={{ background: "linear-gradient(135deg, #0F6B63 0%, #1D8A7A 40%, #D9C58B 80%, #FFF6DE 100%)", border: `1px solid ${TUSCAN}50` }}
    >
      <Bell size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#0F6B63" }} />
      <div className="flex-1 min-w-0">
        <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase" style={{ color: "#0F6B63" }}>
          New Booking
        </p>
        <p className="font-dm text-xs font-semibold mt-0.5 truncate" style={{ color: "#1A3A35" }}>
          {toast.data.customerName}
        </p>
        <p className="font-dm text-[11px] truncate" style={{ color: "rgba(15,107,99,0.65)" }}>
          {toast.data.serviceName} · {toast.data.eventDate}
        </p>
        <p className="font-cinzel text-[10px] tracking-widest mt-1" style={{ color: TUSCAN }}>
          #{toast.data.bookingNumber}
        </p>
      </div>
      <button onClick={onDismiss} style={{ color: "rgba(15,107,99,0.45)" }}>
        <X size={14} />
      </button>
    </div>
  );
}

function ReminderToast({ toast, onDismiss }: { toast: Toast & { kind: "reminder" }; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 10000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const total = toast.data.pendingCount + toast.data.inProgressCount;

  return (
    <div
      className="flex items-start gap-3 w-80 rounded-xl px-4 py-3 shadow-xl"
      style={{ background: "linear-gradient(135deg, #0F6B63 0%, #1D8A7A 40%, #D9C58B 80%, #FFF6DE 100%)", border: "1px solid rgba(220,80,80,0.4)" }}
    >
      <Bell size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#b91c1c" }} />
      <div className="flex-1 min-w-0">
        <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase" style={{ color: "#b91c1c" }}>
          Pending Reminder
        </p>
        <p className="font-dm text-xs font-semibold mt-0.5" style={{ color: "#1A3A35" }}>
          {total} booking{total !== 1 ? "s" : ""} need attention
        </p>
        <p className="font-dm text-[11px] mt-0.5" style={{ color: "rgba(15,107,99,0.65)" }}>
          {toast.data.pendingCount > 0 && `${toast.data.pendingCount} pending`}
          {toast.data.pendingCount > 0 && toast.data.inProgressCount > 0 && " · "}
          {toast.data.inProgressCount > 0 && `${toast.data.inProgressCount} in progress`}
        </p>
      </div>
      <button onClick={onDismiss} style={{ color: "rgba(15,107,99,0.45)" }}>
        <X size={14} />
      </button>
    </div>
  );
}

// ── Inner shell (hooks run unconditionally here) ──────────────────────────
function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const nextId = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPanel) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPanel]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    function handleAnyTouch() { setToasts([]); }
    document.addEventListener("mousedown", handleAnyTouch);
    document.addEventListener("touchstart", handleAnyTouch);
    return () => {
      document.removeEventListener("mousedown", handleAnyTouch);
      document.removeEventListener("touchstart", handleAnyTouch);
    };
  }, [toasts.length]);

  const onNewBooking = useCallback((data: NewBookingPayload) => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev, { id, kind: "booking" as const, data }]);
    setNotifications((prev) => [{ kind: "booking" as const, data }, ...prev].slice(0, 50));
    setUnread((n) => n + 1);
  }, []);

  const onPendingReminder = useCallback((data: PendingReminderPayload) => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev, { id, kind: "reminder" as const, data }]);
    setNotifications((prev) => [{ kind: "reminder" as const, data }, ...prev].slice(0, 50));
    setUnread((n) => n + 1);
  }, []);

  useAdminNotifications(getAccessToken(), onNewBooking, onPendingReminder);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F3EE" }}>

      {/* ── Toast stack (bottom-right) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) =>
          t.kind === "booking" ? (
            <BookingToast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ) : (
            <ReminderToast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          )
        )}
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
       style={{
  background:
    "linear-gradient(160deg, #0F6B63 0%, #1D8A7A 30%, #D9C58B 70%, #FFF6DE 100%)",
  borderRight: `1px solid ${TUSCAN}20`,
}}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: `${TUSCAN}15` }}>
          <LogoMark size={32} />
          <div>
            <p className="font-playfair font-bold text-sm" style={{ color: "#F2D6A1" }}>VED Admin</p>
            <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: `${TUSCAN}70` }}>
              Management
            </p>
          </div>
        </div>

        {/* Admin badge */}
        <div className="px-6 py-3 border-b" style={{ borderColor: `${TUSCAN}10` }}>
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-cinzel flex-shrink-0"
              style={{ background: TUSCAN, color: "#020608" }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-dm text-xs font-medium truncate" style={{ color: "#F2D6A1" }}>{user?.name}</p>
              <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase" style={{ color: TUSCAN }}>Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-dm text-sm transition-all duration-200"
                style={{
                  background: active ? `${TUSCAN}20` : "transparent",
                  color: active ? TUSCAN : "rgba(242,214,161,0.6)",
                  borderLeft: active ? `2px solid ${TUSCAN}` : "2px solid transparent",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: back to site + logout */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: `${TUSCAN}15` }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-dm text-sm transition-colors"
            style={{ color: "rgba(15,107,99,0.7)" }}
          >
            ← Back to Site
          </Link>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-dm text-sm transition-colors hover:bg-red-900/20"
            style={{ color: "#f87171" }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 lg:px-6 border-b"
          style={{ background: "rgba(247,243,238,0.95)", backdropFilter: "blur(12px)", borderColor: `${TUSCAN}20` }}
        >
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ border: `1px solid ${TUSCAN}30`, color: SADDLE }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
          <h1 className="font-cormorant text-xl font-bold italic tracking-wide flex-1" style={{ color: SADDLE }}>
            {NAV.find((n) => isActive(n.href))?.label ?? "Admin"}
          </h1>
          {/* Notification bell */}
          <div className="relative" ref={panelRef}>
            <button
              className="relative p-2 rounded-lg"
              style={{ border: `1px solid ${TUSCAN}20`, color: SADDLE }}
              onClick={() => { setShowPanel((v) => !v); setUnread(0); }}
              title="Notifications"
            >
              <Bell size={16} />
              {unread > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-cinzel text-[9px] font-bold"
                  style={{ background: TUSCAN, color: "#020608" }}
                >
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {showPanel && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl overflow-hidden z-50"
                style={{ background: "linear-gradient(160deg, #0F6B63 0%, #1D8A7A 35%, #D9C58B 70%, #FFF6DE 100%)", border: `1px solid ${TUSCAN}40` }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(15,107,99,0.25)" }}>
                  <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase" style={{ color: "#0F6B63" }}>
                    Notifications
                  </p>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center font-dm text-xs" style={{ color: "rgba(15,107,99,0.45)" }}>
                    No notifications yet
                  </p>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 border-b last:border-0"
                        style={{ borderColor: `${TUSCAN}10` }}
                      >
                        {n.kind === "booking" ? (
                          <div className="flex items-start gap-2">
                            <Bell size={12} className="mt-0.5 flex-shrink-0" style={{ color: "#0F6B63" }} />
                            <div className="min-w-0">
                              <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase mb-0.5" style={{ color: "#0F6B63" }}>
                                New Booking
                              </p>
                              <p className="font-dm text-xs font-semibold truncate" style={{ color: "#1A3A35" }}>
                                {n.data.customerName}
                              </p>
                              <p className="font-dm text-[11px] truncate" style={{ color: "rgba(15,107,99,0.65)" }}>
                                {n.data.serviceName} · {n.data.eventDate}
                              </p>
                              <p className="font-cinzel text-[10px] tracking-widest mt-0.5" style={{ color: TUSCAN }}>
                                #{n.data.bookingNumber}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <Bell size={12} className="mt-0.5 flex-shrink-0" style={{ color: "#b91c1c" }} />
                            <div className="min-w-0">
                              <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase mb-0.5" style={{ color: "#b91c1c" }}>
                                Pending Reminder
                              </p>
                              <p className="font-dm text-xs font-semibold" style={{ color: "#1A3A35" }}>
                                {n.data.pendingCount + n.data.inProgressCount} booking{n.data.pendingCount + n.data.inProgressCount !== 1 ? "s" : ""} need attention
                              </p>
                              <p className="font-dm text-[11px]" style={{ color: "rgba(15,107,99,0.65)" }}>
                                {n.data.pendingCount > 0 && `${n.data.pendingCount} pending`}
                                {n.data.pendingCount > 0 && n.data.inProgressCount > 0 && " · "}
                                {n.data.inProgressCount > 0 && `${n.data.inProgressCount} in progress`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

// ── Root layout — handles auth guard, then delegates to shell ─────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAdmin) router.replace("/");
  }, [isLoading, isAdmin, router]);

  if (isLoading || !isAdmin) return null;

  return <AdminShell>{children}</AdminShell>;
}
