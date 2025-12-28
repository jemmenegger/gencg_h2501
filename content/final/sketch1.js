const UI = { seed: 0, size: 55, irr: 35, w: 35 };
let motions = [];

const FPS = 30;
const N = 6;
const MARGIN = 0.12;

const NEW_MS = 1800, DUR_MS = 3500, STEP_MIN = 0.25, STEP_MAX = 0.75;
const keys = ["size", "irr", "w"];
const pick = a => a[(Math.random() * a.length) | 0];

let autoTheta = 0;
const autoPhi = -0.35;
let camTheta = 0, camPhi = autoPhi;

let radius = 1100;

let isControlling = false;
let snapT = 1;
let snapFromTheta = 0, snapFromPhi = autoPhi;

const AUTO_SPEED = 0.00035;
const SNAP_MS = 700;

let isFrozen = false;        // space = freeze sim
let simNow = 0;              // simulated time (stops when frozen)
let nextSpawn = 0;           // next motion spawn time (sim time)

function mapUI(k) {
  if (k === "size") return map(UI.size, 0, 100, 0.15, 0.95);
  if (k === "irr")  return map(UI.irr,  0, 100, 0.00, 0.60);
  return map(UI.w,  0, 100, 0.5, 3.5);
}

function setup() {
  createCanvas(700, 700, WEBGL);
  frameRate(FPS);

  UI.seed = (random(1e6) | 0);     // same look every frame
  simNow = 0;
  nextSpawn = NEW_MS;

  motions = [];
  motions.push(makeMotion(0), makeMotion(0)); // start with 2 motions

  stroke(0);
  noFill();

  camTheta = autoTheta;
  camPhi = autoPhi;

  radius = min(width, height) * 1.8; // zoomed out start
}

function draw() {
  const dt = deltaTime;
  const dtSim = isFrozen ? 0 : dt;   // freeze => no sim progress

  simNow += dtSim;
  const now = simNow;

  if (dtSim > 0) {
    motions = motions.filter(m => now < m.end); // remove finished
    while (motions.length < 2) motions.push(makeMotion(now)); // keep 2

    const frameScale = dtSim / (1000 / FPS); // stable speed if FPS drops

    for (const m of motions) {
      UI[m.k] += m.dir * m.spd * frameScale;  // animate UI values
      if (UI[m.k] >= 100) { UI[m.k] = 100; m.dir = -1; }
      if (UI[m.k] <= 0)   { UI[m.k] =   0; m.dir =  1; }
    }

    if (now >= nextSpawn) {               // spawn new motion sometimes
      motions.push(makeMotion(now));
      nextSpawn = now + NEW_MS;
    }
  }

  if (!isControlling) {                   // auto cam only if not dragging
    if (dtSim > 0) autoTheta += AUTO_SPEED * dtSim; // freeze stops auto

    if (snapT < 1) {                      // smooth snap back
      snapT = min(1, snapT + dt / SNAP_MS);
      const t = easeOutCubic(snapT);
      camTheta = lerpAngle(snapFromTheta, autoTheta, t);
      camPhi = lerp(snapFromPhi, autoPhi, t);
    } else if (!isFrozen) {
      camTheta = autoTheta;
      camPhi = autoPhi;
    }
  }

  applyCamera(camTheta, camPhi, radius);

  background(240);
  strokeWeight(mapUI("w"));
  randomSeed(UI.seed);                    // keep jitter stable

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
  isControlling = true;                   // manual control start
  snapT = 1;                              // cancel snap while dragging
}

function mouseDragged() {
  if (!isControlling) return;

  const s = 0.01;
  camTheta -= movedX * s;                 // drag rotates
  camPhi += movedY * s;

  const limit = PI / 2 - 0.05;
  camPhi = constrain(camPhi, -limit, limit); // avoid flip
}

function mouseReleased() {
  if (!isControlling) return;

  isControlling = false;

  if (isFrozen) {
    autoTheta = camTheta;                 // keep resume smooth later
    snapT = 1;                            // no snap while frozen
  } else {
    snapFromTheta = camTheta;             // snap back to auto
    snapFromPhi = camPhi;
    snapT = 0;
  }
}

function mouseWheel(e) {
  radius = constrain(radius + e.delta, 350, 3200); // zoom
  return false;
}

function keyPressed() {
  if (key === " ") {
    isFrozen = !isFrozen;                 // toggle freeze

    if (isFrozen) {
      autoTheta = camTheta;               // align auto to current view
      snapT = 1;                          // stop snapping
    } else {
      autoTheta = camTheta;               // resume without jump
      snapFromTheta = camTheta;
      snapFromPhi = camPhi;
      snapT = 0;                          // snap back smoothly
    }
    return false;
  }
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

function makeMotion(now = simNow) {
  const free = keys.filter(k => !motions.some(m => m.k === k));
  const k = free.length ? pick(free) : pick(keys);

  let dir = pick([1, -1]);
  if (UI[k] >= 100) dir = -1;
  if (UI[k] <= 0) dir = 1;

  const spd = STEP_MIN + Math.random() * (STEP_MAX - STEP_MIN);
  return { k, dir, spd, end: now + DUR_MS };
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

    randomSeed(UI.seed + x * 10000 + y * 100 + z); // stable per cell

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
