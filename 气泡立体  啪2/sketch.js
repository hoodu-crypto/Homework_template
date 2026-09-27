let bubbles = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  let colors = [
    [30, 180, 255],   // 蓝
    [150, 70, 255],   // 紫
    [255, 70, 170],   // 粉
    [20, 210, 190],   // 青
    [255, 170, 40]    // 橙
  ];

  for (let i = 0; i < 13; i++) {
    bubbles.push({
      x: random(width),
      y: random(height, height + 400),
      size: random(30, 120),
      speed: random(0.5, 1.8),
      angle: random(TWO_PI),
      color: random(colors)
    });
  }
}

function draw() {
  background(250, 220, 230);

  // 泡泡移动
  for (let b of bubbles) {

    b.y -= b.speed;

    // 错乱的左右漂浮
    b.x += sin(frameCount * 0.02 + b.angle) * 0.8;

    // 到顶部重新出现
    if (b.y < -b.size) {
      resetBubble(b);
    }

    drawBubble(b);
  }

  // 泡泡碰撞
  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {

      let a = bubbles[i];
      let b = bubbles[j];

      let d = dist(a.x, a.y, b.x, b.y);

      if (d < (a.size + b.size) / 2) {

        // 碰到以后偶尔破裂
        if (random(1) < 0.02) {
          popBubble(a);
          popBubble(b);
        }
      }
    }
  }

  // 破裂的小彩色粒子
  for (let i = particles.length - 1; i >= 0; i--) {

    let p = particles[i];

    p.x += p.vx;
    p.y += p.vy;
    p.life -= 6;

    noStroke();
    fill(p.color, p.life);
    circle(p.x, p.y, 5);

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}


// 泡泡外观
function drawBubble(b) {

  push();
  noStroke();

  let c = b.color;

  // 深色底层，让泡泡更有体积
  fill(c[0] * 0.55, c[1] * 0.55, c[2] * 0.55, 170);
  circle(b.x, b.y, b.size);

  // 彩色主体
  fill(c[0], c[1], c[2], 130);
  circle(
    b.x - b.size * 0.06,
    b.y - b.size * 0.06,
    b.size * 0.88
  );

  // 第二种颜色，让里面有彩色变化
  fill(
    255 - c[0] * 0.3,
    255 - c[1] * 0.3,
    255,
    80
  );

  circle(
    b.x + b.size * 0.12,
    b.y + b.size * 0.12,
    b.size * 0.55
  );

  // 透明高光
  fill(255, 255, 255, 210);

  ellipse(
    b.x - b.size * 0.22,
    b.y - b.size * 0.25,
    b.size * 0.22,
    b.size * 0.11
  );

  fill(255, 255, 255, 130);

  circle(
    b.x - b.size * 0.3,
    b.y - b.size * 0.12,
    b.size * 0.07
  );

  pop();
}


// 泡泡破裂
function popBubble(b) {

  for (let i = 0; i < 10; i++) {

    let angle = random(TWO_PI);
    let speed = random(1, 4);

    particles.push({
      x: b.x,
      y: b.y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      color: color(
        random(50, 255),
        random(50, 255),
        random(100, 255)
      ),
      life: 160
    });
  }

  resetBubble(b);
}


// 重新生成泡泡
function resetBubble(b) {

  b.x = random(width);
  b.y = height + random(50, 300);

  b.size = random(30, 120);
  b.speed = random(0.5, 1.8);
  b.angle = random(TWO_PI);
}