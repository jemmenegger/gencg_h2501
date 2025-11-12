// Embed 2 – Base Grid Machine (unoptimized gap version)

function preload() {
  const guiLib = document.createElement("script");
  guiLib.src = "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js";
  document.head.appendChild(guiLib);
}

let params = {
  gridSize: 8,
  gap: 25,
  irregularity: 0.3,
  strokeWeight: 2,
  redraw() {
    background(245);
    drawGrid();
  },
};

let guiLoaded = false;

function setup() {
  createCanvas(600, 600);
  background(245);
  noFill();
  stroke(0);

  const wait = setInterval(() => {
    if (typeof dat !== "undefined" && !guiLoaded) {
      guiLoaded = true;
      clearInterval(wait);

      const gui = new dat.GUI();
      gui.add(params, "gridSize", 3, 20, 1).name("Grid Size");
      gui.add(params, "gap", 0, 100, 1).name("Gap");
      gui.add(params, "irregularity", 0, 1, 0.01).name("Irregularity");
      gui.add(params, "strokeWeight", 0.5, 5, 0.1).name("Line Weight");
      gui.add(params, "redraw").name("Redraw");

      drawGrid();
    }
  }, 100);
}

function draw() {}

function drawGrid() {
  background(245);
  strokeWeight(params.strokeWeight);

  const n = round(params.gridSize);
  const gap = params.gap;
  const irr = params.irregularity;

  // This version tries to "fit" everything inside canvas — the cause of scaling bugs
  const totalGap = (n - 1) * gap;
  const usable = width - totalGap;
  const cell = usable / n;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = i * (cell + gap);
      const y = j * (cell + gap);

      const pts = [
        createVector(x, y),
        createVector(x + cell, y),
        createVector(x + cell, y + cell),
        createVector(x, y + cell),
      ].map(p =>
        createVector(
          p.x + random(-cell * irr, cell * irr),
          p.y + random(-cell * irr, cell * irr)
        )
      );

      const stop = floor(random(2, 5));
      for (let k = 0; k < stop; k++) {
        const a = pts[k];
        const b = pts[(k + 1) % 4];
        line(a.x, a.y, b.x, b.y);
      }
    }
  }
}
