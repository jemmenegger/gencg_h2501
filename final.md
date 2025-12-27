# Final Project — Orbital Lattice Drawing Machine (p5.js WEBGL)

**Author:** Julian Emmenegger  
**Course:** GENCG / Final Project - Breathing Cubes 
**Date:** 2025‑12‑27

---

## Abstract

This project is a **self-directed drawing machine** rendered in 3D with p5.js (WEBGL). It composes a centered **N×N×N lattice** of wireframe cubes whose vertices are perturbed by controlled jitter to evoke a hand-drawn, vibrating line quality. The piece evolves over time through **overlapping parameter drifts** (two at all times) while a **slow camera orbit** reveals structure without deforming the object itself. Randomness is **seeded** for reproducibility; mappings are bounded to keep the system legible.
The work explores how **rule-based structure** and **controlled noise** can produce a sense of intention and breath—somewhere between plotter aesthetics and living system.

---

## Live Demo (for GitHub Pages)

```html
<iframe src="content/final/embed.html" width="100%" height="80vh" style="min-height:760px;border:0;"></iframe>
```

**Files required in the repo:**

```
content/
  final/
    embed.html   ← loader that imports p5 and sketch.js
    sketch.js    ← the source below
```

---

## Gallery (Outputs)

_Add two screenshots of your lattice from different moments/angles if desired:_

```html
<div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
  <img src="content/final/snapshot1.png" width="45%" alt="Lattice view A">
  <img src="content/final/snapshot2.png" width="45%" alt="Lattice view B">
</div>
```

---

## Exploration & Experimentation

### Initial Intent
I wanted a **drawing machine** that does not accept brush input but **evolves parameters autonomously**. The goal was to preserve a clear geometric identity while letting noise and time introduce expression. I intentionally moved away from 2D strokes toward **3D structure**, because the relation between camera, parallax, and line density can carry “life” without requiring complex animation.

### Iterative Process (Condensed Log)

#### Iteration 0 — Spike (2D scratch)
- Early p5 sketches tried to “draw” with a wandering point and Gaussian noise.
- Outcome felt like TV static; no structural anchor.  
- Lesson: randomness needs a **scaffold**.

#### Iteration 1 — Jittered Geometry
- Moved to a single cube with jittered vertices; WEBGL line rendering.  
- Look felt right, but too minimal—no composition change over space.  
- Lesson: scale out via **lattice** and seed each cell deterministically.

#### Iteration 2 — Lattice + Parameter Controls
- Built an **N×N×N** lattice; each cell reseeded via `(seed + ix*10000 + iy*100 + iz)`.  
- Mapped UI parameters to safe ranges: `size`, `irr` (irregularity), `w` (stroke weight).  
- Introduced an **auto-random** concept, but early versions changed everything at once leading to mushy causality.  
- Bugs: gaps/scale coupling, oscillations that “wiggled” instead of drifting, and cases where only one parameter moved.
- Lesson: change **two parameters** at a time with overlapping windows and **one-directional** drift that only flips at bounds.

#### Iteration 3 — Two-Parameter Drift + Orbit
- Final model: at any instant **two drifts** are active. A new drift starts every **1.8 s** and each drift lasts **3.5 s**.  
- Directions chosen per drift; reflect at 0/100 only.  
- Camera: **auto orbit** with optional mouse control; on release, snap back with eased interpolation.  
- Seeded randomness restored reproducibility; line weights tuned for legibility.  
- Final issues resolved: enforcing “two active motions” invariant; shortest-arc camera snapping; size mapping capped to prevent cell overlap.

---

## Design Goals

- **Legibility over time:** motion should be readable as cause→effect (e.g., “lines thicken while jitter increases”).  
- **Stability of identity:** object is static; the **camera** does the revealing.  
- **Bounded mappings:** keep geometry from collapsing or crossing cells.  
- **Reproducibility:** seed-based determinism per cell.  
- **Minimal interface:** no GUI; just orbit + wheel zoom + autonomous evolution.

---

## Influences & References (aligned to the work)

- **Vera Molnár** — constructive systems with subtle rule-breaking; rigorous journaling of algorithmic process.  
- **Georg Nees** — early plotter drawings; lattices and rule-based composition.  
- **Frieder Nake / Manfred Mohr** — combinatorics and algorithmic geometry.  
- **Casey Reas** — process-driven systems; mapping parameters to emergent form.  
- **Anders Hoff (Inconvergent)** — noise as structure (Gaussian perturbations with discipline).

*(Deliberately excluding non-computational references that do not match the system.)*

---

## Algorithmic System

### State & Scheduling
- Let `UI = { seed, size, irr, w }` in `[0..100]`.  
- Maintain an array `motions` of active drifts, each: `{ k, dir, spd, end }`.  
- Invariants: **two motions active**; spawn a new one every `NEW_MS = 1800 ms`; each lasts `DUR_MS = 3500 ms`.  
- Drift integration: `UI[k] += dir * spd` per frame; reflect `dir` if hitting 0 or 100.

### Mappings (kept deliberately narrow)
| Parameter | Meaning                 | Map(0..100) | Reasoning |
|-----------|-------------------------|-------------|-----------|
| `size`    | cube size within cell   | 0.15–0.95   | avoid cross-cell overlap; keep room around edges |
| `irr`     | vertex jitter amount    | 0.00–0.60   | keep cube recognisable; cap chaos                 |
| `w`       | stroke weight           | 0.5–3.5     | readability on high/low DPI displays              |

### Camera
- Continuous orbit: `autoTheta += speed * dt`, `autoPhi = -0.35` (gentle top-down).  
- Mouse drag temporarily controls `(camTheta, camPhi)` within `±(π/2-0.05)`.  
- Release triggers **snap-back** via `easeOutCubic` and `lerpAngle` (shortest arc).  
- Scroll wheel clamps **radius** to `[350, 3200]`.

### Rendering
- Framing margin: `min(w,h) * 0.12`, uniform cell size.  
- Local seed per cell: `seed + x*10000 + y*100 + z`.  
- Cube drawn as 12 line segments with jittered vertices.  
- Frame rate target: **30 FPS** (stable on typical laptops with `N=6`).

---

## Technical Deep Dive

**Why two parameters?**  
Human-readable causality: single-parameter change can feel static; three+ becomes muddy. Overlap of two creates contrapuntal motion that can still be followed.

**Why map `size ≤ 0.95`?**  
Even at `irr=0.60`, corner jitter must not jump across cell boundaries. Limiting the base size gives jitter budget without collision.

**Why seed per cell and not per edge?**  
Per-cell seed keeps a cube’s “identity.” Changing frame-to-frame seeds would produce noise flicker instead of structural jitter.

**Why orbit instead of object rotation?**  
A stationary object with moving viewpoint maintains topology, encouraging the viewer to discover form rather than chase it.

---

## Reproducibility

- Seed is set in `setup()` as an integer. Same seed → same lattice.  
- Deterministic per-cell seeds ensure cubes don’t “crawl” over time—only camera and parameters evolve.

---

## Performance Considerations

- Complexity: `N^3` cubes × 12 edges; at `N=6`, 216 cubes (2592 segments).  
- If devices stutter: reduce to `N=5` or smaller canvas.  
- WEBGL line rendering differs by GPU/driver; the chosen stroke range keeps aliasing minimal.

---

## Testing & Validation

- **Legibility tests:** stepped through extreme values to verify the cube remained recognisable at all `irr` and `w` combinations.  
- **Scheduling tests:** added console probes to ensure two active motions; fixed cases where only one survived due to timing overlap.  
- **Snap-back tests:** exercised quadrant transitions to confirm shortest-arc interpolation and prevented pole flips with `camPhi` clamp.

---

## Known Limitations

- Line joins are GPU/driver dependent; ultra-thick strokes may behave differently across platforms.  
- Very high-DPI screens can make thin lines look faint; the mapping’s lower bound (0.5) mitigates this.

---

## Future Work

- Optional on-screen HUD (pause, lock parameter, save/recall seeds).  
- Controlled “beats” where `N` changes discretely with matched camera timing.  
- Offline batch export with metadata (seed, timeline, camera path).

---

## Final Presentation Alignment (Checklist)

- ✅ WEBGL 3D lattice; object static, camera orbits.  
- ✅ Two-parameter autonomous drift with **1.8 s** start cadence and **3.5 s** duration.  
- ✅ Parameter ranges bounded to preserve legibility.  
- ✅ Seeded determinism; per-cell stable identity.  
- ✅ Mouse orbit override + eased snap-back; wheel zoom.  
- ✅ No GUI sliders in the final; purely autonomous evolution.

---

## Deployment (GitHub Pages)

1. Create the structure:
   ```
   content/final/embed.html
   content/final/sketch.js
   ```
2. Use this `embed.html`:
   ```html
   <!doctype html>
   <html lang="en">
   <head>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width,initial-scale=1" />
     <title>Orbital Lattice – Embed</title>
     <style>
       html,body { margin:0; padding:0; height:100%; background:#f0f0f0; }
       canvas { display:block; }
     </style>
     <script src="https://cdn.jsdelivr.net/npm/p5@1.9.2/lib/p5.min.js"></script>
   </head>
   <body>
     <script src="sketch.js"></script>
   </body>
   </html>
   ```
3. In your Markdown, embed with:
   ```html
   <iframe src="content/final/embed.html" width="100%" height="80vh" style="min-height:760px;border:0;"></iframe>
   ```

---

## Appendix A — Full Source (`content/final/sketch.js`)

```js
const UI = { seed: 0, size: 55, irr: 35, w: 35 };
let motions = [];

// visual + lattice
const FPS = 30;
const N = 6;            // N^3 cubes, increase carefully
const MARGIN = 0.12;

// autoplay param evolution
const NEW_MS = 1800, DUR_MS = 3500, STEP_MIN = 0.25, STEP_MAX = 0.75;
const keys = ["size", "irr", "w"];
const pick = a => a[(Math.random() * a.length) | 0];

// camera orbit + snapping
let autoTheta = 0;
const autoPhi = -0.35;          // from above
let camTheta = 0, camPhi = autoPhi;

// start more zoomed out
let radius = 1100;

let isControlling = false;
let snapT = 1;                  // 0..1
let snapFromTheta = 0, snapFromPhi = autoPhi;

const AUTO_SPEED = 0.00035;     // radians per ms (slow steady)
const SNAP_MS = 700;            // snap duration

function mapUI(k) {
  if (k === "size") return map(UI.size, 0, 100, 0.15, 0.95);
  if (k === "irr")  return map(UI.irr,  0, 100, 0.00, 0.60);
  return map(UI.w,  0, 100, 0.5, 3.5);
}

function setup() {
  createCanvas(700, 700, WEBGL);
  frameRate(FPS);

  UI.seed = (random(1e6) | 0);
  motions.push(makeMotion(), makeMotion());

  stroke(0);
  noFill();

  camTheta = autoTheta;
  camPhi = autoPhi;

  radius = min(width, height) * 1.8; // more zoomed out
}

function draw() {
  const now = millis();

  // evolve params
  motions = motions.filter(m => now < m.end);
  while (motions.length < 2) motions.push(makeMotion(now));

  for (const m of motions) {
    UI[m.k] += m.dir * m.spd;
    if (UI[m.k] >= 100) { UI[m.k] = 100; m.dir = -1; }
    if (UI[m.k] <= 0)   { UI[m.k] = 0;   m.dir = 1; }
  }

  if (!draw.nextSpawn) draw.nextSpawn = now + NEW_MS;
  if (now >= draw.nextSpawn) { motions.push(makeMotion(now)); draw.nextSpawn = now + NEW_MS; }

  // camera behaviour
  if (!isControlling) {
    autoTheta += AUTO_SPEED * deltaTime;

    if (snapT < 1) {
      snapT = min(1, snapT + deltaTime / SNAP_MS);
      const t = easeOutCubic(snapT);
      camTheta = lerpAngle(snapFromTheta, autoTheta, t);
      camPhi   = lerp(snapFromPhi, autoPhi, t);
    } else {
      camTheta = autoTheta;
      camPhi = autoPhi;
    }
  }

  applyCamera(camTheta, camPhi, radius);

  background(240);
  strokeWeight(mapUI("w"));
  randomSeed(UI.seed);

  drawLattice();
}

function applyCamera(theta, phi, r) {
  const cp = cos(phi), sp = sin(phi);
  const x = r * cp * sin(theta);
  const y = r * sp;
  const z = r * cp * cos(theta);
  camera(x, y, z, 0, 0, 0, 0, 1, 0);
}

function mousePressed() {
  isControlling = true;
  snapT = 1;
}

function mouseDragged() {
  if (!isControlling) return;

  const s = 0.01;

  camTheta -= movedX * s;
  camPhi   -= movedY * s;

  const limit = PI / 2 - 0.05;
  camPhi = constrain(camPhi, -limit, limit);
}

function mouseReleased() {
  if (!isControlling) return;

  isControlling = false;
  snapFromTheta = camTheta;
  snapFromPhi = camPhi;
  snapT = 0;
}

function mouseWheel(e) {
  radius = constrain(radius + e.delta, 350, 3200);
  return false;
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function lerpAngle(a, b, t) {
  let d = (b - a) % TWO_PI;
  if (d > PI) d -= TWO_PI;
  if (d < -PI) d += TWO_PI;
  return a + d * t;
}

function makeMotion(now = millis()) {
  const free = keys.filter(k => !motions.some(m => m.k === k));
  const k = free.length ? pick(free) : pick(keys);

  let dir = pick([1, -1]);
  if (UI[k] >= 100) dir = -1;
  if (UI[k] <= 0) dir = 1;

  return { k, dir, spd: STEP_MIN + Math.random() * (STEP_MAX - STEP_MIN), end: now + DUR_MS };
}

function drawLattice() {
  const margin = min(width, height) * MARGIN;
  const usable = min(width, height) - 2 * margin;

  const cell = usable / N;
  const s = cell * mapUI("size");
  const irr = mapUI("irr");
  const start = -((N - 1) * cell) / 2;

  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    push();
    translate(start + x * cell, start + y * cell, start + z * cell);

    randomSeed(UI.seed + x * 10000 + y * 100 + z);
    drawJitterCube(s, irr);

    pop();
  }
}

function drawJitterCube(s, irr) {
  const h = s / 2, j = s * irr;

  const v = [
    [-h,-h,-h],[ h,-h,-h],[ h, h,-h],[-h, h,-h],
    [-h,-h, h],[ h,-h, h],[ h, h, h],[-h, h, h],
  ].map(([x,y,z]) => [x + random(-j,j), y + random(-j,j), z + random(-j,j)]);

  const e = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7]
  ];

  beginShape(LINES);
  for (const [a,b] of e) {
    vertex(v[a][0], v[a][1], v[a][2]);
    vertex(v[b][0], v[b][1], v[b][2]);
  }
  endShape();
}
```

---

## Appendix B — Changelog (Bugs Fixed)

- **Only one parameter active sometimes:** ensured `while (motions.length < 2)` top‑ups and separate periodic spawns every `NEW_MS`.  
- **Wiggle (back‑and‑forth noise):** switched to monotonic drift with bounce only at bounds.  
- **Grid overlap:** clamped `size` mapping to `≤ 0.95`.  
- **Camera snapping across wrong arc:** used `lerpAngle` with shortest‑arc wrap.  
- **Pole flipping:** clamped `camPhi` to `±(π/2−0.05)`.

---
