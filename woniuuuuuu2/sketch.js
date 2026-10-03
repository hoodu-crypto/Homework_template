let sx=120,sy=430,ux=330,uy=350;
let rain=[],drops=[],spark=[];
let dragging=false,happy=false,timer=0;
let canAttach=true,leaving=false;

let clouds=[
  {x:130,y:100,s:.15},
  {x:600,y:160,s:.1}
];

function setup(){
  createCanvas(800,600);

  for(let i=0;i<70;i++){
    rain.push({
      x:random(width),
      y:random(-500,height),
      s:random(4,7),
      l:random(10,18)
    });
  }
}

function draw(){
  background(185,225,245);

  drawClouds();
  drawRain();
  ground();
  grass();

  sx+=happy?1.4:.45;
  if(sx>width+100)sx=-100;

  if(happy&&!dragging){
    ux=sx;
    uy=sy-105;
  }

  umbrella(ux,uy);
  water();
  snail();
}

function drawClouds(){
  noStroke();
  fill(245,250,255,220);

  for(let c of clouds){
    c.x+=c.s;
    if(c.x>width+150)c.x=-150;

    ellipse(c.x,c.y,110,55);
    ellipse(c.x+45,c.y-20,85,65);
    ellipse(c.x+90,c.y,110,55);
    ellipse(c.x+45,c.y+10,145,45);
  }
}

function drawRain(){
  stroke(105,175,215,150);
  strokeWeight(3);

  for(let r of rain){
    let hide=happy&&abs(r.x-ux)<25&&r.y>uy-150&&r.y<uy-65;

    if(!hide){
      line(r.x,r.y,r.x-4,r.y+r.l);
    }

    r.y+=r.s;

    if(r.y>height){
      r.y=random(-100,0);
      r.x=random(width);
    }
  }

  if(happy){
    timer++;

    if(timer>8){
      drops.push({
        x:ux,
        y:uy-150,
        t:0,
        side:random()<.5?-1:1
      });

      timer=0;
    }
  }
}

function water(){

  // 蓝色雨滴沿着伞面滑下
  for(let i=drops.length-1;i>=0;i--){

    let d=drops[i];

    if(d.t===0){

      d.y+=8;

      noStroke();
      fill(70,180,240);
      ellipse(d.x,d.y,10,16);

      if(d.y>=uy-72){
        d.t=.01;
      }

    }else{

      d.t+=.08;

      let t=d.t;

      d.x=ux+d.side*90*t;
      d.y=uy-72+55*t+18*t*t;

      fill(70,180,240);
      ellipse(d.x,d.y,10,14);

      if(t>=1){
        burst(d.x,d.y,d.side);
        drops.splice(i,1);
      }
    }
  }

  // 彩色烟花水花
  for(let i=spark.length-1;i>=0;i--){

    let s=spark[i];

    s.x+=s.vx;
    s.y+=s.vy;
    s.vy+=.08;
    s.life--;

    // 彩色发光外圈
    noStroke();
    fill(
      s.c[0],
      s.c[1],
      s.c[2],
      s.life*2
    );

    ellipse(
      s.x,
      s.y,
      s.size*2.2
    );

    // 白色亮点
    fill(255,255,255,s.life*7);

    ellipse(
      s.x,
      s.y,
      s.size*.6
    );

    // 彩色中心
    fill(
      s.c[0],
      s.c[1],
      s.c[2],
      s.life*7
    );

    ellipse(
      s.x,
      s.y,
      s.size
    );

    if(s.life<=0){
      spark.splice(i,1);
    }
  }
}

function burst(x,y,side){

  // 这里完全没有绿色
  let colors=[
    [255,60,130],   // 粉红
    [255,120,30],   // 橙色
    [255,220,40],   // 黄色
    [50,180,255],   // 蓝色
    [150,70,255],   // 紫色
    [255,60,210]    // 玫红
  ];

  for(let i=0;i<10;i++){

    let c=random(colors);

    spark.push({
      x:x,
      y:y,
      vx:side*random(2,5)+random(-.7,.7),
      vy:random(-3,2),
      size:random(5,10),
      life:35,
      c:c
    });
  }
}

function ground(){

  noStroke();
  fill(170,125,85);

  beginShape();

  vertex(0,425);

  bezierVertex(
    150,405,
    300,435,
    450,420
  );

  bezierVertex(
    600,405,
    700,435,
    800,415
  );

  vertex(800,600);
  vertex(0,600);

  endShape(CLOSE);
}

function grass(){

  stroke(75,145,80);
  strokeWeight(4);

  for(let x=20;x<width;x+=50){

    let y=430+sin(x*.1)*5;

    line(x,y,x-5,y-18);
    line(x,y,x+4,y-22);
    line(x,y,x+10,y-15);
  }
}

function umbrella(x,y){

  push();
  translate(x,y);

  // 伞面
  noStroke();
  fill(245,115,155);

  beginShape();

  vertex(-115,0);

  bezierVertex(
    -95,25,
    -75,25,
    -58,10
  );

  bezierVertex(
    -40,28,
    -18,28,
    0,7
  );

  bezierVertex(
    18,28,
    40,28,
    58,10
  );

  bezierVertex(
    75,25,
    95,25,
    115,0
  );

  bezierVertex(
    90,-48,
    50,-70,
    0,-72
  );

  bezierVertex(
    -50,-70,
    -90,-48,
    -115,0
  );

  endShape(CLOSE);

  // 伞面线条
  noFill();
  stroke(220,80,130);
  strokeWeight(2);

  bezier(-115,0,-70,-35,-35,-55,0,-72);
  bezier(0,-72,35,-55,70,-35,115,0);
  bezier(-58,10,-35,-15,-15,-45,0,-72);
  bezier(0,-72,15,-45,35,-15,58,10);

  // 伞柄
  stroke(120,90,85);
  strokeWeight(6);

  line(0,5,0,95);

  // J型手柄
  noFill();

  beginShape();

  vertex(0,95);

  bezierVertex(
    0,108,
    -5,118,
    -18,120
  );

  bezierVertex(
    -34,122,
    -42,111,
    -40,98
  );

  bezierVertex(
    -39,91,
    -35,87,
    -32,85
  );

  endShape();

  pop();
}

function snail(){

  push();
  translate(sx,sy);

  // 身体
  noStroke();
  fill(248,190,150);

  ellipse(
    0,
    happy?48:38,
    happy?175:170,
    happy?38:48
  );

  // 头
  fill(255,200,160);

  ellipse(
    65,
    happy?10:5,
    72,
    happy?65:75
  );

  // 触角
  stroke(210,145,115);
  strokeWeight(4);

  line(48,-18,38,-52);
  line(78,-18,88,-52);

  noStroke();
  fill(255,215,175);

  ellipse(38,-54,13,13);
  ellipse(88,-54,13,13);

  // 眼睛
  fill(60,70,80);

  ellipse(47,0,9,13);
  ellipse(76,0,9,13);

  // 腮红
  fill(245,125,135,130);

  ellipse(40,20,18,10);
  ellipse(83,20,18,10);

  // 嘴巴
  noFill();
  stroke(155,95,90);
  strokeWeight(2.5);

  if(happy){
    arc(62,18,28,18,0,PI);
  }else{
    arc(62,25,28,16,PI,TWO_PI);
  }

  // 蜗牛壳
  noStroke();

  fill(185,115,65,100);
  ellipse(-25,18,115,115);

  fill(225,160,90);
  ellipse(-30,5,110,110);

  fill(245,190,115);
  ellipse(-48,-12,65,65);

  noFill();
  stroke(185,115,65);
  strokeWeight(6);

  arc(-30,5,70,70,.2,TWO_PI+.2);
  arc(-30,5,40,40,.4,TWO_PI+.4);

  pop();
}

function checkUmbrella(){

  let d=dist(ux,uy,sx,sy-90);

  if(leaving&&d>130){
    canAttach=true;
    leaving=false;
  }

  if(canAttach&&d<105){

    happy=true;

    ux=sx;
    uy=sy-105;

    canAttach=false;
  }
}

function startDrag(x,y){

  if(dist(x,y,ux,uy)<120){

    dragging=true;

    if(happy){

      happy=false;
      leaving=true;
      canAttach=false;
      timer=0;
    }
  }
}

function moveDrag(x,y){

  if(dragging){

    ux=x;
    uy=y;

    checkUmbrella();
  }
}

function endDrag(){
  dragging=false;
}

function mousePressed(){
  startDrag(mouseX,mouseY);
  return false;
}

function mouseDragged(){
  moveDrag(mouseX,mouseY);
  return false;
}

function mouseReleased(){
  endDrag();
  return false;
}

function touchStarted(){

  if(touches.length){
    startDrag(touches[0].x,touches[0].y);
  }

  return false;
}

function touchMoved(){

  if(touches.length){
    moveDrag(touches[0].x,touches[0].y);
  }

  return false;
}

function touchEnded(){
  endDrag();
  return false;
}