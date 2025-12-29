---
title: Week 2 – Grids, Loops & Transformation
nav_order: 30
---
# Week 2 – Grids, Loops & Transformation

## Exploration and Experimentation
Moving on from the random layers of the first week, I shifted my focus to structured, grid-based patterns. This meant I had to get much more comfortable with JavaScript syntax, especially using nested for loops to place shapes across the canvas.

I spent a lot of time tweaking the code to see what happened. I experimented by changing the `space` variable to adjust the density and hiding different lines to see the grid structure. I also placed squares both on the grid points and in the center of the cells to see how the layout changed.

This process was basically doing the "rules and systems" from Week 1, but executing them with code instead of by hand.

<iframe src="content/week02/embed1.html" width="100%" height="700" frameborder="no"></iframe>

After getting the basic grid working, I made a second version. I changed the spacing variable again and added rotation to see how it would alter the pattern.

<iframe src="content/week02/embed2.html" width="100%" height="700" frameborder="no"></iframe>

## Influences and References
To bridge the gap between analog concepts and code, I watched several YouTube tutorials. A key resource was "Making Simple Patterns in p5.js" by Steve's Makerspace.

This video was a direct influence because it explained exactly what I was trying to do:
* **Grid System:** It confirmed that patterns start with a grid system using nested loops for width and height.
* **Parameters:** It showed how to use a variable to control spacing, which matched my experiments with the `space` variable.
* **Placement:** The video discussed placing objects at intersections and centers, which I did using `x` and `x+space/2`.
* **Transformations:** It introduced using `push()` to isolate changes like rotation.

This practical advice helped me turn abstract ideas into a working digital sketch.

## Algorithmic Thinking
This week was less about philosophy and more about practical implementation. The main takeaway was understanding how to build a systematic grid.

**Digital**
* **Nested Loops:** I learned to create a 2D grid by nesting a loop for the y-axis inside a loop for the x-axis.
* **Placement:** I learned to place elements at offsets, like `x+space/2`, rather than just at the corners.
* **Parameters:** I saw how a single variable can control the density of the entire composition.
* **Transformations:** I started using `rectMode(CENTER)` and `rotate()` to change individual elements.
* **Iteration:** Tweaking the code by changing values was my main method for learning these new concepts.

Here is the code from my first grid experiment:

```js
function setup() {
  createCanvas(500,500);
  fill(0);
  strokeWeight(1);
  rectMode(CENTER);
  
  let space = 35;
  
  for (let x=0; x < width+50; x+=space){
    for (let y=0; y < height+50; y+=space){
       //line(x,y,x+space,y);
       //line(x,y,x,y+space);
      
      // No push() or rotate() needed for the simple version
      square(x,y,10);
      square(x+space/2,y+space/2,10);
    }
  }
}
```

## Reflection
My biggest step this week was moving from random experiments to a controlled structure. Learning to use nested loops allowed me to define a system that repeats perfectly. It was satisfying to see how "tweaking" just one rule or variable in the code could completely change the visual result.