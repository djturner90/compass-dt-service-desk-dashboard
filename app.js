"use strict";

const priorities = [
  { key: "P1", label: "Critical", count: 3, within: 2, risk: 1, breached: 0, oldest: "1h 12m", color: "#f14d58" },
  { key: "P2", label: "High", count: 27, within: 22, risk: 4, breached: 1, oldest: "6h 40m", color: "#f37742" },
  { key: "P3", label: "Standard", count: 118, within: 103, risk: 11, breached: 4, oldest: "2d 3h", color: "#3994f2" },
  { key: "P4", label: "Low", count: 264, within: 251, risk: 9, breached: 4, oldest: "5d 2h", color: "#8198b4" }
];

const ageBuckets = [
  { label: "< 1h", value: 96 }, { label: "1–4h", value: 118 }, { label: "4–8h", value: 64 },
  { label: "8–24h", value: 58 }, { label: "1–3d", value: 44 }, { label: "3–7d", value: 22 }, { label: "> 7d", value: 10 }
];

const arrivalBuckets = [
  { time: "08:41", Portal: 5, Teams: 2, Phone: 1, Email: 1 },
  { time: "08:46", Portal: 4, Teams: 1, Phone: 2, Email: 1 },
  { time: "08:51", Portal: 5, Teams: 1, Phone: 1, Email: 1 },
  { time: "08:56", Portal: 6, Teams: 2, Phone: 3, Email: 2 },
  { time: "09:01", Portal: 6, Teams: 4, Phone: 2, Email: 1 },
  { time: "09:06", Portal: 8, Teams: 5, Phone: 1, Email: 2 },
  { time: "09:11", Portal: 8, Teams: 3, Phone: 2, Email: 0 },
  { time: "09:16", Portal: 8, Teams: 5, Phone: 1, Email: 1 },
  { time: "09:21", Portal: 8, Teams: 3, Phone: 3, Email: 0 },
  { time: "09:26", Portal: 8, Teams: 5, Phone: 2, Email: 1 },
  { time: "09:31", Portal: 5, Teams: 4, Phone: 1, Email: 1 },
  { time: "09:36", Portal: 6, Teams: 2, Phone: 2, Email: 0 }
];

const resolverGroups = [
  { name: "End user computing", count: 121, oldest: "1d 8h" },
  { name: "Network", count: 64, oldest: "2d 3h" },
  { name: "Campus apps", count: 58, oldest: "1d 2h" },
  { name: "Applications", count: 47, oldest: "3d 1h" },
  { name: "IT procurement", count: 39, oldest: "5d 2h" },
  { name: "Information security", count: 2, oldest: "21m" }
];

const deviceEstate = {
  pos: { label: "POS", fullLabel: "POS terminals", total: 842, healthy: 816, offline: 14, slow: 12 },
  kiosk: { label: "Kiosks", fullLabel: "Self-service kiosks", total: 466, healthy: 450, offline: 5, slow: 11 },
  kitchen: { label: "Kitchen", fullLabel: "Kitchen management", total: 534, healthy: 520, offline: 4, slow: 10 }
};

const estateSites = [
  { code: "0077", city: "London", region: "South East", total: 24, offline: 3, oldest: "18m" },
  { code: "0644", city: "Dublin", region: "Ireland", total: 18, offline: 2, oldest: "16m" },
  { code: "0512", city: "Birmingham", region: "Midlands", total: 21, offline: 2, oldest: "14m" },
  { code: "0310", city: "Manchester", region: "North West", total: 28, offline: 2, oldest: "13m" },
  { code: "0870", city: "Edinburgh", region: "Scotland", total: 16, offline: 2, oldest: "12m" },
  { code: "0224", city: "Leeds", region: "North East", total: 19, offline: 1, oldest: "11m" },
  { code: "1021", city: "Bristol", region: "South West", total: 15, offline: 1, oldest: "10m" },
  { code: "0455", city: "Glasgow", region: "Scotland", total: 22, offline: 1, oldest: "9m" },
  { code: "0118", city: "Cardiff", region: "Wales", total: 14, offline: 1, oldest: "8m" },
  { code: "0780", city: "Belfast", region: "Northern Ireland", total: 17, offline: 1, oldest: "8m" },
  { code: "0932", city: "Southampton", region: "South East", total: 13, offline: 1, oldest: "7m" },
  { code: "0366", city: "Liverpool", region: "North West", total: 20, offline: 1, oldest: "7m" },
  { code: "0287", city: "Reading", region: "South East", total: 12, offline: 1, oldest: "6m" },
  { code: "1104", city: "Cork", region: "Ireland", total: 16, offline: 1, oldest: "5m" },
  { code: "0672", city: "Cambridge", region: "East", total: 18, offline: 1, oldest: "4m" },
  { code: "0409", city: "Newcastle", region: "North East", total: 15, offline: 1, oldest: "3m" },
  { code: "0991", city: "Oxford", region: "South East", total: 14, offline: 1, oldest: "2m" }
];

const offlineTypePool = [
  "pos", "kiosk", "pos", "kitchen", "pos", "pos", "kiosk", "pos", "kitchen", "pos", "pos", "kiosk",
  "pos", "pos", "kitchen", "pos", "pos", "kiosk", "pos", "pos", "kitchen", "pos", "kiosk"
];

const estateExplorerState = {
  selectedSite: null,
  selectedDevice: null,
  analysisTimers: []
};

let deviceIssues = [
  { location: "Campus 0077 · London", detail: "3 POS terminals offline", age: "2m", severity: "offline" },
  { location: "Campus 0512 · Birmingham", detail: "Kiosk response time 2.8s", age: "4m", severity: "slow" },
  { location: "Campus 0644 · Dublin", detail: "Kitchen display offline", age: "6m", severity: "offline" },
  { location: "Campus 0310 · Manchester", detail: "2 POS terminals running slow", age: "9m", severity: "slow" },
  { location: "Campus 0870 · Edinburgh", detail: "Kiosk heartbeat missed", age: "12m", severity: "offline" }
];

const pulseData = [
  [18, 0], [21, 0], [19, 0], [24, 0], [27, 0], [25, 1], [29, 0], [32, 0],
  [30, 0], [36, 0], [39, 1], [44, 0], [42, 0], [46, 0], [48, 1], [50, 0],
  [52, 1], [49, 0], [45, 0], [42, 0], [39, 0], [37, 0], [34, 0], [36, 0]
];

function makeTransactionSeries(count, total, seed, retryRate = .0002) {
  let value = seed >>> 0;
  const random = () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296; };
  const weights = Array.from({ length: count }, (_, index) => .68 + Math.sin(index / Math.max(1, count - 1) * Math.PI) * .48 + random() * .32);
  const weightTotal = weights.reduce((sum, item) => sum + item, 0);
  return weights.map(weight => {
    const successful = Math.round(total * weight / weightTotal);
    return [successful, Math.max(0, Math.round(successful * retryRate * (.65 + random() * .7)))];
  });
}

const transactionState = {
  range: "hour",
  totals: { hour: 1126, day: 13842, "7d": 112486, month: 498912, year: 6004441, ytd: 4192881 },
  ranges: {
    hour: { label: "Last hour", peakUnit: "/min", series: pulseData },
    day: { label: "Last day", peakUnit: "/hr", series: makeTransactionSeries(24, 13842, 2401) },
    "7d": { label: "Last 7 days", peakUnit: "/6h", series: makeTransactionSeries(28, 112486, 7017) },
    month: { label: "Last month", peakUnit: "/day", series: makeTransactionSeries(30, 498912, 3009) },
    year: { label: "Last year", peakUnit: "/month", series: makeTransactionSeries(12, 6004441, 1208) },
    ytd: { label: "Year to date", peakUnit: "/month", series: makeTransactionSeries(9, 4192881, 9122) }
  }
};

const statusStyles = {
  "AI triage": "#3994f2",
  "Awaiting manager": "#ffb21f",
  "Network team": "#88a5b8",
  "Campus apps": "#88a5b8",
  "AI resolved": "#17b78c",
  "Information security": "#f14d58",
  "Fulfilment agent": "#5db4ff",
  "End user computing": "#88a5b8",
  "Analyst assigned": "#10d1d5",
  "Resolved": "#26d17f"
};

let tickets = [
  { time: "09:40", id: "INC48231", priority: "P2", location: "Campus 0421", summary: "Tills offline, router lights red", channel: "Portal", age: 1, status: "AI triage", description: "Multiple tills have lost connectivity. The local router is powered but showing a red WAN indicator.", owner: "Digital triage agent", stage: 1 },
  { time: "09:39", id: "REQ48230", priority: "P3", location: "Campus 1188", summary: "Software licence, design suite", channel: "Teams", age: 2, status: "Awaiting manager", description: "Colleague needs access to the approved design software suite for a new role.", owner: "Access workflow", stage: 2 },
  { time: "09:38", id: "INC48229", priority: "P1", location: "Campus 0077", summary: "EPOS down across entire campus", channel: "Phone", age: 3, status: "Network team", description: "All point-of-sale terminals are offline. Local restart completed with no recovery.", owner: "Network", stage: 3 },
  { time: "09:36", id: "CAS48228", priority: "P3", location: "Campus 0310", summary: "Order 55123, short delivery", channel: "Portal", age: 5, status: "Campus apps", description: "A delivery was received with two expected cases missing from the order.", owner: "Campus applications", stage: 3 },
  { time: "09:35", id: "INC48227", priority: "P4", location: "Campus 0455", summary: "Printer offline in back office", channel: "Portal", age: 6, status: "AI resolved", description: "Back-office printer was showing offline. Automated spooler reset restored service.", owner: "Digital resolution agent", stage: 4 },
  { time: "09:33", id: "SAF48226", priority: "P1", location: "Campus 0870", summary: "Allergen label mismatch", channel: "Portal", age: 8, status: "Information security", description: "Printed product label does not match the allergen record in the item catalogue.", owner: "Information security", stage: 3 },
  { time: "09:31", id: "REQ48225", priority: "P3", location: "Campus 0203", summary: "New starter access", channel: "Teams", age: 10, status: "Fulfilment agent", description: "New starter requires the standard Campus applications and shared drive access.", owner: "Fulfilment", stage: 3 },
  { time: "09:30", id: "INC48224", priority: "P3", location: "Campus 0644", summary: "Wi-Fi slow in kitchen", channel: "Email", age: 11, status: "Network team", description: "Kitchen tablets are intermittently losing connection during the lunch service window.", owner: "Network", stage: 3 },
  { time: "09:28", id: "INC48223", priority: "P2", location: "Campus 0512", summary: "Payment terminal errors", channel: "Phone", age: 13, status: "End user computing", description: "Two payment terminals display a connection error after the morning update.", owner: "End user computing", stage: 3 },
  { time: "09:27", id: "REQ48222", priority: "P4", location: "Campus 0098", summary: "Password reset, kitchen tablet", channel: "Teams", age: 14, status: "AI resolved", description: "Password reset completed through identity verification and self-service workflow.", owner: "Digital resolution agent", stage: 4 }
];

const priorityFixtures = [
  { time: "09:18", id: "INC48194", priority: "P1", location: "Campus 0144", summary: "Primary till network unavailable", channel: "Phone", age: 72, status: "Network team", owner: "Network", stage: 3, slaState: "At risk", description: "The primary till network is unavailable and the site is trading on a limited fallback connection." },
  { time: "09:14", id: "INC48188", priority: "P2", location: "Campus 0721", summary: "Payment gateway intermittently timing out", channel: "Portal", age: 386, status: "Campus apps", owner: "Campus applications", stage: 3, slaState: "Breached", description: "Payment requests are intermittently timing out during peak trading, affecting two service points." },
  { time: "09:22", id: "INC48204", priority: "P2", location: "Campus 0258", summary: "Kitchen screens not receiving orders", channel: "Phone", age: 318, status: "Network team", owner: "Network", stage: 3, slaState: "At risk", description: "Orders complete at the till but are not appearing on the kitchen management displays." },
  { time: "09:25", id: "REQ48210", priority: "P2", location: "Campus 1092", summary: "Urgent manager access for service launch", channel: "Teams", age: 244, status: "Awaiting manager", owner: "Access workflow", stage: 2, slaState: "At risk", description: "A new unit manager requires elevated access before the afternoon service launch." },
  { time: "09:29", id: "INC48217", priority: "P2", location: "Campus 0334", summary: "Multiple kiosks displaying payment error", channel: "Portal", age: 196, status: "End user computing", owner: "End user computing", stage: 3, slaState: "Within SLA", description: "Three self-service kiosks display a payment device unavailable message." },
  { time: "08:42", id: "REQ48152", priority: "P3", location: "Campus 0821", summary: "Shared drive permissions missing", channel: "Teams", age: 903, status: "Fulfilment agent", owner: "Fulfilment", stage: 3, slaState: "At risk", description: "The catering management team cannot access the weekly reporting folder." },
  { time: "08:56", id: "INC48168", priority: "P3", location: "Campus 0176", summary: "Tablet unable to synchronise menu", channel: "Portal", age: 784, status: "Campus apps", owner: "Campus applications", stage: 3, slaState: "Within SLA", description: "A kitchen tablet cannot download the latest menu and allergen dataset." },
  { time: "09:03", id: "INC48173", priority: "P3", location: "Campus 0611", summary: "Guest Wi-Fi authentication loop", channel: "Email", age: 698, status: "Network team", owner: "Network", stage: 3, slaState: "Within SLA", description: "Guest users return to the sign-in page after successful authentication." },
  { time: "09:11", id: "REQ48185", priority: "P3", location: "Campus 0428", summary: "New starter equipment request", channel: "Portal", age: 581, status: "Analyst assigned", owner: "Campus service desk", stage: 2, slaState: "Within SLA", description: "Laptop, headset and standard application access are required for a new colleague." },
  { time: "08:11", id: "INC48098", priority: "P4", location: "Campus 0455", summary: "Meeting room display input unavailable", channel: "Email", age: 7322, status: "End user computing", owner: "End user computing", stage: 3, slaState: "Breached", description: "The back-office meeting room display does not detect HDMI input from colleague laptops." },
  { time: "08:28", id: "REQ48116", priority: "P4", location: "Campus 0904", summary: "Replace worn keyboard", channel: "Portal", age: 6140, status: "Fulfilment agent", owner: "Fulfilment", stage: 3, slaState: "At risk", description: "A back-office keyboard has several worn and intermittently responding keys." },
  { time: "08:47", id: "REQ48139", priority: "P4", location: "Campus 0265", summary: "Add colleague to distribution list", channel: "Teams", age: 4882, status: "Awaiting manager", owner: "Access workflow", stage: 2, slaState: "Within SLA", description: "A colleague needs to be added to the local Campus announcements distribution list." },
  { time: "09:02", id: "INC48171", priority: "P4", location: "Campus 0733", summary: "Label printer alignment issue", channel: "Portal", age: 4016, status: "End user computing", owner: "End user computing", stage: 3, slaState: "Within SLA", description: "Food labels print slightly off-centre after the latest label roll was fitted." }
];

const priorityExplorerState = { selectedPriority: null };

const godViewState = {
  nodes: [], edges: [], nodeMap: new Map(), flows: [], screenNodes: [],
  yaw: -0.42, pitch: -0.18, zoom: 1, autoRotate: true, labels: true, attentionOnly: false,
  selected: null, hovered: null, dragging: false, moved: false, pointerX: 0, pointerY: 0,
  width: 0, height: 0, dpr: 1, lastFrame: 0, trafficBurstUntil: 0
};

let godEvents = [
  { status: "healthy", title: "Time2Eat telemetry synchronised", detail: "1,842 endpoint heartbeats correlated", age: "now" },
  { status: "degraded", title: "Compass Site 0310 latency above baseline", detail: "Levy · North · 2.4s", age: "2m" },
  { status: "offline", title: "Compass Site 0077 dependency interrupted", detail: "Compass One · network path · 3 endpoints", age: "4m" },
  { status: "healthy", title: "Identity token flow recovered", detail: "All regional hubs responding", age: "7m" }
];

const demoIssues = [
  ["P3", "Portal", "Kitchen display not syncing", "Campus apps"],
  ["P2", "Phone", "Card reader disconnecting", "AI triage"],
  ["P4", "Teams", "Shared mailbox access", "Fulfilment agent"],
  ["P3", "Email", "Menu update not visible", "AI triage"],
  ["P2", "Portal", "Guest Wi-Fi unavailable", "Network team"],
  ["P4", "Portal", "Printer toner request", "AI triage"],
  ["P3", "Teams", "New colleague device setup", "End user computing"],
  ["P1", "Phone", "Payment service unavailable", "AI triage"]
];

const state = {
  isLive: true,
  refreshIn: 5,
  currentView: "service",
  autoRotate: true,
  rotationIn: 30,
  nextNumber: 48232,
  open: 412,
  incoming: 186,
  resolved: 203,
  aiResolved: 58,
  analystResolved: 145,
  selectedTicket: null
};

const deviceState = {
  transactions: 13842,
  lastHourTransactions: 1126,
  heartbeatAge: 8,
  throughput: 4.8,
  apiResponse: 124,
  offlineSites: 17,
  tick: 0
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

const demoAccess = {
  username: "jarvis",
  passwordHash: "57aaefa3f13fcbdf27b6a06b21a9383bba4d03c6c2d1074c806513b8c8dd1fb0",
  sessionKey: "compass-demo-access"
};

async function hashLoginValue(value) {
  if (!window.crypto?.subtle) return "";
  const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function setDashboardAccess(granted) {
  const loginScreen = $("#loginScreen");
  document.body.classList.toggle("login-locked", !granted);
  loginScreen.hidden = granted;
  [$(".skip-link"), $(".topbar"), $("#dashboard")].forEach(element => { if (element) element.inert = !granted; });
  if (!granted) requestAnimationFrame(() => $("#loginUsername").focus());
}

function initAccessGate() {
  let hasAccess = false;
  try { hasAccess = sessionStorage.getItem(demoAccess.sessionKey) === "granted"; } catch (error) { hasAccess = false; }
  setDashboardAccess(hasAccess);

  $("#loginForm").addEventListener("submit", async event => {
    event.preventDefault();
    const username = $("#loginUsername").value.trim().toLowerCase();
    const password = $("#loginPassword").value;
    const submitButton = event.currentTarget.querySelector("button[type='submit']");
    submitButton.disabled = true;
    $("#loginError").textContent = "Checking access…";
    const passwordHash = await hashLoginValue(password);
    const valid = username === demoAccess.username && passwordHash === demoAccess.passwordHash;
    submitButton.disabled = false;
    if (!valid) {
      $("#loginError").textContent = "Username or password not recognised.";
      $("#loginUsername").setAttribute("aria-invalid", "true");
      $("#loginPassword").setAttribute("aria-invalid", "true");
      $(".login-panel").classList.remove("is-denied");
      requestAnimationFrame(() => $(".login-panel").classList.add("is-denied"));
      $("#loginPassword").select();
      return;
    }
    try { sessionStorage.setItem(demoAccess.sessionKey, "granted"); } catch (error) { /* Access still lasts for the current page. */ }
    $("#loginUsername").removeAttribute("aria-invalid");
    $("#loginPassword").removeAttribute("aria-invalid");
    $("#loginError").textContent = "Access confirmed. Opening live estate…";
    $("#loginScreen").classList.add("is-opening");
    setTimeout(() => {
      $("#loginScreen").classList.remove("is-opening");
      setDashboardAccess(true);
    }, 390);
  });

  $("#logoutBtn").addEventListener("click", () => {
    try { sessionStorage.removeItem(demoAccess.sessionKey); } catch (error) { /* No persisted session to clear. */ }
    $("#loginForm").reset();
    $("#loginError").textContent = "";
    setDashboardAccess(false);
  });
}

function renderSparkline(id, values, resolved = false) {
  const svg = document.getElementById(id);
  const width = svg.viewBox.baseVal.width || 140;
  const height = svg.viewBox.baseVal.height || 54;
  const pad = 3;
  const min = Math.min(...values), max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = pad + index * ((width - pad * 2) / (values.length - 1));
    const y = height - pad - ((value - min) / Math.max(max - min, 1)) * (height - pad * 2 - 8);
    return [x, y];
  });
  const path = points.map((point, i) => `${i ? "L" : "M"}${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ");
  const area = `${path} L${points.at(-1)[0]},${height} L${points[0][0]},${height} Z`;
  svg.innerHTML = `<path class="area ${resolved ? "resolved-area" : ""}" d="${area}"></path><path class="line ${resolved ? "resolved-line" : ""}" d="${path}"></path><circle cx="${points.at(-1)[0]}" cy="${points.at(-1)[1]}" r="3"></circle>`;
}

function renderNewBars() {
  const values = [2, 4, 7, 12, 18, 16, 14, 12, 10, 6, 2];
  const svg = $("#newBars");
  const max = Math.max(...values);
  svg.innerHTML = values.map((v, i) => {
    const h = (v / max) * 47;
    return `<rect class="${i === 4 ? "emphasis" : ""}" x="${i * 12.5 + 2}" y="${52 - h}" width="9" height="${h}" rx="2"></rect>`;
  }).join("");
}

function renderPriorities() {
  $("#priorityRows").innerHTML = priorities.map(item => {
    const withinPct = item.within / item.count * 100;
    const riskPct = item.risk / item.count * 100;
    const breachPct = item.breached / item.count * 100;
    return `<button class="priority-row" type="button" data-priority-drill="${item.key}" style="--priority-color:${item.color}" aria-label="Open ${item.key} ${item.label} priority queue, ${item.count} tickets">
      <div class="priority-chip ${item.key.toLowerCase()}">${item.key}</div>
      <div class="priority-details">
        <div class="priority-top"><strong>${item.count}</strong><span>${item.label}</span><div class="priority-stats"><b>${item.within}</b> ok · <span class="risk-text">${item.risk}</span> at risk · <span class="breach-text">${item.breached}</span> breached · <b>${item.oldest}</b><svg class="priority-drill-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></div></div>
        <div class="priority-track"><i class="within" style="width:${withinPct}%"></i><i class="risk" style="width:${riskPct}%"></i><i class="breached" style="width:${breachPct}%"></i></div>
      </div>
    </button>`;
  }).join("");
}

function ticketSlaState(ticket) {
  if (ticket.slaState) return ticket.slaState;
  const targetMinutes = { P1: 240, P2: 480, P3: 4320, P4: 7200 }[ticket.priority];
  if (ticket.age >= targetMinutes) return "Breached";
  if (ticket.age >= targetMinutes * .8) return "At risk";
  return "Within SLA";
}

function priorityTickets(priorityKey) {
  const combined = [...tickets.filter(ticket => ticket.priority === priorityKey && ticket.stage < 4), ...priorityFixtures.filter(ticket => ticket.priority === priorityKey && ticket.stage < 4)];
  const unique = [...new Map(combined.map(ticket => [ticket.id, ticket])).values()];
  const severity = { "Breached": 0, "At risk": 1, "Within SLA": 2 };
  return unique.sort((a, b) => severity[ticketSlaState(a)] - severity[ticketSlaState(b)] || b.age - a.age).slice(0, 8);
}

function openPriorityDrawer(priorityKey) {
  const priority = priorities.find(item => item.key === priorityKey);
  if (!priority) return;
  priorityExplorerState.selectedPriority = priorityKey;
  const targets = {
    P1: { response: "15m", resolution: "4h" },
    P2: { response: "30m", resolution: "8h" },
    P3: { response: "4h", resolution: "3d" },
    P4: { response: "8h", resolution: "5d" }
  }[priorityKey];
  const items = priorityTickets(priorityKey);
  $("#priorityDrawerTitle").textContent = `${priority.key} · ${priority.label}`;
  $("#priorityExplorer").innerHTML = `<div class="priority-summary" style="--priority-accent:${priority.color}">
      <div class="priority-summary-lead"><span class="priority-chip ${priority.key.toLowerCase()}">${priority.key}</span><div><span>Open workload</span><strong>${priority.count}</strong><small>${priority.label} priority tickets</small></div></div>
      <div><span>Within SLA</span><strong>${priority.within}</strong><small>${(priority.within / priority.count * 100).toFixed(1)}% of queue</small></div>
      <div><span>At risk</span><strong class="risk-value">${priority.risk}</strong><small>under 20% remaining</small></div>
      <div><span>Breached</span><strong class="breach-value">${priority.breached}</strong><small>requires review</small></div>
    </div>
    <div class="priority-target-strip">
      <div><span>Response target</span><strong>${targets.response}</strong></div>
      <div><span>Resolution target</span><strong>${targets.resolution}</strong></div>
      <div><span>Oldest open</span><strong>${priority.oldest}</strong></div>
      <div class="priority-risk-track"><span aria-hidden="true"><i style="width:${priority.within / priority.count * 100}%"></i><i class="risk" style="width:${priority.risk / priority.count * 100}%"></i><i class="breached" style="width:${priority.breached / priority.count * 100}%"></i></span><small>Live SLA position</small></div>
    </div>
    <div class="explorer-section-heading"><h3>Tickets requiring attention</h3><span>Showing ${items.length} representative live tickets</span></div>
    <div class="priority-ticket-list">${items.map(ticket => {
      const slaState = ticketSlaState(ticket);
      return `<button class="priority-ticket-row" type="button" data-priority-ticket="${ticket.id}" aria-label="Open ${ticket.id}, ${escapeHtml(ticket.summary)}">
        <span class="priority-ticket-id"><strong>${ticket.id}</strong><small>${ticket.time} · ${ticket.channel}</small></span>
        <span class="priority-ticket-summary"><strong>${escapeHtml(ticket.summary)}</strong><small>${escapeHtml(ticket.location)}</small></span>
        <span class="priority-ticket-age"><small>Age</small><strong>${formatAge(ticket.age)}</strong></span>
        <span class="sla-state ${slaState.toLowerCase().replaceAll(" ", "-")}">${slaState}</span>
        <span class="priority-ticket-owner"><small>Owner</small><strong>${escapeHtml(ticket.owner)}</strong></span>
        <svg class="row-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>`;
    }).join("")}</div>`;
  $("#priorityDrawer").classList.add("is-open");
  $("#priorityDrawer").setAttribute("aria-hidden", "false");
  $("#priorityDrawer [data-close-priority]").focus();
}

function closePriorityDrawer() {
  $("#priorityDrawer").classList.remove("is-open");
  $("#priorityDrawer").setAttribute("aria-hidden", "true");
}

function renderAgeChart() {
  const max = Math.max(...ageBuckets.map(d => d.value));
  $("#ageChart").innerHTML = ageBuckets.map(item => `<div class="age-column"><strong>${item.value}</strong><div class="age-bar" style="height:${Math.max(4, item.value / max * 165)}px"></div><span>${item.label}</span></div>`).join("");
}

function renderArrivals() {
  $("#arrivalsChart").innerHTML = arrivalBuckets.map((bucket, index) => {
    const labels = index % 2 === 0 ? `<time>${bucket.time}</time>` : "";
    return `<div class="arrival-column">${["Portal", "Teams", "Phone", "Email"].map(channel => `<div class="arrival-segment ${channel.toLowerCase()}" style="height:${bucket[channel] / 16 * 100}%" title="${channel}: ${bucket[channel]}"></div>`).join("")}${labels}</div>`;
  }).join("");
}

function renderResolvers() {
  const max = Math.max(...resolverGroups.map(d => d.count));
  $("#resolverList").innerHTML = resolverGroups.map(group => `<div class="resolver-row"><span>${escapeHtml(group.name)}</span><div class="resolver-bar"><i style="width:${group.count / max * 100}%"></i></div><strong>${group.count}</strong><small>${group.oldest}</small></div>`).join("");
}

function deviceTotals() {
  return Object.values(deviceEstate).reduce((totals, group) => ({
    total: totals.total + group.total,
    healthy: totals.healthy + group.healthy,
    offline: totals.offline + group.offline,
    slow: totals.slow + group.slow
  }), { total: 0, healthy: 0, offline: 0, slow: 0 });
}

function renderEstateBars() {
  $("#estateBars").innerHTML = Object.values(deviceEstate).map(group => `<div class="estate-row">
    <span>${group.label}</span>
    <div class="estate-track" aria-label="${group.fullLabel}: ${group.healthy} healthy, ${group.slow} slow and ${group.offline} offline">
      <i class="healthy" style="width:${group.healthy / group.total * 100}%"></i>
      <i class="slow" style="width:${group.slow / group.total * 100}%"></i>
      <i class="offline" style="width:${group.offline / group.total * 100}%"></i>
    </div>
    <strong>${group.total}</strong>
  </div>`).join("");
}

function renderDeviceIssues() {
  $("#deviceIssueList").innerHTML = deviceIssues.slice(0, 5).map(issue => `<div class="device-issue ${issue.severity === "offline" ? "is-offline" : ""}">
    <i class="issue-severity" aria-hidden="true"></i>
    <div><strong>${escapeHtml(issue.location)}</strong><span>${escapeHtml(issue.detail)}</span></div>
    <time>${issue.age}</time>
  </div>`).join("");
}

function deviceIcon(type) {
  const icons = {
    pos: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M8 21h8M12 17v4M8 8h8M8 12h5"/></svg>',
    kiosk: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="18" rx="2"/><path d="M9 6h6M9 10h6M10 23h4M12 20v3"/></svg>',
    kitchen: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h4v3H7zM14 8h3M14 11h3M7 15h10M9 22h6M12 18v4"/></svg>'
  };
  return icons[type] || icons.pos;
}

function createOfflineDevice(site, type, index, minutes = null) {
  const typeDetails = {
    pos: { prefix: "POS", label: "POS terminal", model: "Oracle MICROS Workstation 6", firmware: "T2E 6.14.2", connection: "Ethernet · VLAN 218" },
    kiosk: { prefix: "KSK", label: "Self-service kiosk", model: "Evoke 32-inch kiosk", firmware: "Kiosk shell 4.8.1", connection: "Ethernet · VLAN 218" },
    kitchen: { prefix: "KMS", label: "Kitchen display", model: "Time2Eat KMS display", firmware: "KMS 3.12.7", connection: "Wi-Fi · Campus-IoT" }
  }[type];
  const suffix = String(index + 1).padStart(2, "0");
  const lastSeenMins = minutes ?? Math.max(2, 18 - Number(site.code.slice(-1)) - index * 2);
  return {
    id: `${typeDetails.prefix}-${site.code}-${suffix}`,
    type,
    typeLabel: typeDetails.label,
    model: typeDetails.model,
    firmware: typeDetails.firmware,
    connection: typeDetails.connection,
    lastSeenMins,
    lastSeen: `${lastSeenMins}m ago`,
    lastLatency: type === "kiosk" ? "2.7s" : type === "kitchen" ? "884ms" : "146ms",
    lastReboot: `${3 + (Number(site.code.slice(-2)) % 11)}d ago`,
    serial: `CMP-${site.code}-${typeDetails.prefix}-${String(2100 + index * 17 + Number(site.code)).slice(-4)}`
  };
}

function hydrateSiteDevices() {
  let poolIndex = 0;
  estateSites.forEach(site => {
    site.devices = Array.from({ length: site.offline }, (_, index) => createOfflineDevice(site, offlineTypePool[poolIndex++], index));
  });
}

function clearAnalysisTimers() {
  estateExplorerState.analysisTimers.forEach(timer => clearTimeout(timer));
  estateExplorerState.analysisTimers = [];
}

function estateBreadcrumb(level, site = null, device = null) {
  if (level === "sites") return "All affected sites";
  const siteButton = `<button type="button" data-estate-level="sites">Affected sites</button><span>›</span>`;
  if (level === "devices") return `${siteButton} Campus ${escapeHtml(site.code)} · ${escapeHtml(site.city)}`;
  return `${siteButton}<button type="button" data-site-code="${site.code}">Campus ${escapeHtml(site.code)}</button><span>›</span>${escapeHtml(device.id)}`;
}

function openEstateDrawer() {
  clearAnalysisTimers();
  estateExplorerState.selectedSite = null;
  estateExplorerState.selectedDevice = null;
  renderEstateSites();
  $("#estateDrawer").classList.add("is-open");
  $("#estateDrawer").setAttribute("aria-hidden", "false");
  $("#estateDrawer [data-close-estate]").focus();
}

function closeEstateDrawer() {
  clearAnalysisTimers();
  $("#estateDrawer").classList.remove("is-open");
  $("#estateDrawer").setAttribute("aria-hidden", "true");
}

function renderEstateSites() {
  clearAnalysisTimers();
  estateExplorerState.selectedSite = null;
  estateExplorerState.selectedDevice = null;
  const affected = estateSites.filter(site => site.offline > 0).sort((a, b) => b.offline - a.offline || b.total - a.total);
  const offlineTotal = affected.reduce((sum, site) => sum + site.offline, 0);
  $("#estateBreadcrumb").innerHTML = estateBreadcrumb("sites");
  $("#estateDrawerTitle").textContent = "Offline devices";
  $("#estateExplorer").innerHTML = `<div class="explorer-summary">
      <div><span>Offline devices</span><strong class="alert-value">${offlineTotal}</strong><small>live estate snapshot</small></div>
      <div><span>Affected locations</span><strong>${affected.length}</strong><small>of 428 Campus sites</small></div>
      <div><span>Longest outage</span><strong>${affected[0]?.oldest || "—"}</strong><small>Campus ${affected[0]?.code || "—"}</small></div>
    </div>
    <div class="explorer-section-heading"><h3>Affected sites</h3><span>Select a site to view its devices</span></div>
    <div class="site-list">${affected.map((site, index) => `<button class="site-row" type="button" data-site-code="${site.code}" aria-label="View ${site.offline} offline devices at Campus ${site.code}, ${escapeHtml(site.city)}">
      <span class="site-rank">${String(index + 1).padStart(2, "0")}</span>
      <span class="site-primary"><strong>Campus ${site.code} · ${escapeHtml(site.city)}</strong><span>${escapeHtml(site.region)} · ${site.total} Time2Eat devices</span></span>
      <span class="site-offline"><strong>${site.offline}</strong><span>offline</span></span>
      <span class="site-last-seen"><strong>${site.oldest}</strong><span>oldest outage</span></span>
      <svg class="row-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </button>`).join("")}</div>`;
}

function renderSiteDevices(siteCode) {
  clearAnalysisTimers();
  const site = estateSites.find(item => item.code === siteCode);
  if (!site) return;
  estateExplorerState.selectedSite = site;
  estateExplorerState.selectedDevice = null;
  $("#estateBreadcrumb").innerHTML = estateBreadcrumb("devices", site);
  $("#estateDrawerTitle").textContent = `Campus ${site.code} · ${site.city}`;
  $("#estateExplorer").innerHTML = `<div class="site-context">
      <div><h3>Campus ${site.code} · ${escapeHtml(site.city)}</h3><p>${escapeHtml(site.region)} · latest estate healthcheck</p></div>
      <div><span>Total devices</span><strong>${site.total}</strong></div>
      <div><span>Healthy</span><strong>${site.total - site.offline}</strong></div>
      <div><span>Offline</span><strong class="offline-text">${site.offline}</strong></div>
    </div>
    <div class="explorer-section-heading"><h3>Offline devices</h3><span>Select a device to run AI diagnosis</span></div>
    <div class="device-list">${site.devices.length ? site.devices.map(device => `<button class="offline-device-row" type="button" data-device-id="${device.id}" aria-label="Analyse ${device.id}, ${device.typeLabel}">
      <span class="device-type-icon">${deviceIcon(device.type)}</span>
      <span class="device-primary"><strong>${escapeHtml(device.id)}</strong><span>${escapeHtml(device.typeLabel)} · ${escapeHtml(device.model)}</span></span>
      <span class="device-fact"><span>Last heartbeat</span><strong class="device-offline">${device.lastSeen}</strong></span>
      <span class="device-fact"><span>Connection</span><strong>${escapeHtml(device.connection.split(" · ")[0])}</strong></span>
      <svg class="row-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </button>`).join("") : '<div class="empty-state">All devices at this site are back online.</div>'}</div>`;
}

function renderDeviceDiagnosis(site, device) {
  clearAnalysisTimers();
  estateExplorerState.selectedSite = site;
  estateExplorerState.selectedDevice = device;
  $("#estateBreadcrumb").innerHTML = estateBreadcrumb("device", site, device);
  $("#estateDrawerTitle").textContent = device.id;
  $("#estateExplorer").innerHTML = `<div class="device-hero">
      <span class="device-type-icon">${deviceIcon(device.type)}</span>
      <div><h3>${escapeHtml(device.id)}</h3><p>${escapeHtml(device.typeLabel)} · ${escapeHtml(device.model)} · ${escapeHtml(device.serial)}</p></div>
      <span class="offline-state"><i></i>Offline · ${device.lastSeen}</span>
    </div>
    <div class="telemetry-grid">
      <div><span>Last response</span><strong>${device.lastLatency}</strong></div>
      <div><span>Firmware</span><strong>${escapeHtml(device.firmware)}</strong></div>
      <div><span>Network path</span><strong>${escapeHtml(device.connection)}</strong></div>
      <div><span>Last reboot</span><strong>${device.lastReboot}</strong></div>
    </div>
    <div class="ai-analysis" id="analysisPanel">${analysisProgressMarkup()}</div>`;
  startAnalysis(site, device);
}

function analysisProgressMarkup() {
  return `<div class="ai-analysis-header">
      <div class="ai-identity"><span class="ai-mark">AI</span><div><strong>Compass diagnostic agent</strong><span>Hypothetical estate analysis</span></div></div>
      <span class="analysis-status" id="analysisStatus">Analysing telemetry…</span>
    </div>
    <div class="analysis-body">
      <div class="analysis-progress"><i></i></div>
      <div class="analysis-steps">
        <div class="analysis-step is-running" data-analysis-step="0"><i></i><span>Correlating device heartbeat and performance telemetry</span><small>Running</small></div>
        <div class="analysis-step" data-analysis-step="1"><i>2</i><span>Comparing other devices and shared site dependencies</span><small>Queued</small></div>
        <div class="analysis-step" data-analysis-step="2"><i>3</i><span>Checking recent configuration and software signals</span><small>Queued</small></div>
      </div>
    </div>`;
}

function updateAnalysisStep(currentStep) {
  const panel = $("#analysisPanel");
  if (!panel) return;
  $$('[data-analysis-step]', panel).forEach((step, index) => {
    step.classList.toggle("is-complete", index < currentStep);
    step.classList.toggle("is-running", index === currentStep);
    const marker = $("i", step);
    const label = $("small", step);
    if (index < currentStep) { marker.textContent = "✓"; label.textContent = "Complete"; }
    else if (index === currentStep) { marker.textContent = ""; label.textContent = "Running"; }
    else { marker.textContent = String(index + 1); label.textContent = "Queued"; }
  });
}

function diagnosisFor(site, device) {
  if (site.offline > 1) return {
    title: "Shared site network path interruption",
    confidence: 86,
    summary: `${site.offline} devices at Campus ${site.code} stopped reporting within the same diagnostic window. The correlated timing makes a shared switch, VLAN or local router path more likely than simultaneous device hardware failure.`,
    evidence: [`${site.offline} co-located devices have missed consecutive heartbeats`, `Cloud services and comparable ${device.typeLabel.toLowerCase()} devices remain healthy`, `Last response rose to ${device.lastLatency} immediately before disconnect`],
    actions: ["Check the Campus edge router and access-switch uplink", `Verify ${device.connection} is available at the device port`, "Power-cycle the local network edge only if trading impact permits"]
  };
  if (device.type === "kiosk") return {
    title: "Kiosk application shell likely unresponsive",
    confidence: 78,
    summary: `Network telemetry remained available while the Time2Eat application response degraded to ${device.lastLatency}. This pattern is consistent with a stalled kiosk shell or resource exhaustion rather than a full site connectivity loss.`,
    evidence: ["Other devices at this site continue to report normally", "Response time degraded before the application heartbeat stopped", `Device is running ${device.firmware}`],
    actions: ["Send a remote kiosk-shell restart", "Review memory and content-sync telemetry after recovery", "Escalate for on-site reboot if remote control does not respond"]
  };
  if (device.type === "kitchen") return {
    title: "Wireless lease or access-point roaming failure",
    confidence: 81,
    summary: `The kitchen display stopped reporting shortly after a latency spike. Other wired devices at Campus ${site.code} are healthy, isolating the likely fault to the Campus-IoT wireless path or DHCP lease renewal.`,
    evidence: ["Wired POS and kiosk heartbeats remain stable", `Last observed latency was ${device.lastLatency}`, "No platform-wide KMS service degradation detected"],
    actions: ["Check Campus-IoT access-point health in the kitchen area", "Renew the device DHCP lease or reconnect Wi-Fi", "Confirm the display returns to a 30-second heartbeat"]
  };
  return {
    title: "Local POS network connection lost",
    confidence: 74,
    summary: `The terminal stopped responding while the rest of Campus ${site.code} remained connected. The strongest current hypothesis is a local cable, switch-port or terminal network-adapter interruption.`,
    evidence: ["No correlated outage on other Time2Eat devices", `Last successful response was ${device.lastLatency}`, "Cloud transaction APIs remain within normal latency"],
    actions: ["Check the terminal network cable and link lights", "Test or reset the assigned access-switch port", "Restart the POS terminal if physical connectivity is present"]
  };
}

function renderAnalysisResult(site, device) {
  const result = diagnosisFor(site, device);
  const panel = $("#analysisPanel");
  if (!panel || estateExplorerState.selectedDevice?.id !== device.id) return;
  panel.innerHTML = `<div class="ai-analysis-header">
      <div class="ai-identity"><span class="ai-mark">AI</span><div><strong>Compass diagnostic agent</strong><span>Hypothetical estate analysis</span></div></div>
      <span class="analysis-status is-complete">Analysis complete</span>
    </div>
    <div class="analysis-body analysis-result">
      <div class="diagnosis-lead"><div><span>Most likely root cause</span><h3>${escapeHtml(result.title)}</h3></div><div class="confidence-score"><strong>${result.confidence}%</strong><span>confidence</span></div></div>
      <div class="analysis-callout">${escapeHtml(result.summary)}</div>
      <div class="evidence-grid">
        <div class="evidence-block"><h4>Signals considered</h4><ul>${result.evidence.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        <div class="evidence-block"><h4>Recommended next actions</h4><ul class="recommendation-list">${result.actions.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
      </div>
      <div class="analysis-footer"><span class="analysis-disclaimer">Illustrative AI diagnosis only. No live device, network or service-management data was queried.</span><button class="rerun-button" type="button" data-rerun-analysis>Run analysis again</button></div>
    </div>`;
}

function startAnalysis(site, device) {
  clearAnalysisTimers();
  const panel = $("#analysisPanel");
  if (panel && !$(".analysis-progress", panel)) panel.innerHTML = analysisProgressMarkup();
  estateExplorerState.analysisTimers.push(
    setTimeout(() => updateAnalysisStep(1), 700),
    setTimeout(() => updateAnalysisStep(2), 1450),
    setTimeout(() => renderAnalysisResult(site, device), 2350)
  );
}

function transactionAxisLabel(range, index, count, force = false) {
  const intervals = { hour: 4, day: 4, "7d": 4, month: 5, year: 1, ytd: 1 };
  if (!force && index % intervals[range] !== 0) return "";
  const now = new Date();
  if (range === "hour") {
    const point = new Date(now.getTime() - (count - 1 - index) * 2.5 * 60000);
    return point.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  if (range === "day") return `${String(index).padStart(2, "0")}:00`;
  if (range === "7d") {
    const point = new Date(now.getTime() - (count - 1 - index) * 6 * 3600000);
    return point.toLocaleDateString("en-GB", { weekday: "short" }) + ` ${String(point.getHours()).padStart(2, "0")}:00`;
  }
  if (range === "month") {
    const point = new Date(now.getTime() - (count - 1 - index) * 86400000);
    return point.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
  const months = [];
  const monthCount = range === "year" ? 12 : count;
  for (let offset = monthCount - 1; offset >= 0; offset -= 1) months.push(new Date(now.getFullYear(), now.getMonth() - offset, 1).toLocaleDateString("en-GB", { month: "short" }));
  return months[index] || "";
}

function updateTransactionLiveTotal() {
  const config = transactionState.ranges[transactionState.range];
  $("#transactionRangeLabel").textContent = config.label;
  $("#transactionRangeTotal").textContent = transactionState.totals[transactionState.range].toLocaleString("en-GB");
}

function renderPulseChart() {
  const range = transactionState.range;
  const config = transactionState.ranges[range];
  const series = config.series;
  const max = Math.max(...series.map(item => item[0] + item[1]));
  const peakIndex = series.findIndex(item => item[0] === Math.max(...series.map(point => point[0])));
  $("#pulseChart").innerHTML = series.map((item, index) => {
    const totalHeight = (item[0] + item[1]) / max * 96;
    const retryHeight = item[1] ? Math.max(1, item[1] / (item[0] + item[1]) * totalHeight) : 0;
    const label = transactionAxisLabel(range, index, series.length);
    return `<div class="pulse-bar"><i class="success" style="height:${Math.max(3, totalHeight - retryHeight)}px"></i><i class="retry" style="height:${retryHeight}px"></i>${label ? `<time>${label}</time>` : ""}</div>`;
  }).join("");
  $("#pulseChart").setAttribute("aria-label", `Successful and retried Time2Eat transactions for ${config.label.toLowerCase()}`);
  $("#pulsePeakValue").textContent = `${series[peakIndex][0].toLocaleString("en-GB")}${config.peakUnit}`;
  $("#pulsePeakTime").textContent = transactionAxisLabel(range, peakIndex, series.length, true);
  $$('[data-transaction-range]').forEach(button => {
    const active = button.dataset.transactionRange === range;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  updateTransactionLiveTotal();
}

function updateDeviceMetrics() {
  const totals = deviceTotals();
  $("#deviceTotal").textContent = totals.total.toLocaleString("en-GB");
  $("#healthyDevices").textContent = totals.healthy.toLocaleString("en-GB");
  $("#offlineDevices").textContent = totals.offline.toLocaleString("en-GB");
  $("#offlineDrilldown").setAttribute("aria-label", `View ${totals.offline} offline devices across ${deviceState.offlineSites} affected sites`);
  $("#slowDevices").textContent = totals.slow.toLocaleString("en-GB");
  $("#healthyPercent").textContent = `${(totals.healthy / totals.total * 100).toFixed(1)}%`;
  $("#offlineSites").textContent = deviceState.offlineSites;
  $("#affectedCount").textContent = deviceState.offlineSites;
  $("#transactionCount").textContent = deviceState.transactions.toLocaleString("en-GB");
  updateTransactionLiveTotal();
  $("#heartbeatAge").textContent = `${deviceState.heartbeatAge}s ago`;
  $("#dataFreshness").textContent = `${deviceState.heartbeatAge} sec`;
  $("#throughputValue").textContent = `${deviceState.throughput.toFixed(1)}k`;
  $("#apiResponse").textContent = `${deviceState.apiResponse}ms`;
  $("#hubLatency").textContent = `${Math.max(28, Math.round(deviceState.apiResponse * .31))}ms`;
  for (const [key, group] of Object.entries(deviceEstate)) {
    $(`#${key}Total`).textContent = group.total.toLocaleString("en-GB");
    $(`#${key}Healthy`).textContent = group.healthy.toLocaleString("en-GB");
    $(`#${key}Offline`).textContent = group.offline.toLocaleString("en-GB");
    $(`#${key}Slow`).textContent = group.slow.toLocaleString("en-GB");
  }
  renderEstateBars();
}

function simulateDeviceEvent(manual = false) {
  const keys = Object.keys(deviceEstate);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const group = deviceEstate[key];
  let targetSite = estateSites[Math.floor(Math.random() * estateSites.length)];
  let location = `Campus ${targetSite.code} · ${targetSite.city}`;
  const eventRoll = Math.random();
  let detail, severity, activity;

  if (eventRoll < .38 && group.healthy > 0) {
    group.healthy -= 1;
    group.offline += 1;
    targetSite.offline += 1;
    targetSite.devices.push(createOfflineDevice(targetSite, key, targetSite.devices.length, 0));
    detail = `${group.fullLabel.replace(/s$/, "")} heartbeat missed`;
    severity = "offline";
    activity = `<strong>${location}</strong> · ${escapeHtml(group.fullLabel)} offline · automated connectivity checks started`;
  } else if (eventRoll < .73 && group.healthy > 0) {
    group.healthy -= 1;
    group.slow += 1;
    detail = `${group.fullLabel.replace(/s$/, "")} response above 2.5s`;
    severity = "slow";
    activity = `<strong>${location}</strong> · ${escapeHtml(group.fullLabel)} performance degraded · telemetry trace captured`;
  } else if (group.offline > 0) {
    const recoverySite = estateSites.find(site => site.devices.some(device => device.type === key));
    const recoveredDeviceIndex = recoverySite?.devices.findIndex(device => device.type === key) ?? -1;
    group.offline -= 1;
    group.healthy += 1;
    if (recoverySite && recoveredDeviceIndex >= 0) {
      recoverySite.devices.splice(recoveredDeviceIndex, 1);
      recoverySite.offline = Math.max(0, recoverySite.offline - 1);
      targetSite = recoverySite;
      location = `Campus ${targetSite.code} · ${targetSite.city}`;
    }
    detail = `${group.fullLabel.replace(/s$/, "")} connection restored`;
    severity = "healthy";
    activity = `<strong>${location}</strong> · ${escapeHtml(group.fullLabel)} back online · heartbeat stable`;
  } else if (group.slow > 0) {
    group.slow -= 1;
    group.healthy += 1;
    detail = `${group.fullLabel.replace(/s$/, "")} performance restored`;
    severity = "healthy";
    activity = `<strong>${location}</strong> · ${escapeHtml(group.fullLabel)} response returned to baseline`;
  }

  deviceIssues.unshift({ location, detail, age: "now", severity });
  deviceIssues = deviceIssues.slice(0, 8);
  deviceState.offlineSites = estateSites.filter(site => site.offline > 0).length;
  $("#t2eActivityFeed").innerHTML = activity;
  $("#scanTime").textContent = "just now";
  renderDeviceIssues();
  updateDeviceMetrics();
  if (manual) showToast("Device event simulated", `${location} · ${detail}`);
}

function switchDashboard(view, fromRotation = false) {
  if (!['service', 'time2eat', 'godview'].includes(view)) return;
  state.currentView = view;
  $("#serviceDeskView").hidden = view !== "service";
  $("#time2eatView").hidden = view !== "time2eat";
  $("#godView").hidden = view !== "godview";
  $$('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("#demoActionLabel").textContent = view === "service" ? "Add demo ticket" : view === "time2eat" ? "Simulate device event" : "Pulse the network";
  if (view === "godview") requestAnimationFrame(resizeGodCanvas);
  if (!fromRotation) state.rotationIn = 30;
}

function rotationTick() {
  if (!state.autoRotate || $("#estateDrawer").classList.contains("is-open") || $("#priorityDrawer").classList.contains("is-open") || $("#ticketDrawer").classList.contains("is-open")) return;
  state.rotationIn -= 1;
  if (state.rotationIn <= 0) {
    const sequence = ["service", "time2eat", "godview"];
    switchDashboard(sequence[(sequence.indexOf(state.currentView) + 1) % sequence.length], true);
    state.rotationIn = 30;
  }
  $("#rotationLabel").textContent = `Auto · ${state.rotationIn}s`;
}

function deviceTick() {
  if (!state.isLive) return;
  deviceState.tick += 1;
  deviceState.heartbeatAge = deviceState.tick % 6 === 0 ? 1 : Math.min(30, deviceState.heartbeatAge + 1);
  const transactionRoll = Math.random();
  const transactionDelta = transactionRoll > .98 ? 2 : transactionRoll > .66 ? 1 : 0;
  deviceState.transactions += transactionDelta;
  deviceState.lastHourTransactions += transactionDelta;
  Object.keys(transactionState.totals).forEach(range => { transactionState.totals[range] += transactionDelta; });
  deviceState.throughput = 4.5 + Math.random() * .8;
  deviceState.apiResponse = 112 + Math.floor(Math.random() * 28);
  if (deviceState.tick % 5 === 0) {
    pulseData.shift();
    pulseData.push([28 + Math.floor(Math.random() * 25), Math.random() > .96 ? 1 : 0]);
    renderPulseChart();
    if (Math.random() > .55 && !$("#estateDrawer").classList.contains("is-open")) simulateDeviceEvent(false);
    else $("#t2eActivityFeed").innerHTML = `<strong>Estate scan complete</strong> · ${deviceTotals().total.toLocaleString("en-GB")} device heartbeats checked · cloud routes normal`;
  }
  if (deviceState.tick % 4 === 0) $("#scanTime").textContent = `${Math.min(9, deviceState.heartbeatAge)}s ago`;
  updateDeviceMetrics();
}

function filteredTickets() {
  const priority = $("#priorityFilter").value;
  const channel = $("#channelFilter").value;
  return tickets.filter(ticket => (priority === "all" || ticket.priority === priority) && (channel === "all" || ticket.channel === channel));
}

function formatAge(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function renderTickets(newId = null) {
  const visible = filteredTickets();
  $("#emptyState").hidden = visible.length !== 0;
  $("#ticketTable").innerHTML = visible.slice(0, 10).map(ticket => `<tr class="${ticket.id === newId ? "new-row" : ""}" data-ticket-id="${ticket.id}">
    <td><button class="row-button" type="button" aria-label="Open ${ticket.id}: ${escapeHtml(ticket.summary)}">${ticket.time}</button></td>
    <td>${ticket.id}</td>
    <td><span class="priority-badge ${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
    <td>${escapeHtml(ticket.location)}</td>
    <td class="summary-cell">${escapeHtml(ticket.summary)}</td>
    <td>${ticket.channel}</td>
    <td>${formatAge(ticket.age)}</td>
    <td class="status-cell"><span class="status-indicator" style="--status-color:${statusStyles[ticket.status] || "#88a5b8"}"><i></i>${escapeHtml(ticket.status)}</span></td>
  </tr>`).join("");
}

function updateHeadlineMetrics() {
  $("#openCount").textContent = state.open;
  $("#newCount").textContent = state.incoming;
  $("#resolvedCount").textContent = state.resolved;
  $("#aiResolved").textContent = state.aiResolved;
  $("#analystResolved").textContent = state.analystResolved;
  $("#resolutionLead").textContent = `${state.resolved - state.incoming} ahead`;
  const aiShare = state.aiResolved / state.resolved * 100;
  $("#automationMeter").style.width = `${aiShare.toFixed(1)}%`;
}

function currentTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function updateClock() {
  const now = new Date();
  $("#clock").textContent = now.toLocaleTimeString("en-GB");
  $("#dateLabel").textContent = now.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function addActivity(html) {
  $("#activityFeed").innerHTML = html;
}

function showToast(title, message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong>${escapeHtml(message)}`;
  $("#toastRegion").appendChild(toast);
  setTimeout(() => toast.remove(), 3600);
}

function createDemoTicket(manual = false) {
  const issue = demoIssues[Math.floor(Math.random() * demoIssues.length)];
  const location = `Campus ${String(Math.floor(Math.random() * 1190) + 1).padStart(4, "0")}`;
  const prefix = issue[0] === "P4" ? "REQ" : "INC";
  const id = `${prefix}${state.nextNumber++}`;
  const ticket = {
    time: currentTime(), id, priority: issue[0], channel: issue[1], summary: issue[2], location,
    age: 0, status: issue[3], owner: issue[3] === "AI triage" ? "Digital triage agent" : issue[3], stage: issue[3] === "AI triage" ? 1 : 3,
    description: `${issue[2]} was reported by ${location}. Automated checks have captured the initial diagnostic context and service impact.`
  };
  tickets.unshift(ticket);
  tickets = tickets.slice(0, 16);
  state.incoming += 1;
  state.open += 1;
  const priority = priorities.find(p => p.key === ticket.priority);
  priority.count += 1;
  priority.within += 1;
  arrivalBuckets.at(-1)[ticket.channel] += 1;
  renderTickets(id);
  renderPriorities();
  renderArrivals();
  updateHeadlineMetrics();
  addActivity(`<strong>${ticket.id}</strong> received from ${ticket.location} · ${escapeHtml(ticket.summary)} · entering ${escapeHtml(ticket.status)}`);
  showToast(manual ? "Demo ticket added" : "New ticket received", `${ticket.id} · ${ticket.priority} · ${ticket.location}`);
}

function incrementAges() {
  tickets.forEach(ticket => ticket.age += 1);
}

function simulateProgress() {
  const active = tickets.filter(t => t.stage < 4);
  if (!active.length) return;
  const ticket = active[Math.floor(Math.random() * Math.min(active.length, 7))];
  if (ticket.stage === 1) {
    ticket.stage = 2;
    ticket.status = Math.random() > .35 ? "Analyst assigned" : "Awaiting manager";
    ticket.owner = ticket.status === "Analyst assigned" ? "Campus service desk" : "Access workflow";
    addActivity(`<strong>${ticket.id}</strong> triaged in ${Math.max(1, ticket.age)}m · routed to ${escapeHtml(ticket.owner)}`);
  } else if (ticket.stage === 2 && ticket.status !== "Awaiting manager") {
    ticket.stage = 3;
    ticket.status = Math.random() > .5 ? "End user computing" : "Campus apps";
    ticket.owner = ticket.status;
    addActivity(`<strong>${ticket.id}</strong> accepted by ${escapeHtml(ticket.owner)} · analyst work started`);
  } else if (ticket.stage >= 2 && Math.random() > .52) {
    resolveTicket(ticket, Math.random() > .72);
  }
  renderTickets();
}

function resolveTicket(ticket, byAI = false) {
  if (ticket.stage === 4) return;
  ticket.stage = 4;
  ticket.status = byAI ? "AI resolved" : "Resolved";
  ticket.owner = byAI ? "Digital resolution agent" : "Campus service desk";
  state.open = Math.max(0, state.open - 1);
  state.resolved += 1;
  if (byAI) state.aiResolved += 1; else state.analystResolved += 1;
  const priority = priorities.find(p => p.key === ticket.priority);
  if (priority && priority.count > 0) { priority.count -= 1; priority.within = Math.max(0, priority.within - 1); }
  updateHeadlineMetrics();
  renderPriorities();
  addActivity(`<strong>${ticket.id}</strong> resolved by ${byAI ? "digital agent" : "service desk analyst"} · elapsed ${formatAge(ticket.age)}`);
}

function liveTick() {
  if (!state.isLive) return;
  state.refreshIn -= 1;
  $("#refreshText").textContent = `Auto-refresh in ${state.refreshIn}s`;
  if (state.refreshIn <= 0) {
    state.refreshIn = 5;
    incrementAges();
    if (Math.random() > .38) createDemoTicket(false);
    else simulateProgress();
    renderTickets();
  }
}

function openDrawer(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId) || priorityFixtures.find(t => t.id === ticketId);
  if (!ticket) return;
  state.selectedTicket = ticket;
  $("#drawerTitle").textContent = ticket.id;
  const stages = ["Received", "AI triage", "Routed and assigned", "Resolution in progress", "Resolved and verified"];
  $("#drawerBody").innerHTML = `<div class="ticket-hero"><span class="priority-badge ${ticket.priority.toLowerCase()}">${ticket.priority}</span><h3>${escapeHtml(ticket.summary)}</h3><p>${escapeHtml(ticket.description)}</p></div>
    <div class="detail-grid">
      <div class="detail-item"><span>Location</span><strong>${escapeHtml(ticket.location)}</strong></div>
      <div class="detail-item"><span>Channel</span><strong>${ticket.channel}</strong></div>
      <div class="detail-item"><span>Age</span><strong>${formatAge(ticket.age)}</strong></div>
      <div class="detail-item"><span>Owner</span><strong>${escapeHtml(ticket.owner)}</strong></div>
      <div class="detail-item"><span>Status</span><strong>${escapeHtml(ticket.status)}</strong></div>
      <div class="detail-item"><span>SLA</span><strong>${ticket.priority === "P1" ? "44m remaining" : "Within target"}</strong></div>
    </div>
    <div class="triage-timeline"><h3>Service journey</h3>${stages.map((stage, index) => `<div class="triage-step ${index < ticket.stage ? "is-complete" : index === ticket.stage ? "is-current" : ""}"><strong>${stage}</strong>${index < ticket.stage ? "Completed" : index === ticket.stage ? `Current · ${escapeHtml(ticket.status)}` : "Pending"}</div>`).join("")}</div>`;
  $("#advanceTicketBtn").textContent = ticket.stage >= 4 ? "Ticket resolved" : "Advance triage";
  $("#advanceTicketBtn").disabled = ticket.stage >= 4;
  $("#ticketDrawer").classList.add("is-open");
  $("#ticketDrawer").setAttribute("aria-hidden", "false");
  $(".drawer-header .icon-button").focus();
}

function closeDrawer() {
  $("#ticketDrawer").classList.remove("is-open");
  $("#ticketDrawer").setAttribute("aria-hidden", "true");
}

function advanceSelectedTicket() {
  const ticket = state.selectedTicket;
  if (!ticket || ticket.stage >= 4) return;
  if (ticket.stage === 1) { ticket.stage = 2; ticket.status = "Analyst assigned"; ticket.owner = "Campus service desk"; }
  else if (ticket.stage === 2) { ticket.stage = 3; ticket.status = "End user computing"; ticket.owner = "End user computing"; }
  else resolveTicket(ticket, false);
  renderTickets();
  openDrawer(ticket.id);
  showToast("Triage updated", `${ticket.id} moved to ${ticket.status}`);
}

function seededGodRandom(seed = 1407) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function buildGodGraph() {
  const random = seededGodRandom();
  const nodes = [];
  const edges = [];
  const addNode = node => { nodes.push(node); return node; };
  const addEdge = (source, target, type = "standard") => edges.push({ source, target, type });
  const spreadCounts = (total, names) => {
    const base = Math.floor(total / names.length);
    return names.map((name, index) => ({ name, count: base + (index < total % names.length ? 1 : 0) }));
  };

  addNode({ id: "compass-core", label: "Compass Digital Core", type: "core", status: "core", x: 0, y: 0, z: 0, radius: 11, availability: "99.99%", latency: "18ms" });
  const services = ["Compass Network", "Time2Eat Cloud", "Service Desk", "Identity & Access", "Data Platform", "Security Operations", "People & Access"];
  services.forEach((label, index) => {
    const angle = index / services.length * Math.PI * 2;
    const node = addNode({
      id: `service-${index}`,
      label,
      type: "service",
      status: "healthy",
      x: Math.cos(angle) * 84,
      y: Math.sin(angle) * 62,
      z: Math.sin(angle * 2) * 55,
      radius: 6,
      availability: index === 1 ? "99.99%" : "99.97%",
      latency: `${22 + index * 7}ms`,
      flowRate: `${(1.2 + index * .34).toFixed(1)}k/sec`
    });
    addEdge("compass-core", node.id, "backbone");
  });

  const supportingPlatforms = ["API Gateway", "Integration Bus", "Observability", "CMDB", "Device Management", "Payments", "Menu Service", "Ordering", "Reporting", "Data Lake", "Master Data", "Network Analytics", "Endpoint Security", "SIEM", "Access Governance", "HR Integration", "Procurement Hub", "Notifications", "Mobile Management", "Print Services", "Collaboration", "Knowledge Base", "Automation Hub", "Supplier Gateway", "Backup Services", "DNS & DHCP", "Wi-Fi Control", "Event Streaming", "Service Catalogue"];
  supportingPlatforms.forEach((label, index) => {
    const ring = index % 2 === 0 ? 42 : 62;
    const angle = index / supportingPlatforms.length * Math.PI * 6;
    const node = addNode({ id: `platform-${index}`, label, type: "platform", status: "healthy", x: Math.cos(angle) * ring, y: Math.sin(angle) * ring * .62, z: (index % 5 - 2) * 20, radius: 2.7, availability: "99.95%", latency: `${31 + index % 9 * 5}ms`, flowRate: `${220 + index * 11}/sec` });
    addEdge("compass-core", node.id, "platform-link");
  });

  const centralFunctions = ["Foodbuy", "People", "Legal", "Finance", "Digital & Technology", "Sustainability", "Growth & Commercial"];
  centralFunctions.forEach((label, index) => {
    const angle = index / centralFunctions.length * Math.PI * 2 + .28;
    const node = addNode({
      id: `function-${index}`,
      label,
      type: "function",
      status: "core",
      x: Math.cos(angle) * 132,
      y: Math.sin(angle) * 98,
      z: Math.cos(angle * 2) * 76,
      radius: 6.4,
      scope: "Cross-enterprise",
      color: "#56d6d9"
    });
    addEdge("compass-core", node.id, "function-link");
  });

  const sectorDefs = [
    { id: "chco", name: "CH&CO", sites: 70, color: "#f18a8c", subsectors: ["Gather & Gather", "Vacherin", "Company of Cooks", "Venues & Events"] },
    { id: "compass-one", name: "Compass One", sites: 92, color: "#ffb21f", subsectors: ["ESS", "Medirest", "One Retail"] },
    { id: "education", name: "Compass Education", sites: 74, color: "#e0d34b", subsectors: ["Chartwells Schools", "Pabulum", "Lodestone House", "Chartwells Colleges", "Chartwells Universities"] },
    { id: "workplace", name: "Eurest, Dine & 14forty", sites: 68, color: "#26d17f", subsectors: ["Eurest", "Dine Contract Catering", "14forty"] },
    { id: "levy", name: "Levy", sites: 48, color: "#9b8cff", subsectors: ["Levy UK&I", "Lyvera", "Payne & Gunter", "The Venues Collection"] },
    { id: "ra", name: "Restaurant Associates Group", sites: 44, color: "#5db4ff", subsectors: ["Restaurant Associates", "Rapport Guest Services", "Corporate Hospitality"] },
    { id: "ireland", name: "Compass Ireland", sites: 32, color: "#10d1d5", subsectors: ["Business & Industry", "Education", "Healthcare", "Sport & Leisure"] }
  ];
  const ukRegions = ["London", "South East", "Midlands", "North", "South West & Wales", "Scotland"];
  const irelandRegions = ["Dublin", "Leinster", "Munster", "Connacht & Ulster"];
  const offlineIndexes = new Set([18, 75, 132, 201, 277, 351, 411]);
  const degradedIndexes = new Set([7, 39, 58, 91, 118, 149, 177, 214, 246, 302, 329, 372, 398, 423]);
  let siteIndex = 0;

  sectorDefs.forEach((sector, sectorIndex) => {
    const sectorAngle = sectorIndex / sectorDefs.length * Math.PI * 2 - Math.PI / 2;
    const sectorNode = addNode({
      id: `sector-${sector.id}`,
      label: sector.name,
      type: "sector",
      status: "core",
      x: Math.cos(sectorAngle) * 218,
      y: Math.sin(sectorAngle) * 158,
      z: Math.sin(sectorAngle * 2) * 96,
      radius: 8.4,
      color: sector.color,
      siteCount: sector.sites,
      subsectorCount: sector.subsectors.length,
      attentionCount: 0,
      endpointCount: 0
    });
    addEdge("compass-core", sectorNode.id, "business-link");
    addEdge("service-0", sectorNode.id, "service-route");
    addEdge("service-1", sectorNode.id, "service-route");
    addEdge("service-2", sectorNode.id, "service-route");
    centralFunctions.forEach((_, functionIndex) => addEdge(`function-${functionIndex}`, sectorNode.id, "governance-link"));

    const subsectorNodes = sector.subsectors.map((label, subIndex) => {
      const angle = sectorAngle + subIndex / sector.subsectors.length * Math.PI * 2;
      const node = addNode({
        id: `subsector-${sector.id}-${subIndex}`,
        label,
        type: "subsector",
        status: "core",
        sector: sector.name,
        sectorId: sectorNode.id,
        x: sectorNode.x + Math.cos(angle) * 31,
        y: sectorNode.y + Math.sin(angle) * 24,
        z: sectorNode.z + Math.cos(angle * 1.7) * 28,
        radius: 4.5,
        color: sector.color,
        siteCount: 0,
        endpointCount: 0
      });
      addEdge(sectorNode.id, node.id, "sector-link");
      return node;
    });

    const regionNames = sector.id === "ireland" ? irelandRegions : ukRegions;
    spreadCounts(sector.sites, regionNames).forEach((region, regionIndex) => {
      const regionAngle = sectorAngle + regionIndex / regionNames.length * Math.PI * 2 + .36;
      const regionNode = addNode({
        id: `region-${sector.id}-${regionIndex}`,
        label: region.name,
        type: "region",
        status: "core",
        sector: sector.name,
        sectorId: sectorNode.id,
        region: region.name,
        x: sectorNode.x + Math.cos(regionAngle) * 59,
        y: sectorNode.y + Math.sin(regionAngle) * 44,
        z: sectorNode.z + Math.sin(regionAngle * 1.45) * 52,
        radius: 5.3,
        color: sector.color,
        siteCount: region.count,
        endpointCount: 0,
        attentionCount: 0
      });
      addEdge(sectorNode.id, regionNode.id, "regional");

      for (let localIndex = 0; localIndex < region.count; localIndex += 1) {
        const angle = localIndex * 2.399963 + sectorIndex * .71 + regionIndex * .43;
        const radial = 12 + Math.sqrt((localIndex + 1) / region.count) * 22;
        const assets = siteIndex < 130 ? 5 : 4;
        const pos = Math.max(1, Math.round(assets * .46));
        const kiosk = Math.max(1, Math.round(assets * .25));
        const kitchen = Math.max(0, assets - pos - kiosk);
        const status = offlineIndexes.has(siteIndex) ? "offline" : degradedIndexes.has(siteIndex) ? "degraded" : "healthy";
        const siteCode = String(siteIndex + 1).padStart(4, "0");
        const subsectorNode = subsectorNodes[siteIndex % subsectorNodes.length];
        const siteNode = addNode({
          id: `site-${siteCode}`,
          label: `Compass Site ${siteCode}`,
          type: "site",
          status,
          sector: sector.name,
          sectorId: sectorNode.id,
          subsector: subsectorNode.label,
          subsectorId: subsectorNode.id,
          region: region.name,
          regionId: regionNode.id,
          x: regionNode.x + Math.cos(angle) * radial,
          y: regionNode.y + Math.sin(angle) * radial * .72,
          z: regionNode.z + (random() - .5) * 40,
          radius: status === "healthy" ? 2.05 : 3.2,
          assets, pos, kiosk, kitchen,
          latency: status === "offline" ? "No heartbeat" : status === "degraded" ? `${540 + Math.floor(random() * 1600)}ms` : `${28 + Math.floor(random() * 92)}ms`,
          lastSeen: status === "offline" ? `${2 + Math.floor(random() * 16)}m ago` : `${2 + Math.floor(random() * 24)}s ago`
        });
        addEdge(regionNode.id, siteNode.id, "site-route");
        addEdge(subsectorNode.id, siteNode.id, "operating-link");
        regionNode.endpointCount += assets;
        sectorNode.endpointCount += assets;
        subsectorNode.siteCount += 1;
        subsectorNode.endpointCount += assets;
        if (status !== "healthy") {
          regionNode.attentionCount += 1;
          sectorNode.attentionCount += 1;
        }
        const assetTypes = [...Array(pos).fill("pos"), ...Array(kiosk).fill("kiosk"), ...Array(kitchen).fill("kitchen")];
        assetTypes.forEach((assetType, assetIndex) => {
          const assetAngle = assetIndex / assets * Math.PI * 2 + regionIndex * .33;
          const assetRadius = 4.5 + assetIndex * 1.2;
          const endpointStatus = assetIndex === 0 && status !== "healthy" ? status : "healthy";
          const prefix = { pos: "POS", kiosk: "KSK", kitchen: "KMS" }[assetType];
          const endpoint = addNode({
            id: `endpoint-${siteCode}-${assetIndex + 1}`,
            label: `${prefix}-${siteCode}-${String(assetIndex + 1).padStart(2, "0")}`,
            type: "endpoint",
            assetType,
            status: endpointStatus,
            sector: sector.name,
            sectorId: sectorNode.id,
            subsector: subsectorNode.label,
            subsectorId: subsectorNode.id,
            region: region.name,
            regionId: regionNode.id,
            parentSite: siteNode.id,
            x: siteNode.x + Math.cos(assetAngle) * assetRadius,
            y: siteNode.y + Math.sin(assetAngle) * assetRadius,
            z: siteNode.z + (assetIndex - assets / 2) * 2.2,
            radius: endpointStatus === "healthy" ? .76 : 1.5,
            latency: endpointStatus === "offline" ? "No heartbeat" : endpointStatus === "degraded" ? siteNode.latency : `${24 + Math.floor(random() * 96)}ms`,
            lastSeen: endpointStatus === "offline" ? siteNode.lastSeen : `${2 + Math.floor(random() * 24)}s ago`
          });
          addEdge(siteNode.id, endpoint.id, "asset-link");
        });
        siteIndex += 1;
      }
    });
  });

  godViewState.nodes = nodes;
  godViewState.edges = edges;
  godViewState.nodeMap = new Map(nodes.map(node => [node.id, node]));
  godViewState.flows = edges.filter((edge, index) => ["backbone", "business-link", "function-link", "regional"].includes(edge.type) || index % 23 === 0).map(edge => ({ edge, progress: random(), speed: .035 + random() * .075, size: edge.type === "backbone" ? 2.4 : 1.2 + random() * 1.2 }));
  godViewState.stars = Array.from({ length: 95 }, () => ({ x: random(), y: random(), size: .35 + random() * 1.1, alpha: .12 + random() * .35 }));
  $("#godEntityTotal").textContent = nodes.length.toLocaleString("en-GB");
}

function rotateGodPoint(point) {
  const cy = Math.cos(godViewState.yaw), sy = Math.sin(godViewState.yaw);
  const cp = Math.cos(godViewState.pitch), sp = Math.sin(godViewState.pitch);
  const x1 = point.x * cy - point.z * sy;
  const z1 = point.x * sy + point.z * cy;
  return { x: x1, y: point.y * cp - z1 * sp, z: point.y * sp + z1 * cp };
}

function projectGodPoint(point) {
  const rotated = rotateGodPoint(point);
  const camera = 720;
  const perspective = camera / Math.max(260, camera + rotated.z);
  const scale = perspective * godViewState.zoom;
  return { x: godViewState.width / 2 + rotated.x * scale, y: godViewState.height / 2 + rotated.y * scale, z: rotated.z, scale };
}

function resizeGodCanvas() {
  const wrap = $("#godCanvasWrap");
  const canvas = $("#godCanvas");
  const width = Math.round(wrap.clientWidth);
  const height = Math.round(wrap.clientHeight);
  if (!width || !height) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (width === godViewState.width && height === godViewState.height && dpr === godViewState.dpr) return;
  godViewState.width = width;
  godViewState.height = height;
  godViewState.dpr = dpr;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawGodOrbit(ctx, radius, plane, alpha) {
  ctx.beginPath();
  for (let index = 0; index <= 72; index += 1) {
    const angle = index / 72 * Math.PI * 2;
    const raw = plane === "xy" ? { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 }
      : plane === "xz" ? { x: Math.cos(angle) * radius, y: 0, z: Math.sin(angle) * radius }
      : { x: 0, y: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
    const point = projectGodPoint(raw);
    if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  }
  ctx.strokeStyle = `rgba(74, 151, 188, ${alpha})`;
  ctx.lineWidth = .7;
  ctx.stroke();
}

function godNodeVisible(node) {
  if (!godViewState.attentionOnly) return true;
  if (node.type === "site" || node.type === "endpoint") return node.status !== "healthy";
  return true;
}

function drawGodView(timestamp) {
  requestAnimationFrame(drawGodView);
  if ($("#godView").hidden) { godViewState.lastFrame = timestamp; return; }
  resizeGodCanvas();
  if (!godViewState.width) return;
  const canvas = $("#godCanvas");
  const ctx = canvas.getContext("2d");
  const delta = Math.min(40, timestamp - (godViewState.lastFrame || timestamp));
  godViewState.lastFrame = timestamp;
  if (godViewState.autoRotate && !godViewState.dragging) godViewState.yaw += delta * .000055;
  ctx.clearRect(0, 0, godViewState.width, godViewState.height);

  godViewState.stars.forEach(star => {
    ctx.fillStyle = `rgba(119, 188, 218, ${star.alpha})`;
    ctx.fillRect(star.x * godViewState.width, star.y * godViewState.height, star.size, star.size);
  });
  drawGodOrbit(ctx, 118, "xy", .12);
  drawGodOrbit(ctx, 118, "xz", .1);
  drawGodOrbit(ctx, 260, "yz", .055);

  const visibleNodes = godViewState.nodes.filter(godNodeVisible);
  const visibleIds = new Set(visibleNodes.map(node => node.id));
  const projected = new Map(visibleNodes.map(node => [node.id, projectGodPoint(node)]));
  const selectedId = godViewState.selected?.id;

  godViewState.edges.forEach(edge => {
    if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return;
    const from = projected.get(edge.source), to = projected.get(edge.target);
    const highlighted = selectedId && (edge.source === selectedId || edge.target === selectedId);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = highlighted ? "rgba(140,211,255,.72)" : edge.type === "backbone" ? "rgba(16,209,213,.25)" : edge.type === "business-link" ? "rgba(155,140,255,.24)" : edge.type === "function-link" ? "rgba(86,214,217,.22)" : edge.type === "governance-link" ? "rgba(86,214,217,.055)" : edge.type === "asset-link" ? "rgba(73,133,164,.04)" : edge.type === "operating-link" ? "rgba(125,153,187,.045)" : edge.type === "site-route" ? "rgba(73,133,164,.095)" : "rgba(77,150,181,.15)";
    ctx.lineWidth = highlighted ? 1.55 : edge.type === "backbone" ? 1.15 : edge.type === "business-link" || edge.type === "function-link" ? .9 : edge.type === "asset-link" ? .35 : .6;
    ctx.stroke();
  });

  const burst = timestamp < godViewState.trafficBurstUntil;
  godViewState.flows.forEach(flow => {
    flow.progress = (flow.progress + flow.speed * delta / 1000 * (burst ? 3.2 : 1)) % 1;
    const source = godViewState.nodeMap.get(flow.edge.source);
    const target = godViewState.nodeMap.get(flow.edge.target);
    if (!godNodeVisible(source) || !godNodeVisible(target)) return;
    const t = flow.progress;
    const position = { x: source.x + (target.x - source.x) * t, y: source.y + (target.y - source.y) * t, z: source.z + (target.z - source.z) * t };
    const point = projectGodPoint(position);
    ctx.save();
    ctx.shadowColor = "rgba(16,209,213,.9)";
    ctx.shadowBlur = burst ? 12 : 7;
    ctx.fillStyle = burst ? "rgba(210,255,255,.98)" : "rgba(88,232,236,.9)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, flow.size * Math.max(.65, point.scale), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const colors = { core: "#5db4ff", service: "#10d1d5", function: "#56d6d9", sector: "#9b8cff", subsector: "#8bb7d4", region: "#9b8cff", healthy: "#26d17f", degraded: "#ffb21f", offline: "#f14d58" };
  const sorted = visibleNodes.map(node => ({ node, point: projected.get(node.id) })).sort((a, b) => b.point.z - a.point.z);
  godViewState.screenNodes = sorted;
  sorted.forEach(({ node, point }) => {
    const selected = node.id === selectedId;
    const hovered = node.id === godViewState.hovered?.id;
    const color = node.color || (node.type === "core" ? colors.core : node.type === "service" ? colors.service : node.type === "function" ? colors.function : node.type === "sector" ? colors.sector : node.type === "subsector" ? colors.subsector : node.type === "region" ? colors.region : node.type === "platform" ? "#6ca9c9" : colors[node.status]);
    const radius = Math.max(1.1, node.radius * point.scale * (selected ? 1.18 : 1));
    ctx.save();
    ctx.globalAlpha = Math.max(.34, Math.min(1, 1.06 - (point.z + 280) / 900));
    ctx.shadowColor = color;
    ctx.shadowBlur = node.type === "endpoint" && !selected && !hovered ? 0 : node.type === "site" && !selected && !hovered ? 4 : 14;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (node.type !== "site") {
      ctx.strokeStyle = "rgba(197,241,255,.55)";
      ctx.lineWidth = .8;
      ctx.stroke();
    }
    if (selected || hovered) {
      ctx.shadowBlur = 0;
      ctx.strokeStyle = selected ? "rgba(255,255,255,.9)" : "rgba(174,225,247,.65)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    const prominent = node.type === "core" || node.type === "service" || node.type === "function" || node.type === "sector";
    const showLabel = godViewState.labels && (prominent || selected || hovered || godViewState.zoom > 1.35 && (node.type === "region" || node.type === "subsector") || godViewState.zoom > 1.8 && node.type === "site" && node.status !== "healthy");
    if (showLabel) {
      const fontSize = node.type === "core" ? 11 : node.type === "sector" ? 10 : node.type === "site" ? 8 : 9;
      ctx.font = `${node.type === "core" || node.type === "sector" ? 600 : 500} ${fontSize}px "DM Sans", sans-serif`;
      const textWidth = ctx.measureText(node.label).width;
      const labelX = point.x + radius + 6;
      const labelY = point.y - radius - 3;
      ctx.fillStyle = "rgba(3,18,28,.78)";
      ctx.fillRect(labelX - 3, labelY - fontSize, textWidth + 6, fontSize + 5);
      ctx.fillStyle = node.status === "offline" ? "#ffabb1" : "rgba(222,240,248,.9)";
      ctx.fillText(node.label, labelX, labelY);
    }
  });
  const visibleCount = visibleNodes.length.toLocaleString("en-GB");
  if ($("#visibleNodeCount").textContent !== visibleCount) $("#visibleNodeCount").textContent = visibleCount;
}

function renderGodEvents() {
  $("#godEventList").innerHTML = godEvents.slice(0, 4).map(event => `<div class="god-event ${event.status}"><i></i><div><strong>${escapeHtml(event.title)}</strong><span>${escapeHtml(event.detail)}</span></div><time>${event.age}</time></div>`).join("");
}

function renderGodInspector(node = null) {
  const title = $("#godInspectorTitle");
  const type = $("#godSelectionType");
  if (!node) {
    const sectors = godViewState.nodes.filter(item => item.type === "sector");
    const functions = godViewState.nodes.filter(item => item.type === "function");
    title.textContent = "Model overview";
    type.textContent = "No selection";
    $("#godInspector").innerHTML = `<div class="inspector-overview">
      <div class="model-overview-visual"><span class="overview-core">D&amp;T</span></div>
      <p class="inspector-intro">Explore Compass UK&amp;I from cross-enterprise functions into business sectors, sub-sectors, regions, sites and their connected assets. Live particles show service, telemetry and transaction movement.</p>
      <div class="model-layer-list">
        <div class="model-layer"><i></i><div><strong>Central functions</strong><span>Foodbuy, People, Legal and enterprise teams</span></div><b>7</b></div>
        <div class="model-layer"><i></i><div><strong>Business sectors</strong><span>Operating areas and specialist brands</span></div><b>7</b></div>
        <div class="model-layer"><i></i><div><strong>Sub-sectors + regions</strong><span>26 portfolios · 40 regional clusters</span></div><b>66</b></div>
        <div class="model-layer"><i></i><div><strong>Sites + endpoints</strong><span>428 locations · 1,842 connected assets</span></div><b>2,270</b></div>
      </div>
      <div class="entity-section"><h4>Enter a business sector</h4><div class="god-directory">${sectors.map(item => `<button type="button" data-god-focus-id="${item.id}"><i style="--node-color:${item.color}"></i>${escapeHtml(item.label)}<span>${item.siteCount} sites</span></button>`).join("")}</div></div>
      <div class="entity-section"><h4>Central functions</h4><div class="god-directory compact">${functions.map(item => `<button type="button" data-god-focus-id="${item.id}"><i style="--node-color:${item.color}"></i>${escapeHtml(item.label)}</button>`).join("")}</div></div>
      <div class="inspector-tip">Choose a sector or function here, or select any molecule. Its direct relationships become your next drill-down choices.</div>
    </div>`;
    renderGodExpandedInspector();
    return;
  }

  title.textContent = node.label;
  const typeLabels = { site: "Compass location", endpoint: "Connected endpoint", region: "Sector region", subsector: "Sub-sector", sector: "Business sector", function: "Central function", core: "Enterprise core", platform: "Supporting platform", service: "Core platform" };
  type.textContent = typeLabels[node.type] || "Model entity";
  const connected = godViewState.edges.filter(edge => edge.source === node.id || edge.target === node.id);
  const dependencyMap = new Map();
  connected.forEach(edge => {
    const relationship = godViewState.nodeMap.get(edge.source === node.id ? edge.target : edge.source);
    if (relationship) dependencyMap.set(relationship.id, relationship);
  });
  const relationshipLimit = node.type === "sector" || node.type === "function" ? 24 : node.type === "region" || node.type === "subsector" ? 20 : 12;
  const dependencies = [...dependencyMap.values()].slice(0, relationshipLimit);
  let facts;
  if (node.type === "site") facts = [["Business sector", node.sector], ["Sub-sector", node.subsector], ["Region", node.region], ["Managed endpoints", node.assets], ["Last heartbeat", node.lastSeen], ["Observed latency", node.latency]];
  else if (node.type === "endpoint") facts = [["Asset type", node.assetType === "pos" ? "POS terminal" : node.assetType === "kiosk" ? "Self-service kiosk" : "Kitchen display"], ["Compass site", godViewState.nodeMap.get(node.parentSite)?.label || "—"], ["Business sector", node.sector], ["Region", node.region], ["Last heartbeat", node.lastSeen], ["Observed latency", node.latency]];
  else if (node.type === "region") {
    facts = [["Business sector", node.sector], ["Compass sites", node.siteCount], ["Managed endpoints", node.endpointCount], ["Needs attention", node.attentionCount], ["Regional cluster", node.region], ["Live paths", connected.length.toLocaleString("en-GB")]];
  } else if (node.type === "sector") {
    facts = [["Sub-sectors", node.subsectorCount], ["Regional clusters", dependencies.filter(item => item.type === "region").length], ["Compass sites", node.siteCount], ["Managed endpoints", node.endpointCount], ["Needs attention", node.attentionCount], ["Model status", "Live"]];
  } else if (node.type === "subsector") {
    facts = [["Business sector", node.sector], ["Compass sites", node.siteCount], ["Managed endpoints", node.endpointCount], ["Operating layer", "Sub-sector"], ["Relationship paths", connected.length], ["Model status", "Live"]];
  } else if (node.type === "function") {
    facts = [["Enterprise scope", node.scope], ["Business sectors", dependencies.filter(item => item.type === "sector").length], ["Relationship paths", connected.length], ["Model status", "Live"]];
  } else if (node.type === "service" || node.type === "platform") facts = [["Availability", node.availability], ["Response", node.latency], ["Connected paths", connected.length], ["Telemetry", node.flowRate]];
  else facts = [["Central functions", 7], ["Business sectors", 7], ["Compass sites", 428], ["Connected endpoints", "1,842"], ["Modelled entities", godViewState.nodes.length.toLocaleString("en-GB")], ["Active flows", "8,412"]];
  const statusClass = node.status === "core" ? "core" : node.status;
  const statusLabel = node.status === "core" ? "CONNECTED" : node.status.toUpperCase();
  const pathParts = ["Compass UK&I"];
  if (node.type === "function") pathParts.push("Central functions");
  if (node.sector) pathParts.push(node.sector);
  if (node.type === "sector") pathParts.push(node.label);
  if (node.subsector) pathParts.push(node.subsector);
  if (node.type === "subsector") pathParts.push(node.label);
  if (node.region) pathParts.push(node.region);
  if (node.type === "site" || node.type === "endpoint") pathParts.push(node.type === "site" ? node.label : godViewState.nodeMap.get(node.parentSite)?.label || "Site");
  if (node.type === "endpoint") pathParts.push(node.label);
  const assetMix = node.type === "site" ? `<div class="entity-section"><h4>Connected asset mix</h4><div class="asset-mix"><i class="pos" style="width:${node.pos / node.assets * 100}%"></i><i class="kiosk" style="width:${node.kiosk / node.assets * 100}%"></i><i class="kitchen" style="width:${node.kitchen / node.assets * 100}%"></i></div><div class="asset-mix-labels"><span>POS ${node.pos}</span><span>Kiosk ${node.kiosk}</span><span>Kitchen ${node.kitchen}</span></div></div>` : "";
  $("#godInspector").innerHTML = `<div class="inspector-entity">
    <div class="entity-heading"><div><h3>${escapeHtml(node.label)}</h3><p>${escapeHtml(pathParts.join("  ›  "))}</p></div><span class="entity-status ${statusClass}">${statusLabel}</span></div>
    <div class="entity-facts">${facts.map(fact => `<div><span>${escapeHtml(fact[0])}</span><strong>${escapeHtml(fact[1])}</strong></div>`).join("")}</div>
    ${assetMix}
    <div class="entity-section"><h4>Continue through direct relationships</h4><div class="dependency-list">${dependencies.map(item => `<button type="button" data-god-focus-id="${item.id}">${escapeHtml(item.label)}</button>`).join("")}</div></div>
    <div class="inspector-tip">Choose a relationship to move deeper through the hierarchy. Highlighted lines show every direct dependency for this entity.</div>
  </div>`;
  renderGodExpandedInspector(node);
}

function renderGodExpandedInspector(node = null) {
  const panel = $("#godExpandedInspector");
  const body = $("#godExpandedInspectorBody");
  if (!node) {
    panel.hidden = true;
    body.innerHTML = "";
    return;
  }
  const source = $("#godInspector .inspector-entity");
  if (!source) return;
  panel.querySelector("header strong").textContent = $("#godSelectionType").textContent;
  body.innerHTML = source.innerHTML;
  panel.hidden = false;
}

function focusGodNode(nodeId, orient = true) {
  const node = godViewState.nodeMap.get(nodeId);
  if (!node) return;
  godViewState.selected = node;
  if (orient) {
    const yaw = Math.atan2(node.x, node.z || .001);
    const zAfterYaw = node.x * Math.sin(yaw) + node.z * Math.cos(yaw);
    godViewState.yaw = yaw;
    godViewState.pitch = Math.atan2(node.y, zAfterYaw || .001);
    const zoomByType = { function: 1.3, sector: 1.3, subsector: 1.55, region: 1.55, site: 1.9, endpoint: 2.15 };
    godViewState.zoom = zoomByType[node.type] || 1.35;
    $("#godZoomReadout").textContent = `${Math.round(godViewState.zoom * 100)}%`;
    setGodAutoRotate(false);
  }
  renderGodInspector(node);
  $("#godActivityFeed").innerHTML = `<strong>${escapeHtml(node.label)}</strong> selected · direct relationship paths highlighted`;
}

function findGodNodeAt(x, y) {
  let match = null;
  let nearest = Infinity;
  godViewState.screenNodes.forEach(({ node, point }) => {
    const distance = Math.hypot(point.x - x, point.y - y);
    const hitRadius = node.type === "endpoint" ? 6 : node.type === "site" ? 9 : 14;
    if (distance < hitRadius && distance < nearest) { match = node; nearest = distance; }
  });
  return match;
}

function setGodAutoRotate(enabled) {
  godViewState.autoRotate = enabled;
  $("#godAutoRotate").classList.toggle("is-active", enabled);
  $("#godAutoRotate").setAttribute("aria-pressed", String(enabled));
}

function resetGodView() {
  godViewState.yaw = -.42;
  godViewState.pitch = -.18;
  godViewState.zoom = 1;
  godViewState.selected = null;
  godViewState.hovered = null;
  godViewState.attentionOnly = false;
  $("#godAttentionOnly").classList.remove("is-active");
  $("#godAttentionOnly").setAttribute("aria-pressed", "false");
  $("#godZoomReadout").textContent = "100%";
  renderGodInspector();
  setGodAutoRotate(true);
}

function burstGodViewTraffic() {
  godViewState.trafficBurstUntil = performance.now() + 3600;
  godViewState.flows.forEach((flow, index) => { flow.progress = index / godViewState.flows.length; });
  $("#godFlowRate").textContent = "14.8k";
  $("#godSyncLabel").textContent = "Network-wide telemetry pulse running";
  $("#godActivityFeed").innerHTML = "Compass-wide signal pulse initiated · <strong>all relationship paths illuminated</strong>";
  godEvents.unshift({ status: "healthy", title: "Compass-wide graph pulse completed", detail: `${godViewState.nodes.length.toLocaleString("en-GB")} entities and all dependencies responded`, age: "now" });
  godEvents = godEvents.slice(0, 6);
  renderGodEvents();
  showToast("Graph pulse running", "Live telemetry has been accelerated across the Compass model.");
  setTimeout(() => {
    $("#godFlowRate").textContent = "8.4k";
    $("#godSyncLabel").textContent = "8,412 active data flows";
  }, 3800);
}

function syncGodFullscreenState() {
  const panel = $(".universe-panel");
  const nativeFullscreen = document.fullscreenElement === panel;
  const expanded = nativeFullscreen || panel.classList.contains("is-immersive");
  $("#godFullscreen").classList.toggle("is-active", expanded);
  $("#godFullscreen").setAttribute("aria-pressed", String(expanded));
  $("#godFullscreenLabel").textContent = expanded ? "Collapse" : "Expand";
  $("#godFullscreen").title = expanded ? "Exit full screen" : "Open the model full screen";
  requestAnimationFrame(resizeGodCanvas);
}

async function toggleGodFullscreen() {
  const panel = $(".universe-panel");
  if (document.fullscreenElement === panel) {
    await document.exitFullscreen();
    return;
  }
  if (panel.classList.contains("is-immersive")) {
    panel.classList.remove("is-immersive");
    document.body.classList.remove("god-immersive-open");
    syncGodFullscreenState();
    return;
  }
  if (panel.requestFullscreen) {
    try {
      await panel.requestFullscreen();
      return;
    } catch (error) {
      // Some local-file browser shells block the Fullscreen API; use the in-page equivalent.
    }
  }
  panel.classList.add("is-immersive");
  document.body.classList.add("god-immersive-open");
  syncGodFullscreenState();
}

function initGodView() {
  buildGodGraph();
  renderGodInspector();
  renderGodEvents();
  const canvas = $("#godCanvas");
  const wrap = $("#godCanvasWrap");
  new ResizeObserver(resizeGodCanvas).observe(wrap);

  canvas.addEventListener("pointerdown", event => {
    const rect = canvas.getBoundingClientRect();
    godViewState.dragging = true;
    godViewState.moved = false;
    godViewState.pointerX = event.clientX - rect.left;
    godViewState.pointerY = event.clientY - rect.top;
    canvas.classList.add("is-dragging");
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    if (godViewState.dragging) {
      const dx = x - godViewState.pointerX, dy = y - godViewState.pointerY;
      if (Math.abs(dx) + Math.abs(dy) > 2) godViewState.moved = true;
      godViewState.yaw += dx * .006;
      godViewState.pitch = Math.max(-1.25, Math.min(1.25, godViewState.pitch + dy * .005));
      godViewState.pointerX = x;
      godViewState.pointerY = y;
      setGodAutoRotate(false);
    } else godViewState.hovered = findGodNodeAt(x, y);
  });
  canvas.addEventListener("pointerup", event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    if (!godViewState.moved) {
      const selected = findGodNodeAt(x, y);
      if (selected) focusGodNode(selected.id, false);
      else {
        godViewState.selected = null;
        renderGodInspector();
      }
    }
    godViewState.dragging = false;
    canvas.classList.remove("is-dragging");
  });
  canvas.addEventListener("pointerleave", () => { godViewState.hovered = null; if (!godViewState.dragging) canvas.classList.remove("is-dragging"); });
  canvas.addEventListener("wheel", event => {
    event.preventDefault();
    godViewState.zoom = Math.max(.58, Math.min(2.25, godViewState.zoom * Math.exp(-event.deltaY * .001)));
    $("#godZoomReadout").textContent = `${Math.round(godViewState.zoom * 100)}%`;
  }, { passive: false });
  $("#godReset").addEventListener("click", resetGodView);
  $("#godFullscreen").addEventListener("click", toggleGodFullscreen);
  document.addEventListener("fullscreenchange", syncGodFullscreenState);
  $("#godAutoRotate").addEventListener("click", () => setGodAutoRotate(!godViewState.autoRotate));
  $("#godLabels").addEventListener("click", event => {
    godViewState.labels = !godViewState.labels;
    event.currentTarget.classList.toggle("is-active", godViewState.labels);
    event.currentTarget.setAttribute("aria-pressed", String(godViewState.labels));
  });
  $("#godAttentionOnly").addEventListener("click", event => {
    godViewState.attentionOnly = !godViewState.attentionOnly;
    event.currentTarget.classList.toggle("is-active", godViewState.attentionOnly);
    event.currentTarget.setAttribute("aria-pressed", String(godViewState.attentionOnly));
    godViewState.selected = null;
    renderGodInspector();
  });
  $("#godInspector").addEventListener("click", event => {
    const target = event.target.closest("[data-god-focus-id]");
    if (target) focusGodNode(target.dataset.godFocusId);
  });
  $("#godExpandedInspector").addEventListener("click", event => {
    const target = event.target.closest("[data-god-focus-id]");
    if (target) focusGodNode(target.dataset.godFocusId);
  });
  $("#godExpandedInspectorClose").addEventListener("click", () => { $("#godExpandedInspector").hidden = true; });
  requestAnimationFrame(drawGodView);
}

function bindEvents() {
  $("#liveToggle").addEventListener("click", event => {
    state.isLive = !state.isLive;
    event.currentTarget.classList.toggle("is-live", state.isLive);
    event.currentTarget.setAttribute("aria-pressed", String(state.isLive));
    $("#liveLabel").textContent = state.isLive ? "Live" : "Paused";
    $("#refreshText").textContent = state.isLive ? `Auto-refresh in ${state.refreshIn}s` : "Simulation paused";
  });
  $("#addTicketBtn").addEventListener("click", () => {
    if (state.currentView === "service") createDemoTicket(true);
    else if (state.currentView === "time2eat") simulateDeviceEvent(true);
    else burstGodViewTraffic();
  });
  $$('[data-view]').forEach(button => button.addEventListener("click", () => switchDashboard(button.dataset.view)));
  $("#offlineDrilldown").addEventListener("click", openEstateDrawer);
  $$('[data-transaction-range]').forEach(button => button.addEventListener("click", () => {
    transactionState.range = button.dataset.transactionRange;
    renderPulseChart();
  }));
  $$('[data-close-estate]').forEach(element => element.addEventListener("click", closeEstateDrawer));
  $("#estateDrawer").addEventListener("click", event => {
    const levelButton = event.target.closest('[data-estate-level="sites"]');
    if (levelButton) { renderEstateSites(); return; }
    const siteButton = event.target.closest('[data-site-code]');
    if (siteButton) { renderSiteDevices(siteButton.dataset.siteCode); return; }
    const deviceButton = event.target.closest('[data-device-id]');
    if (deviceButton && estateExplorerState.selectedSite) {
      const device = estateExplorerState.selectedSite.devices.find(item => item.id === deviceButton.dataset.deviceId);
      if (device) renderDeviceDiagnosis(estateExplorerState.selectedSite, device);
      return;
    }
    const rerunButton = event.target.closest('[data-rerun-analysis]');
    if (rerunButton && estateExplorerState.selectedSite && estateExplorerState.selectedDevice) {
      $("#analysisPanel").innerHTML = analysisProgressMarkup();
      startAnalysis(estateExplorerState.selectedSite, estateExplorerState.selectedDevice);
    }
  });
  $("#rotateToggle").addEventListener("click", event => {
    state.autoRotate = !state.autoRotate;
    event.currentTarget.classList.toggle("is-rotating", state.autoRotate);
    event.currentTarget.setAttribute("aria-pressed", String(state.autoRotate));
    event.currentTarget.title = state.autoRotate ? "Pause automatic screen rotation" : "Resume automatic screen rotation";
    $("#rotationLabel").textContent = state.autoRotate ? `Auto · ${state.rotationIn}s` : "Rotation paused";
  });
  $("#priorityFilter").addEventListener("change", () => renderTickets());
  $("#channelFilter").addEventListener("change", () => renderTickets());
  $("#priorityRows").addEventListener("click", event => {
    const priorityRow = event.target.closest('[data-priority-drill]');
    if (priorityRow) openPriorityDrawer(priorityRow.dataset.priorityDrill);
  });
  $$('[data-close-priority]').forEach(element => element.addEventListener("click", closePriorityDrawer));
  $("#priorityExplorer").addEventListener("click", event => {
    const ticketRow = event.target.closest('[data-priority-ticket]');
    if (!ticketRow) return;
    closePriorityDrawer();
    openDrawer(ticketRow.dataset.priorityTicket);
  });
  $("#ticketTable").addEventListener("click", event => {
    const row = event.target.closest("tr[data-ticket-id]");
    if (row) openDrawer(row.dataset.ticketId);
  });
  $$('[data-close-drawer]').forEach(el => el.addEventListener("click", closeDrawer));
  $("#advanceTicketBtn").addEventListener("click", advanceSelectedTicket);
  $("#assignTicketBtn").addEventListener("click", () => {
    const ticket = state.selectedTicket;
    if (!ticket) return;
    ticket.status = "Analyst assigned";
    ticket.owner = "Campus service desk";
    ticket.stage = Math.max(ticket.stage, 2);
    renderTickets();
    openDrawer(ticket.id);
    showToast("Analyst assigned", `${ticket.id} is now owned by Campus service desk`);
  });
  $("#fullscreenBtn").addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch { showToast("Wall mode unavailable", "Use your browser fullscreen shortcut instead."); }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeDrawer();
      closeEstateDrawer();
      closePriorityDrawer();
      const panel = $(".universe-panel");
      if (panel.classList.contains("is-immersive")) {
        panel.classList.remove("is-immersive");
        document.body.classList.remove("god-immersive-open");
        syncGodFullscreenState();
      }
    }
  });
}

function init() {
  hydrateSiteDevices();
  renderSparkline("openSpark", [472, 458, 449, 437, 441, 428, 419, 415, 405, 392, 387, 381]);
  renderSparkline("resolvedSpark", [84, 89, 98, 111, 128, 145, 163, 177, 188, 196, 201, 203], true);
  renderNewBars();
  renderPriorities();
  renderAgeChart();
  renderArrivals();
  renderResolvers();
  renderTickets();
  renderEstateBars();
  renderDeviceIssues();
  renderPulseChart();
  renderSparkline("availabilitySpark", [99.97,99.98,99.98,99.99,99.98,99.99,99.99,100,99.99,99.99,100,99.99], true);
  initGodView();
  updateHeadlineMetrics();
  updateDeviceMetrics();
  updateClock();
  addActivity("Live queue connected · <strong>12 active triage journeys</strong> · all service integrations responding normally");
  bindEvents();
  $("#rotateToggle").classList.add("is-rotating");
  setInterval(updateClock, 1000);
  setInterval(liveTick, 1000);
  setInterval(deviceTick, 1000);
  setInterval(rotationTick, 1000);
}

initAccessGate();
init();
