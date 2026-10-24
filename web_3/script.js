
/* ========================================
   GACHA MEMO
   홈페이지 + 캡슐 뽑기
======================================== */

"use strict";

const STORAGE_KEY = "gachaMemoCapsules";

const capsuleColors = [
  "#F3A8C9",
  "#C9B8EC",
  "#F8E5A7",
  "#B9E2D0",
  "#E88FB7",
  "#D8C8F1",
  "#F5D6E5"
];

const capsuleSymbols = ["♥", "✦", "♡", "✧", "•", ""];

const capsuleField = document.getElementById("capsule-field");
const machine = document.getElementById("machine");
const knobButton = document.getElementById("knob-button");
const toast = document.getElementById("toast");

let toastTimer;
let isTurning = false;
let searchMode = "date";
let selectedMemory = null;
let dropTimer = null;


// 1. 홈페이지 캡슐 생성
function createCapsules() {
  if (!capsuleField) return;

  capsuleField.innerHTML = "";

  const positions = [
    [7, 8], [32, 2], [60, 9], [79, 22],
    [18, 26], [45, 21], [65, 34], [3, 43],
    [30, 44], [51, 51], [77, 48], [14, 64],
    [39, 70], [62, 69], [82, 76], [25, 84],
    [49, 88], [70, 88]
  ];

  positions.forEach((position, index) => {
    const capsule = document.createElement("div");
    capsule.className = "capsule";

    capsule.style.setProperty(
      "--size",
      `${43 + Math.floor(Math.random() * 17)}px`
    );

    capsule.style.setProperty(
      "--capsule-color",
      capsuleColors[index % capsuleColors.length]
    );

    capsule.style.setProperty("--x", `${position[0]}%`);
    capsule.style.setProperty("--y", `${position[1]}%`);

    capsule.style.setProperty(
      "--rotation",
      `${Math.floor(Math.random() * 36) - 18}deg`
    );

    const symbol = document.createElement("span");
    symbol.className = "capsule-symbol";
    symbol.textContent =
      capsuleSymbols[index % capsuleSymbols.length];

    capsule.appendChild(symbol);
    capsuleField.appendChild(capsule);
  });
}


// 2. 안내 메시지
function showToast(message) {
  if (!toast) return;

  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.hidden = false;

  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}


// 3. 손잡이 회전
function turnMachine(showHint = true) {
  if (isTurning || !knobButton || !machine) return;

  isTurning = true;

  knobButton.classList.remove("is-turning");
  machine.classList.remove("is-active");

  void knobButton.offsetWidth;

  knobButton.classList.add("is-turning");
  machine.classList.add("is-active");

  if (showHint) {
    showToast("새로운 추억이 기다리고 있어요.");
  }

  setTimeout(() => {
    knobButton.classList.remove("is-turning");
    machine.classList.remove("is-active");
    isTurning = false;
  }, 750);
}

if (knobButton) {
  knobButton.addEventListener("click", () => turnMachine());
}


// 4. 메뉴 버튼
const pageRoutes = {
  create: "pages/create.html",
  collection: "pages/collection.html",
  organize: "pages/organize.html"
};

document.querySelectorAll("[data-route]").forEach((button) => {
  button.addEventListener("click", () => {
    const route = button.dataset.route;

    if (route === "draw") {
      openDraw();
      return;
    }

    if (pageRoutes[route]) {
      window.location.href = pageRoutes[route];
    }
  });
});


// 5. 캡슐 뽑기 요소
const drawOverlay = document.getElementById("draw-overlay");
const memoryOverlay = document.getElementById("memory-overlay");

const drawDate = document.getElementById("draw-date");
const drawKeyword = document.getElementById("draw-keyword");
const drawResults = document.getElementById("draw-results");
const drawStatus = document.getElementById("draw-status");

const dropped = document.getElementById("draw-dropped");
const droppedCapsule =
  document.getElementById("draw-dropped-capsule");

const moodImageNames = {
  "행복해요": "mood-happy.png",
  "뿌듯해요": "mood-proud.png",
  "조금 슬퍼요": "mood-sad.png",
  "피곤해요": "mood-tired.png"
};


// 6. 저장된 메모 불러오기
function readCapsules() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(data)
      ? data.filter(
          (item) => item && typeof item === "object"
        )
      : [];

  } catch (error) {
    drawStatus.textContent =
      "저장된 기록을 읽지 못했어요.";

    return [];
  }
}


// 7. 검색 팝업 열기
function openDraw() {
  hideDropped();

  drawResults.replaceChildren();
  drawStatus.textContent = "";

  drawOverlay.hidden = false;
  document.body.classList.add("draw-modal-open");

  drawOverlay.querySelector(".draw-dialog").focus();
}


// 8. 검색 팝업 닫기
function closeDraw() {
  drawOverlay.hidden = true;

  if (memoryOverlay.hidden) {
    document.body.classList.remove("draw-modal-open");
  }
}


// 9. 기억 카드 닫기
function closeMemory() {
  memoryOverlay.hidden = true;
  document.body.classList.remove("draw-modal-open");
  hideDropped();
}


// 10. 배출된 캡슐 숨기기
function hideDropped() {
  clearTimeout(dropTimer);

  dropped.hidden = true;
  dropped.classList.remove("is-dropping");
}


// 11. 팝업 닫기 버튼
document.querySelectorAll("[data-close-draw]").forEach((el) => {
  el.addEventListener("click", closeDraw);
});

document.querySelectorAll("[data-close-memory]").forEach((el) => {
  el.addEventListener("click", closeMemory);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (!memoryOverlay.hidden) {
    closeMemory();
  } else if (!drawOverlay.hidden) {
    closeDraw();
  }
});


// 12. 날짜 / 키워드 검색 전환
document.querySelectorAll("[data-search-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    searchMode = button.dataset.searchMode;

    document.querySelectorAll("[data-search-mode]").forEach((item) => {
      const active = item === button;

      item.classList.toggle("is-selected", active);
      item.setAttribute("aria-pressed", String(active));
    });

    drawDate.hidden = searchMode !== "date";
    drawKeyword.hidden = searchMode !== "keyword";

    const label = document.getElementById("draw-search-label");

    label.textContent =
      searchMode === "date" ? "날짜 선택" : "키워드 입력";

    label.htmlFor =
      searchMode === "date" ? "draw-date" : "draw-keyword";

    drawResults.replaceChildren();
    drawStatus.textContent = "";
  });
});


// 13. 검색 결과 캡슐 생성
function makeCapsuleButton(memory) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "draw-result-item";

  const ball = document.createElement("span");
  ball.className = "draw-result-ball";

  ball.style.setProperty(
    "--draw-color",
    memory.color || "#F3A8C9"
  );

  ball.textContent = memory.sticker || "♡";

  const title = document.createElement("strong");
  title.textContent = memory.title || "나의 작은 기억";

  const date = document.createElement("small");
  date.textContent = memory.date || "";

  button.append(ball, title, date);

  button.addEventListener("click", () => {
    dispenseMemory(memory);
  });

  return button;
}


// 14. 날짜 / 키워드 검색
document.getElementById("draw-search-form")
  .addEventListener("submit", (event) => {

    event.preventDefault();

    drawResults.replaceChildren();
    drawStatus.textContent = "";

    const records = readCapsules();
    let found;

    if (searchMode === "date") {

      if (!drawDate.value) {
        drawStatus.textContent = "날짜를 선택해 주세요.";
        return;
      }

      found = records.filter(
        (item) => item.date === drawDate.value
      );

    } else {

      const keyword = drawKeyword.value
        .trim()
        .toLocaleLowerCase();

      if (!keyword) {
        drawStatus.textContent = "키워드를 입력해 주세요.";
        return;
      }

      found = records.filter((item) =>
        [item.title, item.content, item.mood].some((value) =>
          String(value || "")
            .toLocaleLowerCase()
            .includes(keyword)
        )
      );
    }

    if (!found.length) {
      drawStatus.textContent =
        "해당하는 기억이 없어요. 다른 날짜나 키워드로 찾아보세요.";
      return;
    }

    drawStatus.textContent =
      `${found.length}개의 캡슐을 찾았어요. 꺼내 보고 싶은 캡슐을 선택해 주세요.`;

    found.slice().reverse().forEach((memory) => {
      drawResults.appendChild(makeCapsuleButton(memory));
    });
  });


// 15. 선택한 캡슐 배출
function dispenseMemory(memory) {
  selectedMemory = memory;

  closeDraw();
  hideDropped();

  const opening = document.getElementById("dispenser-opening");

  opening.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  turnMachine(false);

  dropTimer = setTimeout(() => {
    const rect = opening.getBoundingClientRect();

    dropped.style.left =
      `${Math.max(
        75,
        Math.min(
          window.innerWidth - 75,
          rect.left + rect.width / 2
        )
      )}px`;

    dropped.style.top =
      `${Math.min(
        window.innerHeight - 130,
        rect.bottom + 5
      )}px`;

    droppedCapsule.style.setProperty(
      "--draw-color",
      memory.color || "#F3A8C9"
    );

    document.getElementById("draw-dropped-sticker")
      .textContent = memory.sticker || "♡";

    dropped.hidden = false;
    dropped.classList.remove("is-dropping");

    void dropped.offsetWidth;

    dropped.classList.add("is-dropping");
    droppedCapsule.focus({ preventScroll: true });

  }, 850);
}


// 16. 캡슐을 열고 기억 카드 표시
function showMemory() {
  if (!selectedMemory) return;

  hideDropped();

  const memory = selectedMemory;

  document.getElementById("memory-date")
    .textContent = memory.date || "";

  document.getElementById("memory-title")
    .textContent = memory.title || "나의 작은 기억";

  document.getElementById("memory-content")
    .textContent = memory.content || "";

  const sticker = document.getElementById("memory-sticker");

  sticker.textContent = memory.sticker || "♡";
  sticker.style.background = memory.color || "#F3A8C9";

  const mood = document.getElementById("memory-mood");
  mood.replaceChildren();

  const imgName = moodImageNames[memory.mood];

  if (imgName) {
    const img = document.createElement("img");

    img.src = `pages/${imgName}`;
    img.alt = "";

    img.onerror = () => {
      img.remove();
    };

    mood.appendChild(img);

  } else if (memory.moodEmoji) {
    const emoji = document.createElement("span");
    emoji.textContent = memory.moodEmoji;
    mood.appendChild(emoji);
  }

  const name = document.createElement("span");
  name.textContent = memory.mood || "오늘의 기분";
  mood.appendChild(name);

  memoryOverlay.hidden = false;
  document.body.classList.add("draw-modal-open");

  memoryOverlay.querySelector(".draw-dialog").focus();
}


// 17. 배출된 캡슐 클릭
droppedCapsule.addEventListener("click", showMemory);


// 18. 다시 뽑기
document.getElementById("memory-again")
  .addEventListener("click", () => {
    closeMemory();
    openDraw();
  });


// 19. 홈페이지 시작
createCapsules();
