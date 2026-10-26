
/* ==========================================
   GACHA MEMO
   LUCKY CARD INTERACTION
========================================== */

(() => {
  "use strict";

  // 五张自己绘制的幸运插画
  // 图片放在 images/lucky-card 文件夹中

  const luckyCards = [
    {
      image: "images/lucky-card/未命名作品 60.jpg",
      title: "작은 행복을 발견했어요!",
      message: "오늘은 예상하지 못한 곳에서 작은 기쁨을 발견할 거예요!",
      color: "#F4A6CE",
      symbol: "♡"
    },
    {
      image: "images/lucky-card/未命名作品 63.jpg",
      title: "행운이 날아왔어요!",
      message: "뜻밖의 작은 행운이 찾아올지도 몰라요!",
      color: "#FFE26B",
      symbol: "✦"
    },
    {
      image: "images/lucky-card/未命名作品 61.jpg",
      title: "설레는 변화가 찾아와요!",
      message: "새로운 시작이 당신에게 기분 좋은 변화를 가져다줄 거예요!",
      color: "#E6A3D4",
      symbol: "♡"
    },
    {
      image: "images/lucky-card/未命名作品 62.jpg",
      title: "무지개가 떠오를 거예요!",
      message: "조금 흐린 하루에도 반짝이는 순간이 찾아올 거예요!",
      color: "#8D8AE8",
      symbol: "✦"
    },
    {
      image: "images/lucky-card/未命名作品 64.jpg",
      title: "좋은 에너지가 가득해요!",
      message: "오늘은 밝은 에너지로 기분 좋은 하루를 보낼 수 있을 거예요!",
      color: "#BCEB8A",
      symbol: "♡"
    }
  ];

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
  // 1. 캡슐 생성
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
  // 2. 카드 팝업 생성
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
  // 3. 元素
  // ========================================

  const dropBall = document.getElementById("lucky-drop-ball");
  const card = document.getElementById("lucky-card");

  const image = document.getElementById("lucky-image");
  const title = document.getElementById("lucky-title");
  const backTitle = document.getElementById("lucky-back-title");
  const message = document.getElementById("lucky-message");

  const guide = document.getElementById("lucky-guide");
  const reveal = document.getElementById("lucky-reveal");
  const again = document.getElementById("lucky-again");
  const close = document.getElementById("lucky-close");

  // ========================================
  // 4. 随机选择插画
  // ========================================

  function randomCard() {
    return luckyCards[
      Math.floor(Math.random() * luckyCards.length)
    ];
  }

  // ========================================
  // 5. 避免和原来的记忆弹窗重叠
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
  // 6. 隐藏掉出的胶囊
  // ========================================

  function hideDrop() {
    clearTimeout(timer);

    drop.hidden = true;
    drop.classList.remove("is-dropping");
  }

  // ========================================
  // 7. 从扭蛋机出口掉出胶囊
  // ========================================

  function drawCard() {
    if (drawing || !overlay.hidden) return;
    if (otherInteractionOpen()) return;

    drawing = true;
    hideDrop();

    currentCard = randomCard();

    // 等待原来手柄旋转动画
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

      drop.hidden = false;

      drop.classList.remove("is-dropping");
      void drop.offsetWidth;
      drop.classList.add("is-dropping");

      drawing = false;

    }, 800);
  }

  // ========================================
  // 8. 打开插画卡片
  // ========================================

  function openCard() {
    if (!currentCard) return;

    hideDrop();

    previousFocus = document.activeElement;

    card.classList.remove("is-flipped");

    image.src = currentCard.image;
    image.alt = currentCard.title;

    title.textContent = currentCard.title;
    backTitle.textContent = currentCard.title;
    message.textContent = currentCard.message;

    guide.textContent = "어떤 행운이 숨어 있을까요?";
    reveal.textContent = "행운 확인하기 ✦";

    overlay.hidden = false;
    document.body.classList.add("lucky-open");

    overlay.querySelector(".lucky-dialog").focus();
  }

  // ========================================
  // 9. 翻转卡片
  // ========================================

  function flipCard() {
    const flipped = card.classList.toggle("is-flipped");

    if (flipped) {
      guide.textContent = "오늘의 행운을 확인했어요!";
      reveal.textContent = "그림 다시 보기";
    } else {
      guide.textContent = "어떤 행운이 숨어 있을까요?";
      reveal.textContent = "행운 확인하기 ✦";
    }
  }

  // ========================================
  // 10. 关闭卡片
  // ========================================

  function closeCard() {
    overlay.hidden = true;
    document.body.classList.remove("lucky-open");

    if (previousFocus && previousFocus.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  // ========================================
  // 11. 再次抽取
  // ========================================

  function drawAgain() {
    closeCard();
    drawCard();
  }

  // ========================================
  // 12. 点击事件
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

})();
