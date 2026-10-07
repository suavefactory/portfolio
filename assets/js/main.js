/* RUI SIMÕES — ascii index
   The ruler is 85 columns on a 17px pitch, the same scale the Virgil
   Abloh bar uses. 14 projects cycle across them, so column 1 and column
   15 are the same project — but only the column under the cursor ever
   lights up, never its repeats.

   Hovering a column runs that project in the strip; clicking it opens
   the project's link. */
(function () {
  /* Fisher-Yates: every ordering equally likely. The projects are
     reshuffled on each page load, and so are the images inside each
     one, so a refresh gives a different arrangement. Nothing is
     persisted — the order lasts exactly one session. */
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var P = shuffle(window.PROJECTS || []);
  P.forEach(function (p) { shuffle(p.media); });
  var PITCH = 17;                  // measured tick pitch, reference px
  var N     = 85;                  // columns across the ruler
  var RULER = (N - 1) * PITCH;     // 1428px

  var ruler   = document.getElementById("ruler");
  var metaTop = document.getElementById("metaTop");
  var metaBot = document.getElementById("metaBot");
  var sLine1  = document.getElementById("sLine1");
  var sLine2  = document.getElementById("sLine2");
  var metaBox = metaTop.parentNode;        // the cells re-arrange between
  var statBox = sLine1.closest(".status"); // the idle and project read-outs

  var tabs    = [];
  var showing = null;              // project index currently in the strip
  // there is no hover on a phone, so touch gets its own path: drag along
  // the ruler to scrub, tap once to preview, tap the same column again
  // to open it
  var TOUCH   = window.matchMedia("(hover: none)").matches;
  var primed  = -1;                // column a tap has already previewed
  // the player scales out of wherever the cursor was
  var px = window.VW() / 2, py = window.VH() / 2;
  window.addEventListener("pointermove", function (e) {
    px = e.clientX; py = e.clientY;
  }, { passive: true });

  /* ── viewport scale ────────────────────────────────────── */
  function fit() {
    document.documentElement.style.setProperty("--s", window.VW() / 1920);
  }
  fit();
  window.addEventListener("resize", fit);
window.addEventListener("orientationchange", fit);

  /* ── build the ruler ───────────────────────────────────── */
  for (var i = 0; i < N; i++) {
    (function (i) {
      var g  = i % P.length;       // column 1 and column 15 share a project
      var p  = P[g];
      var tx = i * PITCH;                              // tick sits here
      var l  = Math.max(0, tx - PITCH / 2);            // hit area around it
      var r  = Math.min(RULER + 1, tx + PITCH / 2);

      var el = document.createElement("button");
      el.className = "tab";
      el.type = "button";
      el.style.left  = l + "px";
      el.style.width = (r - l) + "px";
      el.setAttribute("aria-label", p.client + " — " + p.role + ", " + p.year);

      var tick = document.createElement("span");
      tick.className = "tick";
      tick.style.left = (tx - l) + "px";
      el.appendChild(tick);

      ruler.appendChild(el);
      tabs.push(el);

      el.addEventListener("mouseenter", function () { enter(g); });
      el.addEventListener("focus",      function () { enter(g); });
      // only the projects that have somewhere to go open a window
      // clicking a column spins the strip like a slot reel, then it
      // coasts back down to the drift speed
      el.addEventListener("click", function () {
        if (TOUCH && primed !== i) { primed = i; enter(g); return; }
        if (window.Strip) window.Strip.boost(2600, 1.2);
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" && tabs[i + 1]) { e.preventDefault(); tabs[i + 1].focus(); }
        if (e.key === "ArrowLeft"  && tabs[i - 1]) { e.preventDefault(); tabs[i - 1].focus(); }
      });
    })(i);
  }

  /* dragging a finger across the ruler scrubs through the projects,
     which is what hovering does with a mouse. elementFromPoint is used
     rather than arithmetic because #rot may be rotated a quarter turn. */
  var scrubbing = false;
  ruler.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") scrubbing = true;
  });
  ruler.addEventListener("pointermove", function (e) {
    if (!scrubbing || e.pointerType === "mouse") return;
    e.preventDefault();
    var hit = document.elementFromPoint(e.clientX, e.clientY);
    var tab = hit && hit.closest && hit.closest(".tab");
    if (!tab) return;
    var i = tabs.indexOf(tab);
    if (i >= 0 && i !== primed) { primed = i; enter(i % P.length); }
  });
  function endScrub() { scrubbing = false; }
  ruler.addEventListener("pointerup", endScrub);
  ruler.addEventListener("pointercancel", endScrub);

  var overRuler = false;
  ruler.addEventListener("mouseenter", function () { overRuler = true; });
  ruler.addEventListener("mouseleave", function () { overRuler = false; readout(showing); });
  ruler.addEventListener("focusout", function (e) {
    if (!ruler.contains(e.relatedTarget)) readout(showing);
  });

  /* ── hovering a column runs it ─────────────────────────── */
  var hoverTimer = null;

  function enter(g) {
    readout(g);
    // sweeping the ruler crosses a column every 17px, so the strip only
    // follows once the cursor settles
    clearTimeout(hoverTimer);
    if (g === showing) return;
    hoverTimer = setTimeout(function () {
      showing = g;
      if (window.Strip) window.Strip.show(P[g]);
    }, 90);
  }

  /* ── read-out ──────────────────────────────────────────── */
  function pad(n) { return (n < 10 ? "0" : "") + n; }


  function readout(g) {
    if (g === null || g === undefined) {
      metaBox.classList.remove("project");
      statBox.classList.remove("project");
      metaTop.textContent = "FILMMAKER";
      metaBot.textContent = "LISBON, PT";
      sLine1.textContent  = "SELECTED WORK";
      sLine2.textContent  = "2022—2026";
      return;
    }
    var p = P[g];
    window.CURRENT_PROJECT = p;            // what the 3D LINK points at
    metaBox.classList.add("project");
    statBox.classList.add("project");
    // left cell = which project (its month/year, then its name)
    metaTop.textContent = p.year;
    metaBot.textContent = p.name;
    // right cell = what it is, and what the work was
    sLine1.textContent  = p.title;
    sLine2.textContent  = p.role;
  }


  readout(null);

  /* The brightness running along the scale. Plays on load and then
     every 3s while idle — it is skipped whenever the cursor is on the
     ruler, so it never fights the column under the pointer. */
  function sweep() {
    tabs.forEach(function (el, i) {
      setTimeout(function () { el.classList.add("on"); }, i * 11);
      setTimeout(function () { el.classList.remove("on"); }, i * 11 + 260);
    });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimeout(sweep, 240);
    setInterval(function () { if (!overRuler) sweep(); }, 3000);
  }

  /* ── small-screen index ────────────────────────────────── */
  var ol = document.getElementById("listItems");
  if (ol) {
    P.forEach(function (proj, i) {
      var li = document.createElement("li");
      var inner =
        '<span class="n">' + pad(i + 1) + '</span>' +
        '<span class="c">' + proj.client +
          '<br><span class="d">' + proj.role + '</span></span>' +
        '<span class="y">' + proj.year + (proj.link ? " ↗" : "") + '</span>';
      li.innerHTML = proj.link
        ? '<a href="' + proj.link + '" target="_blank" rel="noopener">' + inner + '</a>'
        : inner;
      ol.appendChild(li);
    });
  }
})();
