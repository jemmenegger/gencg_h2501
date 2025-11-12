# Week 3 – Deconstructing a 3D Time-Object

## Exploration & Experimentation

This week's theme of time as a parameter immediately brought a clear idea to my mind: a physical, mechanical clock. I wanted to move away from 2D and dive into `WEBGL` to create a 3D object that reacted to time.

My concept was a "flipping cube" clock, where different units of time would control different axes of rotation:
* **Seconds:** For every second, the cube spins 90 degrees around its Y-axis (a "world spin").
* **Minutes:** When the seconds roll over, the cube flips 90 degrees on its X-axis (a "nodding" motion).

I had a clear vision for the *behavior* and *aesthetic* (glowing, holographic, smooth motion), but I knew the 3D math to make it work would be very difficult, especially attaching text to the moving faces.

I used AI assistance to help generate the complex code based on my detailed idea. My goal was then to deconstruct this code, understand its core components, and learn from how it was pieced together. I focused on understanding the *logic* of the animation, the rendering, and the timing, even if the complex trigonometry for the text projection was still a "black box."

*(My final 3D cube clock. Seconds spin the cube left/right, while minutes flip it forward.)*
<iframe src="content/week03/embed3.html" width="100%" height="600" frameborder="no"></iframe>

## Influences & References

While I guided the AI on the final aesthetic, my core inspiration came from several places:

* **Split-Flap Displays:** The main idea is based on old-school mechanical "flip clocks" (or Solari boards) from train stations. I wanted to capture that feeling of a physical object "ticking" over to reveal new information. 
* **Holographic UI Aesthetics:** The glowing `emissiveMaterial`, `blendMode(ADD)`, and the monospaced `SourceCodePro` font are all inspired by fictional sci-fi and holographic user interfaces.
* **"Juicy" Animation Principles:** The use of `lerp()` to create the smooth, easing motion is a key principle in game development to make animations feel physical and satisfying, rather than instant and robotic.

## Algorithmic Thinking

My learning this week was focused on reading the generated code and identifying the key "building blocks" of the system. I was able to isolate and understand these simple, powerful concepts:

**1. The "Tick" Logic:**
This is the brain of the clock. Instead of just running on `second()`, it checks *when the second changes*. I learned this is a much more robust way to trigger an event once.

```js
// Check if the second has just changed
if (s !== lastSecond) {
  
  // Is it a new minute?
  if (lastSecond === 59 && s === 0) {
    targetX += 90; // Add 90 degrees to the X-axis (Minute flip)
  } else {
    targetY += 90; // Add 90 degrees to the Y-axis (Second spin)
  }
  
  lastSecond = s; // Remember the new second
}