let snailX = 400;
let snailY = 440;

let shellType = 0;
let spinning = false;
let spin = 0;

let lastTap = 0;
let doubleDelay = 350;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(185, 225, 245);

  sunnySky();
  ground();
  grass();

  // 换壳动画
  if (spinning) {
    spin += 0.35;

    if (spin > TWO_PI) {
      spin = 0;
      spinning = false;
      shellType++;

      if (shellType > 3) {
        shellType = 0;
      }
    }
  }

  drawSnail();
}

// ====================
// 晴天
// ====================

function sunnySky() {

  // 太阳
  noStroke();
  fill(255, 220, 70);
  ellipse(680, 90, 75, 75);

  // 云
  fill(250, 250, 255, 220);

  ellipse(150, 100, 120, 55);
  ellipse(200, 80, 90, 65);
  ellipse(245, 105, 120, 55);

  ellipse(500, 150, 120, 55);
  ellipse(550, 130, 90, 65);
  ellipse(595, 155, 120, 55);
}

// ====================
// 地面
// ====================

function ground() {

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
}

// ====================
// 草
// ====================

function grass() {

  stroke(75, 145, 80);
  strokeWeight(4);

  for (let x = 20; x < width; x += 50) {

    let y = 430 + sin(x * 0.1) * 5;

    line(x, y, x - 5, y - 18);
    line(x, y, x + 4, y - 22);
    line(x, y, x + 10, y - 15);
  }
}

// ====================
// 蜗牛
// ====================

function drawSnail() {

  push();

  translate(snailX, snailY);

  // 身体
  noStroke();
  fill(248, 190, 150);

  ellipse(0, 38, 170, 48);

  // 头
  fill(255, 200, 160);
  ellipse(65, 5, 72, 75);

  // 触角
  stroke(210, 145, 115);
  strokeWeight(4);

  line(48, -18, 38, -52);
  line(78, -18, 88, -52);

  noStroke();
  fill(255, 215, 175);

  ellipse(38, -54, 13, 13);
  ellipse(88, -54, 13, 13);

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

  arc(62, 18, 28, 18, 0, PI);

  // 壳
  push();

  translate(-30, 5);

  if (spinning) {
    rotate(spin);
  }

  drawShell();

  pop();

  pop();
}

// ====================
// 四种壳
// ====================

function drawShell() {

  // 外壳
  noStroke();

  if (shellType == 0) {
    normalShell();
  }

  if (shellType == 1) {
    flowerShell();
  }

  if (shellType == 2) {
    starShell();
  }

  if (shellType == 3) {
    rainbowShell();
  }
}

// ====================
// ① 普通壳
// ====================

function normalShell() {

  fill(185, 115, 65, 100);
  ellipse(0, 13, 115, 115);

  fill(225, 160, 90);
  ellipse(0, 0, 110, 110);

  fill(245, 190, 115);
  ellipse(-18, -17, 65, 65);

  noFill();
  stroke(185, 115, 65);
  strokeWeight(6);

  arc(0, 0, 70, 70, 0.2, TWO_PI + 0.2);
  arc(0, 0, 40, 40, 0.4, TWO_PI + 0.4);
}

// ====================
// ② 花朵壳
// ====================

function flowerShell() {

  // 粉色底
  fill(245, 135, 170);
  ellipse(0, 0, 115, 115);

  // 花朵
  noStroke();

  fill(255, 190, 215);

  ellipse(-25, -5, 35, 35);
  ellipse(25, -5, 35, 35);
  ellipse(0, -30, 35, 35);
  ellipse(0, 20, 35, 35);

  fill(255, 110, 150);

  ellipse(-20, 22, 30, 30);
  ellipse(20, 22, 30, 30);

  // 花心
  fill(255, 220, 70);
  ellipse(0, 0, 28, 28);

  // 小圆点装饰
  fill(255, 240, 245);

  ellipse(-35, 20, 7, 7);
  ellipse(35, -20, 7, 7);
  ellipse(-30, -30, 6, 6);
  ellipse(30, 30, 6, 6);
}

// ====================
// ③ 星星壳
// ====================

function starShell() {

  // 紫色底
  fill(145, 90, 210);
  ellipse(0, 0, 115, 115);

  // 星星
  fill(255, 220, 60);

  beginShape();

  for (let i = 0; i < 10; i++) {

    let a = -HALF_PI + i * PI / 5;
    let r = i % 2 == 0 ? 45 : 20;

    vertex(
      cos(a) * r,
      sin(a) * r
    );
  }

  endShape(CLOSE);

  // 小星星
  fill(255, 245, 150);

  smallStar(-32, 25, 12);
  smallStar(35, -28, 10);
}

// ====================
// ④ 彩虹壳
// ====================

function rainbowShell() {

  // 白色底
  fill(250, 245, 235);
  ellipse(0, 0, 115, 115);

  noFill();
  strokeWeight(9);

  stroke(255, 90, 100);
  arc(0, 0, 90, 90, PI, TWO_PI);

  stroke(255, 170, 50);
  arc(0, 0, 75, 75, PI, TWO_PI);

  stroke(255, 220, 60);
  arc(0, 0, 60, 60, PI, TWO_PI);

  stroke(80, 190, 255);
  arc(0, 0, 45, 45, PI, TWO_PI);

  stroke(150, 100, 230);
  arc(0, 0, 30, 30, PI, TWO_PI);

  // 云
  noStroke();
  fill(255);

  ellipse(-25, 25, 28, 18);
  ellipse(0, 25, 32, 20);
  ellipse(25, 25, 28, 18);
}

// ====================
// 小星星
// ====================

function smallStar(x, y, r) {

  beginShape();

  for (let i = 0; i < 10; i++) {

    let a = -HALF_PI + i * PI / 5;
    let size = i % 2 == 0 ? r : r * 0.4;

    vertex(
      x + cos(a) * size,
      y + sin(a) * size
    );
  }

  endShape(CLOSE);
}

// ====================
// 双击判断
// ====================

function checkDoubleTap(x, y) {

  let d = dist(x, y, snailX, snailY);

  if (d < 130) {

    let now = millis();

    if (now - lastTap < doubleDelay) {

      if (!spinning) {
        spinning = true;
        spin = 0;
      }

      lastTap = 0;

    } else {

      lastTap = now;
    }
  }
}

// ====================
// 电脑鼠标
// ====================

function mousePressed() {

  checkDoubleTap(mouseX, mouseY);

  return false;
}

// ====================
// 手机触摸
// ====================

function touchStarted() {

  if (touches.length) {

    checkDoubleTap(
      touches[0].x,
      touches[0].y
    );
  }

  return false;
}