
/* ==========================================
   GACHA MEMO - MEMORY ORGANIZE
========================================== */

"use strict";

const STORAGE_KEY = "gachaMemoCapsules";

const $ = (selector) => document.querySelector(selector);

const memoryList = $("#memory-list");
const emptyState = $("#empty-state");
const searchInput = $("#search-input");
const sortSelect = $("#sort-select");

const totalCount = $("#total-count");
const favoriteCount = $("#favorite-count");
const resultCount = $("#result-count");

const selectModeButton = $("#select-mode-button");
const selectionToolbar = $("#selection-toolbar");
const selectAllCheckbox = $("#select-all");
const selectedCount = $("#selected-count");
const deleteSelectedButton = $("#delete-selected");

const editModal = $("#edit-modal");
const deleteModal = $("#delete-modal");
const editForm = $("#edit-form");

const toast = $("#toast");

let selectionMode = false;
let selectedIndices = new Set();

let editingTarget = null;
let pendingDelete = [];

let toastTimer = null;
let lastFocusedElement = null;


// ==========================================
// 1. 저장된 기록 읽기
// ==========================================

function readRecords() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("기록 불러오기 오류:", error);
    showToast("기록을 불러오지 못했어요.");
    return [];
  }
}


// ==========================================
// 2. 기록 저장
// ==========================================

function saveRecords(records) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );

    return true;

  } catch (error) {
    console.error("기록 저장 오류:", error);
    showToast("기록을 저장하지 못했어요.");
    return false;
  }
}


// ==========================================
// 3. 원본 기록 위치 확인
// ==========================================

function sameRecord(a, b) {
  if (!a || !b) return false;

  if (a.id != null && b.id != null) {
    return String(a.id) === String(b.id);
  }

  return (
    a.date === b.date &&
    a.title === b.title &&
    a.content === b.content
  );
}

function findOriginal(records, target) {
  if (!target) return -1;

  const index = target.index;

  if (
    Number.isInteger(index) &&
    index >= 0 &&
    index < records.length &&
    sameRecord(records[index], target.snapshot)
  ) {
    return index;
  }

  if (target.snapshot?.id != null) {
    return records.findIndex(
      (record) =>
        record &&
        record.id != null &&
        String(record.id) === String(target.snapshot.id)
    );
  }

  return -1;
}

function makeTarget(memory) {
  return {
    index: memory.__storageIndex,
    snapshot: { ...memory }
  };
}


// ==========================================
// 4. 전체 기록 가져오기
// ==========================================

function getAllMemories() {
  return readRecords()
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        ...item,
        favorite: item.favorite === true,
        __storageIndex: index
      };
    })
    .filter(Boolean);
}


// ==========================================
// 5. 검색 및 정렬
// ==========================================

function getVisibleMemories(allMemories) {
  const keyword = searchInput.value
    .trim()
    .toLocaleLowerCase();

  const result = allMemories.filter((memory) => {
    const text = [
      memory.date,
      memory.title,
      memory.content,
      memory.mood
    ]
      .filter((value) => value != null)
      .join(" ")
      .toLocaleLowerCase();

    return !keyword || text.includes(keyword);
  });

  result.sort((a, b) => {
    const dateA = String(a.date || "");
    const dateB = String(b.date || "");

    const comparison = dateA.localeCompare(dateB);

    if (comparison !== 0) {
      return sortSelect.value === "old"
        ? comparison
        : -comparison;
    }

    return sortSelect.value === "old"
      ? a.__storageIndex - b.__storageIndex
      : b.__storageIndex - a.__storageIndex;
  });

  return result;
}


// ==========================================
// 6. 캡슐 색상
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

  return "#f4b0cd";
}


// ==========================================
// 7. 기록 카드 생성
// ==========================================

function createMemoryCard(memory) {
  const index = memory.__storageIndex;

  const card = document.createElement("article");
  card.className = "memory-card";

  if (selectedIndices.has(index)) {
    card.classList.add("is-selected");
  }

  // 선택 체크박스
  if (selectionMode) {
    const checkboxWrap = document.createElement("label");
    checkboxWrap.className = "memory-checkbox-wrap";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "memory-checkbox";
    checkbox.checked = selectedIndices.has(index);

    checkbox.setAttribute(
      "aria-label",
      `${memory.title || "기억"} 선택`
    );

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedIndices.add(index);
      } else {
        selectedIndices.delete(index);
      }

      card.classList.toggle(
        "is-selected",
        checkbox.checked
      );

      updateSelectionToolbar();
    });

    checkboxWrap.appendChild(checkbox);
    card.appendChild(checkboxWrap);
  }

  // 캡슐
  const capsule = document.createElement("div");
  capsule.className = "memory-capsule";

  capsule.style.setProperty(
    "--capsule-color",
    getCapsuleColor(memory)
  );

  const symbol = document.createElement("span");
  symbol.textContent = memory.sticker || "♡";

  capsule.appendChild(symbol);

  // 기록 정보
  const info = document.createElement("div");
  info.className = "memory-info";

  const date = document.createElement("p");
  date.className = "memory-date";
  date.textContent = memory.date || "";

  const title = document.createElement("h3");
  title.className = "memory-title";
  title.textContent = memory.title || "나의 작은 기억";

  const preview = document.createElement("p");
  preview.className = "memory-preview";
  preview.textContent = memory.content || "";

  info.append(date, title, preview);

  // 버튼
  const actions = document.createElement("div");
  actions.className = "memory-actions";

  const favorite = document.createElement("button");
  favorite.type = "button";
  favorite.className = "icon-button favorite-button";

  favorite.classList.toggle(
    "is-favorite",
    memory.favorite === true
  );

  favorite.textContent = memory.favorite ? "♥" : "♡";

  favorite.setAttribute(
    "aria-label",
    memory.favorite
      ? "컬렉션에서 제외"
      : "컬렉션에 추가"
  );

  favorite.setAttribute(
    "aria-pressed",
    String(memory.favorite === true)
  );

  favorite.addEventListener("click", () => {
    toggleFavorite(makeTarget(memory));
  });

  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "icon-button edit-button";
  edit.textContent = "수정";

  edit.setAttribute(
    "aria-label",
    `${memory.title || "기억"} 수정`
  );

  edit.addEventListener("click", () => {
    openEdit(makeTarget(memory));
  });

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "icon-button delete-button";
  remove.textContent = "삭제";

  remove.setAttribute(
    "aria-label",
    `${memory.title || "기억"} 삭제`
  );

  remove.addEventListener("click", () => {
    openDelete([makeTarget(memory)]);
  });

  actions.append(favorite, edit, remove);
  card.append(capsule, info, actions);

  return card;
}


// ==========================================
// 8. 전체 화면 갱신
// ==========================================

function render() {
  const allMemories = getAllMemories();
  const visibleMemories = getVisibleMemories(allMemories);

  totalCount.textContent = allMemories.length;

  favoriteCount.textContent = allMemories.filter(
    (memory) => memory.favorite
  ).length;

  resultCount.textContent =
    `${visibleMemories.length}개의 기록`;

  memoryList.replaceChildren();

  visibleMemories.forEach((memory) => {
    memoryList.appendChild(
      createMemoryCard(memory)
    );
  });

  const hasRecords = allMemories.length > 0;

  emptyState.hidden = visibleMemories.length > 0;

  const emptyTitle = $("#empty-title");
  const emptyDescription = $("#empty-description");

  if (!hasRecords) {
    emptyTitle.textContent = "아직 기록이 없어요.";
    emptyDescription.textContent =
      "첫 번째 기억을 만들어 보세요!";
  } else {
    emptyTitle.textContent = "검색 결과가 없어요.";
    emptyDescription.textContent =
      "다른 검색어로 다시 찾아보세요.";
  }

  const createLink = emptyState.querySelector("a");
  createLink.hidden = hasRecords;

  updateSelectionToolbar(visibleMemories);
}


// ==========================================
// 9. 즐겨찾기 변경
// ==========================================

function toggleFavorite(target) {
  const records = readRecords();
  const index = findOriginal(records, target);

  if (index === -1) {
    showToast("기록을 찾을 수 없어요.");
    render();
    return;
  }

  const isFavorite = records[index].favorite === true;

  records[index] = {
    ...records[index],
    favorite: !isFavorite
  };

  if (!saveRecords(records)) return;

  showToast(
    isFavorite
      ? "컬렉션에서 제외했어요."
      : "컬렉션에 추가되었어요!"
  );

  render();
}


// ==========================================
// 10. 수정 팝업
// ==========================================

function openEdit(target) {
  const records = readRecords();
  const index = findOriginal(records, target);

  if (index === -1) {
    showToast("기록을 찾을 수 없어요.");
    return;
  }

  editingTarget = {
    index,
    snapshot: { ...records[index] }
  };

  $("#edit-date").value = records[index].date || "";
  $("#edit-title").value = records[index].title || "";
  $("#edit-content").value = records[index].content || "";

  openModal(editModal);

  $("#edit-title").focus();
}

function closeEdit() {
  editingTarget = null;
  closeModal(editModal);
}

editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!editingTarget) return;

  const date = $("#edit-date").value;
  const title = $("#edit-title").value.trim();
  const content = $("#edit-content").value.trim();

  if (!date || !title || !content) {
    showToast("날짜, 제목, 내용을 입력해 주세요.");
    return;
  }

  const records = readRecords();
  const index = findOriginal(records, editingTarget);

  if (index === -1) {
    showToast("기록이 변경되었어요. 다시 확인해 주세요.");
    closeEdit();
    render();
    return;
  }

  records[index] = {
    ...records[index],
    date,
    title,
    content
  };

  if (!saveRecords(records)) return;

  closeEdit();
  render();
  showToast("기억이 수정되었어요!");
});

document.querySelectorAll("[data-close-edit]")
  .forEach((element) => {
    element.addEventListener("click", closeEdit);
  });


// ==========================================
// 11. 삭제 확인 팝업
// ==========================================

function openDelete(targets) {
  if (!targets.length) return;

  pendingDelete = targets;

  const count = targets.length;

  $("#delete-heading").textContent =
    count === 1
      ? "기록을 삭제할까요?"
      : `${count}개의 기록을 삭제할까요?`;

  $("#delete-description").textContent =
    "삭제한 기록은 다시 되돌릴 수 없어요.";

  openModal(deleteModal);
}

function closeDelete() {
  pendingDelete = [];
  closeModal(deleteModal);
}

$("#confirm-delete").addEventListener("click", () => {
  if (!pendingDelete.length) return;

  const records = readRecords();
  const indices = [];

  for (const target of pendingDelete) {
    const index = findOriginal(records, target);

    if (index === -1) {
      showToast("기록이 변경되었어요. 다시 확인해 주세요.");
      closeDelete();
      render();
      return;
    }

    indices.push(index);
  }

  const uniqueIndices = [...new Set(indices)];

  uniqueIndices.sort((a, b) => b - a);

  uniqueIndices.forEach((index) => {
    records.splice(index, 1);
  });

  if (!saveRecords(records)) return;

  const count = uniqueIndices.length;

  closeDelete();

  selectedIndices.clear();
  selectionMode = false;

  selectModeButton.classList.remove("is-active");
  selectModeButton.textContent = "여러 개 선택";
  selectionToolbar.hidden = true;

  render();

  showToast(
    count === 1
      ? "기록이 삭제되었어요."
      : `${count}개의 기록이 삭제되었어요.`
  );
});

document.querySelectorAll("[data-close-delete]")
  .forEach((element) => {
    element.addEventListener("click", closeDelete);
  });


// ==========================================
// 12. 여러 개 선택
// ==========================================

selectModeButton.addEventListener("click", () => {
  selectionMode = !selectionMode;
  selectedIndices.clear();

  selectModeButton.classList.toggle(
    "is-active",
    selectionMode
  );

  selectModeButton.textContent = selectionMode
    ? "선택 취소"
    : "여러 개 선택";

  selectionToolbar.hidden = !selectionMode;

  render();
});

function updateSelectionToolbar(visible = null) {
  if (!selectionMode) return;

  if (!visible) {
    visible = getVisibleMemories(getAllMemories());
  }

  const visibleIndices = visible.map(
    (memory) => memory.__storageIndex
  );

  const selectedVisible = visibleIndices.filter(
    (index) => selectedIndices.has(index)
  );

  selectedCount.textContent =
    `${selectedIndices.size}개 선택됨`;

  deleteSelectedButton.disabled =
    selectedIndices.size === 0;

  selectAllCheckbox.checked =
    visibleIndices.length > 0 &&
    selectedVisible.length === visibleIndices.length;

  selectAllCheckbox.indeterminate =
    selectedVisible.length > 0 &&
    selectedVisible.length < visibleIndices.length;
}

selectAllCheckbox.addEventListener("change", () => {
  const visible = getVisibleMemories(getAllMemories());

  visible.forEach((memory) => {
    if (selectAllCheckbox.checked) {
      selectedIndices.add(memory.__storageIndex);
    } else {
      selectedIndices.delete(memory.__storageIndex);
    }
  });

  render();
});

deleteSelectedButton.addEventListener("click", () => {
  if (!selectedIndices.size) return;

  const allMemories = getAllMemories();

  const targets = allMemories
    .filter((memory) =>
      selectedIndices.has(memory.__storageIndex)
    )
    .map(makeTarget);

  openDelete(targets);
});


// ==========================================
// 13. 검색 및 정렬
// ==========================================

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);


// ==========================================
// 14. 팝업 공통 기능
// ==========================================

function openModal(modal) {
  lastFocusedElement = document.activeElement;

  modal.hidden = false;
  document.body.classList.add("modal-open");

  modal.querySelector(".modal-dialog").focus();
}

function closeModal(modal) {
  modal.hidden = true;

  if (editModal.hidden && deleteModal.hidden) {
    document.body.classList.remove("modal-open");
  }

  if (
    lastFocusedElement &&
    lastFocusedElement.isConnected
  ) {
    lastFocusedElement.focus();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (!deleteModal.hidden) {
    closeDelete();
  } else if (!editModal.hidden) {
    closeEdit();
  }
});


// ==========================================
// 15. 알림 메시지
// ==========================================

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2300);
}


// ==========================================
// 16. 다른 페이지와 데이터 동기화
// ==========================================

window.addEventListener("storage", (event) => {
  if (
    event.key === STORAGE_KEY ||
    event.key === null
  ) {
    selectedIndices.clear();
    render();
  }
});

window.addEventListener("pageshow", () => {
  selectedIndices.clear();
  render();
});


// ==========================================
// 17. 시작
// ==========================================

render();
