import React, { useState } from "react";
import { C, seedIssues, seedVisitors, seedNotices, residents } from "./theme";
import RoleSelect from "./components/RoleSelect";
import ResidentView from "./components/ResidentView";
import WardenView from "./components/WardenView";
import SecurityView from "./components/SecurityView";

export default function App() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(residents[0]);
  const [issues, setIssues] = useState(seedIssues);
  const [visitors, setVisitors] = useState(seedVisitors);
  const [notices, setNotices] = useState(seedNotices);

  if (!role) return <RoleSelect onPick={(r) => setRole(r)} />;

  return (
    <div style={{ background: C.bg, fontFamily: "ui-sans-serif, system-ui, sans-serif" }} className="min-h-screen">
      {role === "resident" && (
        <ResidentView
          user={user}
          setUser={() => setRole(null)}
          issues={issues} setIssues={setIssues}
          visitors={visitors} setVisitors={setVisitors}
          notices={notices.filter(n => n.audience !== "security")}
        />
      )}
      {role === "warden" && (
        <WardenView onLogout={() => setRole(null)} issues={issues} setIssues={setIssues} visitors={visitors} setVisitors={setVisitors} notices={notices} setNotices={setNotices} />
      )}
      {role === "security" && (
        <SecurityView onLogout={() => setRole(null)} visitors={visitors} setVisitors={setVisitors} notices={notices} />
      )}
    </div>
  );
}
