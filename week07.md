---
title: Week 7 – Pixel Rain Waves
nav_order: 70
---# Week 07 – Pixel Rain Waves

## Exploration & Experimentation

Goal: a **bird’s-eye view of water** where **raindrops** trigger **concentric ripples** that overlap, cancel, and recombine. Instead of cellular life rules, I used a **discrete wave field** with damping, rendered as **pixel art**.

Why the **red–white–black** palette?
- **White** for highlights and crest lines.
- **Red** for the water body — strong readability at low resolution.
- **Black** for steep slopes and trough accents.  
Constrained color forces composition and rhythm over effects and gradients.

**Interactions:**  
`SPACE` play/pause · `A` auto-rain · `R` reroll (new seed) · `C` clear · click = splash

---

## Live Demo

<iframe src="content/week07/embed.html" width="100%" height="560" frameborder="0"></iframe>

---

## Iterations

### 1) Wave Core
A height field with two buffers (`cur`, `prev`) updated by a **4-neighbor Laplacian** + **damping**. The first pass animated correctly but looked flat; the ripples needed visual cues.

### 2) Light & Contrast
Per-pixel **normals** approximated from local differences plus a simple **Lambert highlight**. Threshold mapping: **white** for highlights, **red** for body, **black** for steep slopes. Readability jumped without leaving the pixel look.

### 3) Rain & Variation
Each drop is a **Gaussian impulse** for clean initial rings. **Auto-rain** adds stochastic small drops; **reroll** spawns broad seed waves. Same rules, but every session looks different.

---

## Results (Snapshots)

<div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; align-items:flex-start; text-align:center;">
  <figure style="margin:0;">
    <img src="content/week07/img1.webp" width="300" alt="Wide seed ripples with white speculars">
    <figcaption style="font-size:0.9em;">a) Reroll seed: overlapping ring fronts</figcaption>
  </figure>
  <figure style="margin:0;">
    <img src="content/week07/img2.webp" width="300" alt="Dense interference from auto-rain">
    <figcaption style="font-size:0.9em;">b) Auto-rain: interference in red–white–black</figcaption>
  </figure>
  <figure style="margin:0;">
    <img src="content/week07/img3.webp" width="300" alt="Single click splash">
    <figcaption style="font-size:0.9em;">c) Single splash: crisp edge, soft decay</figcaption>
  </figure>
</div>

---

## Algorithmic Thinking

**State:** two fields `cur[y][x]` (now), `prev[y][x]` (previous).

**Update (discrete wave with damping):**
```js
lap = (cur[y-1][x] + cur[y+1][x] + cur[y][x-1] + cur[y][x+1]) * 0.5 - prev[y][x];
next[y][x] = lap * damping; // ~0.99–0.995
```

**Drops (Gaussian impulse):**
```js
cur[yy][xx] += amp * Math.exp(-d2 / (2 * sigma * sigma)) * sign;
```

**Shading (normals + 3-tone palette):**
```js
dzdx = cur[y][x] - cur[y][x+1];
dzdy = cur[y][x] - cur[y+1][x];
n = normalize([-dzdx, -dzdy, 1]);
h = Math.max(0, dot(n, light));
color = slope>t1 ? black : (h>t2 ? white : red);
```

---

## Influences & References

- **Height-field wave solvers** as a simple, robust real-time model.  
- **Minimal palettes** in pixel art — structure over shader complexity.  
- Prior work with **reaction–diffusion / wave-like systems** as conceptual grounding.

---

## Critical Reflection

Reducing to **three colors** and a **simple wave model** forced clarity: composition, timing, density. With **reroll** and **auto-rain**, the system stays fresh without added complexity.  
Key learning: even at low resolution, **normal estimation + threshold mapping** brings strong legibility and style.

**Next:** optional 8-neighbor Laplacian (wider fronts), position-dependent damping (viscosity), and small preset controls for seeds and lighting.
