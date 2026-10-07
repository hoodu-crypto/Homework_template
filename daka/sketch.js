// ==========================================
// DIET CHECK CALENDAR
// 2026 October - December
// ==========================================


// ---------- COLORS ----------

const COLORS = {
  background: "#FFF8F5",

  pink: "#F4B6C7",
  yellow: "#F7E3A6",
  blue: "#B9DDE8",

  white: "#FFFDFB",
  text: "#6D6064",
  border: "#E9DADC"
};


// ---------- MONTHS ----------

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


// ---------- WEEK ----------

const weekNames = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT"
];


// ---------- CHECK DATA ----------

let checkedDays = {};


// ---------- BUTTON DATA ----------

let dayButtons = [];


// ==========================================
// SETUP
// ==========================================

function setup() {

  let canvas = createCanvas(
    getCanvasWidth(),
    getCanvasHeight()
  );

  canvas.style("display", "block");
  canvas.style("margin", "0 auto");
  canvas.style("touch-action", "pan-y");

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
// DRAW MONTH
// ==========================================

function drawMonth(info, startY) {

  let contentWidth = min(
    width - 28,
    680
  );

  let left =
    (width - contentWidth) / 2;

  let columnWidth =
    contentWidth / 7;


  // ---------- MONTH TITLE ----------

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


  // ---------- WEEK ----------

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


  // ---------- DATE INFORMATION ----------

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


  // ---------- CIRCLE SIZE ----------

  let circleSize;

  if (width < 500) {

    circleSize = min(
      columnWidth * 0.68,
      42
    );

  } else {

    circleSize = min(
      columnWidth * 0.66,
      52
    );
  }


  let rowHeight =
    circleSize + 13;


  let calendarStartY =
    weekY + 34;


  // ---------- DRAW DAYS ----------

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


    // Date ID

    let dateID =
      info.year +
      "-" +
      nf(info.month, 2) +
      "-" +
      nf(day, 2);


    let isChecked =
      checkedDays[dateID] === true;


    // ---------- CIRCLE ----------

    if (isChecked) {

      fill(info.color);

    } else {

      fill(COLORS.white);
    }

    noStroke();

    circle(
      x,
      y,
      circleSize
    );


    // ---------- BORDER ----------

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


    // ---------- NUMBER ----------

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


    // ---------- SAVE BUTTON AREA ----------

    dayButtons.push({
      x: x,
      y: y,
      radius: circleSize / 2,
      id: dateID
    });
  }


  // ---------- NEXT MONTH POSITION ----------

  let totalRows =
    ceil(
      (firstDay + daysInMonth) / 7
    );

  let monthHeight =
    58 +
    34 +
    totalRows * rowHeight +
    25;


  return startY + monthHeight;
}


// ==========================================
// MOUSE CLICK
// ==========================================

function mousePressed() {

  checkDay(
    mouseX,
    mouseY
  );

  return true;
}


// ==========================================
// CHECK DAY
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


    if (
      distance <=
      button.radius
    ) {

      let id =
        button.id;


      // ---------- CHECK ----------

      if (checkedDays[id]) {

        delete checkedDays[id];

      } else {

        checkedDays[id] = true;
      }


      saveCheckData();

      redraw();

      break;
    }
  }
}


// ==========================================
// SAVE
// ==========================================

function saveCheckData() {

  localStorage.setItem(
    "dietCalendar_2026",
    JSON.stringify(checkedDays)
  );
}


// ==========================================
// LOAD
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
// CANVAS WIDTH
// ==========================================

function getCanvasWidth() {

  return min(
    windowWidth,
    720
  );
}


// ==========================================
// CANVAS HEIGHT
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

    circleSize = min(
      columnWidth * 0.68,
      42
    );

  } else {

    circleSize = min(
      columnWidth * 0.66,
      52
    );
  }


  let rowHeight =
    circleSize + 13;


  let totalHeight = 35;


  // ---------- THREE MONTHS ----------

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


  totalHeight += 20;


  return totalHeight;
}


// ==========================================
// WINDOW RESIZE
// ==========================================

function windowResized() {

  resizeCanvas(
    getCanvasWidth(),
    getCanvasHeight()
  );

  redraw();
}