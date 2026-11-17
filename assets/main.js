/* PUD preview-1 — progressive enhancement only. Page works fully without this file. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* mobile nav */
  var nav = document.querySelector("header.site nav");
  if (nav && !nav.querySelector(".nav-toggle")) {
    var btn = document.createElement("button");
    btn.className = "nav-toggle";
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "sitenav");
    btn.textContent = "Menu";
    nav.id = "sitenav";
    nav.parentNode.insertBefore(btn, nav);
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); });
    });
  }

  /* proof counters — animate once, unless reduced motion */
  var stats = document.querySelectorAll(".stat .n");
  if (stats.length && "IntersectionObserver" in window && !reduce.matches) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || seen.has(e.target)) return;
        seen.add(e.target);
        var el = e.target, end = parseInt(el.dataset.n, 10), t0 = null, dur = 900;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step); else el.textContent = end;
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { io.observe(s); });
  }

  /* map: dot hover/tap -> name card */
  var card = document.getElementById("map-card");
  var cardF = document.getElementById("map-card-f");
  var wrap = document.querySelector(".map-wrap");
  function show(el, dot) {
    if (!el || !dot) return;
    el.innerHTML = "<strong></strong><span></span>";
    el.querySelector("strong").textContent = dot.dataset.name || "";
    el.querySelector("span").textContent = dot.dataset.where ? "· " + dot.dataset.where : "";
    el.hidden = false;
  }
  if (card && wrap) {
    document.querySelectorAll(".dot").forEach(function (dot) {
      function position() {
        var r = dot.getBoundingClientRect(), w = wrap.getBoundingClientRect();
        card.style.left = ""; card.style.top = "";
        card.style.left = Math.min(Math.max(8, r.left - w.left + 10), w.width - 200) + "px";
        card.style.top = Math.max(8, r.top - w.top - 64) + "px";
      }
      dot.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") { show(card, dot); position(); } });
      dot.addEventListener("focus", function () { show(card, dot); position(); });
      dot.addEventListener("pointerleave", function () { card.hidden = true; });
      dot.addEventListener("blur", function () { card.hidden = true; });
      dot.addEventListener("click", function (e) {
        e.preventDefault();
        if (card.hidden || card.dataset.cur !== dot.dataset.name) { show(card, dot); position(); card.dataset.cur = dot.dataset.name; }
        else { card.hidden = true; card.dataset.cur = ""; }
      });
      dot.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(card, dot); position(); } });
    });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) { card.hidden = true; card.dataset.cur = ""; } });
  }

  /* contact button: preview notice only, no endpoint */
  var send = document.getElementById("sendBtn");
  if (send) {
    send.addEventListener("click", function () {
      var note = send.form.querySelector(".form-note");
      if (note) note.textContent = "Preview build — the form is not connected yet. Please call the office nearest you.";
    });
  }
})();
