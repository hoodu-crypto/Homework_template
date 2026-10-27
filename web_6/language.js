
/* ==========================================
   GACHA MEMO — 한국어 / 中文
========================================== */

(() => {
  "use strict";

  const LANGUAGE_KEY = "gachaMemoLanguage";

  const translations = {
    ko: {
      pageTitle: "GACHA MEMO | 작은 기억 보관소",
      description: "일상의 작은 순간과 소중한 기억을 캡슐에 담아 보세요.",
      headerNote: "나만의 작은 추억 자판기",
      eyebrow: "일상의 작은 캡슐",
      introTitle1: "소중한 순간을",
      introTitle2: "담아보세요.",
      introDesc1: "스쳐 지나가는 생각부터 소중한 기억까지.",
      introDesc2: "작은 캡슐에 담아 오래 간직해 보세요.",
      machineLabel: "추억 캡슐 자판기",
      capsuleFieldLabel: "다양한 색상의 캡슐",
      machineBrand: "작은 기억 보관소",
      mainMenu: "주요 메뉴",
      createTitle: "메모 만들기",
      createSubtitle: "새로운 기억 기록하기",
      drawTitle: "캡슐 뽑기",
      drawSubtitle: "기억 하나 꺼내 보기",
      collectionTitle: "나의 컬렉션",
      collectionSubtitle: "모아 둔 기억 살펴보기",
      organizeTitle: "기억 정리",
      organizeSubtitle: "기록과 보관 관리하기",
      knobCaption: "손잡이를 돌려 보세요",
      knobLabel: "자판기 손잡이 돌리기",
      dispenserCaption: "당신의 소중한 기억이 기다리고 있어요",
      stageCaption: "작은 캡슐 하나에 소중한 순간 하나",
      footer: "오늘의 기억을 오래 간직하세요",
      close: "닫기",
      searchTitle: "나의 기억 찾기",
      searchHelp: "다시 꺼내 보고 싶은 기억을 찾아보세요.",
      dateTab: "날짜로 찾기",
      keywordTab: "키워드로 찾기",
      dateLabel: "날짜 선택",
      keywordLabel: "키워드 입력",
      keywordPlaceholder: "제목이나 내용의 단어를 입력하세요",
      searchButton: "기억 찾기 ✦",
      openCapsule: "캡슐을 열어 기억 보기",
      droppedLabel: "캡슐을 눌러 열어보세요 ✦",
      drawAgain: "다시 뽑기",
      addFavorite: "컬렉션에 추가",
      removeFavorite: "컬렉션에서 제외",
      defaultMemory: "나의 작은 기억",
      defaultMood: "오늘의 기분",
      happy: "행복해요",
      proud: "뿌듯해요",
      sad: "조금 슬퍼요",
      tired: "피곤해요"
    },

    zh: {
      pageTitle: "GACHA MEMO | 小小回忆收藏屋",
      description: "把日常的小瞬间和珍贵回忆装进扭蛋里。",
      headerNote: "属于我的小小回忆扭蛋机",
      eyebrow: "日常的小小扭蛋",
      introTitle1: "把珍贵的瞬间",
      introTitle2: "收藏起来吧。",
      introDesc1: "从一闪而过的想法，到珍贵的回忆。",
      introDesc2: "把它们装进小小扭蛋，长久珍藏。",
      machineLabel: "回忆扭蛋机",
      capsuleFieldLabel: "各种颜色的扭蛋",
      machineBrand: "小小回忆收藏屋",
      mainMenu: "主要菜单",
      createTitle: "制作备忘录",
      createSubtitle: "记录新的回忆",
      drawTitle: "抽取扭蛋",
      drawSubtitle: "取出一段回忆",
      collectionTitle: "我的收藏",
      collectionSubtitle: "看看收藏的回忆",
      organizeTitle: "整理回忆",
      organizeSubtitle: "管理记录与收藏",
      knobCaption: "转动手柄试试看",
      knobLabel: "转动扭蛋机手柄",
      dispenserCaption: "你的珍贵回忆正在等待你",
      stageCaption: "一颗小小扭蛋，收藏一个珍贵瞬间",
      footer: "把今天的回忆长久珍藏",
      close: "关闭",
      searchTitle: "寻找我的回忆",
      searchHelp: "找一找想再次回味的回忆吧。",
      dateTab: "按日期查找",
      keywordTab: "按关键词查找",
      dateLabel: "选择日期",
      keywordLabel: "输入关键词",
      keywordPlaceholder: "请输入标题或内容中的关键词",
      searchButton: "寻找回忆 ✦",
      openCapsule: "打开扭蛋查看回忆",
      droppedLabel: "点击扭蛋打开看看 ✦",
      drawAgain: "再抽一次",
      addFavorite: "加入收藏",
      removeFavorite: "取消收藏",
      defaultMemory: "我的小小回忆",
      defaultMood: "今天的心情",
      happy: "开心",
      proud: "满足",
      sad: "有点难过",
      tired: "疲惫"
    }
  };

  const messages = {
    "저장된 기록을 읽지 못했어요.": "无法读取保存的记录。",
    "날짜를 선택해 주세요.": "请选择日期。",
    "키워드를 입력해 주세요.": "请输入关键词。",
    "해당하는 기억이 없어요. 다른 날짜나 키워드로 찾아보세요.":
      "没有找到符合条件的回忆，试试其他日期或关键词吧。",
    "기록을 찾을 수 없어요.": "找不到这条记录。",
    "기록이 변경되었어요. 다시 찾아주세요.":
      "记录已发生变化，请重新查找。",
    "컬렉션에 추가되었어요!": "已加入我的收藏！",
    "컬렉션에서 제외했어요.": "已从收藏中移除。",
    "즐겨찾기를 저장하지 못했어요.": "无法保存收藏状态。",
    "나의 작은 기억": "我的小小回忆",
    "오늘의 기분": "今天的心情",
    "행복해요": "开心",
    "뿌듯해요": "满足",
    "조금 슬퍼요": "有点难过",
    "피곤해요": "疲惫"
  };

  let currentLanguage = "ko";

  try {
    currentLanguage =
      localStorage.getItem(LANGUAGE_KEY) === "zh"
        ? "zh"
        : "ko";
  } catch {
    currentLanguage = "ko";
  }

  function t(key) {
    return translations[currentLanguage][key] ?? key;
  }

  function translateMessage(message) {
    if (currentLanguage !== "zh") return message;

    if (messages[message]) return messages[message];

    const match = message.match(
      /^(\d+)개의 캡슐을 찾았어요\. 꺼내 보고 싶은 캡슐을 선택해 주세요\.$/
    );

    if (match) {
      return `找到了 ${match[1]} 颗扭蛋，请选择想查看的回忆。`;
    }

    return message;
  }

  function isHomepage() {
    return Boolean(
      document.getElementById("machine") &&
      document.getElementById("knob-button")
    );
  }

  function updateDynamicLabels() {
    const searchLabel =
      document.getElementById("draw-search-label");

    const dateInput =
      document.getElementById("draw-date");

    if (searchLabel && dateInput) {
      searchLabel.textContent = t(
        !dateInput.hidden ? "dateLabel" : "keywordLabel"
      );
    }

    const favoriteButton =
      document.getElementById("memory-favorite-button");

    if (favoriteButton) {
      const saved =
        favoriteButton.getAttribute("aria-pressed") === "true";

      const label = t(
        saved ? "removeFavorite" : "addFavorite"
      );

      favoriteButton.setAttribute("aria-label", label);
      favoriteButton.title = label;
    }
  }

  function applyLanguage() {
    document.documentElement.lang =
      currentLanguage === "zh" ? "zh-CN" : "ko";

    // 首页标题和介绍，只在首页修改
    if (isHomepage()) {
      document.title = t("pageTitle");

      const meta = document.querySelector(
        'meta[name="description"]'
      );

      if (meta) meta.content = t("description");
    }

    // 静态文字
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;

      if (Object.hasOwn(translations[currentLanguage], key)) {
        el.textContent = t(key);
      }
    });

    // 无障碍标签
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const key = el.dataset.i18nAria;

      if (Object.hasOwn(translations[currentLanguage], key)) {
        el.setAttribute("aria-label", t(key));
      }
    });

    // 输入框提示
    document.querySelectorAll(
      "[data-i18n-placeholder]"
    ).forEach(el => {
      const key = el.dataset.i18nPlaceholder;

      if (Object.hasOwn(translations[currentLanguage], key)) {
        el.placeholder = t(key);
      }
    });

    // 语言按钮
    document.querySelectorAll("[data-language]").forEach(button => {
      const active =
        button.dataset.language === currentLanguage;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    updateDynamicLabels();
  }

  function updateDynamicMessages() {
    document.querySelectorAll(
      "[data-dynamic-translation]"
    ).forEach(element => {
      const original = element.dataset.originalKo || "";

      const output = currentLanguage === "zh"
        ? translateMessage(original)
        : original;

      if (element.textContent !== output) {
        element.textContent = output;
      }
    });
  }

  function setLanguage(language) {
    if (!translations[language]) return;

    currentLanguage = language;

    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.warn("언어 설정 저장 실패:", error);
    }

    applyLanguage();
    updateDynamicMessages();

    window.dispatchEvent(
      new CustomEvent("gacha-language-change", {
        detail: { language: currentLanguage }
      })
    );
  }

  window.GachaLanguage = {
    get: () => currentLanguage,
    set: setLanguage,
    t,
    translateMessage
  };

  // ========================================
  // 动态韩文提示观察
  // ========================================

  function observeDynamicMessage(element) {
    let internalUpdate = false;

    function syncMessage() {
      if (internalUpdate) return;

      const current = element.textContent;

      if (!current) {
        element.dataset.originalKo = "";
        element.dataset.dynamicTranslation = "true";
        return;
      }

      const original = element.dataset.originalKo || "";

      // 当前文字是翻译器自己写入的结果，
      // 不能把中文误认为原始韩文。
      const expected =
        currentLanguage === "zh"
          ? translateMessage(original)
          : original;

      if (
        element.dataset.dynamicTranslation === "true" &&
        current === expected
      ) {
        return;
      }

      // 原有业务脚本写入了新的提示
      element.dataset.originalKo = current;
      element.dataset.dynamicTranslation = "true";

      const translated = translateMessage(current);

      if (translated !== current) {
        internalUpdate = true;
        element.textContent = translated;

        // MutationObserver 的回调是异步执行的，
        // 所以这里也要延后解除标记。
        queueMicrotask(() => {
          internalUpdate = false;
        });
      }
    }

    const observer = new MutationObserver(syncMessage);

    observer.observe(element, {
      childList: true,
      characterData: true,
      subtree: true
    });

    if (element.textContent.trim()) {
      syncMessage();
    }
  }

  // ========================================
  // 初始化
  // ========================================

  document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();

    document.querySelectorAll("[data-language]").forEach(button => {
      button.addEventListener("click", () => {
        setLanguage(button.dataset.language);
      });
    });

    // 只观察首页原有脚本的动态提示
    if (isHomepage()) {
      [
        "#draw-status",
        "#toast",
        "#memory-favorite-message"
      ].forEach(selector => {
        const element = document.querySelector(selector);

        if (element) {
          observeDynamicMessage(element);
        }
      });

      // 日期 / 关键词切换
      document.querySelectorAll(
        "[data-search-mode]"
      ).forEach(button => {
        button.addEventListener("click", () => {
          queueMicrotask(updateDynamicLabels);
        });
      });

      // 收藏状态切换
      const favoriteButton =
        document.getElementById("memory-favorite-button");

      if (favoriteButton) {
        const observer = new MutationObserver(
          updateDynamicLabels
        );

        observer.observe(favoriteButton, {
          attributes: true,
          attributeFilter: ["aria-pressed"]
        });
      }

      // 搜索结果：只翻译默认标题
      const results =
        document.getElementById("draw-results");

      if (results) {
        const observer = new MutationObserver(() => {
          results.querySelectorAll(
            ".draw-result-item strong"
          ).forEach(title => {
            if (title.textContent === "나의 작은 기억") {
              title.textContent = t("defaultMemory");
            }
          });
        });

        observer.observe(results, {
          childList: true
        });
      }

      // 记忆弹窗：翻译默认标题和心情
      const memoryOverlay =
        document.getElementById("memory-overlay");

      if (memoryOverlay) {
        const observer = new MutationObserver(() => {
          if (memoryOverlay.hidden) return;

          const title =
            document.getElementById("memory-title");

          if (
            title &&
            title.textContent === "나의 작은 기억"
          ) {
            title.textContent = t("defaultMemory");
          }

          const mood = document.querySelector(
            "#memory-mood span:last-child"
          );

          if (mood && currentLanguage === "zh") {
            const moodMap = {
              "행복해요": "happy",
              "뿌듯해요": "proud",
              "조금 슬퍼요": "sad",
              "피곤해요": "tired",
              "오늘의 기분": "defaultMood"
            };

            const key = moodMap[mood.textContent];

            if (key) mood.textContent = t(key);
          }
        });

        observer.observe(memoryOverlay, {
          attributes: true,
          attributeFilter: ["hidden"]
        });
      }
    }
  });

  // 其他标签页修改语言时同步
  window.addEventListener("storage", event => {
    if (event.key !== LANGUAGE_KEY) return;

    currentLanguage = event.newValue === "zh"
      ? "zh"
      : "ko";

    applyLanguage();
    updateDynamicMessages();

    window.dispatchEvent(
      new CustomEvent("gacha-language-change", {
        detail: { language: currentLanguage }
      })
    );
  });

})();
