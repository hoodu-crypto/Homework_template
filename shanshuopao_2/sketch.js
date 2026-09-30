let bubbles = [];
let pops = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 创建泡泡
  for (let i = 0; i < 18; i++) {
    bubbles.push({
      x: random(width),
      y: random(height, height + 300),
      size: random(35, 90),
      speed: random(0.5, 1.5),
      offset: random(1000),
      popped: false
    });
  }
}

function draw() {
  background(245);

  // =========================
  // 泡泡
  // =========================

  for (let bubble of bubbles) {

    if (!bubble.popped) {

      // 向上移动
      bubble.y -= bubble.speed;

      // 左右轻轻飘动
      bubble.x +=
        sin(frameCount * 0.01 + bubble.offset) * 0.3;

      // 到顶部重新出现
      if (bubble.y < -bubble.size) {
        resetBubble(bubble);
      }

      // 画泡泡
      drawBubble(
        bubble.x,
        bubble.y,
        bubble.size
      );
    }
  }

  // =========================
  // 破裂粒子
  // =========================

  for (let i = pops.length - 1; i >= 0; i--) {

    let p = pops[i];

    p.x += p.vx;
    p.y += p.vy;

    p.vy += 0.01;

    p.life -= 3;

    noStroke();

    fill(
      p.r,
      p.g,
      p.b,
      p.life
    );

    circle(
      p.x,
      p.y,
      p.size
    );

    // 粒子消失
    if (p.life <= 0) {
      pops.splice(i, 1);
    }
  }
}


// ======================================================
// 电脑鼠标点击
// ======================================================

function mousePressed() {

  checkBubbleClick(mouseX, mouseY);

  return false;
}


// ======================================================
// 手机触摸
// ======================================================

function touchStarted() {

  checkBubbleClick(touchX, touchY);

  return false;
}


// ======================================================
// 检查有没有点击到泡泡
// ======================================================

function checkBubbleClick(px, py) {

  // 从后往前检查
  for (let i = bubbles.length - 1; i >= 0; i--) {

    let bubble = bubbles[i];

    // 已经炸开的泡泡跳过
    if (bubble.popped) {
      continue;
    }

    // 计算点击位置和泡泡中心的距离
    let distance = dist(
      px,
      py,
      bubble.x,
      bubble.y
    );

    // 点击到泡泡
    if (distance < bubble.size / 2) {

      popBubble(bubble);

      // 一次只炸一个
      break;
    }
  }
}


// ======================================================
// 泡泡破裂
// ======================================================

function popBubble(bubble) {

  // 防止重复点击
  if (bubble.popped) {
    return;
  }

  // 泡泡消失
  bubble.popped = true;


  // =========================
  // 爆炸粒子
  // =========================

  for (let i = 0; i < 18; i++) {

    let angle = random(TWO_PI);

    let speed = random(1, 4);

    pops.push({

      x: bubble.x,
      y: bubble.y,

      vx: cos(angle) * speed,
      vy: sin(angle) * speed,

      r: random(150, 255),
      g: random(150, 255),
      b: random(150, 255),

      size: random(2, 6),

      life: 180
    });
  }


  // =========================
  // 过一会儿重新出现
  // =========================

  setTimeout(function () {

    resetBubble(bubble);

  }, random(500, 1200));
}


// ======================================================
// 重新生成泡泡
// ======================================================

function resetBubble(bubble) {

  bubble.x = random(width);

  bubble.y =
    height + random(30, 200);

  bubble.size =
    random(35, 90);

  bubble.speed =
    random(0.5, 1.5);

  bubble.popped = false;
}


// ======================================================
// 画泡泡
// ======================================================

function drawBubble(x, y, size) {

  push();

  colorMode(HSB);

  noStroke();


  // =========================
  // 彩色透明泡泡内部
  // =========================

  for (
    let r = size;
    r > size * 0.55;
    r -= 2
  ) {

    let hueValue =
      (r * 3 + frameCount * 0.8) % 360;

    fill(
      hueValue,
      40,
      100,
      8
    );

    circle(
      x,
      y,
      r
    );
  }


  // =========================
  // 中间透明区域
  // =========================

  fill(
    0,
    0,
    100,
    8
  );

  circle(
    x,
    y,
    size * 0.72
  );


  // =========================
  // 彩虹边缘
  // =========================

  noFill();

  strokeWeight(2);


  stroke(
    (frameCount + 20) % 360,
    70,
    100,
    140
  );

  arc(
    x,
    y,
    size,
    size,
    PI * 1.05,
    PI * 1.65
  );


  stroke(
    (frameCount + 140) % 360,
    70,
    100,
    140
  );

  arc(
    x,
    y,
    size,
    size,
    PI * 1.65,
    PI * 2.15
  );


  stroke(
    (frameCount + 250) % 360,
    70,
    100,
    140
  );

  arc(
    x,
    y,
    size,
    size,
    PI * 0.15,
    PI * 0.75
  );


  colorMode(RGB);


  // =========================
  // 大高光
  // =========================

  noStroke();

  fill(
    255,
    255,
    255,
    180
  );

  ellipse(
    x - size * 0.22,
    y - size * 0.25,
    size * 0.18,
    size * 0.08
  );


  // =========================
  // 小高光
  // =========================

  fill(
    255,
    255,
    255,
    120
  );

  circle(
    x - size * 0.30,
    y - size * 0.12,
    size * 0.06
  );

  pop();
}


// ======================================================
// 浏览器窗口大小改变
// ======================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}