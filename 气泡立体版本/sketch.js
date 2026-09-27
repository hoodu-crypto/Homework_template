let bubbles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 18; i++) {
    bubbles.push({
      x: random(width),
      y: random(height, height + 300),
      size: random(30, 90),
      speed: random(0.5, 1.5),
      offset: random(1000)
    });
  }
}

function draw() {
  background(245);

  for (let bubble of bubbles) {

    // 向上飘
    bubble.y -= bubble.speed;

    // 左右轻轻漂浮
    bubble.x += sin(frameCount * 0.01 + bubble.offset) * 0.3;

    // 到顶部后重新出现
    if (bubble.y < -bubble.size) {
      bubble.y = height + bubble.size;
      bubble.x = random(width);
    }

    drawBubble(
      bubble.x,
      bubble.y,
      bubble.size
    );
  }
}


function drawBubble(x, y, size) {

  push();

  // 彩色透明外层
  noStroke();

  for (let r = size; r > size * 0.55; r -= 2) {

    let hueValue =
      (r * 3 + frameCount * 0.8) % 360;

    colorMode(HSB);

    fill(
      hueValue,
      40,
      100,
      8
    );

    circle(x, y, r);
  }

  colorMode(RGB);

  // 透明的中心
  fill(255, 255, 255, 15);
  circle(x, y, size * 0.72);

  // 彩虹边缘
  noFill();
  strokeWeight(2);

  colorMode(HSB);

  stroke(
    (frameCount * 0.8 + 20) % 360,
    70,
    100,
    120
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
    (frameCount * 0.8 + 140) % 360,
    70,
    100,
    120
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
    (frameCount * 0.8 + 250) % 360,
    70,
    100,
    120
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

  // 左上角的高光
  noStroke();
  fill(255, 255, 255, 180);
  ellipse(
    x - size * 0.22,
    y - size * 0.25,
    size * 0.18,
    size * 0.08
  );

  // 小一点的高光
  fill(255, 255, 255, 100);
  circle(
    x - size * 0.30,
    y - size * 0.12,
    size * 0.06
  );

  pop();
}