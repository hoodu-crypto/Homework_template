let snailX=400,snailY,holding=false,timer=0,colorIndex=0;
let bubbles=[],stars=[];
let clouds=[
  {x:130,y:100,s:.15},
  {x:600,y:160,s:.1}
];
let colors=[
  [255,80,170],[255,110,145],[255,145,70],[255,220,50],
  [255,245,90],[90,230,150],[70,210,100],[70,190,255],
  [50,220,225],[145,90,245],[190,140,255],[240,110,220]
];

function setup(){
  createCanvas(windowWidth,windowHeight);
  snailX=width*.5;snailY=height*.73;
  let c=document.querySelector("canvas");
  c.style.touchAction="none";c.style.userSelect="none";
}

function draw(){
  background(185,225,245);
  sky();ground();
  if(holding&&++timer>11){makeBubble();timer=0;}
  snail();drawBubbles();drawStars();
}


// 泡泡
function makeBubble(){
  bubbles.push({
    x:snailX+63,y:snailY+20,size:random(8,65),
    vx:random(-2.4,2.4),vy:random(-1.8,-.8),
    c:colors[colorIndex++%colors.length]
  });
}

function drawBubbles(){
  for(let i=bubbles.length-1;i>=0;i--){
    let b=bubbles[i];
    b.x+=b.vx;b.y+=b.vy;b.vx*=.995;

    noStroke();fill(...b.c,45);circle(b.x,b.y,b.size*.9);
    noFill();stroke(...b.c);strokeWeight(3);circle(b.x,b.y,b.size);
    noStroke();fill(255,220);
    circle(b.x-b.size*.25,b.y-b.size*.25,max(2,b.size*.2));

    if(b.y<-60)bubbles.splice(i,1);
  }
}


// 泡泡变星星
function popBubbles(){
  for(let b of bubbles)for(let i=0;i<6;i++){
    let a=random(TWO_PI),v=random(1.5,4);
    stars.push({
      x:b.x,y:b.y,vx:cos(a)*v,vy:sin(a)*v,
      size:random(5,18),life:random(70,115),c:b.c,
      r:random(TWO_PI),rs:random(-.04,.04)
    });
  }
  bubbles=[];
}

function drawStars(){
  for(let i=stars.length-1;i>=0;i--){
    let s=stars[i];
    s.x+=s.vx;s.y+=s.vy;s.vx*=.97;
    s.vy=s.vy*.97+.01;s.r+=s.rs;s.life--;

    push();translate(s.x,s.y);rotate(s.r);
    fill(...s.c,min(255,s.life*4));noStroke();
    star(0,0,s.size,s.size*.45);
    pop();

    if(s.life<=0)stars.splice(i,1);
  }
}

function star(x,y,o,n){
  beginShape();
  for(let i=0;i<10;i++){
    let a=-PI/2+i*PI/5,r=i%2?n:o;
    vertex(x+cos(a)*r,y+sin(a)*r);
  }
  endShape(CLOSE);
}


// 蜗牛
function snail(){
  noStroke();fill(80,70,60,60);
  ellipse(snailX,snailY+56,155,16);

  push();translate(snailX,snailY);
  if(holding)rotate(sin(frameCount*.12)*.025);

  noStroke();fill(248,190,150);ellipse(0,38,170,48);
  fill(255,200,160);ellipse(65,5,72,75);

  stroke(210,145,115);strokeWeight(4);
  line(48,-18,38,-52);line(78,-18,88,-52);

  noStroke();fill(255,215,175);
  circle(38,-54,13);circle(88,-54,13);

  fill(60,70,80);
  ellipse(47,0,9,13);ellipse(76,0,9,13);

  fill(245,125,135,130);
  ellipse(40,20,18,10);ellipse(86,20,18,10);

  noFill();stroke(155,95,90);strokeWeight(3);
  ellipse(63,20,18,13);

  shell();pop();
}

function shell(){
  noStroke();fill(185,115,65,100);circle(-25,18,115);
  fill(225,160,90);circle(-30,5,110);
  fill(245,190,115);circle(-48,-12,65);

  noFill();stroke(185,115,65);strokeWeight(6);
  arc(-30,5,70,70,.2,TWO_PI+.2);
  arc(-30,5,40,40,.4,TWO_PI+.4);
}


// 天空
function sky(){
  noStroke();fill(255,220,70);
  circle(width*.85,height*.15,75);

  for(let c of clouds){
    c.x+=c.s;
    if(c.x>width+150)c.x=-150;
    cloud(c.x,c.y);
  }
}

function cloud(x,y){
  noStroke();fill(245,250,255,220);
  ellipse(x,y,110,55);
  ellipse(x+45,y-20,85,65);
  ellipse(x+90,y,110,55);
  ellipse(x+45,y+10,145,45);
}


// 地面
function ground(){
  let y=height*.71;
  noStroke();fill(170,125,85);

  beginShape();
  vertex(0,y);
  bezierVertex(width*.19,y-20,width*.37,y+10,width*.56,y-5);
  bezierVertex(width*.75,y-20,width*.88,y+10,width,y-10);
  vertex(width,height);vertex(0,height);
  endShape(CLOSE);

  grass();
}

function grass(){
  let y=height*.71;
  stroke(75,145,80);strokeWeight(4);

  for(let x=20;x<width;x+=50){
    let g=y+sin(x*.1)*5;
    line(x,g,x-5,g-18);
    line(x,g,x+4,g-22);
    line(x,g,x+10,g-15);
  }
}


// 鼠标 / 手机
function start(x,y){
  if(dist(x,y,snailX,snailY)<130){
    holding=true;timer=0;
  }
  return false;
}

function end(){
  if(holding){
    holding=false;
    popBubbles();
  }
  return false;
}

function mousePressed(){return start(mouseX,mouseY);}
function mouseReleased(){return end();}

function touchStarted(){
  if(touches.length)return start(touches[0].x,touches[0].y);
  return false;
}

function touchEnded(){return end();}


// 满屏
function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  snailX=width*.5;
  snailY=height*.73;
}