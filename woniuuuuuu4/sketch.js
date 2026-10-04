let snailX = 400, snailY = 440;
let holding = false;
let bubbles = [], stars = [];
let timer = 0, colorIndex = 0;

let colors = [
  [255,80,170],[255,110,145],[255,145,70],
  [255,220,50],[255,245,90],[90,230,150],
  [70,210,100],[70,190,255],[50,220,225],
  [145,90,245],[190,140,255],[240,110,220]
];

function setup() {
  createCanvas(800,600);
}

function draw() {
  background(185,225,245);
  sky();
  ground();

  if (holding && ++timer > 11) {
    bubble();
    timer = 0;
  }

  snail();
  drawBubbles();
  drawStars();
}

// 泡泡
function bubble() {
  bubbles.push({
    x: snailX+63, y: snailY+20,
    size: random(8,65),
    vx: random(-2.4,2.4),
    vy: random(-1.8,-0.8),
    c: colors[colorIndex++ % colors.length]
  });
}

function drawBubbles() {
  for (let i=bubbles.length-1;i>=0;i--) {
    let b=bubbles[i];
    b.x+=b.vx; b.y+=b.vy; b.vx*=.995;

    noStroke();
    fill(...b.c,45);
    circle(b.x,b.y,b.size*.9);

    noFill();
    stroke(...b.c);
    strokeWeight(3);
    circle(b.x,b.y,b.size);

    noStroke();
    fill(255,220);
    circle(b.x-b.size*.25,b.y-b.size*.25,max(2,b.size*.2));

    if(b.y<-60) bubbles.splice(i,1);
  }
}

// 泡泡变星星
function popBubbles() {
  for(let b of bubbles) {
    for(let i=0;i<6;i++) {
      let a=random(TWO_PI), speed=random(1.5,4);
      stars.push({
        x:b.x,y:b.y,
        vx:cos(a)*speed,vy:sin(a)*speed,
        size:random(5,18),life:random(70,115),
        c:b.c,r:random(TWO_PI),rs:random(-.04,.04)
      });
    }
  }
  bubbles=[];
}

function drawStars() {
  for(let i=stars.length-1;i>=0;i--) {
    let s=stars[i];

    s.x+=s.vx; s.y+=s.vy;
    s.vx*=.97; s.vy*=.97; s.vy+=.01;
    s.r+=s.rs; s.life--;

    push();
    translate(s.x,s.y);
    rotate(s.r);
    fill(...s.c,min(255,s.life*4));
    noStroke();
    star(0,0,s.size,s.size*.45);
    pop();

    if(s.life<=0) stars.splice(i,1);
  }
}

function star(x,y,a,b) {
  beginShape();
  for(let i=0;i<10;i++) {
    let r=i%2?a:b;
    let ang=-PI/2+i*PI/5;
    vertex(x+cos(ang)*r,y+sin(ang)*r);
  }
  endShape(CLOSE);
}

// 蜗牛
function snail() {
  push();
  translate(snailX,snailY);

  if(holding) rotate(sin(frameCount*.12)*.025);

  noStroke();

  fill(248,190,150);
  ellipse(0,38,170,48);

  fill(255,200,160);
  ellipse(65,5,72,75);

  stroke(210,145,115);
  strokeWeight(4);
  line(48,-18,38,-52);
  line(78,-18,88,-52);

  noStroke();
  fill(255,215,175);
  circle(38,-54,13);
  circle(88,-54,13);

  fill(60,70,80);
  ellipse(47,0,9,13);
  ellipse(76,0,9,13);

  fill(245,125,135,130);
  ellipse(40,20,18,10);
  ellipse(86,20,18,10);

  noFill();
  stroke(155,95,90);
  strokeWeight(3);
  ellipse(63,20,18,13);

  shell();
  pop();
}

function shell() {
  noStroke();
  fill(185,115,65,100);
  circle(-25,18,115);

  fill(225,160,90);
  circle(-30,5,110);

  fill(245,190,115);
  circle(-48,-12,65);

  noFill();
  stroke(185,115,65);
  strokeWeight(6);
  arc(-30,5,70,70,.2,TWO_PI+.2);
  arc(-30,5,40,40,.4,TWO_PI+.4);
}

// 背景
function sky() {
  noStroke();
  fill(255,220,70);
  circle(680,90,75);

  fill(250,250,255,220);
  circle(150,100,90);
  circle(200,80,90);
  circle(245,105,90);

  circle(500,150,90);
  circle(550,130,90);
  circle(595,155,90);
}

function ground() {
  noStroke();
  fill(170,125,85);

  beginShape();
  vertex(0,425);
  bezierVertex(150,405,300,435,450,420);
  bezierVertex(600,405,700,435,800,415);
  vertex(800,600);
  vertex(0,600);
  endShape();

  stroke(75,145,80);
  strokeWeight(4);

  for(let x=20;x<width;x+=50) {
    let y=430+sin(x*.1)*5;
    line(x,y,x-5,y-18);
    line(x,y,x+4,y-22);
    line(x,y,x+10,y-15);
  }
}

// 鼠标 + 手机
function start(x,y) {
  if(dist(x,y,snailX,snailY)<130) {
    holding=true;
    timer=0;
  }
  return false;
}

function end() {
  if(holding) {
    holding=false;
    popBubbles();
  }
  return false;
}

function mousePressed() {
  return start(mouseX,mouseY);
}

function mouseReleased() {
  return end();
}

function touchStarted() {
  if(touches.length) return start(touches[0].x,touches[0].y);
}

function touchEnded() {
  return end();
}