let engine;
let blocks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  rectMode(CENTER);

  // Matter.js engine
  engine = Matter.Engine.create();

  // 바닥
  let ground = Matter.Bodies.rectangle(
    width / 2,
    height - 20,
    width,
    40,
    { isStatic: true }
  );

  // 왼쪽 벽
  let leftWall = Matter.Bodies.rectangle(
    0,
    height / 2,
    40,
    height,
    { isStatic: true }
  );

  // 오른쪽 벽
  let rightWall = Matter.Bodies.rectangle(
    width,
    height / 2,
    40,
    height,
    { isStatic: true }
  );

  Matter.Composite.add(engine.world, [
    ground,
    leftWall,
    rightWall
  ]);
}

function draw() {
  background(255);

  // 물리 엔진 업데이트
  Matter.Engine.update(engine);

  // 블록 그리기
  for (let block of blocks) {
    block.display();
  }

  // 안내 문구
  fill(0);
  noStroke();
  textSize(20);
  text("Press ENTER", 20, 30);
}

function keyPressed() {
  if (keyCode === ENTER) {
    blocks.push(
      new Block(width / 2, 50)
    );
  }
}

class Block {
  constructor(x, y) {

    this.w = 100;
    this.h = 50;

    this.body = Matter.Bodies.rectangle(
      x,
      y,
      this.w,
      this.h
    );

    Matter.Composite.add(
      engine.world,
      this.body
    );
  }

  display() {

    let pos = this.body.position;
    let angle = this.body.angle;

    push();

    translate(pos.x, pos.y);
    rotate(angle);

    fill(255, 200, 0);
    stroke(0);
    strokeWeight(2);

    rect(
      0,
      0,
      this.w,
      this.h
    );

    pop();
  }
}