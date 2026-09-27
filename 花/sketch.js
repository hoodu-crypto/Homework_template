let pieces = [];
let finished = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 三层蛋糕的形状
  pieces = [
    {
      type: "triangle",
      x: width / 2 - 40,
      y: -100,
      targetY: height * 0.68,
      size: 70,
      speed: 2.5,
      angle: 0,
      color: [255, 120, 150]
    },

    {
      type: "square",
      x: width / 2 + 30,
      y: -200,
      targetY: height * 0.62,
      size: 90,
      speed: 2.2,
      angle: 0,
      color: [255, 190, 70]
    },

    {
      type: "rect",
      x: width / 2 - 30,
      y: -300,
      targetY: height * 0.55,
      size: 120,
      speed: 2,
      angle: 0,
      color: [120, 190, 255]
    },

    {
      type: "circle",
      x: width / 2 + 20,
      y: -400,
      targetY: height * 0.47,
      size: 45,
      speed: 1.8,
      angle: 0,
      color: [255, 100, 180]
    },

    // 第二层
    {
      type: "triangle",
      x: width / 2 - 20,
      y: -500,
      targetY: height * 0.48,
      size: 60,
      speed: 1.7,
      angle: 0,
      color: [255, 150, 80]
    },

    {
      type: "rect",
      x: width / 2 + 20,
      y: -600,
      targetY: height * 0.41,
      size: 100,
      speed: 1.6,
      angle: 0,
      color: [150, 120, 255]
    },

    // 最上面的装饰
    {
      type: "circle",
      x: width / 2,
      y: -700,
      targetY: height * 0.32,
      size: 35,
      speed: 1.5,
      angle: 0,
      color: [255, 80, 100]
    }
  ];
}


function draw() {

  background(250, 235, 240);

  for (let p of pieces) {

    // 还没有落到位置
    if (p.y < p.targetY) {

      // 向下
      p.y += p.speed;

      // 左右轻轻摆动
      p.x += sin(frameCount * 0.03 + p.y) * 0.8;

      // 旋转
      p.angle += 0.02;

    } else {

      // 到达位置后固定
      p.y = p.targetY;
    }

    drawPiece(p);
  }
}


// 画形状
function drawPiece(p) {

  push();

  translate(p.x, p.y);
  rotate(p.angle);

  noStroke();

  fill(
    p.color[0],
    p.color[1],
    p.color[2]
  );

  if (p.type === "triangle") {

    triangle(
      0,
      -p.size / 2,

      -p.size / 2,
      p.size / 2,

      p.size / 2,
      p.size / 2
    );

  } else if (p.type === "square") {

    rectMode(CENTER);

    square(
      0,
      0,
      p.size
    );

  } else if (p.type === "rect") {

    rectMode(CENTER);

    rect(
      0,
      0,
      p.size * 1.4,
      p.size * 0.55
    );

  } else if (p.type === "circle") {

    circle(
      0,
      0,
      p.size
    );
  }

  pop();
}