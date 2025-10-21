function setup() {
  createCanvas(400, 400);


  let c = color(255, 128, 128);


    background(200,200,20);
    noStroke();
    circle(50,50,50);
  
    noStroke();
    fill(c);
    square(200,200,100);

    c.setAlpha(100)
    fill(c)
    rect(20,20,200)
  
    ellipse(200,200,200,100)
}

function draw() {


  let c = color(500, 200, 128);
      c.setAlpha(5)
  fill(c)
  triangle(300 , 750, 580, 200, 86, 75)


}