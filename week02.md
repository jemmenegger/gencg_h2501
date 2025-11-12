# Week 2 – Grids, Loops & Transformation

## Exploration & Experimentation

Moving on from the random, layered compositions of the first week, my focus shifted to **structured, grid-based patterns**. This required getting much more familiar with JavaScript syntax, specifically nested `for` loops, to create a system that could place shapes across the canvas in a repeating pattern.

As I noted, "I really had to get to know js, tweeked it a bit and tried out different ones." This process of iteration was my main focus. I experimented with:
* Changing the `space` variable (from 35 to 40) to see how it affected the density.
* Commenting and uncommenting `line` elements to visualize the underlying grid structure.
* Placing `square` shapes both on the grid points (`x, y`) and in the center of the grid cells (`x+space/2, y+space/2`).
* Beginning to explore transformations by setting `rectMode(CENTER)` and experimenting with `rotate()`.

This process was a direct translation of the "rules and systems" from Week 1, but executed with code rather than by hand.

*(My first experiment "tweeking" the grid variables and layout. Corresponds to sketch1.js)*
<iframe src="content/week02/embed1.html" width="100%" height="700" frameborder="no"></iframe>

After getting the basic grid working, I created a second variation to show the process of "tweeking" the parameters. I changed the `space` variable from 35 to 45 and properly implemented the `rotate()` function to see how it would alter the pattern.

*(My second variation, manipulating the `space` and `rotate()` factors. Corresponds to sketch2.js)*
<iframe src="content/week02/embed2.html" width="100%" height="700" frameborder="no"></iframe>


## Influences & References

To "get to know js" better and bridge the gap from Week 1's analog concepts, I watched several YouTube tutorials to get into the topic.

A key resource was the tutorial **"Making Simple Patterns in p5.js"** from the channel Steve's Makerspace. This video was a direct influence, as it explained the exact concepts I was experimenting with in my code:

* **Grid System:** The video confirms that all patterns start with a grid system [00:00:39], which I built using nested `for` loops.
* **Parameters:** It explains using a `space` variable to control the grid [00:01:15], which is exactly what I did when I "tweeked" my code from `space = 35` to `space = 40`.
* **Placement:** The video discusses placing objects on the intersections *and* in the center of the grids [00:00:46]. This is directly reflected in my code with `square(x,y,...)` and `square(x+space/2, y+space/2,...)`.
* **Transformations:** It showed how to use `push()` to isolate transformations like `rotate()` [00:09:20], which I experimented with in my second sketch by adding `rotate(180)`.

> *"to make a grid like this we have two for loops one for the width and one for the height" – Steve's Makerspace [00:01:02]*

This practical, code-focused guidance was essential for translating the abstract ideas of rules and systems into a working digital sketch.

## Algorithmic Thinking

This week was less about philosophy and more about practical implementation. The main takeaway was how to build a **systematic grid** and the importance of iterative development.

**Digital (p5.js Practice)**
1.  **Nested Loops:** My main learning was how to create a 2D grid by nesting a `for` loop for the y-axis inside a `for` loop for the x-axis.
2.  **Grid-based Placement:** I learned to place elements not just *at* the grid intersections (`x,y`) but also at *offsets* relative to them, like `x+space/2`.
3.  **Parameters:** I understood how a single variable like `let space` could act as a parameter to control the entire composition's density.
4.  **Transformations:** I began to use `rectMode(CENTER)` to draw shapes from their center and `push()` / `rotate()` to apply transformations to individual elements within the grid.
5.  **Iteration as Learning:** My process of "tweeking" the code (changing values, commenting/uncommenting lines) was my primary method of understanding these new concepts.

Here are the code snippets I worked on, showing the "tweeking" process.

**First sketch (Simple grid of squares - `sketch1.js`)**
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