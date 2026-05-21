"use client";
import { useEffect, useState } from "react";
import { usersApi, type AuthUser } from "@/lib/api";
import { UsersSkeleton } from "../_components/Skeletons";
import { ShieldCheck, UserX, UserCheck } from "lucide-react";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  function load() {
    setLoading(true);
    usersApi.list().then(setUsers).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(user: AuthUser) {
    if (user.role === "admin") return;
    setSaving(user.id);
    await usersApi.update(user.id, { isActive: !user.isActive });
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isActive: !user.isActive } : u));
    setSaving(null);
  }

  async function promoteToAdmin(user: AuthUser) {
    if (!confirm(`Promote ${user.name} to admin?`)) return;
    setSaving(user.id);
    await usersApi.update(user.id, { role: "admin" });
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: "admin" } : u));
    setSaving(null);
  }

  const shown = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="border rounded-xl px-4 py-2.5 font-dm text-sm outline-none flex-1"
          style={{ borderColor: `${TUSCAN}30`, color: SADDLE }} />
        <span className="font-dm text-xs whitespace-nowrap" style={{ color: `${SADDLE}60` }}>
          {shown.length} users
        </span>
      </div>

      {loading ? (
        <UsersSkeleton />
      ) : shown.length === 0 ? (
        <p className="text-center py-16 font-dm text-sm" style={{ color: `${SADDLE}60` }}>No users found.</p>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${TUSCAN}15` }}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: `${TUSCAN}10` }}>
                {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-cinzel text-[11px] tracking-[0.25em] uppercase"
                    style={{ color: `${SADDLE}60` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: `${TUSCAN}08` }}>
              {shown.map((u) => (
                <tr key={u.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-cinzel flex-shrink-0"
                        style={{ background: u.role === "admin" ? TUSCAN : `${TUSCAN}20`, color: u.role === "admin" ? "#020608" : SADDLE }}>
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-dm text-sm font-medium" style={{ color: SADDLE }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-dm text-sm" style={{ color: `${SADDLE}80` }}>{u.email}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full font-cinzel text-[11px] tracking-[0.2em] uppercase"
                      style={{
                        background: u.role === "admin" ? `${TUSCAN}20` : `${SADDLE}10`,
                        color: u.role === "admin" ? SADDLE : `${SADDLE}80`,
                      }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full font-cinzel text-[11px] tracking-[0.2em] uppercase"
                      style={{
                        background: u.isActive ? "#D1FAE5" : "#FEE2E2",
                        color: u.isActive ? "#059669" : "#DC2626",
                      }}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-dm text-xs" style={{ color: `${SADDLE}50` }}>
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.role !== "admin" && (
                      <div className="flex gap-2">
                        <button onClick={() => toggleActive(u)} disabled={saving === u.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                          style={{ background: u.isActive ? "#FEE2E2" : "#D1FAE5" }}
                          title={u.isActive ? "Deactivate" : "Activate"}>
                          {u.isActive
                            ? <UserX size={13} style={{ color: "#DC2626" }} />
                            : <UserCheck size={13} style={{ color: "#059669" }} />}
                        </button>
                        <button onClick={() => promoteToAdmin(u)} disabled={saving === u.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                          style={{ background: `${TUSCAN}15` }}
                          title="Promote to Admin">
                          <ShieldCheck size={13} style={{ color: SADDLE }} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
