
/* ========================================
   GACHA MEMO — 메모 만들기
   한국어 / 中文
======================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "gachaMemoCapsules";
  const LANGUAGE_KEY = "gachaMemoLanguage";

  const form = document.getElementById("capsule-form");
  if (!form) return;

  const mainCapsule = document.getElementById("main-capsule-preview");
  const mainSticker = document.getElementById("main-sticker");
  const ticketCapsule = document.getElementById("ticket-capsule");
  const ticketSticker = document.getElementById("ticket-sticker");

  const dateInput = document.getElementById("memo-date");
  const titleInput = document.getElementById("memo-title-input");
  const contentInput = document.getElementById("memo-content");

  const characterCount = document.getElementById("character-count");
  const previewDate = document.getElementById("preview-date");
  const previewTitle = document.getElementById("preview-title");
  const previewMood = document.getElementById("preview-mood");
  const previewContent = document.getElementById("preview-content");

  const message = document.getElementById("form-message");
  const completeButton = document.getElementById("complete-button");
  const successPanel = document.getElementById("success-panel");
  const makeAnotherButton = document.getElementById("make-another");
  const selectedColorLabel = document.getElementById("selected-color-label");

  // ========================================
  // 1. 中韩翻译
  // ========================================

  const words = {
    ko: {
      pageTitle: "메모 만들기 | GACHA MEMO",
      pageDescription: "나만의 기억을 담은 캡슐을 만들어 보세요.",
      createBackHome: "홈으로 돌아가기",
      createPageTitle: "메모 만들기",
      createIntro: "오늘의 소중한 순간을 나만의 캡슐에 담아보세요.",
      appearanceTitle: "캡슐 꾸미기",
      mainCapsuleLabel: "선택한 캡슐 미리보기",
      appearanceHelp: "마음에 드는 색과 스티커를 골라보세요.",
      colorLegend: "캡슐 색상 선택",
      stickerLegend: "스티커 선택",
      memoSectionTitle: "메모 작성",
      dateField: "날짜",
      titleField: "제목",
      titlePlaceholder: "오늘의 기억에 제목을 붙여보세요.",
      moodLegend: "오늘의 기분",
      moodGroupLabel: "오늘의 기분 선택",
      contentField: "오늘의 메모",
      contentPlaceholder: "오늘의 소중한 순간을 기록해 보세요.",
      contentHelp: "기억하고 싶은 순간을 자유롭게 적어보세요.",
      liveTitle: "캡슐 미리보기",
      liveHelp: "입력한 내용이 실시간으로 반영돼요.",
      completeButton: "캡슐 완성하기",
      submitNote: "완성한 캡슐은 나의 기억 보관함에 저장돼요.",
      successTitle: "캡슐이 완성되었어요!",
      successDescription: "소중한 기억을 캡슐에 담았어요.",
      makeAnother: "새 캡슐 만들기",
      returnHome: "홈으로 돌아가기",
      emptyDate: "날짜를 선택해 주세요.",
      emptyTitle: "나의 작은 기억",
      emptyContent: "오늘의 소중한 순간을 이곳에 기록해 보세요.",
      colorSelected: name => `${name} 캡슐을 선택했어요.`,
      readError: "저장된 기록을 읽지 못했어요. 브라우저 저장 공간을 확인해 주세요.",
      dateError: "날짜를 선택해 주세요.",
      titleError: "기억을 나타내는 제목을 입력해 주세요.",
      contentError: "오늘의 메모 내용을 입력해 주세요.",
      saveError: "캡슐을 저장하지 못했어요. 브라우저 저장 공간 설정을 확인해 주세요."
    },

    zh: {
      pageTitle: "制作备忘录 | GACHA MEMO",
      pageDescription: "制作一颗装满专属回忆的小扭蛋。",
      createBackHome: "返回首页",
      createPageTitle: "制作备忘录",
      createIntro: "把今天的珍贵瞬间装进属于自己的小扭蛋吧。",
      appearanceTitle: "装饰扭蛋",
      mainCapsuleLabel: "所选扭蛋预览",
      appearanceHelp: "选择喜欢的颜色和贴纸吧。",
      colorLegend: "选择扭蛋颜色",
      stickerLegend: "选择贴纸",
      memoSectionTitle: "填写备忘录",
      dateField: "日期",
      titleField: "标题",
      titlePlaceholder: "给今天的回忆起个名字吧。",
      moodLegend: "今天的心情",
      moodGroupLabel: "选择今天的心情",
      contentField: "今天的备忘录",
      contentPlaceholder: "记录下今天的珍贵瞬间吧。",
      contentHelp: "自由写下想要珍藏的瞬间。",
      liveTitle: "扭蛋预览",
      liveHelp: "填写的内容会实时显示在这里。",
      completeButton: "完成扭蛋",
      submitNote: "完成的扭蛋会保存在你的回忆收藏屋中。",
      successTitle: "扭蛋制作完成啦！",
      successDescription: "珍贵的回忆已经装进扭蛋里啦。",
      makeAnother: "制作新扭蛋",
      returnHome: "返回首页",
      emptyDate: "请选择日期。",
      emptyTitle: "我的小小回忆",
      emptyContent: "在这里记录今天的珍贵瞬间吧。",
      colorSelected: name => `已选择${name}扭蛋。`,
      readError: "无法读取已保存的记录，请检查浏览器存储空间。",
      dateError: "请选择日期。",
      titleError: "请输入回忆的标题。",
      contentError: "请输入备忘录内容。",
      saveError: "无法保存扭蛋，请检查浏览器的存储设置。"
    }
  };

  const colorNames = {
    "분홍색": "粉色",
    "보라색": "紫色",
    "민트색": "薄荷绿",
    "노란색": "黄色",
    "하늘색": "浅蓝色"
  };

  const stickerNames = {
    "하트": "爱心",
    "별": "星星",
    "꽃": "花朵",
    "구름": "云朵"
  };

  const moodNames = {
    "행복해요": "开心",
    "뿌듯해요": "满足",
    "조금 슬퍼요": "有点难过",
    "피곤해요": "疲惫"
  };

  const moodAltNames = {
    "행복해요": "开心的表情",
    "뿌듯해요": "满足的表情",
    "조금 슬퍼요": "难过的表情",
    "피곤해요": "疲惫的表情"
  };

  const moodImages = {
    "행복해요": "mood-happy.png",
    "뿌듯해요": "mood-proud.png",
    "조금 슬퍼요": "mood-sad.png",
    "피곤해요": "mood-tired.png"
  };

  function getLanguage() {
    if (window.GachaLanguage?.get) {
      return window.GachaLanguage.get() === "zh" ? "zh" : "ko";
    }

    try {
      return localStorage.getItem(LANGUAGE_KEY) === "zh" ? "zh" : "ko";
    } catch (error) {
      return "ko";
    }
  }

  function t(key) {
    return words[getLanguage()][key];
  }

  function displayColor(name) {
    return getLanguage() === "zh"
      ? colorNames[name] || name
      : name;
  }

  function displaySticker(name) {
    return getLanguage() === "zh"
      ? stickerNames[name] || name
      : name;
  }

  function displayMood(name) {
    return getLanguage() === "zh"
      ? moodNames[name] || name
      : name;
  }

  // ========================================
  // 2. 默认选择
  // ========================================

  let selectedColor = "#F3A8C9";
  let selectedColorName = "분홍색";

  let selectedSticker = "♡";
  let selectedStickerName = "하트";

  let selectedMood = "행복해요";
  let selectedMoodEmoji = "😊";

  let isSaving = false;
  let currentMessageKey = "";
  let currentMessageError = false;

  // ========================================
  // 3. 日期
  // ========================================

  function localDateValue(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatDate(value) {
    if (!value) return t("emptyDate");

    const parts = value.split("-").map(Number);

    if (
      parts.length !== 3 ||
      parts.some(Number.isNaN)
    ) {
      return t("emptyDate");
    }

    if (getLanguage() === "zh") {
      return `${parts[0]}年${parts[1]}月${parts[2]}日`;
    }

    return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
  }

  // ========================================
  // 4. 提示消息
  // ========================================

  function showMessage(key = "", isError = false) {
    currentMessageKey = key;
    currentMessageError = isError;

    message.textContent = key ? t(key) : "";
    message.classList.toggle("is-error", isError);
  }

  // ========================================
  // 5. 心情预览
  // ========================================

  function updateMoodPreview() {
    const imagePath =
      moodImages[selectedMood] || "mood-happy.png";

    previewMood.replaceChildren();

    const moodImage = document.createElement("img");
    moodImage.src = imagePath;
    moodImage.alt = "";
    moodImage.className = "preview-mood-image";

    moodImage.style.width = "25px";
    moodImage.style.height = "25px";
    moodImage.style.objectFit = "contain";
    moodImage.style.display = "block";
    moodImage.style.flexShrink = "0";

    const moodText = document.createElement("span");
    moodText.textContent = displayMood(selectedMood);

    previewMood.style.gap = "6px";

    previewMood.appendChild(moodImage);
    previewMood.appendChild(moodText);
  }

  // ========================================
  // 6. 实时预览
  // ========================================

  function updatePreview() {
    mainCapsule.style.setProperty(
      "--preview-color",
      selectedColor
    );

    ticketCapsule.style.setProperty(
      "--preview-color",
      selectedColor
    );

    mainSticker.textContent = selectedSticker;
    ticketSticker.textContent = selectedSticker;

    previewDate.textContent = formatDate(dateInput.value);

    previewTitle.textContent =
      titleInput.value.trim() || t("emptyTitle");

    updateMoodPreview();

    previewContent.textContent =
      contentInput.value.trim() || t("emptyContent");

    characterCount.textContent =
      `${contentInput.value.length} / 5000`;

    selectedColorLabel.textContent =
      t("colorSelected")(displayColor(selectedColorName));
  }

  // ========================================
  // 7. 更新页面语言
  // ========================================

  function applyCreateLanguage() {
    const lang = getLanguage();

    document.documentElement.lang =
      lang === "zh" ? "zh-CN" : "ko";

    document.title = t("pageTitle");

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = t("pageDescription");

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;

      if (words[lang][key] !== undefined) {
        element.textContent = t(key);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(element => {
      const key = element.dataset.i18nAria;

      if (words[lang][key] !== undefined) {
        element.setAttribute("aria-label", t(key));
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const key = element.dataset.i18nPlaceholder;

      if (words[lang][key] !== undefined) {
        element.placeholder = t(key);
      }
    });

    document.querySelectorAll(".color-option").forEach(button => {
      button.setAttribute(
        "aria-label",
        displayColor(button.dataset.colorName)
      );
    });

    document.querySelectorAll(".sticker-option").forEach(button => {
      button.setAttribute(
        "aria-label",
        `${displaySticker(button.dataset.stickerName)}${lang === "zh" ? "贴纸" : " 스티커"}`
      );
    });

    document.querySelectorAll(".mood-option").forEach(button => {
      const name = button.dataset.mood;
      const label = button.querySelector("b");
      const img = button.querySelector("img");

      if (label) label.textContent = displayMood(name);

      if (img) {
        img.alt = lang === "zh"
          ? moodAltNames[name]
          : ({
              "행복해요": "행복한 표정",
              "뿌듯해요": "뿌듯한 표정",
              "조금 슬퍼요": "슬픈 표정",
              "피곤해요": "피곤한 표정"
            })[name];
      }
    });

    updatePreview();

    if (currentMessageKey) {
      message.textContent = t(currentMessageKey);
      message.classList.toggle("is-error", currentMessageError);
    }
  }

  // ========================================
  // 8. 颜色选择
  // ========================================

  document.querySelectorAll(".color-option").forEach(button => {
    button.addEventListener("click", () => {
      selectedColor = button.dataset.color;
      selectedColorName = button.dataset.colorName;

      document.querySelectorAll(".color-option").forEach(item => {
        const selected = item === button;

        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      updatePreview();
    });
  });

  // ========================================
  // 9. 贴纸选择
  // ========================================

  document.querySelectorAll(".sticker-option").forEach(button => {
    button.addEventListener("click", () => {
      selectedSticker = button.dataset.sticker;
      selectedStickerName = button.dataset.stickerName;

      document.querySelectorAll(".sticker-option").forEach(item => {
        const selected = item === button;

        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      updatePreview();
    });
  });

  // ========================================
  // 10. 心情选择
  // ========================================

  document.querySelectorAll(".mood-option").forEach(button => {
    button.addEventListener("click", () => {
      selectedMood = button.dataset.mood;
      selectedMoodEmoji = button.dataset.emoji;

      document.querySelectorAll(".mood-option").forEach(item => {
        const selected = item === button;

        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      updatePreview();
    });
  });

  // ========================================
  // 11. 输入实时更新
  // ========================================

  [dateInput, titleInput, contentInput].forEach(input => {
    input.addEventListener("input", updatePreview);
    input.addEventListener("change", updatePreview);
  });

  // ========================================
  // 12. 读取已有记录
  // ========================================

  function readSavedCapsules() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(item =>
        item &&
        typeof item === "object" &&
        item.id
      );

    } catch (error) {
      showMessage("readError", true);
      return null;
    }
  }

  // ========================================
  // 13. 保存扭蛋
  // ========================================

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (isSaving) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!dateInput.value) {
      showMessage("dateError", true);
      dateInput.focus();
      return;
    }

    if (!title) {
      showMessage("titleError", true);
      titleInput.focus();
      return;
    }

    if (!content) {
      showMessage("contentError", true);
      contentInput.focus();
      return;
    }

    const savedCapsules = readSavedCapsules();
    if (savedCapsules === null) return;

    const now = new Date();

    // 保留原来的数据结构。
    // mood、colorName、stickerName 使用韩文标准值，
    // 让中韩两种语言都能读取同一份记录。
    const capsule = {
      id:
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : `capsule-${now.getTime()}-${Math.random()
              .toString(36)
              .slice(2, 10)}`,

      createdAt: now.toISOString(),
      date: dateInput.value,
      title: title,
      mood: selectedMood,
      moodEmoji: selectedMoodEmoji,
      moodImage: moodImages[selectedMood],
      content: content,
      color: selectedColor,
      colorName: selectedColorName,
      sticker: selectedSticker,
      stickerName: selectedStickerName
    };

    isSaving = true;
    completeButton.disabled = true;
    completeButton.setAttribute("aria-busy", "true");

    try {
      savedCapsules.push(capsule);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(savedCapsules)
      );

      showMessage("");

      form.hidden = true;
      successPanel.hidden = false;

      successPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    } catch (error) {
      showMessage("saveError", true);

      completeButton.disabled = false;
      completeButton.removeAttribute("aria-busy");
      isSaving = false;
    }
  });

  // ========================================
  // 14. 制作新的扭蛋
  // ========================================

  makeAnotherButton.addEventListener("click", () => {
    form.reset();

    selectedColor = "#F3A8C9";
    selectedColorName = "분홍색";

    selectedSticker = "♡";
    selectedStickerName = "하트";

    selectedMood = "행복해요";
    selectedMoodEmoji = "😊";

    document.querySelectorAll(".color-option").forEach(item => {
      const selected = item.dataset.color === selectedColor;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    document.querySelectorAll(".sticker-option").forEach(item => {
      const selected = item.dataset.sticker === selectedSticker;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    document.querySelectorAll(".mood-option").forEach(item => {
      const selected = item.dataset.mood === selectedMood;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    dateInput.value = localDateValue();

    form.hidden = false;
    successPanel.hidden = true;

    completeButton.disabled = false;
    completeButton.removeAttribute("aria-busy");
    isSaving = false;

    showMessage("");
    updatePreview();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    titleInput.focus({
      preventScroll: true
    });
  });

  // ========================================
  // 15. 监听语言切换
  // ========================================

  window.addEventListener(
    "gacha-language-change",
    applyCreateLanguage
  );

  window.addEventListener("pageshow", applyCreateLanguage);

  // ========================================
  // 16. 页面初始化
  // ========================================

  dateInput.value = localDateValue();
  applyCreateLanguage();

})();
