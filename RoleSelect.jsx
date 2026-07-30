import React from "react";
import { Home, ClipboardList, ShieldCheck, Building2, ChevronRight } from "lucide-react";
import { C } from "../theme";

export default function RoleSelect({ onPick }) {
  const roles = [
    { id: "resident", label: "Resident", icon: Home, desc: "Report issues, invite visitors, view notices" },
    { id: "warden", label: "Warden", icon: ClipboardList, desc: "Review requests, approve visitors, post notices" },
    { id: "security", label: "Security", icon: ShieldCheck, desc: "Check in approved visitors, flag overdue exits" },
  ];
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.bg }}>
      <div className="max-w-3xl w-full">
        <div className="flex items-center gap-2 justify-center mb-2">
          <Building2 size={20} style={{ color: C.accent }} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: C.inkSoft }}>Hostel Office</span>
        </div>
        <h1 className="text-3xl font-black text-center mb-2" style={{ color: C.ink }}>
          Issue &amp; Visitor Workflow
        </h1>
        <p className="text-center text-sm mb-10" style={{ color: C.inkSoft }}>
          Pick a role to sign in. Each role sees only what it needs.
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => onPick(r.id)}
              className="text-left rounded-xl p-5 border transition-shadow hover:shadow-md"
              style={{ background: C.surface, borderColor: C.border }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: C.accentSoft }}>
                <r.icon size={18} style={{ color: C.accent }} />
              </div>
              <div className="font-bold text-base mb-1" style={{ color: C.ink }}>{r.label}</div>
              <div className="text-xs leading-relaxed" style={{ color: C.inkSoft }}>{r.desc}</div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold" style={{ color: C.accent }}>
                Sign in <ChevronRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
