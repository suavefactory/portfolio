/* The slide strip.
   The active project's media runs right to left on a seamless loop
   behind the bar. Every slide is the same height and keeps its own
   aspect ratio, so the widths vary but tops and bottoms line up.

   Motion: a slow constant drift that the wheel can shove along. A
   scroll adds an impulse to the velocity, which then eases back to the
   drift speed on an exponential curve — no steps, no snapping. */
window.Strip = (function () {
  var BASE  = window.MEDIA_BASE || "";

  var H      = 550;    // strip height, reference px
  var GAP    = 24;     // between slides, reference px
  var DRIFT  = 46;     // resting speed, reference px per second
  var PUSH   = 1.9;    // how hard one wheel notch shoves it
  var MAXV   = 2800;   // velocity ceiling, reference px per second
  var EASE   = 2.6;    // how fast velocity falls back to DRIFT
  var MIN    = 3;      // a project always gets at least this many slides
  var EAGER  = 3;      // slides fetched up front; the rest come in lazily

  var strip = document.getElementById("strip");
  var track = document.getElementById("track");

  var proj = null;
  var half = 0;        // width of one copy of the sequence, in px
  var x    = 0;
  var vel  = DRIFT;
  var last = 0;
  var boost  = 0;      // a temporary kick on top of vel, decaying away
  var boostK = 0;      // its decay rate
  var box = {};        // src -> { ratio, h } once the media reports its size

  function scale() { return window.VW() / 1920; }
  function url(src) { return BASE + src.split("/").map(encodeURIComponent).join("/"); }

  /* ── building ──────────────────────────────────────────── */

  function node(item, eager) {
    var n;
    if (item.type === "video") {
      n = document.createElement("video");
      n.muted = true; n.loop = true; n.autoplay = true; n.playsInline = true;
      n.setAttribute("playsinline", "");
      n.preload = eager ? "auto" : "metadata";
    } else {
      n = document.createElement("img");
      n.alt = "";
      n.decoding = "async";
      if (!eager) n.loading = "lazy";
    }
    n.dataset.src = item.src;

    if (!box[item.src]) {
      var read = function () {
        var w = n.naturalWidth || n.videoWidth;
        var h = n.naturalHeight || n.videoHeight;
        if (!w || !h) return;
        var c  = item.crop || {};
        var cx = c.x || 0, cy = c.y || 0;
        box[item.src] = {
          // the slide takes the ratio of the picture WITHOUT its bars...
          ratio: (w * (1 - 2 * cx)) + " / " + (h * (1 - 2 * cy)),
          // ...and the media is blown up by the crop so the bars fall outside
          h: (100 / (1 - 2 * cy)) + "%"
        };
        applyBox(item.src);
      };
      n.addEventListener(item.type === "video" ? "loadedmetadata" : "load", read);
    }
    n.src = url(item.src);
    return n;
  }

  // one media's measurements land on every copy of it at once, so both
  // halves of the loop stay identical
  function applyBox(src) {
    // compared directly rather than through a selector: these paths carry
    // spaces and commas, which are a pain to escape into one
    var all = track.querySelectorAll("img, video");
    for (var i = 0; i < all.length; i++) {
      var n = all[i];
      if (n.dataset.src !== src) continue;
      n.style.height = box[src].h;
      n.parentNode.style.aspectRatio = box[src].ratio;
    }
    measure();
  }

  /* Repeat the media until the loop has enough to work with: at least
     MIN slides, and at least two screens wide so the seam never shows.
     That also covers the "only one or two images" case — the same photo
     or video simply comes round again. */
  function sequence(p) {
    var guessW = H * 16 / 9;
    var need = Math.max(MIN, Math.ceil((window.VW() * 2) / (guessW * scale())) + 1);
    var out = [];
    while (out.length < need) out = out.concat(p.media);
    return out;
  }

  function build(p) {
    var first = (proj === null);
    proj = p;
    strip.classList.remove("empty");
    // re-run the fade so a project change lifts in rather than cutting
    strip.classList.remove("swap");
    void strip.offsetWidth;
    strip.classList.add("swap");
    if (first) strip.style.opacity = "";
    var seq = sequence(p);
    track.innerHTML = "";

    for (var copy = 0; copy < 2; copy++) {
      seq.forEach(function (item, i) {
        var a = document.createElement(p.link ? "a" : "div");
        a.className = "slide";
        if (p.link) {
          a.href = p.link;
          a.target = "_blank";
          a.rel = "noopener";
        }
        a.appendChild(node(item, copy === 0 && i < EAGER));
        if (box[item.src]) {
          a.style.aspectRatio = box[item.src].ratio;
          a.firstChild.style.height = box[item.src].h;
        }
        track.appendChild(a);
      });
    }
    x = 0;
    vel = DRIFT;
    measure();
  }

  /* ── loop geometry ─────────────────────────────────────── */

  // scrollWidth carries the gaps *between* items but not a trailing one,
  // so the repeat period is (scrollWidth + one gap) / 2
  function measure() {
    var g = GAP * scale();
    var w = (track.scrollWidth + g) / 2;
    half = w > 0 ? w : 0;
    wrap();
  }

  function wrap() {
    if (half <= 0) return;
    while (x <= -half) x += half;
    while (x > 0)     x -= half;
  }

  /* ── motion ────────────────────────────────────────────── */

  function step(dt) {
    // velocity relaxes back to the drift speed, framerate-independent
    vel += (DRIFT - vel) * (1 - Math.exp(-EASE * dt));
    // the click kick bleeds off on its own curve, leaving the wheel alone
    if (boost) {
      boost *= Math.exp(-boostK * dt);
      if (boost < 0.5) boost = 0;
    }
    x -= (vel + boost) * scale() * dt;
    wrap();
  }

  /* A slot-machine kick: `speed` extra px/s thrown on top of the drift,
     then spun down exponentially, ~95% gone after `secs`. Absolute
     rather than a multiplier, because the drift is slow enough that a
     percentage of it never reads as a burst. */
  function kick(speed, secs) {
    boost  = speed;
    boostK = 3 / secs;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!last) { last = now; return; }
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    step(dt);
    track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
  }

  window.addEventListener("wheel", function (e) {
    var d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    vel = Math.max(-MAXV, Math.min(MAXV, vel + d * PUSH));
  }, { passive: true });

  /* ── sizing ────────────────────────────────────────────── */

  function sizeStrip() {
    strip.style.height = (H * scale()) + "px";
    measure();
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { sizeStrip(); if (proj) build(proj); }, 160);
  });

  if (window.ResizeObserver) new ResizeObserver(measure).observe(track);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    DRIFT = 0; PUSH = 0; vel = 0;
  }

  sizeStrip();
  requestAnimationFrame(frame);

  return { show: build, boost: kick, current: function () { return proj; } };
})();
