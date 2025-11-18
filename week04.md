# Week 4 – Drawing Machines

## Exploration & Experimentation

This week began with a simple but open-ended idea:  
I wanted to create a *drawing machine* — not one that you control directly, but one that draws autonomously through parameters. The system should feel alive, as if it’s sketching by itself.  

The first direction was inspired by **Vera Molnár’s generative drawings**, where structured grids are gradually disrupted by controlled randomness. I imagined a system that could be influenced through sliders — a mix of order and chaos — but not a traditional “drawing app.”  

My main idea:  
> The user can’t draw. They only influence the *parameters* — speed, randomness, density — and watch the system evolve.

The development evolved through three main iterations, each one bringing me closer to a stable, elegant machine that *breathes* on its own.

---

## Iteration 1 – Parameter Chaos
<iframe src="content/week04/embed1.html" width="100%" height="600" frameborder="no"></iframe>

### Concept  
The first prototype was an attempt to connect **`dat.GUI` controls** to a p5.js sketch — I wanted to tweak brush speed, color, and randomness in real time.  
It started as a classic “random line” system: a point moving around the canvas, leaving trails.  

The early challenges came immediately:
- The `dat.GUI` library wasn’t loading correctly (wrong script order in `<head>`).  
- Color and speed parameters were working, but the visuals looked like noise rather than rhythm.  
- Random motion felt chaotic rather than intentional — there was no structure to “hold” the movement.

### Key Realization  
I realized that a *rule-based structure* (like a grid or orbit) would give the randomness something to push against.  
The idea shifted from “random brush motion” to a **geometric system disturbed by noise** — something more Molnár-like.

---

## Iteration 2 – The Grid Machine
<iframe src="content/week04/embed2.html" width="100%" height="600" frameborder="no"></iframe>

### Concept  
The second version introduced a **grid** — a system of small squares where each cell draws a distorted rectangle built from slightly randomized lines.  
This was the first time the machine started to look like structured generative art rather than random motion.

Each parameter in the GUI directly shaped the composition:
- **Grid Size** – number of cells across the canvas.  
- **Gap** – spacing between cells (still unstable in this version).  
- **Irregularity** – how far each corner could drift from its geometric base.  
- **Line Weight** – visual density of the strokes.  

Changing these sliders instantly redrew the entire grid, revealing how a small numerical adjustment could drastically shift visual balance.

### Challenges  
This version was still unstable and full of quirks:
- Increasing the **gap** sometimes *shrunk* the overall grid, because the code kept trying to “fit” everything inside the canvas.  
- High irregularity values caused overlapping or collapsed shapes.  
- There was no temporal evolution yet — every change happened abruptly through the interface.  

Despite these issues, this version was the first time the system had *structure* rather than chaos.

### Turning Point  
Working with this static grid helped me realise that the machine didn’t need more shapes — it needed *behavior*.  
I began thinking of the parameters themselves as living agents that could move and fluctuate over time.  
That idea directly led to the self-evolving system in Iteration 3.

---

## Iteration 3 – The Living System
<iframe src="content/week04/embed3.html" width="100%" height="600" frameborder="no"></iframe>

### Concept  
This version became a **self-regulating machine**.  
The user can still adjust parameters through the GUI, but when *Auto Random* is activated, the system begins to evolve autonomously — always with *two parameters* in motion, never more, never less.

### Main Developments  
- **Two-parameter logic:** At any time, exactly two parameters are changing. When one finishes, a new one starts, overlapping rhythmically.  
- **Direction bias:** Each parameter moves in *one random direction* (up or down) until it hits a limit, where it “bounces” back.  
- **Dynamic timing:** A parameter runs for 4 seconds, while every 2 seconds a new one is introduced.  
- **Independent randomness:** Drawing randomness (`randomSeed`) and animation randomness (`Math.random()`) were decoupled to avoid predictable patterns.  
- **Cell-based scaling:** Each square now scales *within its own space*, never overlapping or distorting the grid.

### Final Refinements  
The last major fix was subtle but crucial:
- Occasionally, only one parameter moved — caused by overlapping timing windows.  
- The logic was rewritten to always maintain exactly *two active motions* by topping up immediately when one ended.  

After this, the system felt alive — constantly changing, but never chaotic. It breathes, adapts, and balances structure with variation.

---

## Influences & References

This project draws from algorithmic art pioneers who treated systems as creative collaborators rather than tools.

<div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; text-align:center;">
  <img src="content/week04/Image1.webp" width="45%">
  <img src="content/week04/Image2.webp" width="45%">
</div>
<p style="text-align:center;">
  <em>Vera Molnár, <strong>Interruptions</strong>, 1969. Black-and-white plotter drawing. Victoria &amp; Albert Museum.</em>
</p>

- **Vera Molnár** – Her work *Interruptions (1969)* was a key visual reference. Molnár explored *constructive disorder* within strict geometric systems, where the machine’s precision was intentionally disturbed to produce subtle irregularities. This conceptual tension between control and error became a direct influence on how my drawing machine operates.  
- **Georg Nees** – For his early rule-based drawings and explorations of order versus deviation.  
- **Anders Hoff (Inconvergent)** – For showing how controlled noise (Gaussian variation) can produce elegance rather than chaos.  

The piece became less about drawing and more about *meta-control*: building a system that redefines how a drawing machine can behave — precise, autonomous, and slightly unpredictable.

---

## Algorithmic Thinking

The final structure of the machine follows a simple but elegant logic:

1. **Autonomous Evolution**
   - Always two parameters move.  
   - Each runs for 4 s, with a new one starting every 2 s.  
   - Each picks a direction randomly and only reverses on hitting 0 or 100.

2. **Parameter Mapping**
   - `size` → scales each cell around its center (never overlaps).  
   - `irregularity` → adds Gaussian-like noise to edges.  
   - `strokeWeight` → controls visual density and rhythm.

3. **System Stability**
   - When a motion ends, a new one is immediately started (`while (motions.length < 2)`), guaranteeing perpetual dual evolution.  
   - All visuals derive from a single, centered grid that remains stable.

---

## Critical Reflection

This process started as a random drawing tool and ended as a living, evolving system.  
Each iteration removed noise and added *intentionality* — the randomness became structured, rhythmic, almost musical.  

What I learned most was how **system design becomes composition**:  
when you define the rules of change, you’re composing time itself.

Next, I want to explore how this could evolve in 3D space — not as geometry, but as behavior — where motion itself becomes the artwork.
