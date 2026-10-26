
/* ========================================
   GACHA MEMO - 메모 만들기
   직접 그린 기분 이미지 적용
======================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "gachaMemoCapsules";

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

  const selectedColorLabel =
    document.getElementById("selected-color-label");


  // 1. 기분 이미지
  const moodImages = {
    "행복해요": "mood-happy.png",
    "뿌듯해요": "mood-proud.png",
    "조금 슬퍼요": "mood-sad.png",
    "피곤해요": "mood-tired.png"
  };


  // 2. 기본 선택
  let selectedColor = "#F3A8C9";
  let selectedColorName = "분홍색";

  let selectedSticker = "♡";
  let selectedStickerName = "하트";

  let selectedMood = "행복해요";
  let selectedMoodEmoji = "😊";

  let isSaving = false;


  // 3. 오늘 날짜
  function localDateValue(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  // 4. 한국어 날짜 표시
  function formatKoreanDate(value) {
    if (!value) return "날짜를 선택해 주세요.";

    const parts = value.split("-").map(Number);

    if (
      parts.length !== 3 ||
      parts.some(Number.isNaN)
    ) {
      return "날짜를 선택해 주세요.";
    }

    return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
  }


  // 5. 안내 메시지
  function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("is-error", isError);
  }


  // 6. 기분 이미지 미리보기
  function updateMoodPreview() {
    const imagePath =
      moodImages[selectedMood] || "mood-happy.png";

    // 기존 이모지를 지우고 직접 그린 이미지를 표시
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
    moodText.textContent = selectedMood;

    previewMood.style.gap = "6px";

    previewMood.appendChild(moodImage);
    previewMood.appendChild(moodText);
  }


  // 7. 전체 미리보기 업데이트
  function updatePreview() {

    // 캡슐 색상
    mainCapsule.style.setProperty(
      "--preview-color",
      selectedColor
    );

    ticketCapsule.style.setProperty(
      "--preview-color",
      selectedColor
    );

    // 스티커
    mainSticker.textContent = selectedSticker;
    ticketSticker.textContent = selectedSticker;

    // 날짜
    previewDate.textContent =
      formatKoreanDate(dateInput.value);

    // 제목
    previewTitle.textContent =
      titleInput.value.trim() || "나의 작은 기억";

    // 직접 그린 기분 이미지
    updateMoodPreview();

    // 메모 내용
    previewContent.textContent =
      contentInput.value.trim() ||
      "오늘의 소중한 순간을 이곳에 기록해 보세요.";

    // 글자 수
    characterCount.textContent =
      `${contentInput.value.length} / 5000`;

    // 선택한 캡슐 색상 이름
    selectedColorLabel.textContent =
      `${selectedColorName} 캡슐을 선택했어요.`;
  }


  // 8. 캡슐 색상 선택
  document.querySelectorAll(".color-option").forEach((button) => {

    button.addEventListener("click", () => {

      selectedColor = button.dataset.color;
      selectedColorName = button.dataset.colorName;

      document.querySelectorAll(".color-option").forEach((item) => {

        const selected = item === button;

        item.classList.toggle("is-selected", selected);

        item.setAttribute(
          "aria-pressed",
          String(selected)
        );
      });

      updatePreview();
    });
  });


  // 9. 스티커 선택
  document.querySelectorAll(".sticker-option").forEach((button) => {

    button.addEventListener("click", () => {

      selectedSticker = button.dataset.sticker;
      selectedStickerName = button.dataset.stickerName;

      document.querySelectorAll(".sticker-option").forEach((item) => {

        const selected = item === button;

        item.classList.toggle("is-selected", selected);

        item.setAttribute(
          "aria-pressed",
          String(selected)
        );
      });

      updatePreview();
    });
  });


  // 10. 기분 선택
  document.querySelectorAll(".mood-option").forEach((button) => {

    button.addEventListener("click", () => {

      selectedMood = button.dataset.mood;

      selectedMoodEmoji = button.dataset.emoji;

      document.querySelectorAll(".mood-option").forEach((item) => {

        const selected = item === button;

        item.classList.toggle("is-selected", selected);

        item.setAttribute(
          "aria-pressed",
          String(selected)
        );
      });

      updatePreview();
    });
  });


  // 11. 입력 내용 실시간 반영
  [dateInput, titleInput, contentInput].forEach((input) => {

    input.addEventListener("input", updatePreview);

    input.addEventListener("change", updatePreview);
  });


  // 12. 저장된 캡슐 읽기
  function readSavedCapsules() {

    try {

      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) return [];

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.id
      );

    } catch (error) {

      showMessage(
        "저장된 기록을 읽지 못했어요. 브라우저 저장 공간을 확인해 주세요.",
        true
      );

      return null;
    }
  }


  // 13. 캡슐 저장
  form.addEventListener("submit", (event) => {

    event.preventDefault();

    if (isSaving) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // 날짜 확인
    if (!dateInput.value) {

      showMessage("날짜를 선택해 주세요.", true);

      dateInput.focus();

      return;
    }

    // 제목 확인
    if (!title) {

      showMessage(
        "기억을 나타내는 제목을 입력해 주세요.",
        true
      );

      titleInput.focus();

      return;
    }

    // 메모 내용 확인
    if (!content) {

      showMessage(
        "오늘의 메모 내용을 입력해 주세요.",
        true
      );

      contentInput.focus();

      return;
    }

    const savedCapsules = readSavedCapsules();

    if (savedCapsules === null) return;

    const now = new Date();

    // 새 캡슐 데이터
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

      // 직접 그린 이미지 파일명도 저장
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

      showMessage(
        "캡슐을 저장하지 못했어요. 브라우저 저장 공간 설정을 확인해 주세요.",
        true
      );

      completeButton.disabled = false;

      completeButton.removeAttribute("aria-busy");

      isSaving = false;
    }
  });


  // 14. 새 캡슐 만들기
  makeAnotherButton.addEventListener("click", () => {

    form.reset();

    selectedColor = "#F3A8C9";
    selectedColorName = "분홍색";

    selectedSticker = "♡";
    selectedStickerName = "하트";

    selectedMood = "행복해요";
    selectedMoodEmoji = "😊";


    // 색상 선택 초기화
    document.querySelectorAll(".color-option").forEach((item) => {

      const selected =
        item.dataset.color === selectedColor;

      item.classList.toggle("is-selected", selected);

      item.setAttribute(
        "aria-pressed",
        String(selected)
      );
    });


    // 스티커 선택 초기화
    document.querySelectorAll(".sticker-option").forEach((item) => {

      const selected =
        item.dataset.sticker === selectedSticker;

      item.classList.toggle("is-selected", selected);

      item.setAttribute(
        "aria-pressed",
        String(selected)
      );
    });


    // 기분 선택 초기화
    document.querySelectorAll(".mood-option").forEach((item) => {

      const selected =
        item.dataset.mood === selectedMood;

      item.classList.toggle("is-selected", selected);

      item.setAttribute(
        "aria-pressed",
        String(selected)
      );
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


  // 15. 페이지 초기화
  dateInput.value = localDateValue();

  updatePreview();

})();
