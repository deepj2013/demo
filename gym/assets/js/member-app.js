const logs = [];
const receipts = [
  { date: "12 Jul 2026", amount: 1500, mode: "UPI", status: "Paid" },
  { date: "12 Jun 2026", amount: 1500, mode: "Cash", status: "Paid" },
  { date: "12 May 2026", amount: 1500, mode: "UPI", status: "Paid" },
];

function switchScreen(name) {
  document.querySelectorAll(".app-screen").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".app-tabbar button").forEach((b) => b.classList.remove("active"));
  document.getElementById(`screen-${name}`).classList.add("active");
  const tab = document.querySelector(`.app-tabbar button[data-screen="${name}"]`);
  if (tab) tab.classList.add("active");
}

document.querySelectorAll(".app-tabbar button").forEach((btn) => {
  btn.addEventListener("click", () => switchScreen(btn.dataset.screen));
});

document.querySelectorAll("[data-go]").forEach((btn) => {
  btn.addEventListener("click", () => switchScreen(btn.dataset.go));
});

function renderLogs() {
  const box = document.getElementById("logList");
  if (!logs.length) {
    box.innerHTML = `<p style="color:var(--muted);font-size:0.9rem">No sets logged yet in this demo session.</p>`;
    return;
  }
  box.innerHTML = logs
    .map(
      (l) => `<article class="workout-card" style="padding:0.75rem">
        <h3 style="font-size:1.25rem">${l.name}</h3>
        <p style="margin:0">${l.sets} × ${l.reps} @ ${l.weight} kg${l.notes ? " · " + l.notes : ""}</p>
      </article>`
    )
    .join("");
}

function renderReceipts() {
  document.getElementById("receiptList").innerHTML = receipts
    .map(
      (r) => `<div class="receipt">
        <div>
          <strong>${r.date}</strong>
          <div style="color:var(--muted);font-size:0.8rem">${r.mode}</div>
        </div>
        <div style="text-align:right">
          <strong>₹${r.amount.toLocaleString("en-IN")}</strong>
          <div><span class="chip chip-ok">${r.status}</span></div>
        </div>
      </div>`
    )
    .join("");
}

document.getElementById("workoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  logs.unshift({
    name: document.getElementById("exName").value,
    sets: document.getElementById("exSets").value,
    reps: document.getElementById("exReps").value,
    weight: document.getElementById("exWeight").value,
    notes: document.getElementById("exNotes").value.trim(),
  });
  renderLogs();

  const workouts = document.getElementById("statWorkouts");
  workouts.textContent = String(Number(workouts.textContent) + 1);
  const mins = document.getElementById("statMinutes");
  mins.textContent = String(Number(mins.textContent) + 8);

  const ring = document.getElementById("weekRing");
  let pct = Number(getComputedStyle(ring).getPropertyValue("--pct")) || 68;
  pct = Math.min(100, pct + 6);
  ring.style.setProperty("--pct", pct);
  ring.querySelector("strong").textContent = pct + "%";

  document.getElementById("exNotes").value = "";
});

document.getElementById("payNowBtn").addEventListener("click", () => {
  const btn = document.getElementById("payNowBtn");
  btn.textContent = "Processing UPI…";
  btn.disabled = true;
  setTimeout(() => {
    receipts.unshift({
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      amount: 1500,
      mode: "UPI",
      status: "Paid",
    });
    renderReceipts();
    document.querySelector(".fee-banner h3").textContent = "Membership active";
    document.querySelector(".fee-banner p").textContent = "Next due 12 Sep 2026 · ₹1,500";
    btn.textContent = "Paid successfully ✓";
    btn.style.background = "var(--ok)";
  }, 900);
});

renderLogs();
renderReceipts();
