let snailX, snailY;
let dragging = false;
let grass = [];

let clouds = [
  { x: 130, y: 100, s: 0.15 },
  { x: 600, y: 160, s: 0.1 }
];

function setup() {
  createCanvas(windowWidth, windowHeight);

  snailX = width * 0.25;
  snailY = height - 160;

  // 整齐排列的草
  for (let y = height - 165; y < height - 20; y += 28) {
    for (let x = 15; x < width; x += 32) {
      grass.push({
        x: x,
        y: y + random(-4, 4),
        size: random(0.8, 1.05),
        eaten: false
      });
    }
  }
}

function draw() {
  background(185, 225, 245);

  sky();
  ground();
  drawGrass();
  snail();
}


// ====================
// 草
// ====================

function drawGrass() {
  for (let g of grass) {
    if (g.eaten) continue;

    push();
    translate(g.x, g.y);
    scale(g.size);

    stroke(75, 145, 80);
    strokeWeight(4);

    line(0, 0, -5, -18);
    line(0, 0, 3, -23);
    line(0, 0, 10, -15);

    pop();
  }
}


// 蜗牛经过的地方吃掉草
function eatGrass() {
  for (let g of grass) {
    if (g.eaten) continue;

    if (dist(snailX, snailY + 20, g.x, g.y) < 90) {
      g.eaten = true;
    }
  }
}


// ====================
// 蜗牛
// ====================

function snail() {
  push();

  translate(snailX, snailY);

  noStroke();

  // 地面阴影
  fill(80, 70, 60, 60);
  ellipse(0, 56, 155, 16);

  // 身体
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

  // 触角顶端
  noStroke();
  fill(255, 215, 175);

  circle(38, -54, 13);
  circle(88, -54, 13);

  // 眼睛
  fill(60, 70, 80);

  ellipse(47, 0, 9, 13);
  ellipse(76, 0, 9, 13);

  // 腮红
  fill(245, 125, 135, 130);

  ellipse(40, 20, 18, 10);
  ellipse(86, 20, 18, 10);

  // 嘴巴
  noFill();
  stroke(155, 95, 90);
  strokeWeight(3);

  ellipse(63, 20, 18, 13);

  // 壳
  shell();

  pop();
}


// ====================
// 蜗牛壳
// ====================

function shell() {
  noStroke();

  fill(185, 115, 65, 100);
  circle(-25, 18, 115);

  fill(225, 160, 90);
  circle(-30, 5, 110);

  fill(245, 190, 115);
  circle(-48, -12, 65);

  noFill();
  stroke(185, 115, 65);
  strokeWeight(6);

  arc(-30, 5, 70, 70, 0.2, TWO_PI + 0.2);
  arc(-30, 5, 40, 40, 0.4, TWO_PI + 0.4);
}


// ====================
// 天空
// ====================

function sky() {
  noStroke();

  // 太阳
  fill(255, 220, 70);
  circle(width - 120, 90, 75);

  // 云
  for (let c of clouds) {
    c.x += c.s;

    if (c.x > width + 150) {
      c.x = -150;
    }

    cloud(c.x, c.y);
  }
}


function cloud(x, y) {
  noStroke();

  fill(245, 250, 255, 220);

  ellipse(x, y, 110, 55);
  ellipse(x + 45, y - 20, 85, 65);
  ellipse(x + 90, y, 110, 55);
  ellipse(x + 45, y + 10, 145, 45);
}


// ====================
// 土地
// ====================

function ground() {
  noStroke();

  fill(170, 125, 85);

  beginShape();

  vertex(0, height - 175);

  bezierVertex(
    width * 0.2,
    height - 195,
    width * 0.4,
    height - 165,
    width * 0.6,
    height - 180
  );

  bezierVertex(
    width * 0.75,
    height - 195,
    width * 0.9,
    height - 165,
    width,
    height - 185
  );

  vertex(width, height);
  vertex(0, height);

  endShape(CLOSE);
}


// ====================
// 拖动
// ====================

function hitSnail(x, y) {
  return dist(x, y, snailX, snailY) < 110;
}


function startDrag(x, y) {
  if (hitSnail(x, y)) {
    dragging = true;
  }

  return false;
}


function moveDrag(x, y) {
  if (dragging) {
    snailX = x;
    snailY = y;

    // 蜗牛经过的草消失
    eatGrass();
  }

  return false;
}


function stopDrag() {
  dragging = false;
  return false;
}


// ====================
// 鼠标
// ====================

function mousePressed() {
  return startDrag(mouseX, mouseY);
}


function mouseDragged() {
  return moveDrag(mouseX, mouseY);
}


function mouseReleased() {
  return stopDrag();
}


// ====================
// 手机触摸
// ====================

function touchStarted() {
  if (touches.length > 0) {
    return startDrag(touches[0].x, touches[0].y);
  }

  return false;
}


function touchMoved() {
  if (touches.length > 0) {
    return moveDrag(touches[0].x, touches[0].y);
  }

  return false;
}


function touchEnded() {
  return stopDrag();
}


// ====================
// 窗口大小变化
// ====================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}