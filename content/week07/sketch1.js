// Pixel Rain Ripples (top-down water) — red/white/black palette
// This is a small 2D water simulation on a pixel grid.
// Two grids are used: "cur" = current water height, "prev" = last frame height.
// Each frame: we update the wave equation, then draw pixels with simple light shading.
// Controls: SPACE play/pause, A auto rain, R reroll, C clear, click = splash

let cell = 4, cols, rows;
let cur, prev;
let running = true;
let damping = 0.994;
let autoRain = true;
let rainRate = 0.025; // how many random drops per frame
let light = {x: 0.7, y: 0.4, z: 0.6};

function setup() {
  createCanvas(900, 540);
  pixelDensity(1);
  cols = floor(width / cell);
  rows = floor(height / cell);
  cur  = field(0);
  prev = field(0);
  reseed();
  frameRate(60);
}

function draw() {
  if (running) step();   // wave update
  if (autoRain) rain();  // random splashes
  renderShaded();        // draw pixels
}

function field(v) {
  let f = new Array(rows);
  for (let y = 0; y < rows; y++) f[y] = new Float32Array(cols).fill(v);
  return f;
}

function reseed() {
  // reset water, add a few big start splashes at random positions
  clearField();
  let n = int(random(4, 10));
  for (let i = 0; i < n; i++) splash(random(0, cols), random(0, rows), random(0.6, 1.2));
}

function clearField() {
  // zero out both grids so the surface is flat
  for (let y = 0; y < rows; y++) { cur[y].fill(0); prev[y].fill(0); }
}

function step() {
  // wave equation: neighbor average minus previous state, then damping
  let next = field(0);
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      let lap = (cur[y-1][x] + cur[y+1][x] + cur[y][x-1] + cur[y][x+1]) * 0.5 - prev[y][x];
      next[y][x] = lap * damping;
    }
  }
  prev = cur; cur = next;
}

function rain() {
  // pick random positions and add small splashes
  let hits = int(rows * rainRate);
  for (let i = 0; i < hits; i++) {
    let x = random(2, cols - 2);
    let y = random(2, rows - 2);
    splash(x, y, random(0.4, 1.0));
  }
}

function splash(cx, cy, s) {
  // add a smooth impulse (gaussian bump) into "cur" to start a ripple
  let r = int(6 * s), a = 0.18 * s;
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      let xx = int(cx + x), yy = int(cy + y);
      if (xx <= 1 || xx >= cols - 2 || yy <= 1 || yy >= rows - 2) continue;
      let d2 = x*x + y*y;
      let k = exp(-d2 / (2 * (r * 0.6) ** 2));
      cur[yy][xx] += a * k * (random() < 0.85 ? 1 : -1);
    }
  }
}

function renderShaded() {
  // compute a fake normal from height differences, then shade with one light vector
  // palette rule: steep slopes -> black, strong light -> white, otherwise red
  noStroke();
  let lx = light.x, ly = light.y, lz = light.z;

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      let dzdx = cur[y][x] - cur[y][x+1];
      let dzdy = cur[y][x] - cur[y+1][x];

      let nx = -dzdx, ny = -dzdy, nz = 1.0;
      let invLen = 1.0 / Math.sqrt(nx*nx + ny*ny + nz*nz);
      nx*=invLen; ny*=invLen; nz*=invLen;

      let d = max(0, nx*lx + ny*ly + nz*lz);
      let slope = (abs(dzdx) + abs(dzdy)) * 6.0;

      let c;
      if (slope > 1.1) c = color(0);
      else if (d > 0.72) c = color('#ffffff');
      else c = color('#e11616');

      fill(c);
      rect(x * cell, y * cell, cell, cell);
    }
  }
}

function keyPressed() {
  if (key === ' ') running = !running;
  else if (key === 'A' || key === 'a') autoRain = !autoRain;
  else if (key === 'R' || key === 'r') reseed();
  else if (key === 'C' || key === 'c') clearField();
}

function mousePressed() {
  // click adds one splash at the mouse position
  let x = constrain(int(mouseX / cell), 2, cols - 3);
  let y = constrain(int(mouseY / cell), 2, rows - 3);
  splash(x, y, random(0.6, 1.3));
}
