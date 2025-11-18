# Week 4 – Drawing Machines

## Exploration and Experimentation
I started this week with a simple idea. I wanted to create a drawing machine that runs on its own parameters. The goal was a system that feels alive, where I do not draw directly but just watch it evolve.

**Iteration 1: Parameter Chaos**
My first prototype used `dat.GUI` controls to tweak brush speed and randomness in real time. It was a classic random line system, but I faced immediate challenges. The library did not load correctly at first because of a script order error, and the visuals looked like noise rather than rhythm. The random motion felt chaotic because there was no structure to hold it.

<iframe src="content/week04/embed1.html" width="100%" height="600" frameborder="no"></iframe>

**Iteration 2: The Grid Machine**
I realized I needed a rule-based structure, so I introduced a grid where each cell draws a distorted rectangle. This gave the randomness something to push against.

I could control parameters like **Grid Size**, **Gap**, and **Irregularity** directly. Changing the sliders instantly redrew the grid, showing how small numbers could shift the balance. However, it was still unstable. For example, increasing the gap sometimes shrank the whole grid because the code tried to fit everything inside the canvas incorrectly.

<iframe src="content/week04/embed2.html" width="100%" height="600" frameborder="no"></iframe>

**Iteration 3: The Living System**
In the final version, the machine became self-regulating. When "Auto Random" is on, the system evolves on its own. It feels alive because the parameters change in a rhythm rather than jumping abruptly.

I had to refine the logic to make sure it never stopped moving. I fixed a bug where sometimes only one parameter moved by forcing the system to always top up the active motions.

<iframe src="content/week04/embed3.html" width="100%" height="600" frameborder="no"></iframe>

## Influences and References
My main inspiration came from artists who treat systems as collaborators.

* **Vera Molnár:** Her work *Interruptions* was the key reference. She explored "constructive disorder," where a strict geometric system is disturbed by controlled randomness.
* **Georg Nees:** I looked at his early rule-based drawings to understand order versus deviation.
* **Anders Hoff (Inconvergent):** He showed me how controlled noise can produce elegance rather than chaos.

<div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; text-align:center;">
  <img src="content/week04/Image1.png" width="45%">
  <img src="content/week04/Image2.png" width="45%">
</div>

## Algorithmic Thinking
To make the machine feel "alive," I had to implement very specific logic rules.

**1. Autonomous Evolution**
At any time, exactly two parameters are changing. When one motion finishes, a new one starts immediately so the system never stops.

**2. Dynamic Timing**
Each parameter runs for 4 seconds. A new one is introduced every 2 seconds, creating an overlap.

**3. Direction and Bias**
Each parameter picks a random direction (up or down) and only bounces back when it hits a limit like 0 or 100.

**4. Parameter Mapping**
* `size` scales each cell within its own space so they never overlap.
* `irregularity` adds noise to the edges.
* `strokeWeight` controls the visual density.

## Reflection
This process started as a random drawing tool and ended as a living, evolving system. Each iteration removed noise and added intentionality. The randomness became structured and rhythmic.

The biggest lesson for me was seeing how system design becomes composition. When you define the rules of how things change, you are actually composing time itself.