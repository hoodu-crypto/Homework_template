let x = 0;
let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  // Red rect
  push();
  fill(255, 0, 0);
  //translate(100, 100);
  translate(50, 50);
  rotate(radians(angle));
  rect(-50, -50, 100);
  pop();
  angle++;

  // Blue circle
  fill(0, 0, 255);
  circle(x, height / 2, 100);

  //x = x + 1;
  x += 5;
  //x++;

  print(x);
}