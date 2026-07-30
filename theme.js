/* ---------------------------------------------------------------
   TOKENS — clean minimal dashboard
   neutral surface + one confident accent (deep teal), used sparingly
---------------------------------------------------------------- */
export const C = {
  ink: "#1F2430",
  inkSoft: "#6B7280",
  bg: "#F7F7F5",
  surface: "#FFFFFF",
  border: "#E7E7E3",
  sidebar: "#1B1F27",
  sidebarSoft: "#9CA3AF",
  accent: "#2F6F5E",
  accentSoft: "#E4F0EC",
  amber: "#B8842E",
  amberSoft: "#F6EBD9",
  red: "#B0402F",
  redSoft: "#F5DEDA",
};

export const seedIssues = [
  { id: "I-104", resident: "Aman Verma", room: "B-204", category: "Electrical", title: "Fan not working", desc: "Ceiling fan stopped since last night, room getting very hot.", status: "reported", priority: "high", created: "Jul 29, 9:12 AM" },
  { id: "I-103", resident: "Riya Sen", room: "A-118", category: "Plumbing", title: "Leaking tap", desc: "Washbasin tap leaking continuously.", status: "in-progress", priority: "medium", created: "Jul 28, 6:40 PM" },
  { id: "I-102", resident: "Aman Verma", room: "B-204", category: "Furniture", title: "Broken chair", desc: "Study chair leg is broken.", status: "resolved", priority: "low", created: "Jul 25, 11:02 AM" },
];

export const seedVisitors = [
  { id: "V-221", visitor: "Rakesh Verma", relation: "Father", host: "Aman Verma", room: "B-204", date: "Jul 30", slot: "4:00–6:00 PM", purpose: "Family visit", status: "requested", checkIn: null, checkOut: null },
  { id: "V-220", visitor: "Priya Kapoor", relation: "Friend", host: "Riya Sen", room: "A-118", date: "Jul 30", slot: "2:00–4:00 PM", purpose: "Project discussion", status: "approved", checkIn: null, checkOut: null },
  { id: "V-219", visitor: "Sunil Mehta", relation: "Uncle", host: "Karan Joshi", room: "C-310", date: "Jul 29", slot: "5:00–7:00 PM", purpose: "Family visit", status: "checked-out", checkIn: "5:10 PM", checkOut: "6:45 PM" },
];

export const seedNotices = [
  { id: "N-12", title: "Water supply maintenance", body: "Water will be shut off on 2nd floor from 11 AM–1 PM tomorrow for tank cleaning.", audience: "residents", urgent: true, by: "Warden Office", when: "Jul 29" },
  { id: "N-11", title: "Visitor hours reminder", body: "Visitor entry is only permitted between 10 AM and 7 PM on weekdays.", audience: "all", urgent: false, by: "Warden Office", when: "Jul 27" },
];

export const residents = ["Aman Verma", "Riya Sen", "Karan Joshi"];
export const ISSUE_STAGES = ["reported", "in-progress", "resolved"];
export const ISSUE_LABELS = ["Reported", "In progress", "Resolved"];
export const VISITOR_STAGES = ["requested", "approved", "checked-in", "checked-out"];
export const VISITOR_LABELS = ["Requested", "Approved", "Checked in", "Checked out"];

export const inputStyle = { width: "100%", border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 10px", fontSize: 13, color: C.ink, background: "#fff" };
