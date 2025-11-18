let palette=["#F94144","#F3722C","#F8961E","#F9C74F","#90BE6D","#43AA8B","#577590","#277DA1"];
let featPal=["#000000","#FFFFFF","#F94144","#F9C74F","#90BE6D"];

let faceMask;
let faceMinX,faceMaxX,faceMinY,faceMaxY,faceCx,faceCy,faceW,faceH;
let boxes=[];

function setup(){
  createCanvas(900,900);
  noLoop();
  rectMode(CENTER);
  angleMode(DEGREES);
  noStroke();
  setInterval(()=>redraw(),4000);
}

function draw(){
  background("#ffffff");
  drawBg();
  drawFaceCluster();
  drawFeatures();
  drawHair();
  drawEars();
}

function drawBg(){
  colorMode(RGB);
  let cCols=int(random(3,5)),cRows=int(random(3,5));
  let cw=width/cCols,ch=height/cRows;
  let base=shuffle([...palette]).slice(0,int(random(4,8)));
  let dark=base.map(h=>lerpColor(color(h),color(0),0.15));
  let grid=[];
  for(let gy=0;gy<cRows;gy++){
    grid[gy]=[];
    for(let gx=0;gx<cCols;gx++){
      let col=(gx>0&&random()<0.7)?grid[gy][gx-1]:(gy>0&&random()<0.7)?grid[gy-1][gx]:random(dark);
      grid[gy][gx]=col;
    }
  }
  for(let gy=0;gy<cRows;gy++){
    for(let gx=0;gx<cCols;gx++){
      let col=grid[gy][gx];
      let sc=int(random(2,4)),sr=int(random(2,4));
      let w=cw/sc,h=ch/sr;
      for(let sy=0;sy<sr;sy++){
        for(let sx=0;sx<sc;sx++){
          let x=gx*cw+sx*w+w/2,y=gy*ch+sy*h+h/2;
          fill(col);rect(x,y,w+1,h+1);
        }
      }
    }
  }
}

function drawFaceCluster(){
  faceMask=createGraphics(width,height);
  faceMask.noStroke();faceMask.rectMode(CENTER);faceMask.angleMode(DEGREES);
  let cols=shuffle([...palette]).slice(0,int(random(3,6)));
  let n=int(random(3,5));
  faceMinX=width;faceMaxX=0;faceMinY=height;faceMaxY=0;
  let cx=width/2,cy=height/2;
  for(let i=0;i<n;i++){
    let x=cx+random(-120,120),y=cy+random(-140,140);
    let w=random(260,360),h=random(280,380);let c=random(cols);
    fill(c);faceMask.fill(255);
    if(i%2===0){rect(x,y,w,h,80);faceMask.rect(x,y,w,h,80);}
    else{ellipse(x,y,w,h);faceMask.ellipse(x,y,w,h);}
    faceMinX=min(faceMinX,x-w/2);faceMaxX=max(faceMaxX,x+w/2);
    faceMinY=min(faceMinY,y-h/2);faceMaxY=max(faceMaxY,y+h/2);
  }
  faceCx=(faceMinX+faceMaxX)/2;faceCy=(faceMinY+faceMaxY)/2;
  faceW=faceMaxX-faceMinX;faceH=faceMaxY-faceMinY;
}

function drawEars(){
  let v=int(random(3));
  let ew=random(faceW*0.12,faceW*0.18),eh=random(faceH*0.18,faceH*0.26);
  let my=(faceMinY+faceMaxY)/2+random(-40,40);
  let col=random(palette);
  let lx=faceMinX-ew*0.3,rx=faceMaxX+ew*0.3;
  noStroke();fill(col);
  push();translate(lx,my);
  if(v===0)rect(0,0,ew,eh,40);
  else if(v===1)ellipse(0,0,ew,eh);
  else{beginShape();vertex(-ew*0.5,-eh*0.3);vertex(-ew*0.2,-eh*0.5);vertex(ew*0.4,0);vertex(-ew*0.1,eh*0.5);endShape(CLOSE);}
  pop();
  push();translate(rx,my);
  if(v===0)rect(0,0,ew,eh,40);
  else if(v===1)ellipse(0,0,ew,eh);
  else{beginShape();vertex(ew*0.5,-eh*0.3);vertex(ew*0.2,-eh*0.5);vertex(-ew*0.4,0);vertex(ew*0.1,eh*0.5);endShape(CLOSE);}
  pop();
}

function drawFeatures(){
  boxes=[];
  eye();eye();
  nose();
  mouth();
}

function overlap(a,b){
  return !(a.x+a.w/2<b.x-b.w/2||a.x-a.w/2>b.x+b.w/2||a.y+a.h/2<b.y-b.h/2||a.y-a.h/2>b.y+b.h/2);
}

function spot(yMinR,yMaxR,w,h){
  let padX=faceW*0.10,padY=faceH*0.08;
  for(let t=0;t<2000;t++){
    let yMin=faceMinY+faceH*yMinR+padY,yMax=faceMinY+faceH*yMaxR-padY;
    let x=random(faceMinX+padX,faceMaxX-padX),y=random(yMin,yMax);
    let c=faceMask.get(int(x),int(y));if(c[3]===0)continue;
    let b={x,y,w,h},ok=true;for(let o of boxes){if(overlap(b,o)){ok=false;break;}}
    if(ok){boxes.push(b);return createVector(x,y);}
  }
  let p=createVector(faceCx,faceCy);boxes.push({x:p.x,y:p.y,w,h});return p;
}

function eye(){
  let s=random(90,150),bw=s*1.2,bh=s*0.7;
  let p=spot(0.26,0.5,bw,bh);
  let r=random([-90,-45,-15,0,20,90]);
  push();translate(p.x,p.y);rotate(r);noStroke();
  fill("#FFFFFF");ellipse(0,0,s*1.2,s*0.55);
  let rings=int(random(2,4));
  for(let i=0;i<rings;i++){fill(random(featPal));ellipse(0,0,s*(0.45-i*0.1),s*(0.45-i*0.1));}
  fill(0);ellipse(0,0,s*0.15,s*0.15);fill(255);ellipse(-s*0.05,-s*0.05,s*0.05);
  pop();
}

function nose(){
  let s=random(110,180),bw=s*0.55,bh=s*1.0;
  let p=spot(0.42,0.7,bw,bh);
  push();translate(p.x,p.y);rotate(random(-8,8));noStroke();
  let st=int(random(4));
  if(st===0){
    let c1=random(palette),c2=random(palette);
    fill(c1);ellipse(0,-s*0.15,s*0.32,s*0.55);
    fill(c2);ellipse(-s*0.12,s*0.18,s*0.28,s*0.24);ellipse(s*0.12,s*0.18,s*0.28,s*0.24);
  }else if(st===1){
    fill(random(palette));beginShape();vertex(-s*0.18,-s*0.25);vertex(s*0.18,-s*0.25);vertex(0,s*0.45);endShape(CLOSE);
  }else if(st===2){
    fill(random(palette));beginShape();vertex(-s*0.12,-s*0.5);vertex(s*0.12,-s*0.5);vertex(s*0.20,s*0.15);vertex(0,s*0.45);vertex(-s*0.20,s*0.15);endShape(CLOSE);
    fill(random(palette));ellipse(0,s*0.35,s*0.38,s*0.22);
  }else{
    fill(random(palette));rect(-s*0.05,-s*0.1,s*0.22,s*0.6,10);rect(s*0.12,s*0.25,s*0.5,s*0.22,12);
  }
  pop();
}

function mouth(){
  let w=random(140,220),h=random(50,90);
  let p=spot(0.65,0.95,w,h);
  push();translate(p.x,p.y);rotate(random(-8,8));noStroke();
  fill(random(["#F94144","#F3722C","#F9844A","#F9C74F","#FF6F61"]));
  let st=int(random(6));
  if(st===0){
    beginShape();vertex(-w*0.5,0);bezierVertex(-w*0.25,-h*0.5,w*0.25,-h*0.5,w*0.5,0);bezierVertex(w*0.25,h*0.6,-w*0.25,h*0.6,-w*0.5,0);endShape(CLOSE);
  }else if(st===1){
    beginShape();vertex(-w*0.5,0);bezierVertex(-w*0.3,-h*0.7,w*0.3,-h*0.7,w*0.5,0);bezierVertex(w*0.25,h*0.3,-w*0.25,h*0.3,-w*0.5,0);endShape(CLOSE);
  }else if(st===2){
    beginShape();vertex(-w*0.5,0);bezierVertex(-w*0.25,-h*0.25,w*0.25,-h*0.25,w*0.5,0);bezierVertex(w*0.25,h*0.8,-w*0.25,h*0.8,-w*0.5,0);endShape(CLOSE);
  }else if(st===3){
    beginShape();vertex(-w*0.5,0);bezierVertex(-w*0.2,-h*0.1,w*0.2,-h*0.1,w*0.5,0);bezierVertex(w*0.2,h*0.1,-w*0.2,h*0.1,-w*0.5,0);endShape(CLOSE);
  }else if(st===4){
    beginShape();vertex(-w*0.5,0);bezierVertex(-w*0.25,-h*0.6,-w*0.05,-h*0.4,0,-h*0.3);bezierVertex(w*0.05,-h*0.4,w*0.25,-h*0.6,w*0.5,0);bezierVertex(w*0.25,h*0.7,-w*0.25,h*0.7,-w*0.5,0);endShape(CLOSE);
  }else{
    beginShape();vertex(-w*0.5,0);bezierVertex(-w*0.25,-h*0.25,w*0.25,-h*0.25,w*0.5,0);bezierVertex(w*0.25,h*0.1,w*0.1,h*0.25,0,h*0.3);bezierVertex(-w*0.1,h*0.25,-w*0.25,h*0.1,-w*0.5,0);endShape(CLOSE);
  }
  if(st!==3){fill(255,120);ellipse(0,-h*0.1,w*0.35,h*0.18);}
  pop();
}

function drawHair(){
  let n=int(random(1,4));
  let side=faceW*0.12,xMin=faceMinX+side,xMax=faceMaxX-side;
  let yMin=faceMinY+faceH*0.02,yMax=faceMinY+faceH*0.30;
  for(let i=0;i<n;i++){
    let innerW=xMax-xMin;
    let w=random(innerW*0.5,innerW*0.85),h=random(faceH*0.2,faceH*0.35);
    let x=random(xMin+w*0.25,xMax-w*0.25),y=random(yMin+h*0.3,yMax);
    let col=random(["#111111","#222222","#333333","#444444"]);
    fill(col);noStroke();
    let s=int(random(3));
    if(s===0){rect(x,y,w,h,80);}
    else if(s===1){arc(x,y,min(w,innerW),h*2,180,360,CHORD);}
    else{
      let b=int(random(4,7));
      for(let k=0;k<b;k++){
        let bx=constrain(x+random(-w*0.4,w*0.4),xMin,xMax);
        let by=constrain(y+random(-h*0.2,h*0.2),yMin,yMax);
        let r=random(h*0.6,h*1.0);ellipse(bx,by,r,r);
      }
    }
  }
}
