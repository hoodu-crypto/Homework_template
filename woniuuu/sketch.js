let snailX = 120;
let snailY = 430;

let snailSpeed = 0.45;

// false = 头和身体伸出来
// true = 头和身体缩进壳里
let hiding = false;

let rain = [];
let clouds = [];

function setup() {
  createCanvas(800, 600);

  // 防止手机触摸时网页跟着滚动
  let canvasElement = document.querySelector("canvas");

  if (canvasElement) {
    canvasElement.style.touchAction = "none";
    canvasElement.style.userSelect = "none";
    canvasElement.style.webkitUserSelect = "none";
  }

  // =========================
  // 雨滴
  // =========================

  for (let i = 0; i < 100; i++) {
    rain.push({
      x: random(width),
      y: random(-600, height),
      speed: random(4, 7),
      length: random(10, 18)
    });
  }

  // =========================
  // 云
  // =========================

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


function draw() {

  // =========================
  // 天空
  // =========================

  background(185, 225, 245);

  // 云
  drawClouds();

  // 雨
  drawRain();

  // 土地
  drawGround();

  // 草
  drawGrass();


  // =========================
  // 蜗牛移动
  // =========================

  // 只有伸出身体的时候才移动
  if (!hiding) {

    snailX += snailSpeed;

    // 走到最右边以后从左边重新出现
    if (snailX > width + 100) {
      snailX = -100;
    }
  }


  // 蜗牛一直存在
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

  // 土地
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
// 蜗牛
// =====================================================

function drawSnail() {

  push();

  translate(snailX, snailY);


  // =================================================
  // 没有缩进的时候
  // 显示身体和头
  // =================================================

  if (!hiding) {

    drawSnailBody();

    drawSnailHead();
  }


  // 壳永远存在
  drawShell();


  pop();
}


// =====================================================
// 蜗牛身体
// =====================================================

function drawSnailBody() {

  noStroke();

  // 身体
  fill(248, 190, 150);

  ellipse(0, 38, 170, 48);

  // 身体下面的阴影
  fill(205, 145, 120, 100);

  ellipse(0, 52, 135, 18);
}


// =====================================================
// 蜗牛头
// =====================================================

function drawSnailHead() {

  // 头
  noStroke();

  fill(255, 200, 160);

  ellipse(65, 5, 72, 75);


  // 触角
  stroke(210, 145, 115);
  strokeWeight(4);

  line(48, -22, 38, -58);
  line(78, -22, 88, -58);


  // 触角顶部
  noStroke();

  fill(255, 215, 175);

  ellipse(38, -60, 13, 13);
  ellipse(88, -60, 13, 13);


  // 眼睛
  fill(60, 70, 80);

  ellipse(47, 0, 9, 13);
  ellipse(76, 0, 9, 13);


  // 腮红
  fill(245, 125, 135, 110);

  ellipse(40, 20, 18, 10);
  ellipse(83, 20, 18, 10);


  // 嘴巴
  noFill();

  stroke(155, 95, 90);
  strokeWeight(2.5);

  arc(62, 18, 28, 18, 0, PI);
}


// =====================================================
// 蜗牛壳
// =====================================================

function drawShell() {

  // 壳的阴影
  noStroke();

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
// 蜗牛互动
// =====================================================

// 统一处理：点击/触摸蜗牛
function checkSnailInteraction(x, y) {

  // 判断点击位置和蜗牛的距离
  let distanceToSnail = dist(
    x,
    y,
    snailX,
    snailY
  );

  // 点击蜗牛
  if (distanceToSnail < 90) {

    // 切换状态
    hiding = !hiding;
  }
}


// =====================================================
// 电脑鼠标互动
// =====================================================

function mousePressed() {

  checkSnailInteraction(mouseX, mouseY);

}


// =====================================================
// 手机触摸互动
// =====================================================

function touchStarted() {

  // 确认有触摸点
  if (touches.length > 0) {

    let touchX = touches[0].x;
    let touchY = touches[0].y;

    checkSnailInteraction(touchX, touchY);
  }

  // 防止手机网页跟着手指滚动
  return false;
}