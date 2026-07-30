import React from "react";
import { Home, ClipboardList, ShieldCheck, Building2, LogOut } from "lucide-react";
import { C } from "../theme";

export default function Sidebar({ role, user, tab, setTab, tabs, onLogout }) {
  const roleMeta = {
    resident: { label: "Resident", icon: Home },
    warden: { label: "Warden", icon: ClipboardList },
    security: { label: "Security", icon: ShieldCheck },
  }[role];
  return (
    <div className="w-56 shrink-0 min-h-screen flex flex-col justify-between px-3 py-4" style={{ background: C.sidebar }}>
      <div>
        <div className="flex items-center gap-2 px-2 mb-6">
          <Building2 size={18} color="#fff" />
          <span className="text-white font-bold text-sm">Hostel Office</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-2 mb-4 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: C.accent }}>
            <roleMeta.icon size={13} color="#fff" />
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-bold truncate">{user}</div>
            <div className="text-[10px] font-semibold" style={{ color: C.sidebarSoft }}>{roleMeta.label}</div>
          </div>
        </div>
        <nav className="space-y-0.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: tab === t.id ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t.id ? "#fff" : C.sidebarSoft,
              }}
            >
              <t.icon size={15} />
              <span className="flex-1 text-left">{t.label}</span>
              {t.count != null && t.count > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: C.amber, color: "#fff" }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <button onClick={onLogout} className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-semibold" style={{ color: C.sidebarSoft }}>
        <LogOut size={15} /> Switch role
      </button>
    </div>
  );
}
