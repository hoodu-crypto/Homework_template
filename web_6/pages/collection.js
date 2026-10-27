
/* ==========================================
   GACHA MEMO - MY COLLECTION
   한국어 / 中文
========================================== */

"use strict";

const STORAGE_KEY = "gachaMemoCapsules";
const LANGUAGE_KEY = "gachaMemoLanguage";

// ==========================================
// 1. 中韩语言
// ==========================================

const collectionTranslations = {
  ko: {
    pageTitle: "나의 컬렉션 | GACHA MEMO",
    collectionHome: "홈으로",
    collectionPageTitle: "나의 컬렉션",
    collectionIntro1: "마음에 드는 기억들을 하나씩 모아 보세요.",
    collectionIntro2: "소중한 순간들이 나만의 작은 진열장을 채워요.",
    collectionSummary: "컬렉션 정보",
    favoriteCountLabel: "모아 둔 캡슐",
    totalCountLabel: "전체 기록",
    collectionShelfTitle: "나의 캡슐 진열장",
    sortLabel: "정렬 방식",
    sortNewest: "최근 저장순",
    sortOldest: "오래된 순",
    collectionEmptyTitle: "아직 모아 둔 기억이 없어요.",
    collectionEmpty1: "마음에 드는 기억에 하트를 눌러",
    collectionEmpty2: "나만의 컬렉션을 만들어 보세요!",
    collectionDrawButton: "캡슐 뽑으러 가기",
    collectionShelfCaption: "캡슐을 누르면 소중한 기억을 다시 볼 수 있어요.",
    collectionClose: "닫기",
    addFavorite: "컬렉션에 추가",
    removeFavorite: "컬렉션에서 제외",
    addedFavorite: "컬렉션에 추가되었어요!",
    removedFavorite: "컬렉션에서 제외했어요.",
    missingMemory: "기록을 찾을 수 없어요.",
    changedMemory: "기록이 변경되었어요. 다시 확인해 주세요.",
    favoriteError: "즐겨찾기를 변경하지 못했어요.",
    defaultTitle: "나의 작은 기억",
    viewMemory: title => `${title} 기억 보기`
  },

  zh: {
    pageTitle: "我的收藏 | GACHA MEMO",
    collectionHome: "返回首页",
    collectionPageTitle: "我的收藏",
    collectionIntro1: "把喜欢的回忆一颗颗收藏起来吧。",
    collectionIntro2: "让珍贵的瞬间填满属于自己的小小展示柜。",
    collectionSummary: "收藏信息",
    favoriteCountLabel: "已收藏扭蛋",
    totalCountLabel: "全部记录",
    collectionShelfTitle: "我的扭蛋展示柜",
    sortLabel: "排序方式",
    sortNewest: "最近保存",
    sortOldest: "最早保存",
    collectionEmptyTitle: "还没有收藏的回忆。",
    collectionEmpty1: "点击喜欢的回忆旁边的爱心，",
    collectionEmpty2: "建立属于自己的小小收藏吧！",
    collectionDrawButton: "去抽取扭蛋",
    collectionShelfCaption: "点击扭蛋，就能再次查看珍贵的回忆。",
    collectionClose: "关闭",
    addFavorite: "加入收藏",
    removeFavorite: "取消收藏",
    addedFavorite: "已加入我的收藏！",
    removedFavorite: "已从收藏中移除。",
    missingMemory: "找不到这条记录。",
    changedMemory: "记录已发生变化，请重新查看。",
    favoriteError: "无法更改收藏状态。",
    defaultTitle: "我的小小回忆",
    viewMemory: title => `查看回忆：${title}`
  }
};

const collectionMoodNames = {
  "행복해요": "开心",
  "뿌듯해요": "满足",
  "조금 슬퍼요": "有点难过",
  "피곤해요": "疲惫"
};

function collectionLanguage() {
  if (window.GachaLanguage?.get) {
    return window.GachaLanguage.get() === "zh" ? "zh" : "ko";
  }

  try {
    return localStorage.getItem(LANGUAGE_KEY) === "zh" ? "zh" : "ko";
  } catch (error) {
    return "ko";
  }
}

function ct(key) {
  return collectionTranslations[collectionLanguage()][key];
}

function displayCollectionMood(mood) {
  return collectionLanguage() === "zh"
    ? collectionMoodNames[mood] || mood
    : mood;
}

function displayCollectionTitle(title) {
  return title || ct("defaultTitle");
}

// ==========================================
// 2. 原有页面元素
// ==========================================

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
let detailMessageKey = "";

// ==========================================
// 3. 更新页面语言
// ==========================================

function applyCollectionLanguage() {
  const lang = collectionLanguage();

  document.documentElement.lang =
    lang === "zh" ? "zh-CN" : "ko";

  document.title = ct("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;

    if (collectionTranslations[lang][key] !== undefined) {
      element.textContent = ct(key);
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach(element => {
    const key = element.dataset.i18nAria;

    if (collectionTranslations[lang][key] !== undefined) {
      element.setAttribute("aria-label", ct(key));
    }
  });

  renderCollection();

  if (selectedMemory && !memoryModal.hidden) {
    renderMemoryDetails();
    updateFavoriteButton();
  }

  if (detailMessageKey) {
    detailMessage.textContent = ct(detailMessageKey);
  }
}

// ==========================================
// 4. 저장된 기록 불러오기
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
// 5. 캡슐 색상
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
// 6. 날짜 정렬
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
// 7. 캡슐 만들기
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

  const titleText = displayCollectionTitle(memory.title);

  button.setAttribute(
    "aria-label",
    ct("viewMemory")(titleText)
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
// 8. 컬렉션 화면 표시
// ==========================================

function renderCollection() {
  const allMemories = loadMemories();

  const favorites = allMemories.filter(
    memory => memory.favorite === true
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

  sorted.forEach(memory => {
    capsuleGrid.appendChild(
      createCapsuleCard(memory)
    );
  });
}

// ==========================================
// 9. 기억 티켓 내용
// ==========================================

function renderMemoryDetails() {
  if (!selectedMemory) return;

  const memory = selectedMemory;

  document.getElementById("detail-date")
    .textContent = memory.date || "";

  document.getElementById("detail-title")
    .textContent = displayCollectionTitle(memory.title);

  document.getElementById("detail-content")
    .textContent = memory.content || "";

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
    moodName.textContent = displayCollectionMood(memory.mood);
    moodContainer.appendChild(moodName);
  }
}

// ==========================================
// 10. 기억 티켓 열기
// ==========================================

function openMemory(memory) {
  selectedMemory = memory;

  renderMemoryDetails();
  updateFavoriteButton();

  clearTimeout(messageTimer);
  detailMessage.textContent = "";
  detailMessageKey = "";

  memoryModal.hidden = false;
  document.body.classList.add("modal-open");

  memoryModal.querySelector(".modal-dialog").focus();
}

// ==========================================
// 11. 기억 티켓 닫기
// ==========================================

function closeMemory() {
  memoryModal.hidden = true;
  document.body.classList.remove("modal-open");

  clearTimeout(messageTimer);
  detailMessage.textContent = "";
  detailMessageKey = "";

  selectedMemory = null;

  renderCollection();
}

document.querySelectorAll("[data-close-modal]")
  .forEach(button => {
    button.addEventListener("click", closeMemory);
  });

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    !memoryModal.hidden
  ) {
    closeMemory();
  }
});

// ==========================================
// 12. 즐겨찾기 하트 표시
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

  const label = isFavorite
    ? ct("removeFavorite")
    : ct("addFavorite");

  favoriteButton.setAttribute("aria-label", label);
  favoriteButton.title = label;
}

// ==========================================
// 13. 즐겨찾기 추가 / 해제
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
      showDetailMessage("missingMemory");
      return;
    }

    const original = records[index];

    if (
      original.date !== selectedMemory.date ||
      original.title !== selectedMemory.title ||
      original.content !== selectedMemory.content
    ) {
      showDetailMessage("changedMemory");
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

    showDetailMessage(
      nextFavorite ? "addedFavorite" : "removedFavorite"
    );

    renderCollection();

  } catch (error) {
    console.error("즐겨찾기 변경 오류:", error);
    showDetailMessage("favoriteError");
  }
}

function showDetailMessage(key) {
  detailMessageKey = key;
  detailMessage.textContent = ct(key);

  clearTimeout(messageTimer);

  messageTimer = setTimeout(() => {
    detailMessage.textContent = "";
    detailMessageKey = "";
  }, 2000);
}

favoriteButton.addEventListener(
  "click",
  toggleFavorite
);

// ==========================================
// 14. 정렬 변경
// ==========================================

sortSelect.addEventListener("change", () => {
  renderCollection();
});

// ==========================================
// 15. 다른 탭에서 데이터 변경
// ==========================================

window.addEventListener("storage", event => {
  if (
    event.key === STORAGE_KEY ||
    event.key === null
  ) {
    renderCollection();
  }

  if (event.key === LANGUAGE_KEY) {
    applyCollectionLanguage();
  }
});

// ==========================================
// 16. 언어 변경
// ==========================================

window.addEventListener(
  "gacha-language-change",
  applyCollectionLanguage
);

// ==========================================
// 17. 페이지 다시 표시
// ==========================================

window.addEventListener("pageshow", () => {
  applyCollectionLanguage();
});

// ==========================================
// 18. 시작
// ==========================================

applyCollectionLanguage();
