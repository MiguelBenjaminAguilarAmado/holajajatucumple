// Configuración de los 12 cables
const CABLES_DATA = [
  { id: 1,  color: "#ef4444", name: "Rojo",     isTarget: false },
  { id: 2,  color: "#3b82f6", name: "Azul",     isTarget: false },
  { id: 3,  color: "#ef4444", name: "Rojo",     isTarget: true  }, // OBJETIVO 1
  { id: 4,  color: "#eab308", name: "Amarillo", isTarget: false },
  { id: 5,  color: "#f97316", name: "Naranja",  isTarget: true  }, // OBJETIVO 2
  { id: 6,  color: "#ef4444", name: "Rojo",     isTarget: false },
  { id: 7,  color: "#22c55e", name: "Verde",    isTarget: false },
  { id: 8,  color: "#3b82f6", name: "Azul",     isTarget: false },
  { id: 9,  color: "#f8fafc", name: "Blanco",   isTarget: false },
  { id: 10, color: "#94a3b8", name: "Gris",     isTarget: false },
  { id: 11, color: "#b45309", name: "Marrón",   isTarget: false },
  { id: 12, color: "#18181b", name: "Negro",    isTarget: true  }  // OBJETIVO 3
];

// Fechas válidas para el acertijo final
const VALID_DATES = [
  "28/09/10", "28-09-10", "28.09.10", "28/9/10", "28-9-10", "28/09/2010", "28-09-2010", "280910",
  "16/08/26", "16-08-26", "16.08.26", "16/8/26", "16-8-26", "16/08/2026", "16-08-2026", "160826"
];

// Referencias del DOM - Pantallas
const stepBirthday = document.getElementById("step-birthday");
const stepDenied = document.getElementById("step-denied");
const stepIdentity = document.getElementById("step-identity");
const stepVideoMariano = document.getElementById("step-video-mariano");
const stepCode = document.getElementById("step-code");
const stepVideo = document.getElementById("step-video");
const stepPuzzleCamera = document.getElementById("step-puzzle-camera");
const stepVideoPhase2 = document.getElementById("step-video-phase2");
const stepPuzzleCables = document.getElementById("step-puzzle-cables");
const stepVideoPhase3 = document.getElementById("step-video-phase3");
const stepPuzzleFinal = document.getElementById("step-puzzle-final");
const stepVictory = document.getElementById("step-victory");

// Botones iniciales
const btnBirthdayYes = document.getElementById("btn-birthday-yes");
const btnBirthdayNo = document.getElementById("btn-birthday-no");
const btnRetryBirthday = document.getElementById("btn-retry-birthday");
const choiceButtons = document.querySelectorAll(".btn-choice");
const btnBackToIdentity = document.getElementById("btn-back-to-identity");

// Mariano
const videoMariano = document.getElementById("video-mariano");
const imgMariano = document.getElementById("img-mariano");
const placeholderMariano = document.getElementById("placeholder-mariano");
const placeholderTextMariano = document.getElementById("placeholder-text-mariano");
const btnResetMariano = document.getElementById("btn-reset-mariano");

// Código Paula
const codeForm = document.getElementById("code-form");
const codeInput = document.getElementById("code-input");
const errorMessage = document.getElementById("error-message");

// Paula Fase 1
const videoPaula1 = document.getElementById("video-paula-1");
const imgPaula1 = document.getElementById("img-paula-1");
const mediaPlaceholder1 = document.getElementById("media-placeholder-1");
const placeholderText1 = document.getElementById("placeholder-text-1");
const btnGoToPuzzle = document.getElementById("btn-go-to-puzzle");

// Acertijo 01: Cámara
const cameraStage = document.querySelector(".camera-stage");
const cameraLed = document.getElementById("camera-led");
const puzzleFeedback = document.getElementById("puzzle-feedback");
const slot1 = document.getElementById("slot-1");
const slot2 = document.getElementById("slot-2");
const batteryItems = document.querySelectorAll(".battery-item");
const batteriesTray = document.getElementById("batteries-tray");

// Paula Fase 2
const videoPaula2 = document.getElementById("video-paula-2");
const imgPaula2 = document.getElementById("img-paula-2");
const mediaPlaceholder2 = document.getElementById("media-placeholder-2");
const placeholderText2 = document.getElementById("placeholder-text-2");
const btnGoToCables = document.getElementById("btn-go-to-cables");

// Acertijo 02: 12 Cables
const cablesBox = document.getElementById("cables-box");
const wiresContainer = document.getElementById("wires-container");
const cablesStatusLed = document.getElementById("cables-status-led");
const cablesFeedback = document.getElementById("cables-feedback");

// Paula Fase 3
const videoPaula3 = document.getElementById("video-paula-3");
const imgPaula3 = document.getElementById("img-paula-3");
const mediaPlaceholder3 = document.getElementById("media-placeholder-3");
const placeholderText3 = document.getElementById("placeholder-text-3");
const btnGoToFinal = document.getElementById("btn-go-to-final");

// Acertijo Final
const btnHintFinal = document.getElementById("btn-hint-final");
const finalHintText = document.getElementById("final-hint-text");
const finalDateForm = document.getElementById("final-date-form");
const finalDateInput = document.getElementById("final-date-input");
const dateErrorMessage = document.getElementById("date-error-message");
const btnResetAll = document.getElementById("btn-reset-all");

// IDs de YouTube Shorts de Paula
const YT_IDS = {
  paula1: "gSPl7uxFFO0",
  paula2: "4aVduf9paWc",
  paula3: "cCh3aiJvj24"
};

// Referencias a iframes de YouTube
const ytPaula1 = document.getElementById("yt-paula-1");
const ytPaula2 = document.getElementById("yt-paula-2");
const ytPaula3 = document.getElementById("yt-paula-3");

// Badge y texto dinámico del step-code
const codeUserBadge = document.getElementById("code-user-badge");
const codeQuestionText = document.getElementById("code-question-text");

// Estado
let currentUser = null; // "Mariano" | "Paula"
let filledSlots = { "slot-1": null, "slot-2": null };
let cutTargetCables = new Set();
let isCablesActive = false;

// ==========================================
// Función Universal de Carga de Vídeo con Audio
// ==========================================
function loadAndPlayMedia(videoEl, imgEl, placeholderEl, placeholderTextEl, baseName) {
  // Pausar todos los vídeos activos
  pauseAllVideos();

  placeholderEl.classList.add("hidden");
  imgEl.classList.add("hidden");
  videoEl.classList.remove("hidden");

  let formatAttempt = 0;
  const formats = [
    { ext: "mp4", type: "video/mp4" },
    { ext: "webm", type: "video/webm" },
    { ext: "webp", type: "image/webp" }
  ];

  function tryNext() {
    if (formatAttempt >= formats.length) {
      // Ningún formato disponible
      videoEl.classList.add("hidden");
      imgEl.classList.add("hidden");
      placeholderTextEl.innerHTML = `No se encontró el vídeo <code>${baseName}</code>.`;
      placeholderEl.classList.remove("hidden");
      return;
    }

    const current = formats[formatAttempt];
    const path = `assets/${baseName}.${current.ext}`;
    formatAttempt++;

    if (current.ext === "webp") {
      // Probar como imagen WebP (nota: no tiene audio)
      videoEl.classList.add("hidden");
      imgEl.classList.remove("hidden");
      
      const testImg = new Image();
      testImg.onload = () => {
        imgEl.src = path;
        placeholderEl.classList.add("hidden");
      };
      testImg.onerror = () => {
        tryNext();
      };
      testImg.src = path;
    } else {
      // Probar como archivo de vídeo con audio (.mp4 o .webm)
      videoEl.onerror = () => {
        videoEl.onerror = null;
        tryNext();
      };

      videoEl.oncanplay = () => {
        videoEl.oncanplay = null;
        videoEl.onerror = null;
        placeholderEl.classList.add("hidden");
        // Intentar reproducir con audio
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.log("Autoplay bloqueado: el usuario puede reproducir manualmente usando los controles.");
          });
        }
      };

      videoEl.src = path;
      videoEl.load();
    }
  }

  tryNext();
}

// ==========================================
// Función de Carga de Vídeos de YouTube (Shorts de Paula)
// ==========================================
function loadYouTubeVideo(iframeEl, videoId) {
  // Pausar cualquier otro vídeo (local o de YouTube) antes de cargar
  pauseAllVideos();

  if (!iframeEl || !videoId) return;

  // enablejsapi=1 permite detener el vídeo por API al salir de la pantalla
  // autoplay=1 + playsinline=1 para que se reproduzca solo también en móvil
  // rel=0 evita sugerencias de otros vídeos al finalizar
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&enablejsapi=1`;
  iframeEl.src = src;
}

function stopYouTubeVideo(iframeEl) {
  if (!iframeEl) return;
  // Quitar el src detiene por completo la reproducción y el audio
  if (iframeEl.src) {
    iframeEl.src = "";
  }
}

function pauseAllVideos() {
  const allVideos = [videoMariano];
  allVideos.forEach(v => {
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  });

  // Detener los Shorts de YouTube de Paula (quitando el src se corta audio/vídeo)
  const allYouTube = [ytPaula1, ytPaula2, ytPaula3];
  allYouTube.forEach(iframe => stopYouTubeVideo(iframe));
}

// ==========================================
// Control de Pantallas
// ==========================================
function showStep(stepElement) {
  const steps = [
    stepBirthday, 
    stepDenied, 
    stepIdentity, 
    stepVideoMariano,
    stepCode, 
    stepVideo, 
    stepPuzzleCamera, 
    stepVideoPhase2,
    stepPuzzleCables,
    stepVideoPhase3,
    stepPuzzleFinal,
    stepVictory
  ];
  steps.forEach(step => {
    if (step === stepElement) {
      step.classList.remove("hidden");
      step.classList.add("active");
    } else {
      step.classList.add("hidden");
      step.classList.remove("active");
    }
  });
}

// 1. Paso Cumpleaños
btnBirthdayYes.addEventListener("click", () => {
  showStep(stepIdentity);
});

btnBirthdayNo.addEventListener("click", () => {
  window.close();
  showStep(stepDenied);
});

btnRetryBirthday.addEventListener("click", () => {
  showStep(stepBirthday);
});

// 2. Selección de Nombre (Mariano o Paula)
choiceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const user = btn.getAttribute("data-user");
    if (user === "Mariano") {
      startMarianoExperience();
    } else if (user === "Paula") {
      startPaulaExperience();
    }
  });
});

// ==========================================
// EXPERIENCIA DE MARIANO
// ==========================================
function startMarianoExperience() {
  currentUser = "Mariano";
  document.body.classList.remove("theme-red");

  // Configurar el step-code para Mariano
  codeUserBadge.textContent = "Mariano";
  codeUserBadge.style.cssText = ""; // colores por defecto (ámbar)
  codeQuestionText.textContent = "¿Cuál es el código?";
  codeInput.value = "";
  errorMessage.classList.add("hidden");
  showStep(stepCode);

  setTimeout(() => {
    codeInput.focus();
  }, 150);
}

btnResetMariano.addEventListener("click", resetToStart);

// ==========================================
// EXPERIENCIA DE PAULA
// ==========================================
function startPaulaExperience() {
  currentUser = "Paula";
  document.body.classList.add("theme-red");

  // Configurar el step-code para Paula
  codeUserBadge.textContent = "Paula";
  codeUserBadge.style.cssText = "";
  codeQuestionText.textContent = "Vale si y te creo yo, ¿Cuál es el código?";
  codeInput.value = "";
  errorMessage.classList.add("hidden");
  showStep(stepCode);

  setTimeout(() => {
    codeInput.focus();
  }, 150);
}

btnBackToIdentity.addEventListener("click", () => {
  document.body.classList.remove("theme-red");
  pauseAllVideos();
  codeInput.value = "";
  errorMessage.classList.add("hidden");
  showStep(stepIdentity);
});

// Verificación de Código (Mariano: 8301, Paula: 3192)
codeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredCode = codeInput.value.trim();
  const correctCode = currentUser === "Mariano" ? "8301" : "3192";

  if (enteredCode === correctCode) {
    errorMessage.classList.add("hidden");
    if (currentUser === "Mariano") {
      showStep(stepVideoMariano);
      loadAndPlayMedia(videoMariano, imgMariano, placeholderMariano, placeholderTextMariano, "videom");
    } else {
      unlockPaulaPhase1();
    }
  } else {
    errorMessage.textContent = "Código incorrecto. Vuelve a intentarlo.";
    errorMessage.classList.remove("hidden");

    const inputWrapper = codeForm.querySelector(".input-wrapper");
    inputWrapper.classList.remove("shake");
    void inputWrapper.offsetWidth;
    inputWrapper.classList.add("shake");

    if (navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }

    codeInput.select();
  }
});

// Fase 1: videop1 (YouTube Short)
function unlockPaulaPhase1() {
  showStep(stepVideo);
  loadYouTubeVideo(ytPaula1, YT_IDS.paula1);
}

btnGoToPuzzle.addEventListener("click", () => {
  pauseAllVideos();
  resetCameraPuzzle();
  showStep(stepPuzzleCamera);
});

// ==========================================
// ACERTIJO 01: CÁMARA Y BATERÍAS
// ==========================================
function resetCameraPuzzle() {
  filledSlots = { "slot-1": null, "slot-2": null };
  slot1.classList.remove("slot-filled", "slot-hover");
  slot2.classList.remove("slot-filled", "slot-hover");
  slot1.innerHTML = '<span class="slot-pole slot-plus">+</span><div class="slot-inner-target"></div><span class="slot-pole slot-minus">−</span>';
  slot2.innerHTML = '<span class="slot-pole slot-plus">+</span><div class="slot-inner-target"></div><span class="slot-pole slot-minus">−</span>';

  cameraLed.className = "cam-led led-off";
  puzzleFeedback.className = "puzzle-feedback";
  puzzleFeedback.textContent = "Arrastra las baterías correctas a las ranuras.";

  batteryItems.forEach(item => {
    item.classList.remove("snapped", "dragging", "battery-rebound");
    item.style.transform = "";
    item.style.zIndex = "";
    batteriesTray.appendChild(item);
  });
}

batteryItems.forEach(battery => {
  setupBatteryDrag(battery);
});

function setupBatteryDrag(battery) {
  let isDragging = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let currentDx = 0;
  let currentDy = 0;

  battery.addEventListener("pointerdown", (e) => {
    if (battery.classList.contains("snapped")) return;

    isDragging = true;
    startPointerX = e.clientX;
    startPointerY = e.clientY;
    currentDx = 0;
    currentDy = 0;

    battery.setPointerCapture(e.pointerId);
    battery.classList.add("dragging");
    battery.classList.remove("battery-rebound");
    battery.style.zIndex = "1000";

    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  });

  battery.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    currentDx = e.clientX - startPointerX;
    currentDy = e.clientY - startPointerY;

    battery.style.transform = `translate3d(${currentDx}px, ${currentDy}px, 0) scale(1.12)`;
    highlightDropSlotUnderPointer(e.clientX, e.clientY);
  });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    battery.classList.remove("dragging");
    battery.style.zIndex = "";

    try {
      battery.releasePointerCapture(e.pointerId);
    } catch (_) {}

    clearSlotHighlights();

    const targetSlot = getSlotUnderPointer(e.clientX, e.clientY);

    if (targetSlot) {
      handleDropOnSlot(battery, targetSlot);
    } else {
      battery.style.transition = "transform 0.25s ease-out";
      battery.style.transform = "translate3d(0, 0, 0)";
      setTimeout(() => {
        battery.style.transition = "";
        battery.style.transform = "";
      }, 250);
    }
  };

  battery.addEventListener("pointerup", endDrag);
  battery.addEventListener("pointercancel", endDrag);
}

function getSlotUnderPointer(x, y) {
  const slots = [slot1, slot2];
  for (const slot of slots) {
    const rect = slot.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return slot;
    }
  }
  return null;
}

function highlightDropSlotUnderPointer(x, y) {
  const slots = [slot1, slot2];
  slots.forEach(slot => {
    const slotId = slot.getAttribute("data-slot");
    const isOccupied = filledSlots[`slot-${slotId}`] !== null;
    const rect = slot.getBoundingClientRect();
    const isInside = (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);

    if (isInside && !isOccupied) {
      slot.classList.add("slot-hover");
    } else {
      slot.classList.remove("slot-hover");
    }
  });
}

function clearSlotHighlights() {
  slot1.classList.remove("slot-hover");
  slot2.classList.remove("slot-hover");
}

function handleDropOnSlot(battery, slot) {
  const slotKey = `slot-${slot.getAttribute("data-slot")}`;

  if (filledSlots[slotKey] !== null) {
    triggerRebound(battery, "Esa ranura ya está ocupada.");
    return;
  }

  const type = battery.getAttribute("data-type");
  const orientation = battery.getAttribute("data-orientation");

  if (type === "incompatible") {
    triggerRebound(battery, "El tamaño de esta batería no encaja.");
    return;
  }

  if (orientation === "inverted") {
    triggerRebound(battery, "Revisa los polos (+ arriba, − abajo).");
    return;
  }

  snapBatteryIntoSlot(battery, slot, slotKey);
}

function triggerRebound(battery, feedbackText) {
  puzzleFeedback.className = "puzzle-feedback feedback-error";
  puzzleFeedback.textContent = feedbackText;

  if (navigator.vibrate) {
    navigator.vibrate([50, 40, 50]);
  }

  battery.style.transform = "translate3d(0, 0, 0)";
  battery.classList.remove("battery-rebound");
  void battery.offsetWidth;
  battery.classList.add("battery-rebound");

  setTimeout(() => {
    battery.classList.remove("battery-rebound");
  }, 500);
}

function snapBatteryIntoSlot(battery, slot, slotKey) {
  filledSlots[slotKey] = battery.id;
  slot.classList.add("slot-filled");
  battery.classList.add("snapped");
  battery.style.transform = "";

  slot.innerHTML = "";
  slot.appendChild(battery);

  puzzleFeedback.className = "puzzle-feedback feedback-success";
  puzzleFeedback.textContent = "¡Batería colocada!";

  if (navigator.vibrate) {
    navigator.vibrate(35);
  }

  if (filledSlots["slot-1"] && filledSlots["slot-2"]) {
    onPuzzle01Completed();
  }
}

function onPuzzle01Completed() {
  puzzleFeedback.className = "puzzle-feedback feedback-success";
  puzzleFeedback.textContent = "¡Cámara encendiéndose!";

  cameraLed.className = "cam-led led-blink";

  if (navigator.vibrate) {
    navigator.vibrate([80, 50, 80, 50, 150]);
  }

  setTimeout(() => {
    cameraLed.className = "cam-led led-on";
    cameraStage.classList.add("camera-flash-effect");
  }, 900);

  setTimeout(() => {
    cameraStage.classList.remove("camera-flash-effect");
    unlockPaulaPhase2();
  }, 1600);
}

// Fase 2: videop2 (YouTube Short)
function unlockPaulaPhase2() {
  showStep(stepVideoPhase2);
  loadYouTubeVideo(ytPaula2, YT_IDS.paula2);
}

btnGoToCables.addEventListener("click", () => {
  pauseAllVideos();
  initCablesPuzzle();
  showStep(stepPuzzleCables);
});

// ==========================================
// ACERTIJO 02: LOS 12 CABLES
// ==========================================
function initCablesPuzzle() {
  cutTargetCables.clear();
  isCablesActive = true;
  cablesFeedback.textContent = "";
  cablesFeedback.className = "cables-feedback";
  cablesBox.classList.remove("short-circuit");
  cablesStatusLed.className = "cables-status-led";

  renderCables();
}

function renderCables() {
  wiresContainer.innerHTML = "";

  CABLES_DATA.forEach((cable) => {
    const col = document.createElement("div");
    col.className = "wire-column";
    col.dataset.cableId = cable.id;

    const termTop = document.createElement("div");
    termTop.className = "wire-terminal-top";

    const strandTop = document.createElement("div");
    strandTop.className = "wire-strand wire-cut-top";
    strandTop.style.backgroundColor = cable.color;
    if (cable.color === "#f8fafc") strandTop.style.border = "1px solid #cbd5e1";

    const strandBottom = document.createElement("div");
    strandBottom.className = "wire-strand wire-cut-bottom";
    strandBottom.style.backgroundColor = cable.color;
    if (cable.color === "#f8fafc") strandBottom.style.border = "1px solid #cbd5e1";

    const termBottom = document.createElement("div");
    termBottom.className = "wire-terminal-bottom";

    col.appendChild(termTop);
    col.appendChild(strandTop);
    col.appendChild(strandBottom);
    col.appendChild(termBottom);

    col.addEventListener("click", () => {
      cutWire(cable, col);
    });

    wiresContainer.appendChild(col);
  });
}

function cutWire(cable, wireEl) {
  if (!isCablesActive || wireEl.classList.contains("is-cut")) return;

  wireEl.classList.add("is-cut");

  const spark = document.createElement("div");
  spark.className = "wire-spark";
  wireEl.appendChild(spark);
  setTimeout(() => spark.remove(), 400);

  if (cable.isTarget) {
    cutTargetCables.add(cable.id);

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    if (cutTargetCables.size === 3) {
      onCablesCompleted();
    }
  } else {
    // Fallo: Cortocircuito
    isCablesActive = false;
    cablesFeedback.className = "cables-feedback feedback-error";
    cablesFeedback.textContent = "⚡ ¡Cortocircuito! Reiniciando circuito...";

    cablesBox.classList.add("short-circuit");

    if (navigator.vibrate) {
      navigator.vibrate([100, 60, 100, 60, 200]);
    }

    setTimeout(() => {
      initCablesPuzzle();
    }, 900);
  }
}

function onCablesCompleted() {
  isCablesActive = false;
  cablesStatusLed.classList.add("led-defused");
  cablesFeedback.className = "cables-feedback feedback-success";
  cablesFeedback.textContent = "✓ Circuito desactivado con éxito.";

  if (navigator.vibrate) {
    navigator.vibrate([60, 40, 60, 40, 140]);
  }

  setTimeout(() => {
    unlockPaulaPhase3();
  }, 1300);
}

// Fase 3: videop3 (YouTube Short)
function unlockPaulaPhase3() {
  showStep(stepVideoPhase3);
  loadYouTubeVideo(ytPaula3, YT_IDS.paula3);
}

btnGoToFinal.addEventListener("click", () => {
  pauseAllVideos();
  resetFinalPuzzle();
  showStep(stepPuzzleFinal);
});

// ==========================================
// ACERTIJO FINAL (La Fecha Secreta)
// ==========================================
function resetFinalPuzzle() {
  finalDateInput.value = "";
  finalHintText.classList.add("hidden");
  dateErrorMessage.classList.add("hidden");
}

btnHintFinal.addEventListener("click", () => {
  finalHintText.classList.toggle("hidden");
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
});

finalDateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  verifyFinalDate();
});

function verifyFinalDate() {
  const rawInput = finalDateInput.value.trim().toLowerCase();
  const cleanInput = rawInput.replace(/\s+/g, "");

  const isMatch = VALID_DATES.some(validDate => {
    return cleanInput === validDate.toLowerCase();
  });

  if (isMatch) {
    dateErrorMessage.classList.add("hidden");

    if (navigator.vibrate) {
      navigator.vibrate([100, 60, 100, 60, 250]);
    }

    showStep(stepVictory);
  } else {
    dateErrorMessage.textContent = "Fecha incorrecta. Piénsalo bien...";
    dateErrorMessage.classList.remove("hidden");

    const inputWrapper = finalDateForm.querySelector(".input-wrapper");
    inputWrapper.classList.remove("shake");
    void inputWrapper.offsetWidth;
    inputWrapper.classList.add("shake");

    if (navigator.vibrate) {
      navigator.vibrate([50, 40, 50]);
    }

    finalDateInput.select();
  }
}

// ==========================================
// Reinicio General
// ==========================================
btnResetAll.addEventListener("click", resetToStart);

function resetToStart() {
  document.body.classList.remove("theme-red");
  pauseAllVideos();
  codeInput.value = "";
  finalDateInput.value = "";
  finalHintText.classList.add("hidden");
  resetCameraPuzzle();
  cutTargetCables.clear();
  showStep(stepBirthday);
}
