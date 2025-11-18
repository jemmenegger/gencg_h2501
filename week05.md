# Week 5 – Parametric Faces

## Exploration & Experimentation

This week I built a **face generator** that avoids direct drawing. Instead, every portrait emerges from a **fixed set of shapes** that stay the same across outputs but get **re-positioned, re-scaled, and re-layered**. The goal: strong variety from strict constraints.

> Core idea: **~20 fixed shapes** (face tiles, two eyes, nose variants, mouth variants, hair clusters). Each output rearranges these elements — the viewer perceives a face even though only abstract building blocks are being shuffled.

---

## Live Demo

<iframe src="content/week05/embed1.html" width="100%" height="600" frameborder="no"></iframe>

---

## Process & Iterations

### 1) Defining the Toolkit  
- A **constant catalog** of forms: 6–10 face tiles (rectangles and rounded blocks), **two eyes** (white sclera, colored iris rings, pupil), **nose variants** (incl. round “potato” nose), **mouth silhouettes** (full, thin, cupid-bow, downturned, etc.), **hair clusters** (arches and cloud forms), plus **ears**.  
- A **shared palette** (6–8 colors) for face layers and a **globally darkened** version of the same palette for the background.

### 2) Placement & Rules  
- A **central face cluster** emerges from 3–4 tiles that visually fuse into one composite shape.  
- **Feature bands**: eyes in the top band, nose mid, mouth lower band.  
- **Collision boxes** prevent feature overlap; features must remain **inside the face mask**.  
- **Hair** lives only in the upper face band with side margins so **ears stay clear**.  
- **Always two eyes**, with occasional vertical or angled rotations for character.

### 3) Background & Separation  
- A **clustered tiled background** using neighbor-color reuse (bigger “patches” from small tiles), same palette but **uniformly darker** so the face reads clearly in front.  
- No contour lines required — separation comes from **color staging**.

---

## Results (Snapshots)

<div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; align-items:flex-start; text-align:center;">
  <figure style="margin:0;">
    <img src="content/week05/image1.png" width="300" alt="Face Generator Output 1">
    <figcaption style="font-size:0.9em;">a) dense face cluster with vertical eye rotation</figcaption>
  </figure>
  <figure style="margin:0;">
    <img src="content/week05/image2.png" width="300" alt="Face Generator Output 2">
    <figcaption style="font-size:0.9em;">b) potato nose, cupid-bow lips, cloud hair</figcaption>
  </figure>
  <figure style="margin:0;">
    <img src="content/week05/image3.png" width="300" alt="Face Generator Output 3">
    <figcaption style="font-size:0.9em;">c) minimal mouth, strong iris rings, rectangular tiles</figcaption>
  </figure>
</div>

---

## System Logic (concise)

**Shape vocabulary (fixed):**  
- ~6–10 face tiles, **2 eyes**, 1 nose (picked from 4 styles), 1 mouth (picked from 6 styles), 1–3 hair clusters, 2 ears.  
- **No new shapes** — only **position, scale, rotation, and layer** change.

**Placement:**  
- A face **mask** defines valid positions.  
- `getFeaturePos()` samples random points **inside** the mask and uses AABB boxes to avoid overlaps.

**Background:**  
- Coarse grid → subdivided tiles with **neighbor color reuse** to create clustered patches; **globally darker** than the face palette.

**Re-roll:**  
- A fresh arrangement is generated **every 4 seconds** (same shapes, new composition).

---

## Influences & References

My aim was to blend **Cubist composition** (fragmented planes, simultaneity of views) with a **vibrant pop-art palette** for crisp, graphic impact.

<div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; text-align:center;">
  <figure style="margin:0;">
    <img src="content/week05/ref1.jpg" width="45%" alt="Diego Rivera, 1914, Portrait de Messieurs Kawashima et Foujita">
    <figcaption style="font-size:0.9em;">
      Diego Rivera, <em>Portrait de Messieurs Kawashima et Foujita</em>, 1914 — oil & collage, private collection.
    </figcaption>
  </figure>
  <figure style="margin:0;">
    <img src="content/week05/ref2.jpg" width="45%" alt="Les Fenêtres simultanées sur la ville, 1912">
    <figcaption style="font-size:0.9em;">
      <em>Fensterbild (Les Fenêtres simultanées sur la ville)</em>, 1912 — dynamic windows/city simultaneity.
    </figcaption>
  </figure>
</div>

- **Cubism (Rivera, 1914)** — collage logic and planar fragmentation inform the face tiles and stacked layers.  
- **Orphism/Simultanism (Windows theme, 1912)** — overlapping “window” planes and rhythm of fields inspired the clustered background and color blocks.  
- **Pop-art vibrancy** — saturated, punchy palette to keep the compositions bold and contemporary.

---

## Technical Notes

- p5.js in the online editor; no external dependencies.  
- **Mask-based placement** ensures features stay inside the composite face shape.  
- **AABB collision** avoids feature overlap.  
- **Hair side margins** protect ear regions; ears render last to stay clean.

---

## Reflection & Next

This generator shows how **repetition + re-arrangement** can yield wide variation. Because the shapes are fixed, the composition and color decisions become the expressive arena — the viewer completes the face.

Next steps:  
- **Preset seeds** for reproducible characters,  
- **Batch export** (sprite sheets),  
- a **“mood axis”** that co-modulates multiple traits (mouth curvature, eye rotation, hair density).
