import React, { useState } from "react";
import { Home, Wrench, UserPlus, Bell, LayoutGrid, Plus } from "lucide-react";
import { C, ISSUE_STAGES, ISSUE_LABELS, VISITOR_STAGES, VISITOR_LABELS, inputStyle } from "../theme";
import { Row, Stepper, SectionLabel, PrivacyNote, EmptyState, StatCard, ActionBtn, Field, PageHeader, NoticesFeed, QRPass } from "./Atoms";
import Sidebar from "./Sidebar";

export default function ResidentView({ user, setUser, issues, setIssues, visitors, setVisitors, notices }) {
  const [tab, setTab] = useState("overview");
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showVisitorForm, setShowVisitorForm] = useState(false);

  const myIssues = issues.filter((i) => i.resident === user);
  const myVisitors = visitors.filter((v) => v.host === user);
  const openIssues = myIssues.filter(i => i.status !== "resolved").length;

  function addIssue(data) {
    setIssues([{ id: "I-" + Math.floor(100 + Math.random() * 900), resident: user, room: data.room, category: data.category, title: data.title, desc: data.desc, status: "reported", priority: data.priority, created: "Just now" }, ...issues]);
    setShowIssueForm(false);
  }
  function addVisitor(data) {
    setVisitors([{ id: "V-" + Math.floor(100 + Math.random() * 900), visitor: data.visitor, relation: data.relation, host: user, room: data.room, date: data.date, slot: data.slot, purpose: data.purpose, status: "requested", checkIn: null, checkOut: null }, ...visitors]);
    setShowVisitorForm(false);
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "issues", label: "My issues", icon: Wrench, count: openIssues },
    { id: "visitors", label: "My visitors", icon: UserPlus },
    { id: "notices", label: "Notices", icon: Bell, count: notices.filter(n => n.urgent).length },
  ];

  return (
    <div className="flex-1 flex min-h-screen">
      <Sidebar role="resident" user={user} tab={tab} setTab={setTab} tabs={tabs} onLogout={() => setUser(null)} />
      <div className="flex-1 px-8 py-6 max-w-4xl">
        <PrivacyNote text="You can only see your own issues and visitor requests — never other residents' data." />

        {tab === "overview" && (
          <div>
            <PageHeader title={`Welcome, ${user.split(" ")[0]}`} subtitle="Here's what's happening with your room." />
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <StatCard label="Open issues" value={openIssues} icon={Wrench} />
              <StatCard label="Visitors registered" value={myVisitors.length} icon={UserPlus} />
              <StatCard label="Notices" value={notices.length} icon={Bell} />
            </div>
            <SectionLabel icon={Bell}>Latest notices</SectionLabel>
            <NoticesFeed notices={notices.slice(0, 2)} />
          </div>
        )}

        {tab === "issues" && (
          <div>
            <PageHeader title="My issues" />
            <SectionLabel icon={Wrench} action={
              <button onClick={() => setShowIssueForm(!showIssueForm)} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md text-white" style={{ background: C.accent }}>
                <Plus size={13} /> Report issue
              </button>
            }>Reported issues</SectionLabel>
            {showIssueForm && <IssueForm onSubmit={addIssue} onCancel={() => setShowIssueForm(false)} />}
            <div className="space-y-2 mt-3">
              {myIssues.length === 0 && <EmptyState text="No issues reported yet." />}
              {myIssues.map((i) => (
                <Row key={i.id}>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono mb-0.5" style={{ color: C.inkSoft }}>{i.id} · {i.room} · {i.category}</div>
                    <div className="font-bold text-sm" style={{ color: C.ink }}>{i.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{i.desc}</div>
                  </div>
                  <Stepper stages={ISSUE_STAGES} labels={ISSUE_LABELS} current={i.status} />
                </Row>
              ))}
            </div>
          </div>
        )}

        {tab === "visitors" && (
          <div>
            <PageHeader title="My visitors" />
            <SectionLabel icon={UserPlus} action={
              <button onClick={() => setShowVisitorForm(!showVisitorForm)} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md text-white" style={{ background: C.accent }}>
                <Plus size={13} /> Register visitor
              </button>
            }>Registered visitors</SectionLabel>
            {showVisitorForm && <VisitorForm onSubmit={addVisitor} onCancel={() => setShowVisitorForm(false)} />}
            <div className="space-y-2 mt-3">
              {myVisitors.length === 0 && <EmptyState text="No visitors registered." />}
              {myVisitors.map((v) => (
                <VisitorRowWithPass key={v.id} v={v} />
              ))}
            </div>
          </div>
        )}

        {tab === "notices" && (<div><PageHeader title="Notices" /><NoticesFeed notices={notices} /></div>)}
      </div>
    </div>
  );
}

function VisitorRowWithPass({ v }) {
  const [open, setOpen] = useState(false);
  const canShowPass = v.status === "approved" || v.status === "checked-in";
  return (
    <div className="rounded-lg border" style={{ borderColor: C.border, background: C.surface }}>
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        <div className="min-w-0">
          <div className="text-[11px] font-mono mb-0.5" style={{ color: C.inkSoft }}>{v.id} · {v.date} · {v.slot}</div>
          <div className="font-bold text-sm" style={{ color: C.ink }}>{v.visitor} <span className="font-normal text-xs" style={{ color: C.inkSoft }}>({v.relation})</span></div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Stepper stages={VISITOR_STAGES} labels={VISITOR_LABELS} current={v.status} deniedLabel={v.status === "denied" ? "Denied" : null} />
          {canShowPass && <ActionBtn onClick={() => setOpen(!open)} label={open ? "Hide pass" : "Show gate pass"} primary />}
        </div>
      </div>
      {open && canShowPass && (
        <div className="px-4 pb-4 flex items-center gap-4 border-t pt-4" style={{ borderColor: C.border }}>
          <QRPass seed={v.id} />
          <div className="text-xs" style={{ color: C.inkSoft }}>
            Show this to security at the gate.<br />They'll scan it to check {v.visitor.split(" ")[0]} in.
          </div>
        </div>
      )}
    </div>
  );
}

function IssueForm({ onSubmit, onCancel }) {
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const valid = room && title;
  return (
    <div className="rounded-lg border p-4 mb-3" style={{ borderColor: C.border, background: C.surface }}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <Field label="Room number"><input value={room} onChange={e => setRoom(e.target.value)} placeholder="B-204" style={inputStyle} /></Field>
        <Field label="Category">
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option>Electrical</option><option>Plumbing</option><option>Furniture</option><option>Cleanliness</option><option>Other</option>
          </select>
        </Field>
      </div>
      <Field label="Title"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Short summary" style={inputStyle} /></Field>
      <div className="mt-3">
        <Field label="Description"><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="What's wrong, since when..." style={inputStyle} /></Field>
      </div>
      <div className="mt-3">
        <Field label="Priority">
          <select value={priority} onChange={e => setPriority(e.target.value)} style={inputStyle}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </Field>
      </div>
      <div className="flex gap-2 mt-4">
        <button disabled={!valid} onClick={() => onSubmit({ room, category, title, desc, priority })} className="text-xs font-bold px-4 py-2 rounded-md text-white disabled:opacity-40" style={{ background: C.accent }}>Submit issue</button>
        <button onClick={onCancel} className="text-xs font-bold px-4 py-2 rounded-md" style={{ color: C.inkSoft }}>Cancel</button>
      </div>
    </div>
  );
}

function VisitorForm({ onSubmit, onCancel }) {
  const [visitor, setVisitor] = useState("");
  const [relation, setRelation] = useState("");
  const [room, setRoom] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [purpose, setPurpose] = useState("");
  const valid = visitor && room && date && slot;
  return (
    <div className="rounded-lg border p-4 mb-3" style={{ borderColor: C.border, background: C.surface }}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <Field label="Visitor name"><input value={visitor} onChange={e => setVisitor(e.target.value)} placeholder="Full name" style={inputStyle} /></Field>
        <Field label="Relation"><input value={relation} onChange={e => setRelation(e.target.value)} placeholder="Father, friend..." style={inputStyle} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <Field label="Your room"><input value={room} onChange={e => setRoom(e.target.value)} placeholder="B-204" style={inputStyle} /></Field>
        <Field label="Visit date"><input value={date} onChange={e => setDate(e.target.value)} placeholder="Jul 31" style={inputStyle} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <Field label="Time slot"><input value={slot} onChange={e => setSlot(e.target.value)} placeholder="4:00–6:00 PM" style={inputStyle} /></Field>
        <Field label="Purpose"><input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Family visit" style={inputStyle} /></Field>
      </div>
      <div className="flex gap-2 mt-2">
        <button disabled={!valid} onClick={() => onSubmit({ visitor, relation, room, date, slot, purpose })} className="text-xs font-bold px-4 py-2 rounded-md text-white disabled:opacity-40" style={{ background: C.accent }}>Send for approval</button>
        <button onClick={onCancel} className="text-xs font-bold px-4 py-2 rounded-md" style={{ color: C.inkSoft }}>Cancel</button>
      </div>
    </div>
  );
}
