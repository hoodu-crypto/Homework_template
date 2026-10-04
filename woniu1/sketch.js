let snailX = 120;
let snailY;
let snailSpeed = 0.45;
let hiding = false;

let rain = [];
let clouds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  snailY = height * 0.72;

  let c = document.querySelector("canvas");
  c.style.touchAction = "none";
  c.style.userSelect = "none";

  for (let i = 0; i < 100; i++) {
    rain.push({
      x: random(width),
      y: random(-600, height),
      speed: random(4, 7),
      length: random(10, 18)
    });
  }

  clouds = [
    { x: width * 0.2, y: height * 0.17, speed: 0.15 },
    { x: width * 0.75, y: height * 0.25, speed: 0.1 }
  ];
}


function draw() {
  background(185, 225, 245);

  drawClouds();
  drawRain();
  drawGround();
  drawGrass();

  if (!hiding) {
    snailX += snailSpeed;
    if (snailX > width + 100) snailX = -100;
  }

  drawSnail();
}


// =========================
// 云
// =========================

function drawClouds() {
  noStroke();
  fill(245, 250, 255, 220);

  for (let c of clouds) {
    c.x += c.speed;
    if (c.x > width + 150) c.x = -150;

    ellipse(c.x, c.y, 110, 55);
    ellipse(c.x + 45, c.y - 20, 85, 65);
    ellipse(c.x + 90, c.y, 110, 55);
    ellipse(c.x + 45, c.y + 10, 145, 45);
  }
}


// =========================
// 雨
// =========================

function drawRain() {
  stroke(105, 175, 215, 150);
  strokeWeight(3);

  for (let r of rain) {
    line(r.x, r.y, r.x - 4, r.y + r.length);
    r.y += r.speed;

    if (r.y > height) {
      r.y = random(-100, 0);
      r.x = random(width);
    }
  }
}


// =========================
// 土地
// =========================

function drawGround() {
  let y = height * 0.71;

  noStroke();
  fill(170, 125, 85);

  beginShape();
  vertex(0, y);

  bezierVertex(
    width * 0.18, y - 20,
    width * 0.37, y + 10,
    width * 0.56, y - 5
  );

  bezierVertex(
    width * 0.75, y - 20,
    width * 0.88, y + 10,
    width, y - 10
  );

  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  fill(135, 100, 75, 80);

  ellipse(width * 0.15, height * 0.83, 130, 25);
  ellipse(width * 0.43, height * 0.91, 150, 30);
  ellipse(width * 0.75, height * 0.80, 120, 25);
}


// =========================
// 草
// =========================

function drawGrass() {
  let y = height * 0.71;

  stroke(75, 145, 80);
  strokeWeight(3);

  for (let x = 20; x < width; x += 50) {
    let gy = y + sin(x * 0.1) * 5;

    line(x, gy, x - 5, gy - 18);
    line(x, gy, x + 4, gy - 22);
    line(x, gy, x + 10, gy - 15);
  }
}


// =========================
// 蜗牛
// =========================

function drawSnail() {
  push();
  translate(snailX, snailY);

  if (!hiding) {
    drawBody();
    drawHead();
  }

  drawShell();
  pop();
}


// 身体
function drawBody() {
  noStroke();

  fill(248, 190, 150);
  ellipse(0, 38, 170, 48);

  fill(205, 145, 120, 100);
  ellipse(0, 52, 135, 18);
}


// 头
function drawHead() {
  noStroke();
  fill(255, 200, 160);
  ellipse(65, 5, 72, 75);

  stroke(210, 145, 115);
  strokeWeight(4);

  line(48, -22, 38, -58);
  line(78, -22, 88, -58);

  noStroke();
  fill(255, 215, 175);

  ellipse(38, -60, 13, 13);
  ellipse(88, -60, 13, 13);

  fill(60, 70, 80);

  ellipse(47, 0, 9, 13);
  ellipse(76, 0, 9, 13);

  fill(245, 125, 135, 110);

  ellipse(40, 20, 18, 10);
  ellipse(83, 20, 18, 10);

  noFill();
  stroke(155, 95, 90);
  strokeWeight(2.5);

  arc(62, 18, 28, 18, 0, PI);
}


// 壳
function drawShell() {
  noStroke();

  fill(185, 115, 65, 100);
  ellipse(-25, 18, 115, 115);

  fill(225, 160, 90);
  ellipse(-30, 5, 110, 110);

  fill(245, 190, 115);
  ellipse(-48, -12, 65, 65);

  noFill();
  stroke(185, 115, 65);
  strokeWeight(6);

  arc(-30, 5, 70, 70, 0.2, TWO_PI + 0.2);
  arc(-30, 5, 40, 40, 0.4, TWO_PI + 0.4);
}


// =========================
// 点击 / 触摸
// =========================

function checkSnail(x, y) {
  if (dist(x, y, snailX, snailY) < 90) {
    hiding = !hiding;
  }
}

function mousePressed() {
  checkSnail(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    checkSnail(touches[0].x, touches[0].y);
  }

  return false;
}


// =========================
// 满屏适配
// =========================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  snailY = height * 0.72;
}