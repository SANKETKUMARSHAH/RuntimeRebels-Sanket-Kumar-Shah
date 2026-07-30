import React, { useState } from "react";
import { Wrench, UserPlus, Bell, AlertTriangle, LayoutGrid, ClipboardList } from "lucide-react";
import { C, ISSUE_STAGES, ISSUE_LABELS, VISITOR_STAGES, VISITOR_LABELS, inputStyle } from "../theme";
import { Row, Stepper, SectionLabel, PrivacyNote, EmptyState, StatCard, ActionBtn, Field, PageHeader, NoticesFeed } from "./Atoms";
import Sidebar from "./Sidebar";

export default function WardenView({ onLogout, issues, setIssues, visitors, setVisitors, notices, setNotices }) {
  const [tab, setTab] = useState("overview");
  const pendingIssues = issues.filter(i => i.status !== "resolved").length;
  const pendingVisitors = visitors.filter(v => v.status === "requested").length;

  function updateIssue(id, status) { setIssues(issues.map(i => i.id === id ? { ...i, status } : i)); }
  function updateVisitor(id, status) { setVisitors(visitors.map(v => v.id === id ? { ...v, status } : v)); }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "issues", label: "Issues", icon: Wrench, count: pendingIssues },
    { id: "visitors", label: "Visitor approvals", icon: UserPlus, count: pendingVisitors },
    { id: "notices", label: "Notices", icon: Bell },
  ];

  return (
    <div className="flex-1 flex min-h-screen">
      <Sidebar role="warden" user="Warden Office" tab={tab} setTab={setTab} tabs={tabs} onLogout={onLogout} />
      <div className="flex-1 px-8 py-6 max-w-5xl">
        <PrivacyNote text="Full oversight: you see all issues and visitor requests to coordinate resolution — residents only see their own." />

        {tab === "overview" && (
          <div>
            <PageHeader title="Overview" subtitle="Everything that needs your attention today." />
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <StatCard label="Open issues" value={pendingIssues} icon={Wrench} />
              <StatCard label="Pending visitor requests" value={pendingVisitors} icon={UserPlus} />
              <StatCard label="Active notices" value={notices.length} icon={Bell} />
            </div>
            <SectionLabel icon={AlertTriangle}>Needs attention</SectionLabel>
            <div className="space-y-2">
              {issues.filter(i => i.status !== "resolved").map(i => (
                <Row key={i.id}>
                  <div className="text-xs" style={{ color: C.ink }}><b>{i.id}</b> — {i.title} · {i.room} ({i.resident})</div>
                  <Stepper stages={ISSUE_STAGES} labels={ISSUE_LABELS} current={i.status} />
                </Row>
              ))}
              {visitors.filter(v => v.status === "requested").map(v => (
                <Row key={v.id}>
                  <div className="text-xs" style={{ color: C.ink }}><b>{v.id}</b> — {v.visitor} visiting {v.host} · {v.date} {v.slot}</div>
                  <Stepper stages={VISITOR_STAGES} labels={VISITOR_LABELS} current={v.status} />
                </Row>
              ))}
              {pendingIssues === 0 && pendingVisitors === 0 && <EmptyState text="Nothing pending. Good shape." />}
            </div>
          </div>
        )}

        {tab === "issues" && (
          <div>
            <PageHeader title="All reported issues" />
            <div className="space-y-2">
              {issues.map(i => (
                <Row key={i.id}>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono mb-0.5" style={{ color: C.inkSoft }}>{i.id} · {i.room} · {i.resident} · {i.category}</div>
                    <div className="font-bold text-sm" style={{ color: C.ink }}>{i.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{i.desc}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Stepper stages={ISSUE_STAGES} labels={ISSUE_LABELS} current={i.status} />
                    {i.status !== "resolved" && (
                      <div className="flex gap-1">
                        {i.status === "reported" && <ActionBtn onClick={() => updateIssue(i.id, "in-progress")} label="Start" />}
                        <ActionBtn onClick={() => updateIssue(i.id, "resolved")} label="Resolve" primary />
                      </div>
                    )}
                  </div>
                </Row>
              ))}
            </div>
          </div>
        )}

        {tab === "visitors" && (
          <div>
            <PageHeader title="Visitor requests" />
            <div className="space-y-2">
              {visitors.map(v => (
                <Row key={v.id}>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono mb-0.5" style={{ color: C.inkSoft }}>{v.id} · {v.date} · {v.slot}</div>
                    <div className="font-bold text-sm" style={{ color: C.ink }}>{v.visitor} <span className="font-normal text-xs" style={{ color: C.inkSoft }}>({v.relation}) → {v.host}, {v.room}</span></div>
                    <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{v.purpose}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Stepper stages={VISITOR_STAGES} labels={VISITOR_LABELS} current={v.status} deniedLabel={v.status === "denied" ? "Denied" : null} />
                    {v.status === "requested" && (
                      <div className="flex gap-1">
                        <ActionBtn onClick={() => updateVisitor(v.id, "approved")} label="Approve" primary />
                        <ActionBtn onClick={() => updateVisitor(v.id, "denied")} label="Deny" danger />
                      </div>
                    )}
                  </div>
                </Row>
              ))}
            </div>
          </div>
        )}

        {tab === "notices" && <PostNotice notices={notices} setNotices={setNotices} />}
      </div>
    </div>
  );
}

function PostNotice({ notices, setNotices }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [urgent, setUrgent] = useState(false);
  function post() {
    if (!title || !body) return;
    setNotices([{ id: "N-" + Math.floor(Math.random() * 900), title, body, audience, urgent, by: "Warden Office", when: "Just now" }, ...notices]);
    setTitle(""); setBody(""); setUrgent(false);
  }
  return (
    <div>
      <PageHeader title="Notices" />
      <SectionLabel icon={Bell}>Post a notice</SectionLabel>
      <div className="rounded-lg border p-4 mb-6" style={{ borderColor: C.border, background: C.surface }}>
        <Field label="Title"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Water supply maintenance" style={inputStyle} /></Field>
        <div className="mt-3"><Field label="Message"><textarea rows={3} value={body} onChange={e => setBody(e.target.value)} style={inputStyle} /></Field></div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <Field label="Audience">
            <select value={audience} onChange={e => setAudience(e.target.value)} style={inputStyle}>
              <option value="all">Everyone</option>
              <option value="residents">Residents only</option>
              <option value="security">Security only</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 mt-5 text-xs font-semibold" style={{ color: C.ink }}>
            <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} /> Mark as urgent
          </label>
        </div>
        <button onClick={post} className="mt-4 text-xs font-bold px-4 py-2 rounded-md text-white" style={{ background: C.accent }}>Post notice</button>
      </div>
      <SectionLabel icon={ClipboardList}>Recent notices</SectionLabel>
      <NoticesFeed notices={notices} />
    </div>
  );
}
