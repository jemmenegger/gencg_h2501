---
title: Semester Reflection
nav_order: 90
---
# Week 15 – Semester Reflection

## What I learned about my process
I work best when something runs on screen. As soon as I see movement, I can make fast decisions. I often push one value too far, watch it break, and then fix the rule so the failure turns into a feature. Sometimes I start polishing visuals too early. When I stop and ask, “what is the rule here?”, the result gets cleaner.

## Highlights from my projects
- **Week 4 – Drawing Machine:** I moved from random sliders to a clear rule: only two parameters change at the same time. They overlap in time and hand off to the next one. This made the system feel alive, not noisy.
- **Week 5 – Face Generator:** I used a fixed set of shapes (eyes, nose, mouth, tiles) and only changed position, scale, and order. Features had to stay inside a face mask, and I added simple collision checks so parts do not overlap. The style stayed consistent and still gave many unique results.
- **Week 7 – Pixel Rain Waves:** I switched to a small wave model (height field + damping). I drew normals from the height field and used a strict red–white–black palette. That kept the pixel look and still made ripples easy to read.
- **Final – Breathing Cube (WEBGL):** One time source drove multiple things (rotation, density, glow). The key was smooth easing and accumulation so it feels like a real object, not just numbers changing.

## How my algorithmic thinking changed
At the start it was “make it move.” Later it became “one set of values should drive several layers.” I also started to design time: what does the piece look like after 30 seconds, not just one frame? Accumulation and repetition became core tools.

## Using LLMs (how and why)
LLMs helped me ship faster. They gave me working scaffolds, quick refactors, and ideas when I got stuck. I still had to do the thinking: define the concept, the rules, and check that I understand the code. If I cannot explain the rule in plain words, I am not done. Overall, LLMs saved time and helped me learn more JavaScript patterns (buffers, schedulers, masking, parameter mapping). But it is important to read the code and know what it does.

## Biggest issues and fixes
- **Gap scaling bug (Week 4):** changing gap resized the whole grid. Fix: make scaling local to each cell and keep stable bounds.
- **Only one parameter moved (Week 4):** timing bug. Fix: always keep exactly two active motions and top up when one ends.
- **Features outside the face (Week 5):** placement ignored the mask edge. Fix: sample an offscreen face mask and use simple AABB collision.
- **Small black ear speck (Week 5):** draw order problem. Fix: add small “ear corridors” and adjust layer order.
- **Flat ripples (Week 7):** hard to read. Fix: normal based shading and a strict 3 color palette.

## Final thoughts
This semester I moved from making effects to composing behaviours. LLMs helped me work faster, but the work only made sense when I could explain the rule behind it. The best results often started as bugs that showed me a better rule. That is what I want to keep doing.
