function preload() {
  const lib = document.createElement("script");
  lib.src = "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js";
  document.head.appendChild(lib);
}

const UI = {
  gridSize: 8,
  randomSeed: 42,
  size: 50,
  irregularity: 30,
  strokeWeight: 35,
  autoplay: false,
  toggle() {
    UI.autoplay = !UI.autoplay;
    if (UI.autoplay) startAuto();
    else stopAuto();
  },
};

let guiReady = false;
let gui;
let motions = [];
let intervalId = null;

const FPS = 30;
const EDGE_DELAY_MS = 0;
const NEW_MOTION_EVERY_MS = 2000;
const MOTION_DURATION_MS = 4000;
const STEP_MIN = 0.3;
const STEP_MAX = 0.7;
const MARGIN_RATIO = 0.08;

const evolveKeys = ["size", "irregularity", "strokeWeight"];

const pick = a => a[Math.floor(Math.random() * a.length)];
const uiToReal = key =>
  key === "size" ? map(UI.size, 0, 100, 0.1, 1.0)
: key === "irregularity" ? map(UI.irregularity, 0, 100, 0, 1)
: map(UI.strokeWeight, 0, 100, 0.5, 4);

function setup() {
  createCanvas(512, 512);
  frameRate(FPS);
  noFill();
  stroke(0);

  const wait = setInterval(() => {
    if (typeof dat === "undefined" || guiReady) return;
    clearInterval(wait);
    guiReady = true;

    gui = new dat.GUI({ width: 300 });
    gui.add(UI, "gridSize", 3, 20, 1).name("Grid Size");
    gui.add(UI, "randomSeed", 0, 999, 1).name("Seed");
    gui.add(UI, "size", 0, 100, 1).name("Size (%)");
    gui.add(UI, "irregularity", 0, 100, 1).name("Irregularity (%)");
    gui.add(UI, "strokeWeight", 0, 100, 1).name("Line Weight (%)");
    gui.add(UI, "toggle").name("▶ Auto Random");

    drawGrid();
  }, 30);
}

function draw() {
  if (!guiReady) return;

  if (UI.autoplay) {
    const now = millis();
    motions = motions.filter(m => now < m.endAt);

    while (motions.length < 2) scheduleMotion();

    for (const m of motions) {
      UI[m.key] += m.dir * m.speed;
      if (UI[m.key] >= 100) { UI[m.key] = 100; m.dir = -1; m.endAt += EDGE_DELAY_MS; }
      if (UI[m.key] <= 0)   { UI[m.key] =   0; m.dir =  1; m.endAt += EDGE_DELAY_MS; }
    }

    for (const c of gui.__controllers) c.updateDisplay();
  }

  drawGrid();
}

function startAuto() {
  motions = [];
  scheduleMotion();
  scheduleMotion();
  intervalId = setInterval(scheduleMotion, NEW_MOTION_EVERY_MS);
}

function stopAuto() {
  clearInterval(intervalId);
  intervalId = null;
  motions = [];
}

function scheduleMotion() {
  const now = millis();
  const freeKeys = evolveKeys.filter(k => !motions.some(m => m.key === k));
  const key = freeKeys.length ? pick(freeKeys) : pick(evolveKeys);

  let dir = pick([1, -1]);
  if (UI[key] >= 100) dir = -1;
  if (UI[key] <= 0) dir = 1;

  const speed = STEP_MIN + Math.random() * (STEP_MAX - STEP_MIN);
  motions.push({ key, dir, speed, startAt: now, endAt: now + MOTION_DURATION_MS });
}

function drawGrid() {
  background(240);
  randomSeed(round(UI.randomSeed));
  strokeWeight(uiToReal("strokeWeight"));

  const n = round(UI.gridSize);
  const irr = uiToReal("irregularity");
  const scale = uiToReal("size");
  const margin = width * MARGIN_RATIO;

  const gridW = width - 2 * margin;
  const gridH = height - 2 * margin;
  const cellW = gridW / n;
  const cellH = gridH / n;
  const cell = min(cellW, cellH);
  const s = cell * scale;
  const half = s / 2;

  const startX = (width - n * cell) / 2;
  const startY = (height - n * cell) / 2;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const cx = startX + i * cell + cell / 2;
      const cy = startY + j * cell + cell / 2;

      const pts = [
        createVector(cx - half, cy - half),
        createVector(cx + half, cy - half),
        createVector(cx + half, cy + half),
        createVector(cx - half, cy + half),
      ].map(p => createVector(
        p.x + random(-s * irr, s * irr),
        p.y + random(-s * irr, s * irr)
      ));

      const sides = floor(random(2, 5));
      for (let k = 0; k < sides; k++) line(pts[k].x, pts[k].y, pts[(k + 1) % 4].x, pts[(k + 1) % 4].y);
    }
  }
}
