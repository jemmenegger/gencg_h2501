---
title: Final Project – Breathing Cube
nav_order: 80
---
# Final Project Documentation: Breathing Cube

## Interactive sketch
<iframe src="content/final/embed1.html" width="100%" height="700" frameborder="no"></iframe>

<div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; text-align:center; margin-top:10px;">
  <img src="content/final/breathing-cube_01.webp" width="45%" alt="Breathing Cube screenshot 1">
  <img src="content/final/breathing-cube_02.webp" width="45%" alt="Breathing Cube screenshot 2">
</div>
<p style="text-align:center;">
  <em>Two stills from the final WEBGL lattice, showing the jittered wireframe cubes and the overall density.</em>
</p>

## Overview
Breathing Cube is a generative 3D sketch made with p5.js (WEBGL). It draws a lattice of wireframe cubes. Each cube looks slightly imperfect because its corners are jittered. The system slowly evolves a few parameters over time, which makes the whole structure feel like it is breathing.

Interaction is simple:
- Drag to rotate the view
- Scroll to zoom
- Press Space to freeze the simulation and inspect one moment

## Idea and goal
My goal was to create a system that stays clear and structured, but still feels alive.

I wanted a strict underlying order that never disappears, and then controlled disorder inside that order. I tried to avoid pure randomness. The viewer should still understand that there is a rule based system behind the visuals.

A simple rule I followed:
- Keep the big structure stable
- Let small details change over time

## Influences and references

### Vera Molnar: Interruptions
<div style="display:flex; justify-content:center; flex-wrap:wrap; text-align:center; margin:10px 0;">
  <img src="content/final/ref_molnar_interruptions.webp" width="70%" alt="Vera Molnar Interruptions reference image">
</div>
<p style="text-align:center;">
  <em>Vera Molnar, <strong>Interruptions</strong>, 1969. Black and white plotter drawing. Victoria and Albert Museum.</em>
</p>

Molnar’s idea of constructive disorder was an important reference during my weekly work. She starts with a strict geometric system and then disturbs it with controlled changes. That approach matches my process: the grid stays stable, but small deviations create expression.

### Georg Nees: Schotter (1968)
<div style="display:flex; justify-content:center; flex-wrap:wrap; text-align:center; margin:10px 0;">
  <img src="content/final/ref_nees_schotter.webp" width="70%" alt="Georg Nees Schotter reference image">
</div>
<p style="text-align:center;">
  <em>Georg Nees, <strong>Schotter</strong>, 1968. Systematic grid with increasing disorder.</em>
</p>

Nees shows how a grid can slowly break down while still staying readable as a grid. Even when things get messy, you can see the system. That idea influenced my decision to always keep the structure visible and only push disorder locally.

### Manfred Mohr: early hypercube explorations
<div style="display:flex; justify-content:center; flex-wrap:wrap; text-align:center; margin:10px 0;">
  <img src="content/final/ref_mohr_hypercube.webp" width="70%" alt="Manfred Mohr hypercube reference image">
</div>
<p style="text-align:center;">
  <em>Manfred Mohr, early cube and hypercube line systems. Structural drawing logic over realistic 3D rendering.</em>
</p>

Mohr helped me think about cubes as a graphic element instead of a realistic 3D object. His early hypercube works focus on structure and line systems. That pushed me to keep my cubes as wireframes and treat the sketch as drawing, not rendering.

### Anders Hoff (Inconvergent)
His work helped me understand controlled noise. It showed me that randomness can look clean and elegant when it is limited and applied with intention.

## Iteration process (weekly projects)

### Iteration 2: The Grid Machine
<iframe src="content/final/iteration2.html" width="100%" height="600" frameborder="no"></iframe>

In this iteration I realised I needed a rule based structure, so I introduced a grid. Each cell draws a distorted rectangle. That gave the randomness something to push against.

I built controls for:
- Grid Size
- Gap
- Irregularity
- Stroke Weight

This made exploration fast, because changing a slider instantly redrew the grid.

What did not work yet:
- The layout could become unstable
- Increasing the gap sometimes shrank the whole grid

This happened because the code tried to fit the grid into the canvas by subtracting the gaps from the total width. That changed the cell size in a way that broke the composition.

Main learning:
- Layout needs a stable framing (margins and a usable area)
- Fitting logic can create scaling bugs and make the system feel inconsistent

### Iteration 3: The Living System
<iframe src="content/final/iteration3.html" width="100%" height="600" frameborder="no"></iframe>

In the next iteration the machine became self regulating. I added an Auto Random mode where the sketch evolves on its own. The goal was that the system changes continuously, but in a controlled rhythm.

Key changes:
- The system never stops moving
- Parameters evolve smoothly instead of jumping

I had to refine the logic so it always stays active. I fixed a bug where sometimes only one parameter moved by forcing the system to always keep two active motions running.

Main learning:
- Constraints and timing are more important than adding more randomness
- Overlapping motions create organic change without chaos

## Final version: Breathing Cube (3D lattice)

### What changed compared to the weekly work
For the final piece I moved the same idea into 3D.

Instead of a 2D grid of rectangles, I draw an N×N×N lattice of cubes (N = 6, so 216 cubes). Each cube is a wireframe. The corners are jittered, which creates the same constructive disorder effect, but in space.

I also added a camera system:
- Slow auto orbit so the viewer can observe the structure
- Manual rotation and zoom
- Freeze mode to inspect a still state

## Algorithmic thinking (how it works)

### Code structure (quick map)
The sketch is basically split into three parts:
1. **Simulation**: update the evolving parameters (size, irr, stroke weight)
2. **Camera**: auto orbit + manual control + smooth snap back
3. **Drawing**: build the cube lattice and draw jittered wireframe cubes

---

### 1) Stable structure: a centred lattice
I first define a margin and a usable area. This makes the lattice feel framed, instead of touching the canvas edges.

```js
const margin = min(width, height) * MARGIN;
const usable = min(width, height) - 2 * margin;

const cell = usable / N;
const start = -((N - 1) * cell) / 2;
```

Then I place cubes in a 3D grid. Each cube has a fixed position based on its x, y, z index:

```js
for (let x = 0; x < N; x++)
  for (let y = 0; y < N; y++)
    for (let z = 0; z < N; z++) {
      push();
      translate(start + x * cell, start + y * cell, start + z * cell);
      // draw cube here...
      pop();
    }
```

This part is the strict rule of the piece. No matter how the parameters change, the lattice stays stable.

---

### 2) Drawing one cube: jittered vertices plus wireframe edges
A cube starts as 8 clean vertices (normal cube corners). Then I add jitter to each vertex. The jitter amount is based on the `irr` parameter.

```js
const h = s / 2;       // half size
const j = s * irr;     // jitter range

const v = [
  [-h,-h,-h],[ h,-h,-h],[ h, h,-h],[-h, h,-h],
  [-h,-h, h],[ h,-h, h],[ h, h, h],[-h, h, h],
].map(([x,y,z]) => [
  x + random(-j, j),
  y + random(-j, j),
  z + random(-j, j)
]);
```

Then I draw the cube as lines. I use a simple edge list (12 edges):

```js
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
```

So the cube stays readable, but it looks slightly drawn and imperfect.

---

### 3) Stable randomness (no flicker)
At first I had flickering, because random jitter would change every frame. I did not want that. I wanted each cube to keep its own stable shape.

So I control the randomness using `randomSeed()`.

Global seed (same every frame):
```js
randomSeed(UI.seed);
```

Then I create a deterministic seed per cube cell:
```js
randomSeed(UI.seed + x * 10000 + y * 100 + z);
```

This makes the jitter stable per cube. The cube does not re roll every frame. Only the evolving parameters change the overall look.

---

### 4) Autonomous evolution (the breathing motion)
The breathing effect is made by evolving only a few parameters over time:
- `size`
- `irr`
- `w` (stroke weight)

I treat each evolving parameter as a motion object:

```js
return { k, dir, spd, end: now + DUR_MS };
```

In the draw loop I always keep two motions alive:

```js
motions = motions.filter(m => now < m.end);
while (motions.length < 2) motions.push(makeMotion(now));
```

The motions change the UI values smoothly, and bounce at the limits:

```js
UI[m.k] += m.dir * m.spd * frameScale;

if (UI[m.k] >= 100) { UI[m.k] = 100; m.dir = -1; }
if (UI[m.k] <= 0)   { UI[m.k] =   0; m.dir =  1; }
```

Timing is important here:
- each motion runs about 3.5 seconds (`DUR_MS`)
- a new motion starts every 1.8 seconds (`NEW_MS`)
So they overlap, which creates a rhythm.

---

### 5) Frame rate safe movement
If FPS drops, I still want motion speed to feel similar. So I scale the change by frame time:

```js
const frameScale = dtSim / (1000 / FPS);
UI[m.k] += m.dir * m.spd * frameScale;
```

This keeps the breathing motion stable across machines.

---

### 6) Freeze mode for inspection (Space)
Freeze stops the simulation time, so parameters stop evolving:

```js
const dtSim = isFrozen ? 0 : dt;
simNow += dtSim;
```

When frozen:
- the lattice stays exactly the same
- auto camera orbit stops
But manual camera control still works, so I can inspect the form.

---

### 7) Camera behaviour (auto orbit + snap back)
Auto orbit moves the camera slowly around the centre:

```js
autoTheta += AUTO_SPEED * dtSim;
applyCamera(camTheta, camPhi, radius);
```

Manual control uses mouse drag to change `camTheta` and `camPhi`. On release, the camera snaps back smoothly using easing:

```js
const t = easeOutCubic(snapT);
camTheta = lerpAngle(snapFromTheta, autoTheta, t);
camPhi   = lerp(snapFromPhi, autoPhi, t);
```

This keeps the sketch autonomous, but still lets the viewer explore.

---

## Reflection
This process started as a random drawing tool and ended as a rule based system that feels alive.

The biggest improvement was not adding complexity, but adding clarity:
- Stable composition (framed lattice)
- Stable randomness per cube (no flicker)
- Controlled evolution with timing rules (always two motions)

In the final version, the structure always stays readable, while the small imperfections and slow motion keep it interesting over time.

## If I had more time
- Add an export function for high resolution still images
- Optimise performance so a larger lattice size (bigger N) can run smoothly
