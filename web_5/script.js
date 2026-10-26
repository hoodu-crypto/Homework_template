/* GACHA MEMO — 홈페이지 + 캡슐 뽑기 */
"use strict";
const STORAGE_KEY = "gachaMemoCapsules";
const capsuleColors = ["#F3A8C9", "#C9B8EC", "#F8E5A7", "#B9E2D0", "#E88FB7", "#D8C8F1", "#F5D6E5"];
const capsuleSymbols = ["♥", "✦", "♡", "✧", "•", ""];
const capsuleField = document.getElementById("capsule-field");
const machine = document.getElementById("machine");
const knobButton = document.getElementById("knob-button");
const toast = document.getElementById("toast");
let toastTimer, isTurning = false, searchMode = "date", selectedMemory = null, dropTimer = null;

function createCapsules() {
  if (!capsuleField) return;
  capsuleField.innerHTML = "";
  const positions = [[7,8],[32,2],[60,9],[79,22],[18,26],[45,21],[65,34],[3,43],[30,44],[51,51],[77,48],[14,64],[39,70],[62,69],[82,76],[25,84],[49,88],[70,88]];
  positions.forEach((position, index) => {
    const capsule = document.createElement("div");
    capsule.className = "capsule";
    capsule.style.setProperty("--size", `${43 + Math.floor(Math.random() * 17)}px`);
    capsule.style.setProperty("--capsule-color", capsuleColors[index % capsuleColors.length]);
    capsule.style.setProperty("--x", `${position[0]}%`);
    capsule.style.setProperty("--y", `${position[1]}%`);
    capsule.style.setProperty("--rotation", `${Math.floor(Math.random() * 36) - 18}deg`);
    const symbol = document.createElement("span");
    symbol.className = "capsule-symbol";
    symbol.textContent = capsuleSymbols[index % capsuleSymbols.length];
    capsule.appendChild(symbol);
    capsuleField.appendChild(capsule);
  });
}
function showToast(message) {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}
function turnMachine(showHint = true) {
  if (isTurning) return;
  isTurning = true;
  knobButton.classList.remove("is-turning");
  machine.classList.remove("is-active");
  void knobButton.offsetWidth;
  knobButton.classList.add("is-turning");
  machine.classList.add("is-active");
  setTimeout(() => {
    knobButton.classList.remove("is-turning");
    machine.classList.remove("is-active");
    isTurning = false;
  }, 750);
}
knobButton?.addEventListener("click", () => turnMachine());
const pageRoutes = {create:"pages/create.html", collection:"pages/collection.html", organize:"pages/organize.html"};
document.querySelectorAll("[data-route]").forEach(button => button.addEventListener("click", () => {
  const route = button.dataset.route;
  if (route === "draw") { openDraw(); return; }
  if (pageRoutes[route]) window.location.href = pageRoutes[route];
}));

const drawOverlay = document.getElementById("draw-overlay");
const memoryOverlay = document.getElementById("memory-overlay");
const drawDate = document.getElementById("draw-date");
const drawKeyword = document.getElementById("draw-keyword");
const drawResults = document.getElementById("draw-results");
const drawStatus = document.getElementById("draw-status");
const dropped = document.getElementById("draw-dropped");
const droppedCapsule = document.getElementById("draw-dropped-capsule");
const moodImageNames = {"행복해요":"mood-happy.png","뿌듯해요":"mood-proud.png","조금 슬퍼요":"mood-sad.png","피곤해요":"mood-tired.png"};

function readCapsules() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data.map((x, index) => x && typeof x === "object" ? {...x, __storageIndex:index, favorite:x.favorite === true} : null).filter(Boolean) : [];
  } catch (error) {
    drawStatus.textContent = "저장된 기록을 읽지 못했어요.";
    return [];
  }
}
function openDraw() {
  hideDropped();
  drawResults.replaceChildren();
  drawStatus.textContent = "";
  drawOverlay.hidden = false;
  document.body.classList.add("draw-modal-open");
  drawOverlay.querySelector(".draw-dialog").focus();
}
function closeDraw() {
  drawOverlay.hidden = true;
  if (memoryOverlay.hidden) document.body.classList.remove("draw-modal-open");
}
function closeMemory() {
  memoryOverlay.hidden = true;
  document.body.classList.remove("draw-modal-open");
  hideDropped();
}
function hideDropped() {
  clearTimeout(dropTimer);
  dropped.hidden = true;
  dropped.classList.remove("is-dropping");
}
document.querySelectorAll("[data-close-draw]").forEach(el => el.addEventListener("click", closeDraw));
document.querySelectorAll("[data-close-memory]").forEach(el => el.addEventListener("click", closeMemory));
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!memoryOverlay.hidden) closeMemory();
  else if (!drawOverlay.hidden) closeDraw();
});

document.querySelectorAll("[data-search-mode]").forEach(button => button.addEventListener("click", () => {
  searchMode = button.dataset.searchMode;
  document.querySelectorAll("[data-search-mode]").forEach(item => {
    const active = item === button;
    item.classList.toggle("is-selected", active);
    item.setAttribute("aria-pressed", String(active));
  });
  drawDate.hidden = searchMode !== "date";
  drawKeyword.hidden = searchMode !== "keyword";
  document.getElementById("draw-search-label").textContent = searchMode === "date" ? "날짜 선택" : "키워드 입력";
  document.getElementById("draw-search-label").htmlFor = searchMode === "date" ? "draw-date" : "draw-keyword";
  drawResults.replaceChildren();
  drawStatus.textContent = "";
}));

function makeCapsuleButton(memory) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "draw-result-item";
  const ball = document.createElement("span");
  ball.className = "draw-result-ball";
  ball.style.setProperty("--draw-color", memory.color || "#F3A8C9");
  ball.textContent = memory.sticker || "♡";
  const title = document.createElement("strong");
  title.textContent = memory.title || "나의 작은 기억";
  const date = document.createElement("small");
  date.textContent = memory.date || "";
  button.append(ball, title, date);
  button.addEventListener("click", () => dispenseMemory(memory));
  return button;
}
document.getElementById("draw-search-form").addEventListener("submit", event => {
  event.preventDefault();
  drawResults.replaceChildren();
  drawStatus.textContent = "";
  const records = readCapsules();
  let found;
  if (searchMode === "date") {
    if (!drawDate.value) { drawStatus.textContent = "날짜를 선택해 주세요."; return; }
    found = records.filter(x => x.date === drawDate.value);
  } else {
    const keyword = drawKeyword.value.trim().toLocaleLowerCase();
    if (!keyword) { drawStatus.textContent = "키워드를 입력해 주세요."; return; }
    found = records.filter(x => [x.title, x.content, x.mood].some(v => String(v || "").toLocaleLowerCase().includes(keyword)));
  }
  if (!found.length) {
    drawStatus.textContent = "해당하는 기억이 없어요. 다른 날짜나 키워드로 찾아보세요.";
    return;
  }
  drawStatus.textContent = `${found.length}개의 캡슐을 찾았어요. 꺼내 보고 싶은 캡슐을 선택해 주세요.`;
  found.slice().reverse().forEach(memory => drawResults.appendChild(makeCapsuleButton(memory)));
});

function dispenseMemory(memory) {
  selectedMemory = memory;
  closeDraw();
  hideDropped();
  const opening = document.getElementById("dispenser-opening");
  opening.scrollIntoView({behavior:"smooth", block:"center"});
  turnMachine(false);
  // 스크롤이 끝난 뒤 배출구 위치를 계산해 캡슐을 떨어뜨립니다.
  dropTimer = setTimeout(() => {
    const rect = opening.getBoundingClientRect();
    dropped.style.left = `${Math.max(75, Math.min(window.innerWidth - 75, rect.left + rect.width / 2))}px`;
    dropped.style.top = `${Math.min(window.innerHeight - 130, rect.bottom + 5)}px`;
    droppedCapsule.style.setProperty("--draw-color", memory.color || "#F3A8C9");
    document.getElementById("draw-dropped-sticker").textContent = memory.sticker || "♡";
    dropped.hidden = false;
    dropped.classList.remove("is-dropping");
    void dropped.offsetWidth;
    dropped.classList.add("is-dropping");
    droppedCapsule.focus({preventScroll:true});
  }, 850);
}
function showMemory() {
  if (!selectedMemory) return;
  hideDropped();
  const memory = selectedMemory;
  document.getElementById("memory-date").textContent = memory.date || "";
  document.getElementById("memory-title").textContent = memory.title || "나의 작은 기억";
  document.getElementById("memory-content").textContent = memory.content || "";
  const mood = document.getElementById("memory-mood");
  mood.replaceChildren();
  const imgName = moodImageNames[memory.mood];
  if (imgName) {
    const img = document.createElement("img");
    img.src = `pages/${imgName}`;
    img.alt = "";
    img.onerror = () => { img.remove(); };
    mood.appendChild(img);
  } else if (memory.moodEmoji) {
    const emoji = document.createElement("span");
    emoji.textContent = memory.moodEmoji;
    mood.appendChild(emoji);
  }
  const name = document.createElement("span");
  name.textContent = memory.mood || "오늘의 기분";
  mood.appendChild(name);
  updateFavoriteButton();
  const message = document.getElementById("memory-favorite-message");
  message.textContent = "";
  message.classList.remove("is-visible");
  memoryOverlay.hidden = false;
  document.body.classList.add("draw-modal-open");
  memoryOverlay.querySelector(".draw-dialog").focus();
}
droppedCapsule.addEventListener("click", showMemory);
document.getElementById("memory-again").addEventListener("click", () => { closeMemory(); openDraw(); });
createCapsules();

/* 컬렉션에 추가 / 제외 */
const favoriteButton = document.getElementById("memory-favorite-button");
const favoriteMessage = document.getElementById("memory-favorite-message");
let favoriteMessageTimer = null;
function updateFavoriteButton() {
  if (!selectedMemory || !favoriteButton) return;
  const saved = selectedMemory.favorite === true;
  favoriteButton.classList.toggle("is-favorite", saved);
  favoriteButton.setAttribute("aria-pressed", String(saved));
  favoriteButton.setAttribute("aria-label", saved ? "컬렉션에서 제외" : "컬렉션에 추가");
  favoriteButton.title = saved ? "컬렉션에서 제외" : "컬렉션에 추가";
}
function toggleFavorite() {
  if (!selectedMemory) return;
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const index = selectedMemory.__storageIndex;
    if (!Array.isArray(records) || !Number.isInteger(index) || !records[index]) {
      showToast("기록을 찾을 수 없어요.");
      return;
    }
    const original = records[index];
    if (original.date !== selectedMemory.date || original.title !== selectedMemory.title || original.content !== selectedMemory.content) {
      showToast("기록이 변경되었어요. 다시 찾아주세요.");
      return;
    }
    const next = original.favorite !== true;
    records[index] = {...original, favorite:next};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    selectedMemory.favorite = next;
    updateFavoriteButton();
    favoriteMessage.textContent = next ? "컬렉션에 추가되었어요!" : "컬렉션에서 제외했어요.";
    favoriteMessage.classList.add("is-visible");
    clearTimeout(favoriteMessageTimer);
    favoriteMessageTimer = setTimeout(() => {
      favoriteMessage.textContent = "";
      favoriteMessage.classList.remove("is-visible");
    }, 2000);
  } catch (error) {
    console.error("즐겨찾기 저장 오류:", error);
    showToast("즐겨찾기를 저장하지 못했어요.");
  }
}
favoriteButton?.addEventListener("click", toggleFavorite);
