/* Animated TV grain.
   Full-screen per-frame noise is far too expensive, so a handful of
   noise tiles are baked once and then cycled — at ~24fps with a random
   sub-pixel offset each frame it is indistinguishable from live static. */
(function () {
  var canvas = document.getElementById("grain");
  if (!canvas) return;
  var ctx = canvas.getContext("2d", { alpha: true });

  var TILE   = 128;   // tile edge, px
  var FRAMES = 12;    // how many tiles to cycle through
  var FPS    = 24;    // film-grain cadence
  var AMOUNT = 26;    // peak alpha of a grain speck (0-255)

  var tiles    = [];
  var patterns = [];

  function bakeTiles() {
    tiles = [];
    patterns = [];
    for (var f = 0; f < FRAMES; f++) {
      var t = document.createElement("canvas");
      t.width = t.height = TILE;
      var tc = t.getContext("2d");
      var img = tc.createImageData(TILE, TILE);
      var d = img.data;
      for (var i = 0; i < d.length; i += 4) {
        // signed noise: half the specks lighten, half darken
        var v = Math.random();
        var lum = v < 0.5 ? 0 : 255;
        d[i] = d[i + 1] = d[i + 2] = lum;
        d[i + 3] = Math.random() * AMOUNT;
      }
      tc.putImageData(img, 0, 0);
      tiles.push(t);
      patterns.push(ctx.createPattern(t, "repeat"));
    }
  }

  var dpr = 1;
  function resize() {
    // grain is a 1px-scale effect, so cap the backing store at 1x on
    // hi-dpi screens: it looks right and costs a quarter of the fill
    dpr = 1;
    canvas.width  = Math.ceil(window.VW() * dpr);
    canvas.height = Math.ceil(window.VH() * dpr);
    bakeTiles();
  }

  var frame = 0;
  var last = 0;
  var interval = 1000 / FPS;

  function draw(now) {
    requestAnimationFrame(draw);
    if (now - last < interval) return;
    last = now;

    var p = patterns[frame % FRAMES];
    frame++;
    if (!p) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // jitter the tile origin so the 128px repeat never reads as a grid
    ctx.translate(-((Math.random() * TILE) | 0), -((Math.random() * TILE) | 0));
    ctx.fillStyle = p;
    ctx.fillRect(0, 0, canvas.width + TILE, canvas.height + TILE);
    ctx.restore();
  }

  var resizeTimer;
  function later() { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); }
  window.addEventListener("resize", later);
  window.addEventListener("orientationchange", later);

  resize();
  requestAnimationFrame(draw);
})();
