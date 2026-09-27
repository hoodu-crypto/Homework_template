let bubbles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 气泡
  for (let i = 0; i < 15; i++) {
    bubbles.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  background(245);

  for (let bubble of bubbles) {

    // 气泡向上移动
    bubble.y -= bubble.speed;

    // 到达顶部后，从下面重新出现
    if (bubble.y < -bubble.size) {
      bubble.y = height + bubble.size;
      bubble.x = random(width);
    }

    // 画气泡
    fill(200, 230, 255, 80);
    stroke(100, 180, 220);
    strokeWeight(2);

    circle(
      bubble.x,
      bubble.y,
      bubble.size
    );
  }
}