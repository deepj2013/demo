(function () {
  function tick() {
    const el = document.getElementById("clock");
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  }
  tick();
  setInterval(tick, 30000);
})();
