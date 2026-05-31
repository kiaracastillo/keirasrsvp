//  Google Apps Script Web App
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyt-8hzYaZUbQRpiSeh46e2qysMlu5BzziaiK6PWiAqnlNlhrEn0c-zvcJr4fCF0D3_/exec";


// Elements
const intro = document.getElementById("intro");
const inviteScreen = document.getElementById("inviteScreen");
const closedCard = document.getElementById("closedCard");
const tapHint = document.getElementById("tapHint");

const invitationCard = document.getElementById("invitationCard");
const openRsvp = document.getElementById("openRsvp");

const overlay = document.getElementById("overlay");
const closeModal = document.getElementById("closeModal");

const rsvpForm = document.getElementById("rsvpForm");
const familyField = document.getElementById("familyField");
const familyName = document.getElementById("familyName");

const submitBtn = document.getElementById("submitBtn");
const errorText = document.getElementById("errorText");
const toast = document.getElementById("toast");

let opened = false;

// Después de 3 segundos aparece el Tap
setTimeout(() => {
  if (!opened) {
    tapHint.classList.add("show");
  }
}, 1000);

// Abrir invitación
function openInvitation() {
  if (opened) return;

  opened = true;

  tapHint.classList.remove("show");
  closedCard.classList.add("opening");

  setTimeout(() => {
    intro.classList.add("hidden");
    inviteScreen.classList.remove("hidden");
  }, 900);
}

closedCard.addEventListener("click", openInvitation);

closedCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    openInvitation();
  }
});

// Abrir modal RSVP
function openModal() {
  overlay.classList.remove("hidden");
  invitationCard.classList.add("dimmed");
}

// Cerrar modal RSVP
function closeRsvpModal() {
  overlay.classList.add("hidden");
  invitationCard.classList.remove("dimmed");
  errorText.textContent = "";
}

openRsvp.addEventListener("click", openModal);
closeModal.addEventListener("click", closeRsvpModal);

// Cerrar al tocar fuera del formulario
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeRsvpModal();
  }
});

// Ya no escondemos el campo del nombre.
// Ahora el nombre es obligatorio para Sí y para No.
rsvpForm.addEventListener("change", () => {
  errorText.textContent = "";
});

// Mostrar mensaje pop up
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3900);
}

// Enviar datos a Google Sheets
async function sendToGoogleSheet(payload) {
  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: new URLSearchParams(payload)
  });
}

// Submit form
rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(rsvpForm);
  const attending = data.get("attending");
  const family = familyName.value.trim();

  if (!attending) {
    errorText.textContent = "Selecciona si asistirás o no.";
    return;
  }

  if (!family) {
    errorText.textContent = "Escribe tu nombre o family name, por favor.";
    familyName.focus();
    return;
  }

  if (GOOGLE_SCRIPT_URL.includes("TU_URL_DE_GOOGLE_SCRIPT_AQUI")) {
    errorText.textContent =
      "Falta pegar la URL de Google Apps Script en script.js.";
    return;
  }

  const payload = {
    eventName: "Keira Castillo Party",
    attending: attending,
    familyName: family,
    guestName: family,
    sentAt: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  errorText.textContent = "";

  try {
    await sendToGoogleSheet(payload);

    closeRsvpModal();
    rsvpForm.reset();

    if (attending === "Sí") {
      showToast(`¡Gracias, ${family}! Nos vemos en la fiesta ✨`);
    } else {
      showToast(`Gracias por avisarnos, ${family} 💙`);
    }
  } catch (error) {
    errorText.textContent = "No se pudo enviar. Intenta otra vez.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar";
  }
});