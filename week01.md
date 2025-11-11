# Week 1 – Introduction & Foundations

## Exploration & Experimentation

This first week introduced the foundations of **generative art** — from its philosophical roots to its hands-on analog beginnings.  
We explored how rules, randomness, and interaction form the basis of creative systems, long before computers were involved.

During the analog session, I worked with another student on **Sprouts**, a rule-based drawing game by John H. Conway & Michael S. Patterson.  
Even without code, we quickly noticed parallels to algorithmic thinking: constraints, iteration, and emergent complexity.  
The unpredictability of each move reminded me how randomness and rules can generate surprising forms.

Later, we moved to **p5.js**, where I set up the environment and recreated simple sketches.  
I experimented with shapes, loops, and randomness — almost like translating the analog ideas into digital form.  
My final result was an **abstract composition**, built by layering geometric shapes with randomised positions and colours.  
This felt like painting with logic instead of a brush.

<img src="content/week01/IMG_8887.jpg" width="80%">

*(Analog Sprouts game — lines and constraints forming visual systems.)*

## Influences & References

We studied early pioneers such as **Hilma af Klint, Malevich, Kandinsky, Vera Molnár, Georg Nees**, and **Frieder Nake**,  
each showing how mathematical or rule-driven structures can lead to strong aesthetics.

> *“My life is a system of rules.”* – Vera Molnár  

Her statement resonated with the week’s theme: creativity emerging from limitation.  
Sol LeWitt’s *Wall Drawing #118* and the **Conditional Design Workbook** further highlighted how simple procedural rules  
can lead to infinite variation — a concept I later explored through p5.js.

## Algorithmic Thinking

From analog to digital, the mindset remained the same: define a system and let it evolve.

**Analog (Computing without computer)**  
- Followed Sol LeWitt’s rule set for *Wall Drawing #118*: “Fifty randomly placed points all connected by straight lines.”  
- Played *Sprouts* — strategy emerging from visual constraints.  
- Created a personal procedural drawing system inspired by Conditional Design.

<iframe src="content\week01\embed.html" width="100%" height="700" frameborder="no"></iframe>

**Digital (Computing with computer)**  
1. Set up **p5.js** environment (VS Code + Live Server).  
2. Reproduced a simple hand-drawing in code.  
3. Explored randomness and iteration in grids.  
4. Created an abstract digital painting from random shapes.

```js
function setup() {
  createCanvas(400, 400);
  noLoop();
  for (let i = 0; i < 200; i++) {
    fill(random(255), random(255), random(255), 100);
    noStroke();
    ellipse(random(width), random(height), random(20, 80));
  }
}
```
