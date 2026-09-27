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

      // 随机决定这个泡泡什么时候破
      popTime: random(180, 600),
      age: 0,
      popped: false
    });
  }
}

function draw() {
  background(245);

  // 泡泡
  for (let bubble of bubbles) {

    if (!bubble.popped) {

      bubble.age++;

      // 向上移动
      bubble.y -= bubble.speed;

      // 左右轻轻飘动
      bubble.x +=
        sin(frameCount * 0.01 + bubble.offset) * 0.3;

      // 随机破掉
      if (bubble.age > bubble.popTime) {
        popBubble(bubble);
      }

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

  // 画破裂的小粒子
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

    circle(p.x, p.y, 4);

    // 粒子消失
    if (p.life <= 0) {
      pops.splice(i, 1);
    }
  }
}


// ======================
// 泡泡破裂
// ======================

function popBubble(bubble) {

  bubble.popped = true;

  // 产生小粒子
  for (let i = 0; i < 10; i++) {

    let angle = random(TWO_PI);
    let speed = random(1, 3);

    pops.push({
      x: bubble.x,
      y: bubble.y,

      vx: cos(angle) * speed,
      vy: sin(angle) * speed,

      r: random(150, 255),
      g: random(150, 255),
      b: random(150, 255),

      life: 180
    });
  }

  // 过一会儿重新生成泡泡
  setTimeout(function () {
    resetBubble(bubble);
  }, random(300, 1000));
}


// ======================
// 重新生成泡泡
// ======================

function resetBubble(bubble) {

  bubble.x = random(width);
  bubble.y = height + random(30, 200);

  bubble.size = random(35, 90);
  bubble.speed = random(0.5, 1.5);

  bubble.age = 0;
  bubble.popTime = random(180, 600);

  bubble.popped = false;
}


// ======================
// 画真正的泡泡
// ======================

function drawBubble(x, y, size) {

  push();

  colorMode(HSB);

  noStroke();

  // 彩色透明的泡泡内部
  for (let r = size; r > size * 0.55; r -= 2) {

    let hueValue =
      (r * 3 + frameCount * 0.8) % 360;

    fill(
      hueValue,
      40,
      100,
      8
    );

    circle(x, y, r);
  }

  // 中间透明区域
  fill(0, 0, 100, 8);
  circle(x, y, size * 0.72);

  // 彩虹边缘
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

  // 大高光
  noStroke();

  fill(255, 255, 255, 180);

  ellipse(
    x - size * 0.22,
    y - size * 0.25,
    size * 0.18,
    size * 0.08
  );

  // 小高光
  fill(255, 255, 255, 120);

  circle(
    x - size * 0.30,
    y - size * 0.12,
    size * 0.06
  );

  pop();
}