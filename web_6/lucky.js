
/* ==========================================
   GACHA MEMO
   LUCKY CARD INTERACTION
   한국어 / 中文
========================================== */

(() => {
  "use strict";

  // ========================================
  // 1. 五张原创幸运卡片
  // ========================================

  const luckyCards = [
    {
      image: "images/lucky-card/未命名作品 60.jpg",
      ko: {
        title: "작은 행복을 발견했어요!",
        message: "오늘은 예상하지 못한 곳에서 작은 기쁨을 발견할 거예요!"
      },
      zh: {
        title: "发现小小的幸福啦！",
        message: "今天，你会在意想不到的地方发现一份小小的快乐！"
      },
      color: "#F4A6CE",
      symbol: "♡"
    },
    {
      image: "images/lucky-card/未命名作品 63.jpg",
      ko: {
        title: "행운이 날아왔어요!",
        message: "뜻밖의 작은 행운이 찾아올지도 몰라요!"
      },
      zh: {
        title: "好运飞来啦！",
        message: "说不定会有一份意想不到的小幸运悄悄来到你身边！"
      },
      color: "#FFE26B",
      symbol: "✦"
    },
    {
      image: "images/lucky-card/未命名作品 61.jpg",
      ko: {
        title: "설레는 변화가 찾아와요!",
        message: "새로운 시작이 당신에게 기분 좋은 변화를 가져다줄 거예요!"
      },
      zh: {
        title: "令人期待的变化即将到来！",
        message: "一个崭新的开始，会为你带来令人开心的变化！"
      },
      color: "#E6A3D4",
      symbol: "♡"
    },
    {
      image: "images/lucky-card/未命名作品 62.jpg",
      ko: {
        title: "무지개가 떠오를 거예요!",
        message: "조금 흐린 하루에도 반짝이는 순간이 찾아올 거예요!"
      },
      zh: {
        title: "彩虹就要出现啦！",
        message: "即使今天有一点阴天，也会迎来闪闪发光的美好瞬间！"
      },
      color: "#8D8AE8",
      symbol: "✦"
    },
    {
      image: "images/lucky-card/未命名作品 64.jpg",
      ko: {
        title: "좋은 에너지가 가득해요!",
        message: "오늘은 밝은 에너지로 기분 좋은 하루를 보낼 수 있을 거예요!"
      },
      zh: {
        title: "今天充满好能量！",
        message: "今天也会充满明亮的能量，度过心情愉快的一天！"
      },
      color: "#BCEB8A",
      symbol: "♡"
    }
  ];

  // ========================================
  // 2. 中韩语言设置
  // ========================================

  const luckyTexts = {
    ko: {
      openCapsule: "행운 캡슐 열기",
      dropLabel: "캡슐을 눌러 열어보세요!",
      close: "닫기",
      heading: "오늘의 작은 행운",
      description: "당신에게 도착한 작은 선물이에요!",
      imageAlt: "행운 카드 일러스트",
      guideBefore: "어떤 행운이 숨어 있을까요?",
      guideAfter: "오늘의 행운을 확인했어요!",
      reveal: "행운 확인하기 ✦",
      showFront: "그림 다시 보기",
      again: "다시 뽑기"
    },

    zh: {
      openCapsule: "打开幸运扭蛋",
      dropLabel: "点击扭蛋打开看看！",
      close: "关闭",
      heading: "今日的小小幸运",
      description: "这是一份专属于你的小礼物！",
      imageAlt: "幸运卡片插画",
      guideBefore: "里面藏着什么样的幸运呢？",
      guideAfter: "已经看到今天的幸运啦！",
      reveal: "查看今日幸运 ✦",
      showFront: "再看看插画",
      again: "再抽一次"
    }
  };

  function getLanguage() {
    if (window.GachaLanguage?.get) {
      return window.GachaLanguage.get() === "zh" ? "zh" : "ko";
    }

    try {
      return localStorage.getItem("gachaMemoLanguage") === "zh"
        ? "zh"
        : "ko";
    } catch (error) {
      return "ko";
    }
  }

  function text(key) {
    return luckyTexts[getLanguage()][key];
  }

  function cardText() {
    if (!currentCard) return null;
    return currentCard[getLanguage()];
  }

  // ========================================
  // 3. 原有扭蛋机元素
  // ========================================

  const knob = document.getElementById("knob-button");
  const opening = document.getElementById("dispenser-opening");
  const machine = document.getElementById("machine");

  if (!knob || !opening) {
    console.error("손잡이 또는 캡슐 배출구를 찾을 수 없습니다.");
    return;
  }

  let currentCard = null;
  let drawing = false;
  let timer = null;
  let previousFocus = null;

  // ========================================
  // 4. 创建掉落的幸运扭蛋
  // ========================================

  const drop = document.createElement("div");

  drop.className = "lucky-drop";
  drop.id = "lucky-drop";
  drop.hidden = true;

  drop.innerHTML = `
    <button
      class="lucky-drop-ball"
      id="lucky-drop-ball"
      type="button"
      aria-label="행운 캡슐 열기"
    >
      <span class="lucky-drop-symbol">✦</span>
    </button>

    <span class="lucky-drop-label">
      캡슐을 눌러 열어보세요!
    </span>
  `;

  document.body.appendChild(drop);

  // ========================================
  // 5. 创建幸运卡片弹窗
  // ========================================

  const overlay = document.createElement("div");

  overlay.className = "lucky-overlay";
  overlay.id = "lucky-overlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <div class="lucky-backdrop"></div>

    <section
      class="lucky-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lucky-heading"
      tabindex="-1"
    >

      <button
        class="lucky-close"
        id="lucky-close"
        type="button"
        aria-label="닫기"
      >×</button>

      <h2 id="lucky-heading">
        오늘의 작은 행운
      </h2>

      <p class="lucky-description">
        당신에게 도착한 작은 선물이에요!
      </p>

      <div class="lucky-card-scene">

        <div class="lucky-card" id="lucky-card">

          <div class="lucky-face lucky-front">

            <div class="lucky-picture">
              <img
                id="lucky-image"
                src=""
                alt="행운 카드 일러스트"
              >
            </div>

            <p class="lucky-title" id="lucky-title"></p>

          </div>

          <div class="lucky-face lucky-back">

            <h3 id="lucky-back-title"></h3>

            <p id="lucky-message"></p>

          </div>

        </div>

      </div>

      <p class="lucky-guide" id="lucky-guide">
        어떤 행운이 숨어 있을까요?
      </p>

      <div class="lucky-actions">

        <button
          type="button"
          class="lucky-main-button"
          id="lucky-reveal"
        >
          행운 확인하기 ✦
        </button>

        <button
          type="button"
          class="lucky-other-button"
          id="lucky-again"
        >
          다시 뽑기
        </button>

      </div>

    </section>
  `;

  document.body.appendChild(overlay);

  // ========================================
  // 6. 元素
  // ========================================

  const dropBall = document.getElementById("lucky-drop-ball");
  const dropLabel = drop.querySelector(".lucky-drop-label");

  const card = document.getElementById("lucky-card");

  const image = document.getElementById("lucky-image");
  const title = document.getElementById("lucky-title");
  const backTitle = document.getElementById("lucky-back-title");
  const message = document.getElementById("lucky-message");

  const heading = document.getElementById("lucky-heading");
  const description = overlay.querySelector(".lucky-description");

  const guide = document.getElementById("lucky-guide");
  const reveal = document.getElementById("lucky-reveal");
  const again = document.getElementById("lucky-again");
  const close = document.getElementById("lucky-close");

  // ========================================
  // 7. 更新中韩语言
  // ========================================

  function updateLuckyLanguage() {
    dropBall.setAttribute("aria-label", text("openCapsule"));
    dropLabel.textContent = text("dropLabel");

    close.setAttribute("aria-label", text("close"));

    heading.textContent = text("heading");
    description.textContent = text("description");

    again.textContent = text("again");

    if (currentCard) {
      const selected = cardText();

      title.textContent = selected.title;
      backTitle.textContent = selected.title;
      message.textContent = selected.message;

      image.alt = selected.title;
    } else {
      image.alt = text("imageAlt");
    }

    const flipped = card.classList.contains("is-flipped");

    guide.textContent = text(
      flipped ? "guideAfter" : "guideBefore"
    );

    reveal.textContent = text(
      flipped ? "showFront" : "reveal"
    );
  }

  // ========================================
  // 8. 随机选择幸运卡片
  // ========================================

  function randomCard() {
    return luckyCards[
      Math.floor(Math.random() * luckyCards.length)
    ];
  }

  // ========================================
  // 9. 避免和记忆弹窗重叠
  // ========================================

  function otherInteractionOpen() {
    const ids = [
      "draw-overlay",
      "memory-overlay",
      "draw-dropped"
    ];

    return ids.some((id) => {
      const element = document.getElementById(id);
      return element && !element.hidden;
    });
  }

  // ========================================
  // 10. 隐藏掉出的扭蛋
  // ========================================

  function hideDrop() {
    clearTimeout(timer);

    drop.hidden = true;
    drop.classList.remove("is-dropping");
  }

  // ========================================
  // 11. 从扭蛋机出口掉出扭蛋
  // ========================================

  function drawCard() {
    if (drawing || !overlay.hidden) return;
    if (otherInteractionOpen()) return;

    drawing = true;
    hideDrop();

    currentCard = randomCard();

    // 保留原来的手柄旋转动画时间
    timer = setTimeout(() => {
      const rect = opening.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;

      const x = Math.max(
        75,
        Math.min(window.innerWidth - 75, centerX)
      );

      const y = Math.max(
        15,
        Math.min(window.innerHeight - 130, rect.bottom + 8)
      );

      drop.style.left = `${x}px`;
      drop.style.top = `${y}px`;

      dropBall.style.setProperty(
        "--lucky-color",
        currentCard.color
      );

      dropBall.querySelector(".lucky-drop-symbol")
        .textContent = currentCard.symbol;

      updateLuckyLanguage();

      drop.hidden = false;

      drop.classList.remove("is-dropping");
      void drop.offsetWidth;
      drop.classList.add("is-dropping");

      drawing = false;

    }, 800);
  }

  // ========================================
  // 12. 打开幸运卡片
  // ========================================

  function openCard() {
    if (!currentCard) return;

    hideDrop();

    previousFocus = document.activeElement;

    card.classList.remove("is-flipped");

    image.src = currentCard.image;

    updateLuckyLanguage();

    overlay.hidden = false;
    document.body.classList.add("lucky-open");

    overlay.querySelector(".lucky-dialog").focus();
  }

  // ========================================
  // 13. 翻转卡片
  // ========================================

  function flipCard() {
    card.classList.toggle("is-flipped");

    updateLuckyLanguage();
  }

  // ========================================
  // 14. 关闭卡片
  // ========================================

  function closeCard() {
    overlay.hidden = true;
    document.body.classList.remove("lucky-open");

    if (previousFocus && previousFocus.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  // ========================================
  // 15. 再次抽取
  // ========================================

  function drawAgain() {
    closeCard();
    drawCard();
  }

  // ========================================
  // 16. 点击事件
  // ========================================

  knob.addEventListener("click", drawCard);

  dropBall.addEventListener("click", openCard);

  reveal.addEventListener("click", flipCard);

  card.addEventListener("click", flipCard);

  again.addEventListener("click", drawAgain);

  close.addEventListener("click", closeCard);

  overlay.querySelector(".lucky-backdrop")
    .addEventListener("click", closeCard);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) {
      closeCard();
    }
  });

  window.addEventListener("resize", () => {
    if (!drop.hidden) hideDrop();
  });

  // ========================================
  // 17. 监听首页语言切换
  // ========================================

  window.addEventListener(
    "gacha-language-change",
    updateLuckyLanguage
  );

  // 初始化语言
  updateLuckyLanguage();

})();
