
/* ==========================================
   GACHA MEMO - MY COLLECTION
========================================== */

"use strict";

const STORAGE_KEY = "gachaMemoCapsules";

const favoriteCount = document.getElementById("favorite-count");
const totalCount = document.getElementById("total-count");

const emptyState = document.getElementById("empty-state");
const collectionShelf = document.getElementById("collection-shelf");
const capsuleGrid = document.getElementById("capsule-grid");
const shelfCaption = document.getElementById("shelf-caption");

const sortSelect = document.getElementById("sort-select");

const memoryModal = document.getElementById("memory-modal");
const favoriteButton = document.getElementById("detail-favorite");
const detailMessage = document.getElementById("detail-message");

let selectedMemory = null;
let messageTimer = null;


// ==========================================
// 1. 저장된 기록 불러오기
// ==========================================

function loadMemories() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(data)) return [];

    return data
      .map((item, index) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        return {
          ...item,
          __storageIndex: index,
          favorite: item.favorite === true
        };
      })
      .filter(Boolean);

  } catch (error) {
    console.error("기록 불러오기 오류:", error);
    return [];
  }
}


// ==========================================
// 2. 캡슐 색상
// ==========================================

function getCapsuleColor(memory) {
  const color = memory.color;

  if (
    typeof color === "string" &&
    (
      /^#[0-9a-fA-F]{3}$/.test(color) ||
      /^#[0-9a-fA-F]{6}$/.test(color)
    )
  ) {
    return color;
  }

  return "#F3A8C9";
}


// ==========================================
// 3. 날짜 정렬
// ==========================================

function sortMemories(memories) {
  const mode = sortSelect.value;

  return memories.slice().sort((a, b) => {
    const dateA = String(a.date || "");
    const dateB = String(b.date || "");

    const result = dateA.localeCompare(dateB);

    if (result !== 0) {
      return mode === "old" ? result : -result;
    }

    return mode === "old"
      ? a.__storageIndex - b.__storageIndex
      : b.__storageIndex - a.__storageIndex;
  });
}


// ==========================================
// 4. 캡슐 만들기
// ==========================================

function createCapsuleCard(memory) {
  const slot = document.createElement("div");
  slot.className = "capsule-slot";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "capsule-button";

  button.style.setProperty(
    "--capsule-color",
    getCapsuleColor(memory)
  );

  const titleText = memory.title || "나의 작은 기억";

  button.setAttribute(
    "aria-label",
    `${titleText} 기억 보기`
  );

  const symbol = document.createElement("span");
  symbol.className = "capsule-symbol";
  symbol.textContent = memory.sticker || "♡";

  button.appendChild(symbol);

  const title = document.createElement("span");
  title.className = "capsule-title";
  title.textContent = titleText;
  title.title = titleText;

  const date = document.createElement("span");
  date.className = "capsule-date";
  date.textContent = memory.date || "";

  button.addEventListener("click", () => {
    openMemory(memory);
  });

  slot.append(button, title, date);

  return slot;
}


// ==========================================
// 5. 컬렉션 화면 표시
// ==========================================

function renderCollection() {
  const allMemories = loadMemories();

  const favorites = allMemories.filter(
    (memory) => memory.favorite === true
  );

  favoriteCount.textContent = favorites.length;
  totalCount.textContent = allMemories.length;

  capsuleGrid.replaceChildren();

  if (favorites.length === 0) {
    emptyState.hidden = false;
    collectionShelf.hidden = true;
    shelfCaption.hidden = true;
    return;
  }

  emptyState.hidden = true;
  collectionShelf.hidden = false;
  shelfCaption.hidden = false;

  const sorted = sortMemories(favorites);

  sorted.forEach((memory) => {
    capsuleGrid.appendChild(
      createCapsuleCard(memory)
    );
  });
}


// ==========================================
// 6. 기억 티켓 열기
// ==========================================

function openMemory(memory) {
  selectedMemory = memory;

  document.getElementById("detail-date")
    .textContent = memory.date || "";

  document.getElementById("detail-title")
    .textContent = memory.title || "나의 작은 기억";

  document.getElementById("detail-content")
    .textContent = memory.content || "";

  // 기분
  const moodContainer = document.getElementById(
    "detail-mood"
  );

  moodContainer.replaceChildren();

  const moodImageNames = {
    "행복해요": "mood-happy.png",
    "뿌듯해요": "mood-proud.png",
    "조금 슬퍼요": "mood-sad.png",
    "피곤해요": "mood-tired.png"
  };

  const imageName = moodImageNames[memory.mood];

  if (imageName) {
    const img = document.createElement("img");

    img.src = imageName;
    img.alt = "";

    img.onerror = () => img.remove();

    moodContainer.appendChild(img);

  } else if (memory.moodEmoji) {
    const emoji = document.createElement("span");
    emoji.textContent = memory.moodEmoji;
    moodContainer.appendChild(emoji);
  }

  if (memory.mood) {
    const moodName = document.createElement("span");
    moodName.textContent = memory.mood;
    moodContainer.appendChild(moodName);
  }

  // 즐겨찾기 상태
  updateFavoriteButton();

  clearTimeout(messageTimer);
  detailMessage.textContent = "";

  memoryModal.hidden = false;
  document.body.classList.add("modal-open");

  memoryModal.querySelector(".modal-dialog").focus();
}


// ==========================================
// 7. 기억 티켓 닫기
// ==========================================

function closeMemory() {
  memoryModal.hidden = true;
  document.body.classList.remove("modal-open");

  clearTimeout(messageTimer);
  detailMessage.textContent = "";

  selectedMemory = null;

  renderCollection();
}

document.querySelectorAll("[data-close-modal]")
  .forEach((button) => {
    button.addEventListener("click", closeMemory);
  });

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !memoryModal.hidden
  ) {
    closeMemory();
  }
});


// ==========================================
// 8. 즐겨찾기 하트 표시
// ==========================================

function updateFavoriteButton() {
  if (!selectedMemory) return;

  const isFavorite = selectedMemory.favorite === true;

  favoriteButton.classList.toggle(
    "is-favorite",
    isFavorite
  );

  favoriteButton.setAttribute(
    "aria-pressed",
    String(isFavorite)
  );

  favoriteButton.setAttribute(
    "aria-label",
    isFavorite
      ? "컬렉션에서 제외"
      : "컬렉션에 추가"
  );

  favoriteButton.title = isFavorite
    ? "컬렉션에서 제외"
    : "컬렉션에 추가";
}


// ==========================================
// 9. 즐겨찾기 추가 / 해제
// ==========================================

function toggleFavorite() {
  if (!selectedMemory) return;

  try {
    const records = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(records)) return;

    const index = selectedMemory.__storageIndex;

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= records.length ||
      !records[index]
    ) {
      detailMessage.textContent =
        "기록을 찾을 수 없어요.";
      return;
    }

    const original = records[index];

    // 다른 기록을 잘못 수정하지 않도록 확인
    if (
      original.date !== selectedMemory.date ||
      original.title !== selectedMemory.title ||
      original.content !== selectedMemory.content
    ) {
      detailMessage.textContent =
        "기록이 변경되었어요. 다시 확인해 주세요.";
      return;
    }

    const nextFavorite = original.favorite !== true;

    records[index] = {
      ...original,
      favorite: nextFavorite
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );

    selectedMemory.favorite = nextFavorite;

    updateFavoriteButton();

    detailMessage.textContent = nextFavorite
      ? "컬렉션에 추가되었어요!"
      : "컬렉션에서 제외했어요.";

    clearTimeout(messageTimer);

    messageTimer = setTimeout(() => {
      detailMessage.textContent = "";
    }, 2000);

    // 목록도 바로 갱신
    renderCollection();

  } catch (error) {
    console.error("즐겨찾기 변경 오류:", error);

    detailMessage.textContent =
      "즐겨찾기를 변경하지 못했어요.";
  }
}

favoriteButton.addEventListener(
  "click",
  toggleFavorite
);


// ==========================================
// 10. 정렬 변경
// ==========================================

sortSelect.addEventListener("change", () => {
  renderCollection();
});


// ==========================================
// 11. 다른 탭에서 데이터 변경 시 갱신
// ==========================================

window.addEventListener("storage", (event) => {
  if (
    event.key === STORAGE_KEY ||
    event.key === null
  ) {
    renderCollection();
  }
});


// ==========================================
// 12. 페이지가 다시 표시될 때 갱신
// ==========================================

window.addEventListener("pageshow", () => {
  renderCollection();
});


// ==========================================
// 13. 시작
// ==========================================

renderCollection();
