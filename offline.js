const offlineStatus = document.querySelector("#offlineStatus");
const offlineUpdate = document.querySelector("#offlineUpdate");
let offlineRegistration;
let offlineError = "";
let updateRequested = false;

function showOfflineStatus() {
  const ready = Boolean(offlineRegistration?.active && navigator.serviceWorker.controller);
  const waiting = Boolean(offlineRegistration?.waiting);
  offlineUpdate.hidden = !waiting;
  offlineStatus.classList.toggle("is-error", Boolean(offlineError));
  if (offlineError) {
    offlineStatus.textContent = offlineError;
  } else if (waiting) {
    offlineStatus.textContent = "Eine neue Version ist bereit. Du kannst sie jetzt laden.";
  } else if (ready) {
    offlineStatus.textContent = navigator.onLine
      ? "Hilfe offline bereit. Anbieter-Seiten und WhatsApp brauchen Internet."
      : "Du bist offline. Die Hilfe bleibt verfügbar; Anbieter-Seiten und WhatsApp brauchen Internet.";
  } else {
    offlineStatus.textContent = "Offline-Hilfe wird vorbereitet. Bitte kurz online geöffnet lassen …";
  }
}

function watchInstallation(worker) {
  worker.addEventListener("statechange", () => {
    if (worker.state === "redundant") {
      offlineError = offlineRegistration.active
        ? "Die Aktualisierung ist fehlgeschlagen. Die bisherige Offline-Hilfe bleibt verfügbar. Bitte später online neu öffnen."
        : "Offline-Speicherung fehlgeschlagen. Bitte mit Internetverbindung neu öffnen.";
      console.warn("Tesla-Hilfe: Service-Worker-Installation fehlgeschlagen.");
    }
    showOfflineStatus();
  });
}

async function prepareOffline() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    offlineError = "Dieser Browser kann die Hilfe hier nicht offline speichern. Öffne die HTTPS-Adresse in Safari oder einem aktuellen Browser.";
    showOfflineStatus();
    return;
  }
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (updateRequested) {
      location.reload();
      return;
    }
    showOfflineStatus();
  });
  try {
    offlineRegistration = await navigator.serviceWorker.register("sw.js", { updateViaCache: "none" });
    offlineRegistration.addEventListener("updatefound", () => {
      if (offlineRegistration.installing) watchInstallation(offlineRegistration.installing);
    });
    if (offlineRegistration.installing) watchInstallation(offlineRegistration.installing);
    showOfflineStatus();
  } catch (error) {
    console.warn("Tesla-Hilfe: Offline-Speicherung nicht verfügbar.", error);
    offlineError = "Die Offline-Hilfe konnte nicht vorbereitet werden. Bitte später mit Internetverbindung neu öffnen.";
    showOfflineStatus();
  }
}

offlineUpdate.addEventListener("click", () => {
  if (!offlineRegistration?.waiting) {
    offlineError = "Diese Aktualisierung ist nicht mehr verfügbar. Bitte die Seite neu öffnen.";
    showOfflineStatus();
    return;
  }
  updateRequested = true;
  offlineUpdate.disabled = true;
  offlineUpdate.textContent = "Neue Version wird geladen …";
  offlineRegistration.waiting.postMessage({ type: "ACTIVATE_UPDATE" });
});

window.addEventListener("online", showOfflineStatus);
window.addEventListener("offline", showOfflineStatus);
prepareOffline();
