
/* ==========================================
   GACHA MEMO - MEMORY ORGANIZE
   한국어 / 中文
========================================== */

"use strict";

const STORAGE_KEY = "gachaMemoCapsules";
const LANGUAGE_KEY = "gachaMemoLanguage";
const $ = selector => document.querySelector(selector);

// ==========================================
// 1. 中韩翻译
// ==========================================

const translations = {
  ko: {
    pageTitle: "기억 정리 | GACHA MEMO",
    home: "홈으로",
    pageHeading: "기억 정리",
    intro1: "차곡차곡 쌓인 기억을 살펴보고,",
    intro2: "나만의 작은 기록들을 정리해 보세요.",
    totalRecords: "전체 기록",
    favorites: "즐겨찾기",
    listHeading: "나의 기억 목록",
    searchPlaceholder: "제목이나 내용 검색",
    searchLabel: "기억 검색",
    sortLabel: "정렬 방식",
    sortNew: "최신 날짜순",
    sortOld: "오래된 날짜순",
    selectMultiple: "여러 개 선택",
    cancelSelection: "선택 취소",
    selectAll: "전체 선택",
    deleteSelected: "선택 삭제",
    createMemo: "메모 만들기",
    close: "닫기",
    editHeading: "기억 수정하기",
    editDescription: "소중한 기록을 다시 정리해 보세요.",
    date: "날짜",
    title: "제목",
    content: "내용",
    titlePlaceholder: "기억의 제목",
    contentPlaceholder: "기억을 적어 주세요.",
    cancel: "취소",
    save: "저장하기",
    confirmDelete: "삭제하기",
    deleteWarning: "삭제한 기록은 다시 되돌릴 수 없어요.",
    deleteOneHeading: "기록을 삭제할까요?",
    deleteManyHeading: n => `${n}개의 기록을 삭제할까요?`,
    resultCount: n => `${n}개의 기록`,
    selectedCount: n => `${n}개 선택됨`,
    noRecords: "아직 기록이 없어요.",
    noRecordsHelp: "첫 번째 기억을 만들어 보세요!",
    noResults: "검색 결과가 없어요.",
    noResultsHelp: "다른 검색어로 다시 찾아보세요.",
    defaultTitle: "나의 작은 기억",
    selectMemory: title => `${title} 선택`,
    editMemory: title => `${title} 수정`,
    deleteMemory: title => `${title} 삭제`,
    addFavorite: "컬렉션에 추가",
    removeFavorite: "컬렉션에서 제외",
    edit: "수정",
    remove: "삭제",
    loadError: "기록을 불러오지 못했어요.",
    saveError: "기록을 저장하지 못했어요.",
    missingRecord: "기록을 찾을 수 없어요.",
    changedRecord: "기록이 변경되었어요. 다시 확인해 주세요.",
    favoriteAdded: "컬렉션에 추가되었어요!",
    favoriteRemoved: "컬렉션에서 제외했어요.",
    validationError: "날짜, 제목, 내용을 입력해 주세요.",
    editSuccess: "기억이 수정되었어요!",
    deleteOneSuccess: "기록이 삭제되었어요.",
    deleteManySuccess: n => `${n}개의 기록이 삭제되었어요.`
  },

  zh: {
    pageTitle: "整理回忆 | GACHA MEMO",
    home: "返回首页",
    pageHeading: "整理回忆",
    intro1: "翻看一点点积累起来的回忆，",
    intro2: "整理属于自己的珍贵记录吧。",
    totalRecords: "全部记录",
    favorites: "我的收藏",
    listHeading: "我的回忆列表",
    searchPlaceholder: "搜索标题或内容",
    searchLabel: "搜索回忆",
    sortLabel: "排序方式",
    sortNew: "日期从近到远",
    sortOld: "日期从远到近",
    selectMultiple: "批量选择",
    cancelSelection: "取消选择",
    selectAll: "全选",
    deleteSelected: "删除选中项",
    createMemo: "制作备忘录",
    close: "关闭",
    editHeading: "编辑回忆",
    editDescription: "重新整理这段珍贵的记录吧。",
    date: "日期",
    title: "标题",
    content: "内容",
    titlePlaceholder: "回忆的标题",
    contentPlaceholder: "写下你的回忆吧。",
    cancel: "取消",
    save: "保存修改",
    confirmDelete: "确认删除",
    deleteWarning: "删除后将无法恢复这些记录。",
    deleteOneHeading: "确定要删除这条记录吗？",
    deleteManyHeading: n => `确定要删除选中的${n}条记录吗？`,
    resultCount: n => `共 ${n} 条记录`,
    selectedCount: n => `已选择 ${n} 条`,
    noRecords: "还没有保存的回忆。",
    noRecordsHelp: "来制作第一颗回忆扭蛋吧！",
    noResults: "没有找到相关记录。",
    noResultsHelp: "换个关键词再试试吧。",
    defaultTitle: "我的小小回忆",
    selectMemory: title => `选择：${title}`,
    editMemory: title => `编辑：${title}`,
    deleteMemory: title => `删除：${title}`,
    addFavorite: "加入收藏",
    removeFavorite: "取消收藏",
    edit: "编辑",
    remove: "删除",
    loadError: "无法读取记录。",
    saveError: "保存失败，请检查浏览器存储空间。",
    missingRecord: "找不到这条记录。",
    changedRecord: "记录已发生变化，请重新确认。",
    favoriteAdded: "已加入我的收藏！",
    favoriteRemoved: "已取消收藏。",
    validationError: "请填写日期、标题和内容。",
    editSuccess: "回忆修改成功！",
    deleteOneSuccess: "记录已删除。",
    deleteManySuccess: n => `已删除 ${n} 条记录。`
  }
};

function getLanguage() {
  if (window.GachaLanguage?.get) {
    return window.GachaLanguage.get() === "zh" ? "zh" : "ko";
  }

  try {
    return localStorage.getItem(LANGUAGE_KEY) === "zh"
      ? "zh"
      : "ko";
  } catch {
    return "ko";
  }
}

function t(key, ...args) {
  const value = translations[getLanguage()][key];
  return typeof value === "function" ? value(...args) : value;
}

// ==========================================
// 2. 页面元素与状态
// ==========================================

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
let toastKey = null;
let toastArgs = [];
let lastFocusedElement = null;

// ==========================================
// 3. 数据读取与保存
// ==========================================

function readRecords() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("기록 불러오기 오류:", error);
    showToast("loadError");
    return [];
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );
    return true;
  } catch (error) {
    console.error("기록 저장 오류:", error);
    showToast("saveError");
    return false;
  }
}

// ==========================================
// 4. 查找原始记录
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
    return records.findIndex(record =>
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

function getAllMemories() {
  return readRecords()
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;

      return {
        ...item,
        favorite: item.favorite === true,
        __storageIndex: index
      };
    })
    .filter(Boolean);
}

// ==========================================
// 5. 搜索与排序
// ==========================================

const moodTranslations = {
  "행복해요": "开心",
  "뿌듯해요": "满足",
  "조금 슬퍼요": "有点难过",
  "피곤해요": "疲惫"
};

function getVisibleMemories(allMemories) {
  const keyword = searchInput.value
    .trim()
    .toLocaleLowerCase();

  const result = allMemories.filter(memory => {
    const text = [
      memory.date,
      memory.title,
      memory.content,
      memory.mood,
      moodTranslations[memory.mood]
    ]
      .filter(value => value != null)
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
// 6. 扭蛋颜色
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
// 7. 创建回忆卡片
// ==========================================

function createMemoryCard(memory) {
  const index = memory.__storageIndex;
  const titleText = memory.title || t("defaultTitle");

  const card = document.createElement("article");
  card.className = "memory-card";

  if (selectedIndices.has(index)) {
    card.classList.add("is-selected");
  }

  // 多选复选框
  if (selectionMode) {
    const checkboxWrap = document.createElement("label");
    checkboxWrap.className = "memory-checkbox-wrap";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "memory-checkbox";
    checkbox.checked = selectedIndices.has(index);
    checkbox.setAttribute("aria-label", t("selectMemory", titleText));

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedIndices.add(index);
      } else {
        selectedIndices.delete(index);
      }

      card.classList.toggle("is-selected", checkbox.checked);
      updateSelectionToolbar();
    });

    checkboxWrap.appendChild(checkbox);
    card.appendChild(checkboxWrap);
  }

  // 扭蛋
  const capsule = document.createElement("div");
  capsule.className = "memory-capsule";
  capsule.style.setProperty(
    "--capsule-color",
    getCapsuleColor(memory)
  );

  const symbol = document.createElement("span");
  symbol.textContent = memory.sticker || "♡";
  capsule.appendChild(symbol);

  // 记录信息
  const info = document.createElement("div");
  info.className = "memory-info";

  const date = document.createElement("p");
  date.className = "memory-date";
  date.textContent = memory.date || "";

  const title = document.createElement("h3");
  title.className = "memory-title";
  title.textContent = titleText;

  const preview = document.createElement("p");
  preview.className = "memory-preview";
  preview.textContent = memory.content || "";

  info.append(date, title, preview);

  // 操作按钮
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
    t(memory.favorite ? "removeFavorite" : "addFavorite")
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
  edit.textContent = t("edit");
  edit.setAttribute("aria-label", t("editMemory", titleText));

  edit.addEventListener("click", () => {
    openEdit(makeTarget(memory));
  });

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "icon-button delete-button";
  remove.textContent = t("remove");
  remove.setAttribute("aria-label", t("deleteMemory", titleText));

  remove.addEventListener("click", () => {
    openDelete([makeTarget(memory)]);
  });

  actions.append(favorite, edit, remove);
  card.append(capsule, info, actions);

  return card;
}

// ==========================================
// 8. 刷新列表
// ==========================================

function render() {
  const allMemories = getAllMemories();
  const visibleMemories = getVisibleMemories(allMemories);

  totalCount.textContent = allMemories.length;
  favoriteCount.textContent = allMemories.filter(
    memory => memory.favorite
  ).length;

  resultCount.textContent = t("resultCount", visibleMemories.length);

  memoryList.replaceChildren();

  visibleMemories.forEach(memory => {
    memoryList.appendChild(createMemoryCard(memory));
  });

  const hasRecords = allMemories.length > 0;

  emptyState.hidden = visibleMemories.length > 0;

  $("#empty-title").textContent = hasRecords
    ? t("noResults")
    : t("noRecords");

  $("#empty-description").textContent = hasRecords
    ? t("noResultsHelp")
    : t("noRecordsHelp");

  emptyState.querySelector("a").hidden = hasRecords;

  updateSelectionToolbar(visibleMemories);
}

// ==========================================
// 9. 收藏切换
// ==========================================

function toggleFavorite(target) {
  const records = readRecords();
  const index = findOriginal(records, target);

  if (index === -1) {
    showToast("missingRecord");
    render();
    return;
  }

  const isFavorite = records[index].favorite === true;

  records[index] = {
    ...records[index],
    favorite: !isFavorite
  };

  if (!saveRecords(records)) return;

  showToast(isFavorite ? "favoriteRemoved" : "favoriteAdded");
  render();
}

// ==========================================
// 10. 编辑回忆
// ==========================================

function openEdit(target) {
  const records = readRecords();
  const index = findOriginal(records, target);

  if (index === -1) {
    showToast("missingRecord");
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

editForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!editingTarget) return;

  const date = $("#edit-date").value;
  const title = $("#edit-title").value.trim();
  const content = $("#edit-content").value.trim();

  if (!date || !title || !content) {
    showToast("validationError");
    return;
  }

  const records = readRecords();
  const index = findOriginal(records, editingTarget);

  if (index === -1) {
    showToast("changedRecord");
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
  showToast("editSuccess");
});

document.querySelectorAll("[data-close-edit]").forEach(element => {
  element.addEventListener("click", closeEdit);
});

// ==========================================
// 11. 删除确认
// ==========================================

function updateDeleteDialog() {
  const count = pendingDelete.length;

  $("#delete-heading").textContent = count === 1
    ? t("deleteOneHeading")
    : t("deleteManyHeading", count);

  $("#delete-description").textContent = t("deleteWarning");
}

function openDelete(targets) {
  if (!targets.length) return;

  pendingDelete = targets;
  updateDeleteDialog();
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
      showToast("changedRecord");
      closeDelete();
      render();
      return;
    }

    indices.push(index);
  }

  const uniqueIndices = [...new Set(indices)];
  uniqueIndices.sort((a, b) => b - a);

  uniqueIndices.forEach(index => {
    records.splice(index, 1);
  });

  if (!saveRecords(records)) return;

  const count = uniqueIndices.length;

  closeDelete();

  selectedIndices.clear();
  selectionMode = false;

  selectModeButton.classList.remove("is-active");
  selectionToolbar.hidden = true;
  selectModeButton.textContent = t("selectMultiple");

  render();

  if (count === 1) {
    showToast("deleteOneSuccess");
  } else {
    showToast("deleteManySuccess", count);
  }
});

document.querySelectorAll("[data-close-delete]").forEach(element => {
  element.addEventListener("click", closeDelete);
});

// ==========================================
// 12. 多选功能
// ==========================================

selectModeButton.addEventListener("click", () => {
  selectionMode = !selectionMode;
  selectedIndices.clear();

  selectModeButton.classList.toggle(
    "is-active",
    selectionMode
  );

  selectModeButton.textContent = selectionMode
    ? t("cancelSelection")
    : t("selectMultiple");

  selectionToolbar.hidden = !selectionMode;

  render();
});

function updateSelectionToolbar(visible = null) {
  if (!selectionMode) return;

  if (!visible) {
    visible = getVisibleMemories(getAllMemories());
  }

  const visibleIndices = visible.map(
    memory => memory.__storageIndex
  );

  const selectedVisible = visibleIndices.filter(
    index => selectedIndices.has(index)
  );

  selectedCount.textContent = t("selectedCount", selectedIndices.size);

  deleteSelectedButton.disabled = selectedIndices.size === 0;

  selectAllCheckbox.checked =
    visibleIndices.length > 0 &&
    selectedVisible.length === visibleIndices.length;

  selectAllCheckbox.indeterminate =
    selectedVisible.length > 0 &&
    selectedVisible.length < visibleIndices.length;
}

selectAllCheckbox.addEventListener("change", () => {
  const visible = getVisibleMemories(getAllMemories());

  visible.forEach(memory => {
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

  const targets = getAllMemories()
    .filter(memory => selectedIndices.has(memory.__storageIndex))
    .map(makeTarget);

  openDelete(targets);
});

// ==========================================
// 13. 搜索与排序
// ==========================================

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

// ==========================================
// 14. 弹窗通用功能
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

  if (lastFocusedElement && lastFocusedElement.isConnected) {
    lastFocusedElement.focus();
  }
}

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;

  if (!deleteModal.hidden) {
    closeDelete();
  } else if (!editModal.hidden) {
    closeEdit();
  }
});

// ==========================================
// 15. 提示消息
// ==========================================

function showToast(key, ...args) {
  toastKey = key;
  toastArgs = args;

  toast.textContent = t(key, ...args);
  toast.hidden = false;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.hidden = true;
    toastKey = null;
    toastArgs = [];
  }, 2300);
}

// ==========================================
// 16. 更新整个页面语言
// ==========================================

function applyOrganizeLanguage() {
  const lang = getLanguage();

  document.documentElement.lang =
    lang === "zh" ? "zh-CN" : "ko";

  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    const value = translations[lang][key];

    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = t(key);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach(element => {
    const key = element.dataset.i18nAria;
    element.setAttribute("aria-label", t(key));
  });

  selectModeButton.textContent = selectionMode
    ? t("cancelSelection")
    : t("selectMultiple");

  if (selectionMode) {
    selectedCount.textContent = t(
      "selectedCount",
      selectedIndices.size
    );
  }

  if (!deleteModal.hidden && pendingDelete.length) {
    updateDeleteDialog();
  }

  if (toastKey && !toast.hidden) {
    toast.textContent = t(toastKey, ...toastArgs);
  }

  render();
}

// ==========================================
// 17. 跨页面同步
// ==========================================

window.addEventListener("storage", event => {
  if (event.key === STORAGE_KEY || event.key === null) {
    selectedIndices.clear();
    render();
  }

  if (event.key === LANGUAGE_KEY) {
    applyOrganizeLanguage();
  }
});

window.addEventListener(
  "gacha-language-change",
  applyOrganizeLanguage
);

window.addEventListener("pageshow", () => {
  selectedIndices.clear();
  applyOrganizeLanguage();
});

// ==========================================
// 18. 初始化
// ==========================================

applyOrganizeLanguage();
