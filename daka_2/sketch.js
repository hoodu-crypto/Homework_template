// ==========================================
// 🌷 10 DAYS DIET CHALLENGE
// 2026.10.04 ~ 2026.10.13
// 点击日期 → 星星烟花 ✨
// ==========================================


// ------------------------------------------
// 颜色
// ------------------------------------------

const PINK = "#F4B8C8";     // 奶粉色
const GREEN = "#C9DFB7";    // 奶绿色
const BLUE = "#B9DDE8";     // 奶蓝色

const BACKGROUND = "#FFF9F6";
const WHITE = "#FFFDFC";
const TEXT = "#6D6064";
const BORDER = "#E8D9DC";


// ------------------------------------------
// 10天
// ------------------------------------------

const days = [
  { day: 4, color: PINK },
  { day: 5, color: PINK },

  { day: 6, color: GREEN },
  { day: 7, color: GREEN },
  { day: 8, color: GREEN },

  { day: 9, color: BLUE },
  { day: 10, color: BLUE },
  { day: 11, color: BLUE },
  { day: 12, color: BLUE },
  { day: 13, color: BLUE }
];


// ------------------------------------------
// 打卡记录
// ------------------------------------------

let checkedDays = {};


// ------------------------------------------
// 日期圆圈
// ------------------------------------------

let dayButtons = [];


// ------------------------------------------
// 星星粒子
// ------------------------------------------

let stars = [];


// ==========================================
// SETUP
// ==========================================

function setup() {

  createCanvas(
    getCanvasWidth(),
    getCanvasHeight()
  );

  textAlign(CENTER, CENTER);

  loadCheckData();
}


// ==========================================
// DRAW
// ==========================================

function draw() {

  background(BACKGROUND);

  dayButtons = [];

  // 日历
  drawCalendar();

  // 星星烟花
  drawStars();
}


// ==========================================
// 日历
// ==========================================

function drawCalendar() {

  // ----------------------------------------
  // 标题
  // ----------------------------------------

  fill(TEXT);

  textStyle(BOLD);

  textSize(
    min(28, width * 0.07)
  );

  text(
    "10 DAYS",
    width / 2,
    48
  );

  textStyle(NORMAL);

  textSize(
    min(14, width * 0.035)
  );

  fill("#9A898E");

  text(
    "2026 · October 4 — 13",
    width / 2,
    78
  );


  // ----------------------------------------
  // 提示
  // ----------------------------------------

  textSize(
    min(12, width * 0.03)
  );

  fill("#B19EA3");

  text(
    "Tap to check in ♡",
    width / 2,
    108
  );


  // ----------------------------------------
  // 日期
  // ----------------------------------------

  let contentWidth =
    min(width - 40, 560);

  let spacing =
    contentWidth / 5;


  let circleSize;

  if (width < 500) {

    circleSize =
      min(
        spacing * 0.62,
        55
      );

  } else {

    circleSize =
      min(
        spacing * 0.58,
        65
      );
  }


  let startX =
    width / 2 -
    spacing * 2;


  let startY = 165;


  for (
    let i = 0;
    i < days.length;
    i++
  ) {

    let item = days[i];

    let row =
      floor(i / 5);

    let column =
      i % 5;


    let x =
      startX +
      spacing * column;


    let y =
      startY +
      row * 125;


    let id =
      "2026-10-" +
      nf(item.day, 2);


    let isChecked =
      checkedDays[id] === true;


    // --------------------------------------
    // 日期圆圈
    // --------------------------------------

    if (isChecked) {

      fill(item.color);

    } else {

      fill(WHITE);
    }


    noStroke();

    circle(
      x,
      y,
      circleSize
    );


    // --------------------------------------
    // 边框
    // --------------------------------------

    noFill();

    stroke(
      isChecked
        ? item.color
        : BORDER
    );

    strokeWeight(1.5);

    circle(
      x,
      y,
      circleSize
    );

    noStroke();


    // --------------------------------------
    // 日期数字
    // --------------------------------------

    fill(
      isChecked
        ? "#FFFFFF"
        : TEXT
    );

    textStyle(BOLD);

    textSize(
      min(
        circleSize * 0.38,
        20
      )
    );

    text(
      item.day,
      x,
      y
    );

    textStyle(NORMAL);


    // --------------------------------------
    // DAY 1 / DAY 2...
    // --------------------------------------

    fill("#A89399");

    textSize(
      min(10, width * 0.025)
    );

    text(
      "DAY " + (i + 1),
      x,
      y + circleSize / 2 + 17
    );


    // --------------------------------------
    // 保存点击位置
    // --------------------------------------

    dayButtons.push({

      x: x,
      y: y,

      radius:
        circleSize / 2,

      id: id,

      color:
        item.color
    });
  }
}


// ==========================================
// ✨ 星星烟花
// ==========================================

function drawStars() {

  for (
    let i = stars.length - 1;
    i >= 0;
    i--
  ) {

    let star = stars[i];


    // 更新位置
    star.x += star.vx;
    star.y += star.vy;


    // 轻微重力
    star.vy += 0.025;


    // 逐渐消失
    star.life -= 5;


    // 旋转
    star.rotation += star.rotationSpeed;


    // --------------------------------------
    // 绘制星星
    // --------------------------------------

    push();

    translate(
      star.x,
      star.y
    );

    rotate(
      star.rotation
    );


    // 透明度
    let alpha =
      constrain(
        star.life,
        0,
        255
      );


    // 星星颜色
    fill(
      red(star.color),
      green(star.color),
      blue(star.color),
      alpha
    );

    noStroke();


    drawStar(
      0,
      0,
      star.size,
      star.size * 0.4
    );


    pop();


    // --------------------------------------
    // 删除已经消失的星星
    // --------------------------------------

    if (star.life <= 0) {

      stars.splice(i, 1);
    }
  }
}


// ==========================================
// ⭐ 绘制五角星
// ==========================================

function drawStar(
  x,
  y,
  outerRadius,
  innerRadius
) {

  let points = 5;

  beginShape();

  for (
    let i = 0;
    i < points * 2;
    i++
  ) {

    let angle =
      -HALF_PI +
      i * PI / points;


    let radius =
      i % 2 === 0
        ? outerRadius
        : innerRadius;


    vertex(
      x + cos(angle) * radius,
      y + sin(angle) * radius
    );
  }

  endShape(CLOSE);
}


// ==========================================
// ✨ 创建星星烟花
// ==========================================

function createStarBurst(
  x,
  y,
  color
) {

  // 一次产生 18 颗星星
  for (
    let i = 0;
    i < 18;
    i++
  ) {

    let angle =
      random(TWO_PI);


    let speed =
      random(1.2, 3.8);


    stars.push({

      x: x,
      y: y,

      vx:
        cos(angle) * speed,

      vy:
        sin(angle) * speed,

      size:
        random(3, 7),

      life:
        random(150, 230),

      rotation:
        random(TWO_PI),

      rotationSpeed:
        random(-0.08, 0.08),

      color:
        color
    });
  }


  // ----------------------------------------
  // 再加几个比较大的闪光星星
  // ----------------------------------------

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    let angle =
      random(TWO_PI);

    let speed =
      random(0.5, 2.2);


    stars.push({

      x: x,
      y: y,

      vx:
        cos(angle) * speed,

      vy:
        sin(angle) * speed,

      size:
        random(7, 11),

      life:
        random(180, 255),

      rotation:
        random(TWO_PI),

      rotationSpeed:
        random(-0.05, 0.05),

      color:
        color
    });
  }
}


// ==========================================
// 鼠标点击
// ==========================================

function mousePressed() {

  checkDay(
    mouseX,
    mouseY
  );

  return false;
}


// ==========================================
// 手机触摸
// ==========================================

function touchStarted() {

  checkDay(
    mouseX,
    mouseY
  );

  return false;
}


// ==========================================
// 检查点击日期
// ==========================================

function checkDay(x, y) {

  for (
    let i = 0;
    i < dayButtons.length;
    i++
  ) {

    let button =
      dayButtons[i];


    let distance =
      dist(
        x,
        y,
        button.x,
        button.y
      );


    // --------------------------------------
    // 点击圆圈
    // --------------------------------------

    if (
      distance <=
      button.radius
    ) {

      let id =
        button.id;


      // ------------------------------------
      // 如果已经打卡
      // → 取消
      // ------------------------------------

      if (checkedDays[id]) {

        delete checkedDays[id];
      }


      // ------------------------------------
      // 如果没有打卡
      // → 打卡 + 烟花
      // ------------------------------------

      else {

        checkedDays[id] = true;


        // ✨ 星星烟花
        createStarBurst(
          button.x,
          button.y,
          button.color
        );
      }


      // 保存
      saveCheckData();


      break;
    }
  }
}


// ==========================================
// 保存
// ==========================================

function saveCheckData() {

  localStorage.setItem(
    "dietChallenge_2026_10",
    JSON.stringify(
      checkedDays
    )
  );
}


// ==========================================
// 读取
// ==========================================

function loadCheckData() {

  let saved =
    localStorage.getItem(
      "dietChallenge_2026_10"
    );


  if (saved) {

    try {

      checkedDays =
        JSON.parse(saved);

    } catch (error) {

      checkedDays = {};
    }
  }
}


// ==========================================
// Canvas 宽度
// ==========================================

function getCanvasWidth() {

  return min(
    windowWidth,
    650
  );
}


// ==========================================
// Canvas 高度
// ==========================================

function getCanvasHeight() {

  return 470;
}


// ==========================================
// 手机旋转 / 浏览器大小变化
// ==========================================

function windowResized() {

  resizeCanvas(
    getCanvasWidth(),
    getCanvasHeight()
  );

  redraw();
}