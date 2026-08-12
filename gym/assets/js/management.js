const members = [
  { id: "ADY-101", name: "Rahul Patel", phone: "98260 11223", plan: "Monthly", expiry: "2026-08-12", status: "Active" },
  { id: "ADY-102", name: "Priya Sharma", phone: "97542 33445", plan: "Yearly", expiry: "2027-01-05", status: "Active" },
  { id: "ADY-103", name: "Amit Verma", phone: "90091 55667", plan: "Quarterly", expiry: "2026-07-28", status: "Due" },
  { id: "ADY-104", name: "Sneha Gupta", phone: "88894 77889", plan: "Monthly", expiry: "2026-07-20", status: "Overdue" },
  { id: "ADY-105", name: "Vikas Yadav", phone: "79995 22001", plan: "Half-yearly", expiry: "2026-11-02", status: "Active" },
  { id: "ADY-106", name: "Neha Joshi", phone: "91300 44112", plan: "Monthly", expiry: "2026-08-01", status: "Active" },
  { id: "ADY-107", name: "Rohit Mane", phone: "94250 88990", plan: "Quarterly", expiry: "2026-09-15", status: "Active" },
  { id: "ADY-108", name: "Anjali Singh", phone: "81090 33456", plan: "Monthly", expiry: "2026-07-26", status: "Due" },
];

const payments = [
  { member: "Rahul Patel", plan: "Monthly", amount: 1500, mode: "UPI" },
  { member: "Priya Sharma", plan: "Yearly", amount: 12000, mode: "UPI" },
  { member: "Vikas Yadav", plan: "Half-yearly", amount: 7500, mode: "Cash" },
  { member: "Neha Joshi", plan: "Monthly", amount: 1500, mode: "Card" },
];

const attendance = [
  { time: "06:12", member: "Rahul Patel", trainer: "Coach Arjun", area: "Free weights" },
  { time: "07:05", member: "Priya Sharma", trainer: "Coach Meera", area: "Cardio" },
  { time: "07:40", member: "Vikas Yadav", trainer: "Coach Arjun", area: "Strength" },
  { time: "18:15", member: "Neha Joshi", trainer: "Coach Kabir", area: "Functional" },
  { time: "19:02", member: "Rohit Mane", trainer: "Coach Meera", area: "Free weights" },
];

const trainers = [
  { name: "Coach Arjun", specialty: "Strength & Powerlifting", shift: "Morning", members: 42, status: "On floor" },
  { name: "Coach Meera", specialty: "Fat loss & Conditioning", shift: "Evening", members: 38, status: "On floor" },
  { name: "Coach Kabir", specialty: "Functional & Mobility", shift: "Evening", members: 27, status: "Break" },
  { name: "Coach Riya", specialty: "Beginner coaching", shift: "Morning", members: 31, status: "Off today" },
];

const footfall = [
  { day: "Mon", h: 55 },
  { day: "Tue", h: 62 },
  { day: "Wed", h: 48 },
  { day: "Thu", h: 70 },
  { day: "Fri", h: 74 },
  { day: "Sat", h: 88 },
  { day: "Sun", h: 66 },
];

const feeLedger = [];

function statusChip(status) {
  const map = { Active: "chip-ok", Due: "chip-warn", Overdue: "chip-danger", "On floor": "chip-ok", Break: "chip-warn", "Off today": "chip-muted" };
  return `<span class="chip ${map[status] || "chip-muted"}">${status}</span>`;
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

function renderMembers(filter = "") {
  const q = filter.toLowerCase();
  const rows = members
    .filter((m) => !q || m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.id.toLowerCase().includes(q))
    .map(
      (m) => `<tr>
        <td>${m.id}</td>
        <td>${m.name}</td>
        <td>${m.phone}</td>
        <td>${m.plan}</td>
        <td>${m.expiry}</td>
        <td>${statusChip(m.status)}</td>
      </tr>`
    )
    .join("");
  document.querySelector("#membersTable tbody").innerHTML = rows;

  const select = document.getElementById("feeMember");
  select.innerHTML = members.map((m) => `<option value="${m.name}">${m.name} (${m.id})</option>`).join("");
}

function renderPayments() {
  document.querySelector("#recentPayments tbody").innerHTML = payments
    .map((p) => `<tr><td>${p.member}</td><td>${p.plan}</td><td>₹${p.amount.toLocaleString("en-IN")}</td><td>${p.mode}</td></tr>`)
    .join("");
}

function renderAttendance() {
  document.querySelector("#attendanceTable tbody").innerHTML = attendance
    .map((a) => `<tr><td>${a.time}</td><td>${a.member}</td><td>${a.trainer}</td><td>${a.area}</td></tr>`)
    .join("");
}

function renderTrainers() {
  document.querySelector("#trainersTable tbody").innerHTML = trainers
    .map((t) => `<tr><td>${t.name}</td><td>${t.specialty}</td><td>${t.shift}</td><td>${t.members}</td><td>${statusChip(t.status)}</td></tr>`)
    .join("");
}

function renderFootfall() {
  const max = Math.max(...footfall.map((f) => f.h));
  document.getElementById("footfallChart").innerHTML = footfall
    .map((f) => `<div class="bar" style="height:${Math.round((f.h / max) * 100)}%"><span>${f.day}</span></div>`)
    .join("");
}

function renderFeeLedger() {
  const tbody = document.querySelector("#feeLedger tbody");
  if (!feeLedger.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:var(--muted)">No collections yet — try collecting a fee.</td></tr>`;
    return;
  }
  tbody.innerHTML = feeLedger
    .map((f) => `<tr><td>${f.time}</td><td>${f.member}</td><td>₹${Number(f.amount).toLocaleString("en-IN")}</td><td>${f.mode}</td></tr>`)
    .join("");
}

// Navigation
document.querySelectorAll(".mgmt-side button[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mgmt-side button").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`view-${btn.dataset.view}`).classList.add("active");
  });
});

document.getElementById("memberSearch").addEventListener("input", (e) => renderMembers(e.target.value));

document.getElementById("feeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const member = document.getElementById("feeMember").value;
  const amount = document.getElementById("feePlan").value;
  const mode = document.getElementById("feeMode").value;
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  feeLedger.unshift({ time, member, amount, mode });
  payments.unshift({ member, plan: document.getElementById("feePlan").selectedOptions[0].text.split("—")[0].trim(), amount: Number(amount), mode });
  renderFeeLedger();
  renderPayments();
  toast(`Receipt generated · ${member} · ₹${Number(amount).toLocaleString("en-IN")}`);
  e.target.reset();
});

document.getElementById("checkInBtn").addEventListener("click", () => {
  const pool = members.filter((m) => m.status === "Active");
  const m = pool[Math.floor(Math.random() * pool.length)];
  const trainersOn = ["Coach Arjun", "Coach Meera", "Coach Kabir"];
  const areas = ["Free weights", "Cardio", "Strength", "Functional"];
  const now = new Date();
  attendance.unshift({
    time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    member: m.name,
    trainer: trainersOn[Math.floor(Math.random() * trainersOn.length)],
    area: areas[Math.floor(Math.random() * areas.length)],
  });
  renderAttendance();
  const kpi = document.getElementById("kpiCheckins");
  kpi.textContent = String(Number(kpi.textContent) + 1);
  toast(`Checked in · ${m.name}`);
});

document.getElementById("addMemberBtn").addEventListener("click", () => {
  const n = members.length + 101;
  members.unshift({
    id: `ADY-${n}`,
    name: "New Walk-in Member",
    phone: "90000 00000",
    plan: "Monthly",
    expiry: "2026-08-25",
    status: "Active",
  });
  renderMembers(document.getElementById("memberSearch").value);
  document.getElementById("kpiMembers").textContent = String(Number(document.getElementById("kpiMembers").textContent) + 1);
  toast("Demo member added · ADY-" + n);
});

document.getElementById("refreshDemo").addEventListener("click", () => {
  footfall.forEach((f) => (f.h = 40 + Math.floor(Math.random() * 55)));
  renderFootfall();
  toast("Dashboard demo data refreshed");
});

renderMembers();
renderPayments();
renderAttendance();
renderTrainers();
renderFootfall();
renderFeeLedger();
