function setup() {
  createCanvas(500,500);
  fill(0);
  strokeWeight(1);
  rectMode(CENTER);
  let space = 40;
  let angle = 0;
  for (let x=0;x<width+50;x+=space){
    for (let y=0;y<height+50;y+=space){
       line(x,y,x+space,y);
       line(x,y,x,y+space);
      push();      
      square(x,y,20)
      square(x+space/2,y+space/2,10)
      rotate(180)
    }
  }
}
