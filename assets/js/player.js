/* The player window.
   Clicking a column opens this small window at a random spot on screen,
   scaling out of the cursor. Chrome and motion follow virgilabloh.com
   /usmnt, read off its stylesheet: #1d1d1d body, 10px radius, #252525
   title bar, 12px round close, 10px mono filename, and the 0.18s
   ease-out scale(.92)->1 pop.

   A project with a link plays that link — YouTube and Vimeo through
   their embed endpoints, anything else framed directly. A project
   without one plays its own media instead. */
window.Player = (function () {
  var BASE   = window.MEDIA_BASE || "";
  var W      = 480;   // window width, reference px
  var PAD    = 9;     // glass frame around the content
  var MARGIN = 24;    // keep the window this far inside the viewport

  var el, fileEl, body, openBtn;
  var proj = null;
  var box  = { l: 0, t: 0 };

  function url(src) {
    return BASE + src.split("/").map(encodeURIComponent).join("/");
  }

  /* ── what to play ──────────────────────────────────────── */

  // the original site's vimeo params, kept so the chrome matches
  function embed(link) {
    var m = /vimeo\.com\/(\d+)/.exec(link);
    if (m) return "https://player.vimeo.com/video/" + m[1] +
                  "?autoplay=1&color=ffffff&title=0&byline=0&portrait=0";
    m = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/.exec(link);
    if (m) {
      // origin is required: without it YouTube cannot verify who is
      // embedding and refuses the player with "Error 153"
      var q = "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      if (/^https?:$/.test(location.protocol)) {
        q += "&origin=" + encodeURIComponent(location.origin);
      }
      return "https://www.youtube.com/embed/" + m[1] + q;
    }
    return link;   // anything else is framed as-is
  }

  function label(p) {
    if (!p.link) return p.name + "." + (p.media[0].type === "video" ? "mp4" : "jpg");
    if (/vimeo|youtu/.test(p.link)) return p.name + ".mp4";
    try { return new URL(p.link).hostname.replace(/^www\./, ""); }
    catch (e) { return p.name; }
  }

  function content(p) {
    if (p.link) {
      var f = document.createElement("iframe");
      f.src = embed(p.link);
      f.allow = "autoplay; fullscreen; picture-in-picture";
      f.setAttribute("allowfullscreen", "");
      return f;
    }
    // no link — play the project's own media
    var item = p.media.filter(function (m) { return m.type === "video"; })[0] || p.media[0];
    var n;
    if (item.type === "video") {
      n = document.createElement("video");
      n.muted = true; n.loop = true; n.autoplay = true; n.playsInline = true;
      n.setAttribute("playsinline", "");
      n.controls = true;
    } else {
      n = document.createElement("img");
      n.alt = "";
    }
    n.src = url(item.src);
    return n;
  }

  /* ── chrome ────────────────────────────────────────────── */

  var X = '<svg viewBox="0 0 6 6" fill="none" stroke="currentColor" stroke-width="1"><path d="M1.2 1.2l3.6 3.6M4.8 1.2L1.2 4.8"/></svg>';

  function build() {
    el = document.createElement("div");
    el.className = "win";
    el.setAttribute("role", "dialog");
    el.innerHTML =
      '<div class="win-bar">' +
        '<div class="l">' +
          '<button class="win-close" type="button" aria-label="Close">' + X + '</button>' +
          '<span class="win-file"></span>' +
        '</div>' +
        '<div class="r"><button class="win-open" type="button">OPEN</button></div>' +
      '</div>' +
      '<div class="win-body"></div>';
    document.body.appendChild(el);

    fileEl  = el.querySelector(".win-file");
    body    = el.querySelector(".win-body");
    openBtn = el.querySelector(".win-open");

    el.querySelector(".win-close").addEventListener("click", close);
    openBtn.addEventListener("click", function () {
      if (proj && proj.link) window.open(proj.link, "_blank", "noopener");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    drag(el.querySelector(".win-bar"));
  }

  /* ── placement ─────────────────────────────────────────── */

  function spot(w, h) {
    var vw = window.VW(), vh = window.VH();
    var b  = document.querySelector(".bar");
    var br = b ? b.getBoundingClientRect() : null;
    var maxL = Math.max(MARGIN, vw - w - MARGIN);
    var maxT = Math.max(MARGIN, vh - h - MARGIN);
    for (var i = 0; i < 24; i++) {
      var l = MARGIN + Math.random() * (maxL - MARGIN);
      var t = MARGIN + Math.random() * (maxT - MARGIN);
      if (!br || t + h < br.top - 8 || t > br.bottom + 8) return { l: l, t: t };
    }
    return { l: MARGIN + Math.random() * (maxL - MARGIN),
             t: Math.max(MARGIN, (br ? br.top : vh) - h - 16) };
  }

  /* Clamped, so the window can never leave the page — this guards the
     drag as well as the initial placement. */
  function place(l, t) {
    var w = el.offsetWidth, h = el.offsetHeight;
    var vw = window.VW(), vh = window.VH();
    box.l = Math.max(0, Math.min(l, Math.max(0, vw - w)));
    box.t = Math.max(0, Math.min(t, Math.max(0, vh - h)));
    el.style.left = box.l + "px";
    el.style.top  = box.t + "px";
  }

  /* ── open / close ──────────────────────────────────────── */

  function open(p, originX, originY) {
    if (!el) build();
    proj = p;

    var w = Math.min(W, window.VW() - MARGIN * 2);
    el.style.width = w + "px";
    body.style.height = Math.round((w - PAD * 2) * 9 / 16) + "px";

    fileEl.textContent = label(p);
    openBtn.style.display = p.link ? "" : "none";
    body.innerHTML = "";
    body.appendChild(content(p));

    // measured rather than assumed: the title bar sizes to its buttons
    el.style.visibility = "hidden";
    el.classList.add("on");
    var h = el.offsetHeight;
    el.style.visibility = "";

    var s = spot(w, h);
    place(s.l, s.t);

    // scale out of the cursor, in the window's own coordinates
    el.style.transformOrigin = (originX - s.l) + "px " + (originY - s.t) + "px";
    el.classList.remove("pop");
    void el.offsetWidth;                 // restart the keyframe
    el.classList.add("pop");
  }

  function close() {
    if (!el) return;
    el.classList.remove("on", "pop");
    body.innerHTML = "";                 // stops the video dead
    proj = null;
  }

  /* ── drag by the title bar ─────────────────────────────── */
  function drag(handle) {
    var sx, sy, sl, st, live = false;
    handle.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button")) return;
      live = true;
      sx = e.clientX; sy = e.clientY; sl = box.l; st = box.t;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", function (e) {
      if (live) place(sl + (e.clientX - sx), st + (e.clientY - sy));
    });
    function end(e) {
      if (!live) return;
      live = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  }

  // a shrinking viewport must not strand the window outside it
  window.addEventListener("resize", function () {
    if (el && el.classList.contains("on")) place(box.l, box.t);
  });

  return { open: open, close: close };
})();
