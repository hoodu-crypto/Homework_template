let clothes = [];

function setup() {
  createCanvas(1000, 700);

  clothes = [
    {
      type: "shirt",
      x: 280,
      y: 445,
      color: "#F39AAE",
      folded: false
    },

    {
      type: "jacket",
      x: 470,
      y: 430,
      color: "#9FC4E6",
      folded: false
    },

    {
      type: "skirt",
      x: 680,
      y: 440,
      color: "#C5A6DD",
      folded: false
    },

    {
      type: "pants",
      x: 390,
      y: 555,
      color: "#82B4D5",
      folded: false
    },

    {
      type: "coat",
      x: 600,
      y: 555,
      color: "#E7B37D",
      folded: false
    },

    {
      type: "socks",
      x: 220,
      y: 555,
      color: "#A9D7B5",
      folded: false
    }
  ];
}


function draw() {

  background("#DCEFF4");

  drawWall();

  drawFloor();

  drawRug();

  for (let i = 0; i < clothes.length; i++) {
    drawClothes(clothes[i]);
  }
}


// ==================================================
// 墙
// ==================================================

function drawWall() {

  noStroke();

  fill("#DCEFF4");
  rect(0, 0, 1000, 390);

  fill("#C7DFE4");
  rect(0, 375, 1000, 15);
}


// ==================================================
// 木地板
// ==================================================

function drawFloor() {

  noStroke();

  fill("#D8B283");
  rect(0, 390, 1000, 310);

  stroke("#C59B6C");
  strokeWeight(2);

  for (let y = 430; y < 700; y += 55) {
    line(0, y, 1000, y);
  }

  stroke("#CBA274");
  strokeWeight(1);

  for (let i = 0; i < 18; i++) {

    let x = 30 + i * 55;
    let y = 410 + (i % 5) * 53;

    line(x, y, x + 35, y - 3);
    line(x + 45, y + 5, x + 70, y + 2);
  }
}


// ==================================================
// 毛绒地毯
// ==================================================

function drawRug() {

  noStroke();

  // 地毯
  fill("#E8B5C6");
  ellipse(500, 535, 760, 285);

  fill("#EDC0CE");
  ellipse(500, 530, 710, 255);

  // 毛绒边缘
  stroke("#DCA6B7");
  strokeWeight(2);

  for (let i = 0; i < 80; i++) {

    let a = TWO_PI * i / 80;

    let x1 = 500 + cos(a) * 350;
    let y1 = 530 + sin(a) * 125;

    let x2 = 500 + cos(a) * 358;
    let y2 = 530 + sin(a) * 130;

    line(x1, y1, x2, y2);
  }

  // 毛绒小点
  noStroke();

  for (let i = 0; i < 50; i++) {

    let a = i * 2.4;
    let r = 30 + (i * 17) % 300;

    let x = 500 + cos(a) * r;
    let y = 530 + sin(a) * r * 0.35;

    if (i % 2 == 0) {
      fill("#E1ACBD");
    } else {
      fill("#F1C8D4");
    }

    ellipse(x, y, 4, 3);
  }
}


// ==================================================
// 衣服
// ==================================================

function drawClothes(c) {

  push();

  translate(c.x, c.y);

  if (c.folded) {

    drawFoldedClothes(c);

  } else {

    if (c.type == "shirt") {
      drawShirt(c.color);
    }

    if (c.type == "jacket") {
      drawJacket(c.color);
    }

    if (c.type == "skirt") {
      drawSkirt(c.color);
    }

    if (c.type == "pants") {
      drawPants(c.color);
    }

    if (c.type == "coat") {
      drawCoat(c.color);
    }

    if (c.type == "socks") {
      drawSocks(c.color);
    }
  }

  pop();
}


// ==================================================
// 上衣
// ==================================================

function drawShirt(c) {

  noStroke();

  // 阴影
  fill("#D47E94");

  beginShape();
  vertex(-45, -35);
  vertex(-75, -5);
  vertex(-55, 20);
  vertex(-38, 5);
  vertex(-30, 60);
  vertex(30, 60);
  vertex(38, 5);
  vertex(55, 20);
  vertex(75, -5);
  vertex(45, -35);
  vertex(20, -45);
  vertex(-20, -45);
  endShape(CLOSE);

  // 主体
  fill(c);

  beginShape();
  vertex(-40, -35);
  vertex(-70, -5);
  vertex(-52, 15);
  vertex(-35, 2);
  vertex(-27, 55);
  vertex(27, 55);
  vertex(35, 2);
  vertex(52, 15);
  vertex(70, -5);
  vertex(40, -35);
  vertex(20, -42);
  vertex(-20, -42);
  endShape(CLOSE);

  // 领口
  fill("#E68098");
  ellipse(0, -35, 32, 14);

  // 纽扣
  fill("#FFF5F5");

  ellipse(-6, 0, 6, 6);
  ellipse(-6, 17, 6, 6);
  ellipse(-6, 34, 6, 6);

  // 褶皱
  stroke("#D37D92");
  strokeWeight(2);

  line(15, -15, 12, 38);
  line(25, -8, 22, 30);
}


// ==================================================
// 外套
// ==================================================

function drawJacket(c) {

  noStroke();

  // 阴影
  fill("#769AB7");

  beginShape();
  vertex(-50, -40);
  vertex(-78, -5);
  vertex(-58, 15);
  vertex(-38, 0);
  vertex(-32, 65);
  vertex(32, 65);
  vertex(38, 0);
  vertex(58, 15);
  vertex(78, -5);
  vertex(50, -40);
  endShape(CLOSE);

  // 主体
  fill(c);

  beginShape();
  vertex(-46, -43);
  vertex(-72, -5);
  vertex(-53, 12);
  vertex(-34, -2);
  vertex(-28, 58);
  vertex(28, 58);
  vertex(34, -2);
  vertex(53, 12);
  vertex(72, -5);
  vertex(46, -43);
  endShape(CLOSE);

  // 衣领
  fill("#C1D9EC");

  triangle(-32, -40, -5, -7, -25, 0);
  triangle(32, -40, 5, -7, 25, 0);

  // 拉链
  stroke("#7195B0");
  strokeWeight(3);

  line(0, -8, 0, 52);

  // 口袋
  noFill();

  stroke("#7195B0");
  strokeWeight(2);

  rect(-24, 20, 16, 12, 3);
  rect(8, 20, 16, 12, 3);

  // 扣子
  fill("#EFF7FB");
  noStroke();

  ellipse(0, 7, 5, 5);
  ellipse(0, 23, 5, 5);
  ellipse(0, 39, 5, 5);
}


// ==================================================
// 裙子
// ==================================================

function drawSkirt(c) {

  noStroke();

  // 阴影
  fill("#A681BD");

  beginShape();
  vertex(-28, -42);
  vertex(28, -42);
  vertex(48, 52);
  vertex(-48, 52);
  endShape(CLOSE);

  // 主体
  fill(c);

  beginShape();
  vertex(-25, -40);
  vertex(25, -40);
  vertex(44, 48);
  vertex(-44, 48);
  endShape(CLOSE);

  // 腰部
  fill("#B18BC8");
  rect(-27, -42, 54, 12, 5);

  // 裙褶
  stroke("#AC87C3");
  strokeWeight(2);

  line(-13, -25, -20, 38);
  line(0, -25, 0, 42);
  line(13, -25, 20, 38);

  // 蝴蝶结
  noStroke();

  fill("#F1D5F2");

  ellipse(-7, -34, 14, 9);
  ellipse(7, -34, 14, 9);
  ellipse(0, -34, 6, 6);
}


// ==================================================
// 裤子
// ==================================================

function drawPants(c) {

  noStroke();

  // 阴影
  fill("#648BA7");

  beginShape();
  vertex(-32, -48);
  vertex(32, -48);
  vertex(28, 0);
  vertex(58, 65);
  vertex(15, 70);
  vertex(0, 12);
  vertex(-15, 70);
  vertex(-58, 65);
  vertex(-28, 0);
  endShape(CLOSE);

  // 主体
  fill(c);

  beginShape();
  vertex(-30, -46);
  vertex(30, -46);
  vertex(27, 0);
  vertex(54, 62);
  vertex(14, 67);
  vertex(0, 10);
  vertex(-14, 67);
  vertex(-54, 62);
  vertex(-27, 0);
  endShape(CLOSE);

  // 腰部
  fill("#6E97B4");
  rect(-30, -46, 60, 13, 4);

  // 裤缝
  stroke("#6E97B4");
  strokeWeight(2);

  line(0, -28, 0, 5);

  // 口袋
  noFill();

  arc(-18, -18, 23, 23, 0, HALF_PI);
  arc(18, -18, 23, 23, HALF_PI, PI);
}


// ==================================================
// 长外套
// ==================================================

function drawCoat(c) {

  noStroke();

  // 阴影
  fill("#C58D62");

  beginShape();
  vertex(-38, -55);
  vertex(-68, -18);
  vertex(-53, 5);
  vertex(-36, -5);
  vertex(-44, 72);
  vertex(44, 72);
  vertex(36, -5);
  vertex(53, 5);
  vertex(68, -18);
  vertex(38, -55);
  endShape(CLOSE);

  // 主体
  fill(c);

  beginShape();
  vertex(-35, -55);
  vertex(-63, -18);
  vertex(-49, 4);
  vertex(-32, -7);
  vertex(-40, 68);
  vertex(40, 68);
  vertex(32, -7);
  vertex(49, 4);
  vertex(63, -18);
  vertex(35, -55);
  endShape(CLOSE);

  // 衣领
  fill("#F0C69C");

  triangle(-28, -53, -5, -20, -23, -10);
  triangle(28, -53, 5, -20, 23, -10);

  // 中间线
  stroke("#C48E64");
  strokeWeight(2);

  line(0, -17, 0, 58);

  // 扣子
  fill("#FFF0D5");
  noStroke();

  ellipse(0, 0, 7, 7);
  ellipse(0, 20, 7, 7);
  ellipse(0, 40, 7, 7);
}


// ==================================================
// 袜子
// ==================================================

function drawSocks(c) {

  noStroke();

  // 第一只
  fill(c);

  beginShape();

  vertex(-35, -15);
  vertex(-8, -15);
  vertex(-8, 20);
  vertex(12, 34);
  vertex(5, 53);
  vertex(-24, 42);
  vertex(-35, 24);

  endShape(CLOSE);

  // 第二只
  fill("#8FC8A2");

  beginShape();

  vertex(5, -20);
  vertex(32, -20);
  vertex(32, 15);
  vertex(50, 29);
  vertex(42, 49);
  vertex(12, 37);
  vertex(5, 20);

  endShape(CLOSE);

  // 袜口
  fill("#D4EDDA");

  rect(-35, -15, 27, 9, 4);
  rect(5, -20, 27, 9, 4);

  // 小装饰
  fill("#FFF0B0");

  ellipse(-20, 12, 7, 7);
  ellipse(25, 8, 7, 7);
}


// ==================================================
// 折叠后的衣服
// ==================================================

function drawFoldedClothes(c) {

  if (c.type == "shirt") {
    foldedShirt(c.color);
  }

  else if (c.type == "jacket") {
    foldedJacket(c.color);
  }

  else if (c.type == "skirt") {
    foldedSkirt(c.color);
  }

  else if (c.type == "pants") {
    foldedPants(c.color);
  }

  else if (c.type == "coat") {
    foldedCoat(c.color);
  }

  else if (c.type == "socks") {
    foldedSocks(c.color);
  }
}


// ==================================================
// 折叠上衣
// ==================================================

function foldedShirt(c) {

  noStroke();

  // 阴影
  fill("#C98499");
  ellipse(0, 27, 105, 22);

  // 衣服主体
  fill(c);

  beginShape();

  vertex(-38, -28);
  vertex(-23, -37);
  vertex(0, -27);
  vertex(23, -37);
  vertex(38, -28);

  vertex(31, 23);
  vertex(18, 30);
  vertex(-20, 30);
  vertex(-32, 23);

  endShape(CLOSE);

  // 折进去的袖子
  fill(lighten(c));

  beginShape();

  vertex(-38, -28);
  vertex(-55, -12);
  vertex(-47, 4);
  vertex(-30, -5);
  vertex(-26, 15);
  vertex(-37, 20);
  vertex(-43, 5);

  endShape(CLOSE);

  beginShape();

  vertex(38, -28);
  vertex(55, -12);
  vertex(47, 4);
  vertex(30, -5);
  vertex(26, 15);
  vertex(37, 20);
  vertex(43, 5);

  endShape(CLOSE);

  // 领口
  fill("#FFF4F5");
  ellipse(0, -26, 22, 8);

  // 折痕
  stroke(darken(c));
  strokeWeight(2);

  line(-27, 5, 27, 5);
}


// ==================================================
// 折叠外套
// ==================================================

function foldedJacket(c) {

  noStroke();

  fill("#789AB6");
  ellipse(0, 28, 115, 23);

  // 主体
  fill(c);

  beginShape();

  vertex(-40, -31);
  vertex(-20, -39);
  vertex(20, -39);
  vertex(40, -31);

  vertex(36, 23);
  vertex(20, 30);
  vertex(-20, 30);
  vertex(-36, 23);

  endShape(CLOSE);

  // 袖子
  fill(lighten(c));

  beginShape();

  vertex(-40, -29);
  vertex(-57, -13);
  vertex(-48, 4);
  vertex(-31, -4);
  vertex(-27, 15);
  vertex(-37, 20);
  vertex(-44, 6);

  endShape(CLOSE);

  beginShape();

  vertex(40, -29);
  vertex(57, -13);
  vertex(48, 4);
  vertex(31, -4);
  vertex(27, 15);
  vertex(37, 20);
  vertex(44, 6);

  endShape(CLOSE);

  // 衣领
  fill("#D2E5F3");

  triangle(-20, -37, 0, -21, -13, -10);
  triangle(20, -37, 0, -21, 13, -10);

  // 拉链
  stroke(darken(c));
  strokeWeight(2);

  line(0, -15, 0, 24);
}


// ==================================================
// 折叠裙子
// ==================================================

function foldedSkirt(c) {

  noStroke();

  fill("#A982BB");
  ellipse(0, 27, 110, 23);

  // 裙子
  fill(c);

  beginShape();

  vertex(-40, -27);
  vertex(40, -27);
  vertex(44, -8);
  vertex(38, 7);
  vertex(45, 18);
  vertex(25, 28);
  vertex(0, 32);
  vertex(-25, 28);
  vertex(-45, 18);
  vertex(-38, 7);
  vertex(-44, -8);

  endShape(CLOSE);

  // 上面一层
  fill(lighten(c));

  beginShape();

  vertex(-37, -5);
  vertex(37, -5);
  vertex(40, 7);
  vertex(25, 17);
  vertex(0, 22);
  vertex(-25, 17);
  vertex(-40, 7);

  endShape(CLOSE);

  // 腰部
  fill(darken(c));

  rect(-36, -27, 72, 11, 5);

  // 裙褶
  stroke(darken(c));
  strokeWeight(2);

  line(-25, 4, 25, 4);
  line(-17, 16, 17, 16);
}


// ==================================================
// 折叠裤子
// ==================================================

function foldedPants(c) {

  noStroke();

  fill("#658BA5");
  ellipse(0, 28, 115, 23);

  // 第一条裤腿
  fill(c);

  beginShape();

  vertex(-38, -31);
  vertex(0, -31);
  vertex(17, 22);
  vertex(-7, 29);
  vertex(-38, 17);

  endShape(CLOSE);

  // 第二条裤腿
  fill(lighten(c));

  beginShape();

  vertex(-5, -34);
  vertex(35, -34);
  vertex(43, 17);
  vertex(14, 27);
  vertex(-5, 17);

  endShape(CLOSE);

  // 腰部
  fill(darken(c));

  rect(-37, -34, 72, 12, 4);

  // 裤缝
  stroke(darken(c));
  strokeWeight(2);

  line(-5, -18, 14, 20);
}


// ==================================================
// 折叠长外套
// ==================================================

function foldedCoat(c) {

  noStroke();

  fill("#C58D62");
  ellipse(0, 28, 120, 24);

  // 主体
  fill(c);

  beginShape();

  vertex(-42, -32);
  vertex(-24, -40);
  vertex(24, -40);
  vertex(42, -32);

  vertex(38, 22);
  vertex(22, 30);
  vertex(-22, 30);
  vertex(-38, 22);

  endShape(CLOSE);

  // 袖子
  fill(lighten(c));

  beginShape();

  vertex(-41, -29);
  vertex(-58, -13);
  vertex(-49, 5);
  vertex(-31, -4);
  vertex(-27, 16);
  vertex(-38, 21);
  vertex(-45, 6);

  endShape(CLOSE);

  beginShape();

  vertex(41, -29);
  vertex(58, -13);
  vertex(49, 5);
  vertex(31, -4);
  vertex(27, 16);
  vertex(38, 21);
  vertex(45, 6);

  endShape(CLOSE);

  // 衣领
  fill("#F1C89D");

  triangle(-22, -38, 0, -22, -14, -10);
  triangle(22, -38, 0, -22, 14, -10);

  // 中间折痕
  stroke(darken(c));
  strokeWeight(2);

  line(0, -10, 0, 22);

  // 扣子
  noStroke();

  fill("#FFF0D5");

  ellipse(0, 0, 6, 6);
  ellipse(0, 14, 6, 6);
}


// ==================================================
// 折叠袜子
// ==================================================

function foldedSocks(c) {

  noStroke();

  fill("#87B99A");
  ellipse(0, 22, 85, 20);

  // 第一只
  fill(c);

  beginShape();

  vertex(-36, -21);
  vertex(-12, -21);
  vertex(-10, 0);
  vertex(6, 11);
  vertex(-2, 23);
  vertex(-25, 16);
  vertex(-36, 5);

  endShape(CLOSE);

  // 第二只
  fill(lighten(c));

  beginShape();

  vertex(-10, -24);
  vertex(14, -24);
  vertex(16, -3);
  vertex(34, 8);
  vertex(27, 21);
  vertex(5, 14);
  vertex(-10, 5);

  endShape(CLOSE);

  // 袜口
  fill("#D7EFD9");

  rect(-36, -21, 24, 8, 4);
  rect(-10, -24, 24, 8, 4);

  // 小装饰
  fill("#FFF0B0");

  ellipse(-23, 2, 6, 6);
  ellipse(10, 0, 6, 6);
}


// ==================================================
// 点击
// ==================================================

function mousePressed() {

  checkClick(mouseX, mouseY);

  return false;
}


// ==================================================
// 手机触屏
// ==================================================

function touchStarted() {

  if (touches.length > 0) {

    let x = touches[0].x;
    let y = touches[0].y;

    checkClick(x, y);
  }

  return false;
}


// ==================================================
// 判断点击哪件衣服
// ==================================================

function checkClick(x, y) {

  for (let i = clothes.length - 1; i >= 0; i--) {

    let c = clothes[i];

    let d = dist(
      x,
      y,
      c.x,
      c.y
    );

    if (d < 90) {

      c.folded = true;

      return;
    }
  }
}


// ==================================================
// 颜色变亮
// ==================================================

function lighten(hex) {

  let col = color(hex);

  let r = min(red(col) + 25, 255);
  let g = min(green(col) + 25, 255);
  let b = min(blue(col) + 25, 255);

  return color(r, g, b);
}


// ==================================================
// 颜色变暗
// ==================================================

function darken(hex) {

  let col = color(hex);

  let r = max(red(col) - 30, 0);
  let g = max(green(col) - 30, 0);
  let b = max(blue(col) - 30, 0);

  return color(r, g, b);
}