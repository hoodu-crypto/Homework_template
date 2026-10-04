let snailX = 120;
let snailY = 430;

let normalSpeed = 0.45;
let happySpeed = 1.4;

let snailSpeed = normalSpeed;
let happy = false;

let rain = [];
let clouds = [];

let umbrellaX = 300;
let umbrellaY = 370;

let draggingUmbrella = false;
let umbrellaLocked = false;


// =====================================================
// SETUP
// =====================================================

function setup() {

  createCanvas(800, 600);

  let canvasElement = document.querySelector("canvas");

  if (canvasElement) {
    canvasElement.style.touchAction = "none";
    canvasElement.style.userSelect = "none";
    canvasElement.style.webkitUserSelect = "none";
  }


  // 雨
  for (let i = 0; i < 100; i++) {

    rain.push({
      x: random(width),
      y: random(-600, height),
      speed: random(4, 7),
      length: random(10, 18)
    });
  }


  // 云
  clouds.push({
    x: 130,
    y: 100,
    speed: 0.15
  });

  clouds.push({
    x: 600,
    y: 160,
    speed: 0.1
  });
}


// =====================================================
// DRAW
// =====================================================

function draw() {

  background(185, 225, 245);

  drawClouds();
  drawRain();
  drawGround();
  drawGrass();


  // ===================================================
  // 蜗牛移动
  // ===================================================

  snailSpeed = happy ? happySpeed : normalSpeed;

  snailX += snailSpeed;

  if (snailX > width + 100) {
    snailX = -100;
  }


  // ===================================================
  // 雨伞跟随蜗牛
  // ===================================================

  if (umbrellaLocked && !draggingUmbrella) {

    umbrellaX = snailX + 20;
    umbrellaY = snailY - 105;
  }


  // 先画雨伞
  drawUmbrella(
    umbrellaX,
    umbrellaY
  );


  // 再画蜗牛
  drawSnail();
}


// =====================================================
// 云
// =====================================================

function drawClouds() {

  for (let c of clouds) {

    c.x += c.speed;

    if (c.x > width + 150) {
      c.x = -150;
    }

    drawCloud(c.x, c.y);
  }
}


function drawCloud(x, y) {

  noStroke();

  fill(245, 250, 255, 220);

  ellipse(x, y, 110, 55);
  ellipse(x + 45, y - 20, 85, 65);
  ellipse(x + 90, y, 110, 55);
  ellipse(x + 45, y + 10, 145, 45);
}


// =====================================================
// 雨
// =====================================================

function drawRain() {

  stroke(105, 175, 215, 150);
  strokeWeight(3);

  for (let r of rain) {

    line(
      r.x,
      r.y,
      r.x - 4,
      r.y + r.length
    );

    r.y += r.speed;

    if (r.y > height) {

      r.y = random(-100, 0);
      r.x = random(width);
    }
  }
}


// =====================================================
// 土地
// =====================================================

function drawGround() {

  noStroke();

  fill(170, 125, 85);

  beginShape();

  vertex(0, 425);

  bezierVertex(
    150, 405,
    300, 435,
    450, 420
  );

  bezierVertex(
    600, 405,
    700, 435,
    800, 415
  );

  vertex(800, 600);
  vertex(0, 600);

  endShape(CLOSE);


  // 湿润的土地
  fill(135, 100, 75, 80);

  ellipse(120, 500, 130, 25);
  ellipse(350, 550, 150, 30);
  ellipse(600, 480, 120, 25);
}


// =====================================================
// 草
// =====================================================

function drawGrass() {

  stroke(75, 145, 80);
  strokeWeight(3);

  for (let x = 20; x < width; x += 50) {

    let y = 430 + sin(x * 0.1) * 5;

    line(x, y, x - 5, y - 18);
    line(x, y, x + 4, y - 22);
    line(x, y, x + 10, y - 15);
  }
}


// =====================================================
// 雨伞
// =====================================================

function drawUmbrella(x, y) {

  push();

  translate(x, y);

  // 伞面
  noStroke();

  fill(255, 145, 175);

  arc(
    0,
    0,
    125,
    75,
    PI,
    TWO_PI
  );

  // 伞面底部的小弧线
  stroke(220, 100, 135);
  strokeWeight(3);

  arc(
    -42,
    0,
    25,
    18,
    0,
    PI
  );

  arc(
    0,
    0,
    25,
    18,
    0,
    PI
  );

  arc(
    42,
    0,
    25,
    18,
    0,
    PI
  );


  // 伞柄
  stroke(120, 100, 100);
  strokeWeight(5);

  line(0, 0, 0, 72);


  // 伞柄底部
  noFill();

  arc(
    7,
    72,
    15,
    18,
    0,
    PI
  );

  pop();
}


// =====================================================
// 蜗牛
// =====================================================

function drawSnail() {

  push();

  translate(snailX, snailY);

  drawSnailBody();
  drawSnailHead();
  drawShell();

  pop();
}


// =====================================================
// 蜗牛身体
// =====================================================

function drawSnailBody() {

  noStroke();

  if (happy) {

    // 开心时身体趴得更低
    fill(248, 190, 150);

    ellipse(0, 48, 175, 38);

    fill(205, 145, 120, 90);

    ellipse(0, 60, 140, 15);

  } else {

    fill(248, 190, 150);

    ellipse(0, 38, 170, 48);

    fill(205, 145, 120, 100);

    ellipse(0, 52, 135, 18);
  }
}


// =====================================================
// 蜗牛头
// =====================================================

function drawSnailHead() {

  noStroke();

  fill(255, 200, 160);

  if (happy) {

    ellipse(65, 10, 72, 65);

  } else {

    ellipse(65, 5, 72, 75);
  }


  // 触角
  stroke(210, 145, 115);
  strokeWeight(4);

  if (happy) {

    // 开心时触角稍微向上
    line(48, -18, 38, -52);
    line(78, -18, 88, -52);

  } else {

    line(48, -22, 38, -58);
    line(78, -22, 88, -58);
  }


  // 触角顶部
  noStroke();

  fill(255, 215, 175);

  ellipse(38, happy ? -54 : -60, 13, 13);
  ellipse(88, happy ? -54 : -60, 13, 13);


  // 眼睛
  fill(60, 70, 80);

  ellipse(47, 0, 9, 13);
  ellipse(76, 0, 9, 13);


  // 腮红
  fill(245, 125, 135, 130);

  ellipse(40, 20, 18, 10);
  ellipse(83, 20, 18, 10);


  // 嘴巴
  noFill();

  stroke(155, 95, 90);
  strokeWeight(2.5);

  if (happy) {

    // 开心的嘴巴
    arc(
      62,
      17,
      28,
      18,
      0,
      PI
    );

  } else {

    arc(
      62,
      18,
      28,
      18,
      0,
      PI
    );
  }
}


// =====================================================
// 蜗牛壳
// =====================================================

function drawShell() {

  noStroke();

  // 壳阴影
  fill(185, 115, 65, 100);

  ellipse(-25, 18, 115, 115);


  // 壳主体
  fill(225, 160, 90);

  ellipse(-30, 5, 110, 110);


  // 壳高光
  fill(245, 190, 115);

  ellipse(-48, -12, 65, 65);


  // 壳螺旋
  noFill();

  stroke(185, 115, 65);
  strokeWeight(6);

  arc(
    -30,
    5,
    70,
    70,
    0.2,
    TWO_PI + 0.2
  );

  arc(
    -30,
    5,
    40,
    40,
    0.4,
    TWO_PI + 0.4
  );
}


// =====================================================
// 判断雨伞是否靠近蜗牛
// =====================================================

function checkUmbrella() {

  let d = dist(
    umbrellaX,
    umbrellaY,
    snailX + 20,
    snailY - 70
  );

  if (d < 85) {

    happy = true;
    umbrellaLocked = true;

    umbrellaX = snailX + 20;
    umbrellaY = snailY - 105;

  } else {

    happy = false;
    umbrellaLocked = false;
  }
}


// =====================================================
// 开始拖动雨伞
// =====================================================

function startUmbrellaDrag(x, y) {

  let d = dist(
    x,
    y,
    umbrellaX,
    umbrellaY
  );

  if (d < 75) {

    draggingUmbrella = true;
    umbrellaLocked = false;
    happy = false;
  }
}


// =====================================================
// 拖动雨伞
// =====================================================

function moveUmbrella(x, y) {

  if (draggingUmbrella) {

    umbrellaX = x;
    umbrellaY = y;

    checkUmbrella();
  }
}


// =====================================================
// 结束拖动
// =====================================================

function endUmbrellaDrag() {

  if (draggingUmbrella) {

    checkUmbrella();

    draggingUmbrella = false;

    // 如果没有放到蜗牛附近
    // 就保持雨伞原来的位置
    if (!umbrellaLocked) {

      happy = false;
    }
  }
}


// =====================================================
// 鼠标
// =====================================================

function mousePressed() {

  startUmbrellaDrag(mouseX, mouseY);

  return false;
}


function mouseDragged() {

  moveUmbrella(mouseX, mouseY);

  return false;
}


function mouseReleased() {

  endUmbrellaDrag();

  return false;
}


// =====================================================
// 手机触摸
// =====================================================

function touchStarted() {

  if (touches.length > 0) {

    startUmbrellaDrag(
      touches[0].x,
      touches[0].y
    );
  }

  return false;
}


function touchMoved() {

  if (touches.length > 0) {

    moveUmbrella(
      touches[0].x,
      touches[0].y
    );
  }

  return false;
}


function touchEnded() {

  endUmbrellaDrag();

  return false;
}