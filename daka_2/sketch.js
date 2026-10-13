
const PINK = "#F4B8C8";
const GREEN = "#C9DFB7";
const BLUE = "#B9DDE8";

const BACKGROUND = "#FFF9F6";
const WHITE = "#FFFDFC";
const TEXT = "#6D6064";
const BORDER = "#E8D9DC";

const months = [
  { month: 10, name: "OCTOBER", color: PINK },
  { month: 11, name: "NOVEMBER", color: GREEN },
  { month: 12, name: "DECEMBER", color: BLUE }
];

const WEEKDAYS = [
  "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
];

let checkedDays = {};
let dayButtons = [];
let stars = [];
let lastTouchAt = -1000;

function setup() {
  const canvas = createCanvas(
    getCanvasWidth(),
    getCanvasHeight()
  );

  canvas.elt.style.display = "block";
  canvas.elt.style.maxWidth = "100%";
  canvas.elt.style.height = "auto";
  canvas.elt.style.margin = "0 auto";
  canvas.elt.style.touchAction = "manipulation";

  pixelDensity(min(window.devicePixelRatio || 1, 2));
  textAlign(CENTER, CENTER);

  loadCheckData();
}

function draw() {
  background(BACKGROUND);
  dayButtons = [];

  drawHeader();

  const monthHeight = getMonthHeight();
  const gap = width < 500 ? 22 : 28;
  const startY = 130;

  for (let i = 0; i < months.length; i++) {
    drawCalendar(
      months[i],
      startY + i * (monthHeight + gap)
    );
  }

  drawStars();
}

// ------------------------------
// 标题
// ------------------------------

function drawHeader() {
  fill(TEXT);
  noStroke();

  textStyle(BOLD);
  textSize(min(28, width * 0.07));
  text("10 DAYS", width / 2, 40);

  textStyle(NORMAL);
  textSize(min(14, width * 0.035));
  fill("#9A898E");
  text("2026 · October — December", width / 2, 70);

  textSize(min(12, width * 0.03));
  fill("#B19EA3");
  text("Tap to check in ♡", width / 2, 98);
}

// ------------------------------
// 每月日历
// ------------------------------

function drawCalendar(info, startY) {
  const contentWidth = min(width - 40, 560);
  const spacing = contentWidth / 5;

  const circleSize = width < 500
    ? min(spacing * 0.62, 55)
    : min(spacing * 0.58, 65);

  const startX = width / 2 - spacing * 2;

  const totalDays = new Date(
    2026,
    info.month,
    0
  ).getDate();

  const rowGap = width < 500 ? 88 : 100;
  const gridStartY = startY + 105;

  // 月份标题
  fill(info.color);
  noStroke();
  textStyle(BOLD);
  textSize(min(19, width * 0.045));

  text(
    info.name + " 2026",
    width / 2,
    startY + 28
  );

  // 标题下方细线
  stroke(BORDER);
  strokeWeight(1);

  line(
    width / 2 - contentWidth / 2,
    startY + 55,
    width / 2 + contentWidth / 2,
    startY + 55
  );

  noStroke();

  // 日期和星期
  for (let i = 0; i < totalDays; i++) {
    const day = i + 1;
    const row = floor(i / 5);
    const column = i % 5;

    const x = startX + spacing * column;
    const y = gridStartY + row * rowGap;

    const id =
      "2026-" +
      nf(info.month, 2) +
      "-" +
      nf(day, 2);

    const isChecked = checkedDays[id] === true;

    // 自动计算真实星期
    const weekdayIndex = new Date(
      2026,
      info.month - 1,
      day
    ).getDay();

    const weekday = WEEKDAYS[weekdayIndex];

    // 星期显示在圆圈上方
    fill("#A89399");
    noStroke();
    textStyle(NORMAL);
    textSize(min(10, width * 0.025));

    text(
      weekday,
      x,
      y - circleSize / 2 - 13
    );

    // 日期圆圈
    fill(isChecked ? info.color : WHITE);
    noStroke();
    circle(x, y, circleSize);

    // 圆圈边框
    noFill();
    stroke(isChecked ? info.color : BORDER);
    strokeWeight(1.5);
    circle(x, y, circleSize);

    // 日期数字
    noStroke();
    fill(isChecked ? "#FFFFFF" : TEXT);
    textStyle(BOLD);
    textSize(min(circleSize * 0.38, 20));
    text(day, x, y);

    textStyle(NORMAL);

    // 点击区域
    dayButtons.push({
      x: x,
      y: y,
      radius: circleSize / 2 + 5,
      id: id,
      color: info.color
    });
  }
}

// ------------------------------
// 星星烟花动画
// ------------------------------

function drawStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    const star = stars[i];

    star.x += star.vx;
    star.y += star.vy;
    star.vy += 0.025;
    star.life -= 5;
    star.rotation += star.rotationSpeed;

    push();
    translate(star.x, star.y);
    rotate(star.rotation);

    const alpha = constrain(star.life, 0, 255);
    const c = color(star.color);

    fill(
      red(c),
      green(c),
      blue(c),
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

    if (star.life <= 0) {
      stars.splice(i, 1);
    }
  }
}

// ------------------------------
// 绘制五角星
// ------------------------------

function drawStar(x, y, outerRadius, innerRadius) {
  beginShape();

  for (let i = 0; i < 10; i++) {
    const angle = -HALF_PI + i * PI / 5;

    const radius = i % 2 === 0
      ? outerRadius
      : innerRadius;

    vertex(
      x + cos(angle) * radius,
      y + sin(angle) * radius
    );
  }

  endShape(CLOSE);
}

// ------------------------------
// 创建星星烟花
// ------------------------------

function createStarBurst(x, y, colorValue) {
  // 普通星星
  for (let i = 0; i < 18; i++) {
    const angle = random(TWO_PI);
    const speed = random(1.2, 3.8);

    stars.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(3, 7),
      life: random(150, 230),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.08, 0.08),
      color: colorValue
    });
  }

  // 较大的星星
  for (let i = 0; i < 5; i++) {
    const angle = random(TWO_PI);
    const speed = random(0.5, 2.2);

    stars.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(7, 11),
      life: random(180, 255),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.05, 0.05),
      color: colorValue
    });
  }
}

// ------------------------------
// 电脑鼠标点击
// ------------------------------

function mousePressed() {
  if (millis() - lastTouchAt < 450) {
    return false;
  }

  checkDay(mouseX, mouseY);
  return false;
}

// ------------------------------
// 手机触摸
// ------------------------------

function touchStarted() {
  lastTouchAt = millis();

  const hit = checkDay(mouseX, mouseY);

  return hit ? false : true;
}

// ------------------------------
// 打卡 / 取消打卡
// ------------------------------

function checkDay(x, y) {
  for (let i = 0; i < dayButtons.length; i++) {
    const button = dayButtons[i];

    if (
      dist(x, y, button.x, button.y) <= button.radius
    ) {
      if (checkedDays[button.id]) {
        // 再次点击，取消打卡
        delete checkedDays[button.id];
      } else {
        // 第一次点击，完成打卡
        checkedDays[button.id] = true;

        createStarBurst(
          button.x,
          button.y,
          button.color
        );
      }

      saveCheckData();
      return true;
    }
  }

  return false;
}

// ------------------------------
// 保存打卡记录
// ------------------------------

function saveCheckData() {
  try {
    localStorage.setItem(
      "dietChallenge_2026_OctNovDec",
      JSON.stringify(checkedDays)
    );
  } catch (error) {
    // 存储不可用时仍然可以正常操作
  }
}

// ------------------------------
// 读取打卡记录
// ------------------------------

function loadCheckData() {
  try {
    const saved = localStorage.getItem(
      "dietChallenge_2026_OctNovDec"
    );

    if (saved) {
      checkedDays = JSON.parse(saved) || {};
    } else {
      // 兼容旧版 10 月打卡数据
      const old = localStorage.getItem(
        "dietChallenge_2026_10"
      );

      if (old) {
        checkedDays = JSON.parse(old) || {};
      }
    }
  } catch (error) {
    checkedDays = {};
  }
}

// ------------------------------
// 画布尺寸
// ------------------------------

function getCanvasWidth() {
  return min(windowWidth, 650);
}

function getMonthHeight() {
  const rowGap = width < 500 ? 88 : 100;

  // 31 天最多分为 7 行
  return 105 + rowGap * 6 + 50;
}

function getCanvasHeight() {
  const w = min(windowWidth, 650);
  const rowGap = w < 500 ? 88 : 100;
  const monthHeight = 105 + rowGap * 6 + 50;
  const gap = w < 500 ? 22 : 28;

  return 130 + monthHeight * 3 + gap * 2 + 20;
}

// ------------------------------
// 窗口大小变化
// ------------------------------

function windowResized() {
  resizeCanvas(
    getCanvasWidth(),
    getCanvasHeight()
  );
}
