// ==========================================
// 🍓 DIET CHECK CALENDAR
// 2026년 10월 ~ 12월
// ==========================================


// ---------- 색상 ----------
const COLORS = {
  background: "#FFF8F5",  // 奶白
  pink: "#F4B6C7",        // 奶粉色
  yellow: "#F7E3A6",      // 奶黄色
  blue: "#B9DDE8",        // 奶蓝色

  white: "#FFFDFB",
  text: "#6D6064",
  border: "#E9DADC"
};


// ---------- 3个月 ----------
const months = [
  {
    year: 2026,
    month: 10,
    name: "October",
    color: COLORS.pink
  },

  {
    year: 2026,
    month: 11,
    name: "November",
    color: COLORS.yellow
  },

  {
    year: 2026,
    month: 12,
    name: "December",
    color: COLORS.blue
  }
];


// ---------- 星期 ----------
const weekNames = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT"
];


// ---------- 打卡记录 ----------
let checkedDays = {};


// ---------- 所有日期按钮 ----------
let dayButtons = [];


// ==========================================
// SETUP
// ==========================================

function setup() {

  createCanvas(
    getCanvasWidth(),
    getCanvasHeight()
  );

  loadCheckData();

  textAlign(CENTER, CENTER);

  noStroke();
}


// ==========================================
// DRAW
// ==========================================

function draw() {

  background(COLORS.background);

  dayButtons = [];

  let y = 35;

  for (let i = 0; i < months.length; i++) {

    y = drawMonth(
      months[i],
      y
    );
  }
}


// ==========================================
// 绘制月份
// ==========================================

function drawMonth(info, startY) {

  let contentWidth =
    min(width - 28, 680);

  let left =
    (width - contentWidth) / 2;

  let columnWidth =
    contentWidth / 7;


  // ----------------------------------------
  // 月份标题
  // ----------------------------------------

  fill(COLORS.text);

  textStyle(BOLD);

  textSize(
    min(27, width * 0.065)
  );

  text(
    info.year + "  ·  " + info.name,
    width / 2,
    startY + 22
  );

  textStyle(NORMAL);


  // ----------------------------------------
  // 星期
  // ----------------------------------------

  let weekY =
    startY + 58;

  textSize(
    min(11, width * 0.028)
  );

  for (let i = 0; i < 7; i++) {

    let x =
      left +
      columnWidth * i +
      columnWidth / 2;

    fill(COLORS.text);

    text(
      weekNames[i],
      x,
      weekY
    );
  }


  // ----------------------------------------
  // 日期参数
  // ----------------------------------------

  let firstDay =
    new Date(
      info.year,
      info.month - 1,
      1
    ).getDay();


  let daysInMonth =
    new Date(
      info.year,
      info.month,
      0
    ).getDate();


  // ----------------------------------------
  // 圆圈大小
  // ----------------------------------------

  let circleSize;

  if (width < 500) {

    circleSize =
      min(
        columnWidth * 0.68,
        42
      );

  } else {

    circleSize =
      min(
        columnWidth * 0.66,
        52
      );
  }


  // 日期之间的垂直距离
  let rowHeight =
    circleSize + 13;


  let calendarStartY =
    weekY + 34;


  // ----------------------------------------
  // 日期
  // ----------------------------------------

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    let index =
      firstDay + day - 1;

    let column =
      index % 7;

    let row =
      floor(index / 7);


    let x =
      left +
      columnWidth * column +
      columnWidth / 2;


    let y =
      calendarStartY +
      row * rowHeight;


    // 日期 ID
    let dateID =
      info.year +
      "-" +
      nf(info.month, 2) +
      "-" +
      nf(day, 2);


    let isChecked =
      checkedDays[dateID] === true;


    // --------------------------------------
    // 日期圆圈
    // --------------------------------------

    if (isChecked) {

      // 点击后：使用当前月份对应的奶色
      fill(info.color);

    } else {

      // 未打卡
      fill(COLORS.white);
    }


    noStroke();

    circle(
      x,
      y,
      circleSize
    );


    // --------------------------------------
    // 圆圈边框
    // --------------------------------------

    noFill();

    stroke(
      isChecked
        ? info.color
        : COLORS.border
    );

    strokeWeight(1.3);

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
        : COLORS.text
    );

    textSize(
      min(
        circleSize * 0.36,
        17
      )
    );

    text(
      day,
      x,
      y
    );


    // 保存点击区域
    dayButtons.push({

      x: x,
      y: y,

      radius:
        circleSize / 2,

      id: dateID
    });
  }


  // ----------------------------------------
  // 计算下一个月份的位置
  // ----------------------------------------

  let totalRows =
    ceil(
      (firstDay + daysInMonth) / 7
    );


  // ★ 月份之间的间距
  // 不会像之前那么大
  let monthHeight =
    58 +
    34 +
    totalRows * rowHeight +
    25;


  return startY + monthHeight;
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
// 检查点击的是哪一天
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


    // 点击进入圆圈
    if (
      distance <=
      button.radius
    ) {

      let id =
        button.id;


      // ------------------------------------
      // 已经打卡
      // → 再点击取消
      // ------------------------------------

      if (checkedDays[id]) {

        delete checkedDays[id];

      }

      // ------------------------------------
      // 没有打卡
      // → 点击打卡
      // ------------------------------------

      else {

        checkedDays[id] = true;
      }


      // 保存
      saveCheckData();


      // 更新画面
      redraw();


      break;
    }
  }
}


// ==========================================
// 保存打卡记录
// ==========================================

function saveCheckData() {

  localStorage.setItem(
    "dietCalendar_2026",
    JSON.stringify(
      checkedDays
    )
  );
}


// ==========================================
// 读取打卡记录
// ==========================================

function loadCheckData() {

  let saved =
    localStorage.getItem(
      "dietCalendar_2026"
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
    720
  );
}


// ==========================================
// Canvas 高度
// ==========================================

function getCanvasHeight() {

  let contentWidth =
    min(
      windowWidth - 28,
      680
    );


  let columnWidth =
    contentWidth / 7;


  let circleSize;

  if (windowWidth < 500) {

    circleSize =
      min(
        columnWidth * 0.68,
        42
      );

  } else {

    circleSize =
      min(
        columnWidth * 0.66,
        52
      );
  }


  let rowHeight =
    circleSize + 13;


  let totalHeight = 35;


  // 计算三个月份高度
  for (
    let i = 0;
    i < months.length;
    i++
  ) {

    let info =
      months[i];


    let firstDay =
      new Date(
        info.year,
        info.month - 1,
        1
      ).getDay();


    let daysInMonth =
      new Date(
        info.year,
        info.month,
        0
      ).getDate();


    let totalRows =
      ceil(
        (firstDay + daysInMonth) / 7
      );


    let monthHeight =
      58 +
      34 +
      totalRows * rowHeight +
      25;


    totalHeight +=
      monthHeight;
  }


  // 页面底部留一点空间
  totalHeight += 20;


  return totalHeight;
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