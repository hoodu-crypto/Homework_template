let bubbles = [];

function setup() {
  createCanvas(800, 600);

  for (let i = 0; i < 18; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  background(250, 225, 235);

  for (let b of bubbles) {
    b.move();
    b.show();
  }
}

class Bubble {

  constructor() {
    this.x = random(50, 750);
    this.y = random(600, 800);
    this.size = random(25, 90);
    this.speed = random(1, 2);

   let colors = [
  [255, 120, 180],
  [255, 170, 200],
  [255, 80, 150],
  [255, 140, 20],
  [30, 160, 255],
  [130, 50, 255],
  [20, 210, 160],
  [255, 210, 20],
  [255, 200, 220]
];

    this.c = random(colors);

    this.pop = false;
    this.time = 0;
    this.dots = [];
  }

  move() {

    if (!this.pop) {

      this.y -= this.speed;
      this.x += sin(frameCount * 0.03) * 0.5;

      // 泡泡破裂
      if (this.y < 50) {

        this.pop = true;

        // 产生小点
        for (let i = 0; i < 14; i++) {

          let a = random(TWO_PI);
          let s = random(1, 3);

          this.dots.push({
            x: this.x,
            y: this.y,
            vx: cos(a) * s,
            vy: sin(a) * s,
            size: random(6, 10)
          });
        }
      }

    } else {

      // 小点散开
      for (let d of this.dots) {
        d.x += d.vx;
        d.y += d.vy;
        d.size *= 0.94;
      }

      this.time++;

      // 重新生成泡泡
      if (this.time > 25) {
        this.y = random(650, 800);
        this.x = random(50, 750);
        this.size = random(25, 90);
        this.pop = false;
        this.time = 0;
        this.dots = [];
      }
    }
  }

  show() {

    if (!this.pop) {

      noStroke();

      // 彩色泡泡
      fill(this.c[0], this.c[1], this.c[2], 210);
      ellipse(this.x, this.y, this.size);

      // 简单高光
      fill(255, 255, 255, 180);
      ellipse(
        this.x - this.size * 0.2,
        this.y - this.size * 0.25,
        this.size * 0.2
      );

    } else {

      // 破裂的小点
      noStroke();
      fill(this.c[0], this.c[1], this.c[2]);

      for (let d of this.dots) {
        ellipse(d.x, d.y, d.size);
      }
    }
  }
}