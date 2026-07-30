import React, { useState } from "react";
import { UserPlus, ShieldCheck, ClipboardList, Bell, LayoutGrid } from "lucide-react";
import { C, VISITOR_STAGES, VISITOR_LABELS } from "../theme";
import { Row, Stepper, SectionLabel, PrivacyNote, EmptyState, StatCard, ActionBtn, PageHeader, NoticesFeed } from "./Atoms";
import Sidebar from "./Sidebar";

export default function SecurityView({ onLogout, visitors, setVisitors, notices }) {
  const [tab, setTab] = useState("overview");
  const gate = visitors.filter(v => ["approved", "checked-in"].includes(v.status));
  const history = visitors.filter(v => v.status === "checked-out");
  const waiting = gate.filter(v => v.status === "approved").length;
  const inHostel = gate.filter(v => v.status === "checked-in").length;

  function checkIn(id) { setVisitors(visitors.map(v => v.id === id ? { ...v, status: "checked-in", checkIn: nowTime() } : v)); }
  function checkOut(id) { setVisitors(visitors.map(v => v.id === id ? { ...v, status: "checked-out", checkOut: nowTime() } : v)); }
  function nowTime() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "gate", label: "Gate register", icon: ShieldCheck, count: waiting },
    { id: "history", label: "History", icon: ClipboardList },
    { id: "notices", label: "Notices", icon: Bell },
  ];

  return (
    <div className="flex-1 flex min-h-screen">
      <Sidebar role="security" user="Gate Security" tab={tab} setTab={setTab} tabs={tabs} onLogout={onLogout} />
      <div className="flex-1 px-8 py-6 max-w-4xl">
        <PrivacyNote text="You only see approved visitor gate-passes — resident room issues and complaints are not visible to security." />

        {tab === "overview" && (
          <div>
            <PageHeader title="Gate overview" />
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <StatCard label="Waiting to check in" value={waiting} icon={UserPlus} />
              <StatCard label="Currently inside" value={inHostel} icon={ShieldCheck} />
              <StatCard label="Completed today" value={history.length} icon={ClipboardList} />
            </div>
            <SectionLabel icon={ShieldCheck}>Next up at the gate</SectionLabel>
            <div className="space-y-2">
              {gate.length === 0 && <EmptyState text="No approved visitors waiting." />}
              {gate.map(v => (
                <Row key={v.id}>
                  <div className="text-xs" style={{ color: C.ink }}><b>{v.visitor}</b> → {v.host}, {v.room} · {v.slot}</div>
                  <Stepper stages={VISITOR_STAGES} labels={VISITOR_LABELS} current={v.status} />
                </Row>
              ))}
            </div>
          </div>
        )}

        {tab === "gate" && (
          <div>
            <PageHeader title="Gate register" subtitle="Today's approved visitors." />
            <div className="space-y-2">
              {gate.length === 0 && <EmptyState text="No approved visitors waiting at the gate right now." />}
              {gate.map(v => (
                <SecurityGateRow key={v.id} v={v} onCheckIn={() => checkIn(v.id)} onCheckOut={() => checkOut(v.id)} />
              ))}
            </div>
          </div>
        )}

        {tab === "history" && (
          <div>
            <PageHeader title="Completed visits" />
            <div className="space-y-2">
              {history.map(v => (
                <Row key={v.id}>
                  <div className="text-xs" style={{ color: C.ink }}><b>{v.visitor}</b> → {v.host}, {v.room} · {v.date}</div>
                  <div className="text-xs" style={{ color: C.inkSoft }}>In {v.checkIn} · Out {v.checkOut}</div>
                </Row>
              ))}
            </div>
          </div>
        )}

        {tab === "notices" && (<div><PageHeader title="Notices" /><NoticesFeed notices={notices.filter(n => n.audience !== "residents")} /></div>)}
      </div>
    </div>
  );
}

function SecurityGateRow({ v, onCheckIn, onCheckOut }) {
  const [scanning, setScanning] = useState(false);
  function scanThenCheckIn() {
    setScanning(true);
    setTimeout(() => { setScanning(false); onCheckIn(); }, 500);
  }
  return (
    <div className="rounded-lg border" style={{ borderColor: C.border, background: C.surface }}>
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        <div className="min-w-0">
          <div className="text-[11px] font-mono mb-0.5" style={{ color: C.inkSoft }}>{v.id} · {v.date} · {v.slot}</div>
          <div className="font-bold text-sm" style={{ color: C.ink }}>{v.visitor} <span className="font-normal text-xs" style={{ color: C.inkSoft }}>({v.relation})</span></div>
          <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>Visiting {v.host} · Room {v.room}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Stepper stages={VISITOR_STAGES} labels={VISITOR_LABELS} current={v.status} />
          {v.status === "approved" && (
            <ActionBtn onClick={scanThenCheckIn} label={scanning ? "Scanning..." : "Scan QR to check in"} primary />
          )}
          {v.status === "checked-in" && <ActionBtn onClick={onCheckOut} label="Check out" danger />}
        </div>
      </div>
    </div>
  );
}
