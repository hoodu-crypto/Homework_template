
 // ========================================
// GACHA MEMO
// 홈페이지 인터랙션 및 캡슐 생성
// ========================================

// 1. 캡슐 색상
const capsuleColors = [
  "#F3A8C9",
  "#C9B8EC",
  "#F8E5A7",
  "#B9E2D0",
  "#E88FB7",
  "#D8C8F1",
  "#F5D6E5"
];

// 2. 캡슐 장식
const capsuleSymbols = ["♥", "✦", "♡", "✧", "•", ""];

const capsuleField = document.getElementById("capsule-field");
const machine = document.getElementById("machine");
const knobButton = document.getElementById("knob-button");
const toast = document.getElementById("toast");

// 3. 캡슐 생성
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

    const size = 43 + Math.floor(Math.random() * 17);
    const color = capsuleColors[index % capsuleColors.length];
    const symbol = capsuleSymbols[index % capsuleSymbols.length];
    const rotation = Math.floor(Math.random() * 36) - 18;

    capsule.style.setProperty("--size", `${size}px`);
    capsule.style.setProperty("--capsule-color", color);
    capsule.style.setProperty("--x", `${position[0]}%`);
    capsule.style.setProperty("--y", `${position[1]}%`);
    capsule.style.setProperty("--rotation", `${rotation}deg`);

    const symbolElement = document.createElement("span");
    symbolElement.className = "capsule-symbol";
    symbolElement.textContent = symbol;

    capsule.appendChild(symbolElement);
    capsuleField.appendChild(capsule);
  });
}

// 4. 한국어 안내 메시지
let toastTimer;

function showToast(message) {
  if (!toast) return;

  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.hidden = false;

  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

// 5. 머신 손잡이 회전
let isTurning = false;

function turnMachine() {
  if (isTurning) return;

  isTurning = true;

  if (knobButton) {
    knobButton.classList.remove("is-turning");
  }

  if (machine) {
    machine.classList.remove("is-active");
  }

  // CSS 애니메이션을 다시 실행합니다.
  if (knobButton) {
    void knobButton.offsetWidth;
    knobButton.classList.add("is-turning");
  }

  if (machine) {
    machine.classList.add("is-active");
  }

  showToast("새로운 추억이 기다리고 있어요.");

  setTimeout(() => {
    if (knobButton) {
      knobButton.classList.remove("is-turning");
    }

    if (machine) {
      machine.classList.remove("is-active");
    }

    isTurning = false;
  }, 750);
}

if (knobButton) {
  knobButton.addEventListener("click", turnMachine);
}

// 6. 페이지 경로
const pageRoutes = {
  create: "pages/create.html",
  draw: "pages/draw.html",
  collection: "pages/collection.html",
  organize: "pages/organize.html"
};

// 7. 페이지 이동
function openPage(routeName) {
  const target = pageRoutes[routeName];

  if (!target) {
    showToast("해당 페이지는 준비 중이에요.");
    return;
  }

  // 페이지 존재 여부를 먼저 검사하지 않고 바로 이동합니다.
  window.location.href = target;
}

// 8. 네 개의 메뉴 버튼 연결
document.querySelectorAll("[data-route]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const routeName = button.dataset.route;
    openPage(routeName);
  });
});

// 9. 홈페이지 초기화
createCapsules();
