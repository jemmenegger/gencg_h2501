// Embed 1 – Parameter Chaos
// Early drawing-machine prototype: random movement with adjustable speed and stroke

function preload() {
  const guiLib = document.createElement("script");
  guiLib.src = "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js";
  document.head.appendChild(guiLib);
}

let settings = {
  brushSize: 6,
  speed: 2,
  randomness: 1.2,
  color: [255, 120, 50],
  reset() {
    background(15);
    x = width / 2;
    y = height / 2;
  },
};

let x, y, angle;
let guiReady = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(15);
  strokeWeight(settings.brushSize);
  stroke(settings.color);
  noFill();

  x = width / 2;
  y = height / 2;
  angle = random(TWO_PI);

  // Wait for dat.GUI to load
  const wait = setInterval(() => {
    if (typeof dat !== "undefined" && !guiReady) {
      guiReady = true;
      clearInterval(wait);

      const gui = new dat.GUI();
      gui.add(settings, "brushSize", 1, 30, 1).name("Brush Size");
      gui.add(settings, "speed", 0.1, 10, 0.1).name("Speed");
      gui.add(settings, "randomness", 0.1, 3, 0.1).name("Randomness");
      gui.addColor(settings, "color").name("Color");
      gui.add(settings, "reset").name("Reset Canvas");
    }
  }, 100);
}

function draw() {
  if (!guiReady) return;

  stroke(settings.color);
  strokeWeight(settings.brushSize);

  // Add random deviation to the angle
  angle += random(-settings.randomness, settings.randomness);

  // Step forward in the current direction
  const stepX = cos(angle) * settings.speed;
  const stepY = sin(angle) * settings.speed;

  line(x, y, x + stepX, y + stepY);

  x += stepX;
  y += stepY;

  // Wrap around edges
  if (x < 0) x = width;
  if (x > width) x = 0;
  if (y < 0) y = height;
  if (y > height) y = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
