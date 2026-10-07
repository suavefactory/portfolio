/* The rotating LINK, built from the name object on ruisimoes.com.
   Same construction as the original — per-character tracking, the Õ
   hand-built as an O with a ~ placed over it, bevelled extrusion, a
   spin group nested inside a mouse-tilt group — but white instead of
   near-black, sized to overflow the viewport, and drifting slowly
   around the screen. It lives behind everything and ignores the
   pointer, so it never gets in the way of the bar or the stills. */
(function () {
const THREE = window.THREE;
const FontLoader   = THREE.FontLoader;
const TextGeometry = THREE.TextGeometry;

const canvas = document.getElementById("name3d");
const still  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas) {
  const FILL_W = 0.30;    // fraction of the viewport the word may span
  const FILL_H = 0.21;    // and of its height, whichever limits first
  const BASE_Y = 0.30;    // parked this far above centre, near the top
  const SPIN   = 0.48;    // radians per second, the original's 0.008/frame
  const DRIFT  = { x: 0.07, y: 0.035 };    // of the visible frame
  const PERIOD = { x: 37, y: 29 };         // seconds — slow, and coprime

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 6;

  /* Lighting kept deliberately flat: a high ambient so the front faces
     land at essentially the material colour, plus a weak directional
     that only separates the extruded sides and bevels by about 10%.
     Enough to read as dimensional, not enough to look shaded. */
  scene.add(new THREE.AmbientLight(0xffffff, 0.82));
  const dl = new THREE.DirectionalLight(0xffffff, 0.24);
  dl.position.set(3, 3, 4);
  scene.add(dl);


  const SIZE = 0.88, DEPTH = 0.32, TRACKING = 0.0;
  const cfg = {
    // `height` is what three r147 calls the extrusion; newer versions
    // renamed it `depth`. Both are passed so either build behaves.
    size: SIZE, depth: DEPTH, height: DEPTH, curveSegments: 8,
    bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 3
  };
  // the classic browser hyperlink blue. Matte, so no specular
  // highlight on top of the gentle face-to-side falloff.
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0000ee, metalness: 0.0, roughness: 0.95
  });

  // the font has no Õ, so it is assembled from an O and a ~
  function buildLine(word, font) {
    const line = new THREE.Group();
    let x = 0;
    for (const ch of [...word]) {
      const accent = ch === "Õ" || ch === "õ";
      const base   = accent ? (ch === "Õ" ? "O" : "o") : ch;

      const geo = new TextGeometry(base, { ...cfg, font });
      geo.computeBoundingBox();
      const w = geo.boundingBox.max.x - geo.boundingBox.min.x;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = x;
      line.add(mesh);

      if (accent) {
        const t = new TextGeometry("~", { ...cfg, font, size: SIZE * 0.48, depth: DEPTH * 0.5, height: DEPTH * 0.5 });
        t.computeBoundingBox();
        const tw = t.boundingBox.max.x - t.boundingBox.min.x;
        const tm = new THREE.Mesh(t, mat);
        tm.position.set(x + (w - tw) / 2, SIZE * 0.70, 0);
        line.add(tm);
      }
      x += w + TRACKING;
    }
    line.position.x = -x / 2;
    return line;
  }

  /* spin inside tilt inside float, so the three motions compose
     instead of fighting each other */
  const spin  = new THREE.Group();
  const tilt  = new THREE.Group();
  const float = new THREE.Group();
  tilt.add(spin);
  float.add(tilt);
  scene.add(float);

  // what the camera can see on the z=0 plane
  function frame() {
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    return { h, w: h * camera.aspect };
  }

  let spanX = 1, spanY = 1;   // the word's own size in world units
  let lastW = 0, lastH = 0;
  function resize() {
    const w = window.VW(), h = window.VH();
    if (!w || !h) return;     // laid out yet?
    lastW = w; lastH = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    const f = frame();
    // whichever limit bites first, so it is always fully on screen
    spin.scale.setScalar(Math.min((f.w * FILL_W) / spanX, (f.h * FILL_H) / spanY));
  }
  window.addEventListener("resize", resize);
  window.addEventListener("load", resize);
  window.addEventListener("orientationchange", () => setTimeout(resize, 120));

  let mx = 0, my = 0, lx = 0, ly = 0;
  window.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();   // rotated in portrait
    mx =  ((e.clientX - r.left) / r.width)  * 2 - 1;
    my = -((e.clientY - r.top)  / r.height) * 2 + 1;
  }, { passive: true });

  /* The canvas does not take pointer events — that would swallow clicks
     across the whole screen — so hits are raycast against the letters
     and handled in the capture phase, before anything underneath. */
  function hasLink() {
    const c = window.CURRENT_PROJECT;
    return !!(c && c.link);
  }

  const ray = new THREE.Raycaster();
  const portrait = window.matchMedia("(orientation: portrait) and (max-width: 900px)");
  const TOUCH    = window.matchMedia("(hover: none)").matches;
  const HIT      = TOUCH ? 0.40 : 1;   // smaller target on a phone; the
                                       // letters stay the size they are

  /* Map a viewport point into the canvas's own coordinates. In portrait
     #rot is turned a quarter turn, and getBoundingClientRect then
     reports the axis-aligned footprint of the ROTATED box — so reading
     x/y straight off it lands nowhere near the letters. The rotation is
     `rotate(90deg) translateY(-100%)`, which sends a local (lx,ly) to
     viewport (H-ly, lx); inverted, that is lx = vy, ly = W - vx. */
  function local(cx, cy) {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    if (portrait.matches) {
      return { x: cy, y: canvas.getBoundingClientRect().width - cx,
               w: canvas.clientWidth, h: canvas.clientHeight };
    }
    return { x: cx - r.left, y: cy - r.top, w: r.width, h: r.height };
  }

  function overWord(cx, cy) {
    if (!hasLink()) return false;      // read live, not from the last frame
    const p = local(cx, cy);
    if (!p) return false;
    ray.setFromCamera(new THREE.Vector2(
      (p.x / p.w) * 2 - 1, -(p.y / p.h) * 2 + 1), camera);

    // raycast against a shrunken copy of the word, so the tap target is
    // tighter than the artwork without changing how it looks
    let saved;
    if (HIT !== 1) {
      saved = spin.scale.clone();
      spin.scale.multiplyScalar(HIT);
      spin.updateMatrixWorld(true);
    }
    const hit = ray.intersectObject(spin, true).length > 0;
    if (saved) { spin.scale.copy(saved); spin.updateMatrixWorld(true); }
    return hit;
  }

  function onBar(e) { return e.target.closest && e.target.closest(".bar"); }

  window.addEventListener("pointermove", (e) => {
    if (onBar(e)) { document.body.style.cursor = ""; return; }
    document.body.style.cursor = overWord(e.clientX, e.clientY) ? "pointer" : "";
  }, { passive: true });

  window.addEventListener("click", (e) => {
    if (onBar(e) || !overWord(e.clientX, e.clientY)) return;
    const p = window.CURRENT_PROJECT;
    if (!p || !p.link) return;
    e.preventDefault();
    e.stopPropagation();
    window.open(p.link, "_blank", "noopener");
  }, true);

  (function (font) {
      const word = buildLine("LINK", font);
      spin.add(word);

      let box = new THREE.Box3().setFromObject(spin);
      let sz  = box.getSize(new THREE.Vector3());
      let mid = box.getCenter(new THREE.Vector3());
      // centre it on its own bounding box so the spin stays put
      word.position.x -= mid.x;
      word.position.y -= mid.y;

      // the underline, extruded to the same depth as the letters
      const rule = new THREE.Mesh(
        new THREE.BoxGeometry(sz.x, SIZE * 0.085, DEPTH), mat);
      rule.position.set(0, -sz.y / 2 - SIZE * 0.20, DEPTH / 2);
      spin.add(rule);

      box = new THREE.Box3().setFromObject(spin);
      sz  = box.getSize(new THREE.Vector3());
      spanX = sz.x || 1;
      spanY = sz.y || 1;
      resize();

      let last = 0;
      (function animate(now) {
        requestAnimationFrame(animate);
        // the font is parsed synchronously now, so this can run before
        // layout has settled — and Safari changes the viewport as its
        // toolbars collapse. Cheap to check, and self-correcting.
        if (window.VW() !== lastW || window.VH() !== lastH) resize();

        const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
        last = now;
        const t = now / 1000;

        lx += (mx - lx) * 0.04;
        ly += (my - ly) * 0.04;

        // nothing to link to, nothing to show
        float.visible = hasLink();

        if (!still) spin.rotation.y += SPIN * dt;

        tilt.rotation.x = -ly * 0.40;
        tilt.rotation.z = -lx * 0.20;

        const f = frame();
        float.position.x = Math.sin((t / PERIOD.x) * Math.PI * 2) * f.w * DRIFT.x + lx * f.w * 0.04;
        float.position.y = f.h * BASE_Y
                         + Math.cos((t / PERIOD.y) * Math.PI * 2) * f.h * DRIFT.y
                         + ly * f.h * 0.03;

        renderer.render(scene, camera);
      })(0);
  })(new FontLoader().parse(window.__HELVETIKER_BOLD));
}
})();
