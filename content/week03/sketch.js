let targetY = 0;   // Sekunden: Welt-Y-Spin (links-rechts)
let targetX = 0;   // Minuten: Welt-X-Kipp (nicken)
let currentY = 0;
let currentX = 0;

let lastSecond = -1;
let lastMinute = -1;

let flashAlpha = 0;       // Text-Sichtbarkeit
let flashPending = false; // auslösen, sobald Bewegung zur Ruhe kommt

let myFont;

// Farbwechsel pro Minute
const palette = [
  [0, 255, 0],
  [0, 200, 255],
  [255, 150, 0],
  [200, 0, 255],
  [255, 40, 120]
];
let colorIdx = 0;

// Text-Layout
const FACE_TEXT_SIZE = 84;
const LINE_OFFSET     = 48;  // vertikaler Abstand der zwei Zeilen
const BLOCK_SHIFT_UP  = 20;  // gesamten Block leicht nach oben schieben

function preload() {
  myFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
  createCanvas(600, 600, WEBGL);
  angleMode(DEGREES);
  textFont(myFont);
  textSize(FACE_TEXT_SIZE);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0); // schwarz
  ambientLight(110);
  pointLight(255, 255, 255, 0, 0, 600);

  const s = second();
  const m = minute();
  const h = hour();

  // --- Ticks ---
  if (s !== lastSecond) {
    if (lastSecond === 59 && s === 0) {
      targetX += 90;                           // Minutenwechsel: Kipp um X (Nicken)
      colorIdx = (colorIdx + 1) % palette.length; // Farbe wechseln
    } else {
      targetY += 90;                           // pro Sekunde: Welt-Y Spin
    }
    flashPending = true;                       // Overlays erst zeigen, wenn Ruhe erreicht
    lastSecond = s;
  }
  if (m !== lastMinute) lastMinute = m;

  // --- weiche Bewegung ---
  currentY = lerp(currentY, targetY, 0.14);
  currentX = lerp(currentX, targetX, 0.14);

  const settled =
    abs(currentY - targetY) < 0.3 &&
    abs(currentX - targetX) < 0.3;

  if (flashPending && settled) {
    flashAlpha = 255;
    flashPending = false;
    // Snap & Bound
    currentY = targetY = targetY % 360;
    currentX = targetX = targetX % 360;
  }
  flashAlpha = max(0, flashAlpha - 14);

  // --- Kamera-Neigung fuer Tiefe ---
  rotateX(-20);
  rotateY(30);

  // --- Wuerfel (REIHENFOLGE ENTSCHEIDEND): erst Welt-Y (Sekunden), dann X (Minuten) ---
  const [r,g,b] = palette[colorIdx];

  // Kern
  push();
  rotateY(currentY);   // Sekunden: Welt-Y
  rotateX(currentX);   // Minuten: X (Nicken)
  emissiveMaterial(r, g, b);
  box(200);
  pop();

  // Glow-Shells (additiv, leicht groesser), gleiche Transform-Reihenfolge
  push();
  rotateY(currentY);
  rotateX(currentX);
  blendMode(ADD);
  noStroke();
  drawingContext.disable(drawingContext.DEPTH_TEST);
  for (let i = 1; i <= 3; i++) {
    fill(r, g, b, 18);
    box(200 + i * 18);
  }
  drawingContext.enable(drawingContext.DEPTH_TEST);
  blendMode(BLEND);
  pop();

  // --- Overlays nur waehrend Ruhephase ---
  if (flashAlpha > 0) {
    const half = 100;
    const eps  = 1.0;

    // Vorberechnung fuer RY -> RX (genau diese Reihenfolge!)
    const ry = radians(currentY);
    const rx = radians(currentX);
    const cy = cos(ry), sy = sin(ry);
    const cx = cos(rx), sx = sin(rx);

    // FRONT-Face-Normale (Start (0,0,1) -> RY -> RX):
    // Nach RY: (sy, 0, cy)
    // Nach RX: ( sy,
    //           -sx*cy,
    //            cx*cy )
    const nFx = sy;
    const nFy = -sx * cy;
    const nFz =  cx * cy;

    // Mittelpunkt der Frontflaeche
    const fFx = nFx * (half + eps);
    const fFy = nFy * (half + eps);
    const fFz = nFz * (half + eps);

    // Ausrichtung der Overlay-Ebene zur Front
    const fYaw   = degrees(Math.atan2(nFx, nFz));                           // rotateY
    const fPitch = degrees(Math.atan2(-nFy, Math.sqrt(nFx*nFx + nFz*nFz))); // rotateX

    // LINKE Face-Normale (Start (-1,0,0) -> RY -> RX):
    // Nach RY: (-cy, 0, sy)
    // Nach RX: ( -cy,
    //           -sy*sx,
    //            sy*cx )
    const nLx = -cy;
    const nLy = -sy * sx;
    const nLz =  sy * cx;

    const fLx = nLx * (half + eps);
    const fLy = nLy * (half + eps);
    const fLz = nLz * (half + eps);

    const lYaw   = degrees(Math.atan2(nLx, nLz));
    const lPitch = degrees(Math.atan2(-nLy, Math.sqrt(nLx*nLx + nLz*nLz)));

    // --- Strings ---
    const secStr = nf(s, 2);   // "01", "02", ...
    const hh = nf(h, 2);
    const mm = nf(m, 2);

    // Dezisekunden (0–9), Start bei 5, zweistellig
    const deciRaw   = Math.floor((performance.now() % 1000) / 100); // 0..9
    const deciShift = (deciRaw + 5) % 10;
    const deciStr   = nf(deciShift, 2); // "05".."09","00".."

    // Z-Test aus: Overlay soll immer oben liegen
    drawingContext.disable(drawingContext.DEPTH_TEST);

    // FRONT: Sekunden oben, Dezisekunden unten, Block leicht nach oben
    push();
    translate(fFx, fFy, fFz);
    rotateY(fYaw);
    rotateX(fPitch);
    fill(0, flashAlpha);
    noStroke();
    text(secStr, 0, -LINE_OFFSET - BLOCK_SHIFT_UP);
    text(deciStr, 0,  LINE_OFFSET - BLOCK_SHIFT_UP);
    pop();

    // LINKS: Stunden oben, Minuten unten, gleiches Layout
    push();
    translate(fLx, fLy, fLz);
    rotateY(lYaw);
    rotateX(lPitch);
    fill(0, flashAlpha);
    noStroke();
    text(hh, 0, -LINE_OFFSET - BLOCK_SHIFT_UP);
    text(mm, 0,  LINE_OFFSET - BLOCK_SHIFT_UP);
    pop();

    drawingContext.enable(drawingContext.DEPTH_TEST);
  }
}
