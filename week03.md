# Week 3 – Deconstructing a 3D Time-Object

## Exploration and Experimentation
The theme of time immediately gave me the idea of a physical, mechanical clock. I decided to move away from 2D and use `WEBGL` to create a 3D object that reacts to time.

My concept was a "flipping cube" where different time units control different axes. Seconds make the cube spin 90 degrees around the Y-axis, while minutes make it flip on the X-axis. I knew the 3D math and text projection would be very difficult, so I used AI to generate the code based on my detailed description. My goal was to deconstruct the result and understand the logic behind the animation and rendering.

<iframe src="content/week03/embed1.html" width="100%" height="600" frameborder="no"></iframe>

## Influences and References
While I guided the final look, my inspiration came from a mix of mechanical and digital sources:

* **Split-Flap Displays:** I wanted the feeling of old-school mechanical "flip clocks" found in train stations, where the object physically ticks to reveal new info.
* **Holographic UI:** The glowing materials and monospaced font were inspired by sci-fi holographic interfaces.
* **"Juicy" Animation:** I used game development principles like `lerp()` to make the motion feel smooth and heavy instead of instant and robotic.

## Algorithmic Thinking
My learning this week focused on reading the generated code and identifying the key building blocks. I was able to isolate the core logic that drives the clock.

**The "Tick" Logic**
Instead of just checking the current second, the code checks *when the second changes*. This is a robust way to trigger an animation exactly once per tick.

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
```

## Reflection
This week was different because I worked backwards from a complex result. Even though the trigonometry for the text was complex, I learned a lot by analyzing the logic of the state changes. It showed me that I can build advanced 3D systems by defining the behavior clearly, even if I need help with the math.