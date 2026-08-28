/* Keep private contact data in one place. Replace the empty value locally before use. */
const CONFIG = {
  contactPhone: "",
  contactWhatsAppPhone: "",
  whatsappText: "Hi Alex, ich brauche gerade Hilfe mit dem Tesla."
};

const app = document.querySelector("#app");
const backButton = document.querySelector("#backButton");
const alexDialog = document.querySelector("#alexDialog");
const history = [];

const pages = {
  start: {
    eyebrow: "Eine Frage. Eine Handlung.",
    title: "Was möchtest du gerade machen?",
    intro: "Hier findest du schnell den nächsten Schritt.",
    choices: [
      ["🚗", "Ich fahre los", "Einsteigen und sicher starten.", "drive"],
      ["⚡", "Ich möchte laden", "Tesla Supercharger oder andere Ladesäule.", "charge"],
      ["🏖️", "Ich fahre in den Urlaub", "Das Tesla-Navi plant die Strecke.", "holiday"],
      ["🆘", "Ich weiß nicht weiter", "Eine kurze Antwort für deine Situation.", "stuck"],
      ["📱", "Welche App brauche ich?", "Die richtige App für deine Aufgabe.", "apps"]
    ]
  },
  drive: {
    eyebrow: "Ich fahre los",
    title: "In vier einfachen Schritten",
    steps: ["Einsteigen.", "Bremse drücken.", "Gang auswählen.", "Losfahren."],
    note: "Bei einer längeren Strecke: Ziel ins Tesla-Navi eingeben. Der Tesla kann die Route und Ladeplanung übernehmen, soweit deine Fahrzeug- und Softwareversion dies unterstützt."
  },
  charge: {
    eyebrow: "Ich möchte laden",
    title: "Welche Ladesäule möchtest du nutzen?",
    choices: [["🔴", "Tesla Supercharger", "Einfach mit dem Tesla-Navi hinfahren.", "supercharger", "red"], ["🔵", "Andere Ladesäule", "Zum Beispiel ADAC e-Charge / Aral pulse oder EWE Go.", "other-charge", "blue"]]
  },
  supercharger: { eyebrow: "Tesla Supercharger", title: "So lädst du", steps: ["Zum vorgeschlagenen Supercharger fahren.", "Parken.", "Ladekabel nehmen und einstecken.", "Laden lassen.", "Kabel abziehen und weiterfahren."] },
  "other-charge": { eyebrow: "Andere Ladesäule", title: "Du kannst auch öffentlich laden", intro: "Nicht jede Karte funktioniert an jeder Säule. Prüfe vor dem Start die App oder die Angaben an der Säule.", choices: [["💳", "ADAC e-Charge / Aral pulse", "App und physische Ladekarte.", "adac", "blue"], ["💳", "EWE Go", "App und physische Ladekarte.", "ewe", "green"], ["🗺️", "Ladestation suchen", "Chargemap zeigt dir Ladestationen.", "chargemap"]] },
  holiday: { eyebrow: "Ich fahre in den Urlaub", title: "Lass den Tesla planen", steps: ["Ziel ins Tesla-Navi eingeben.", "Tesla-Route berechnen lassen.", "Ladestopps prüfen.", "Falls verfügbar: erwarteten Akku bei Ankunft prüfen.", "Zum Ladestopp fahren, laden und weiterfahren."], note: "Nicht selbst ausrechnen, wann du laden musst. Eine Ankunftsreserve von 20 % ist nur eine einfache Orientierung, wenn dein Tesla diese Einstellung anbietet." },
  apps: { eyebrow: "Welche App brauche ich?", title: "Nimm die App für deine Aufgabe", appCards: [["🚗 Tesla", "Navigation und Ladeplanung"], ["🗺️ Chargemap", "Ladestationen finden"], ["💶 Chargeprice", "Preise vergleichen"], ["💳 ADAC e-Charge / Aral pulse", "Mit deiner ADAC-Ladekarte laden"], ["💳 EWE Go", "Mit deiner EWE-Go-Karte laden"]], note: "Einfach losfahren: Tesla. Ladestation suchen: Chargemap. Preise vergleichen: Chargeprice. Mit deiner Karte laden: ADAC e-Charge / Aral pulse oder EWE Go." },
  stuck: { eyebrow: "Ich weiß nicht weiter", title: "Was ist gerade los?", choices: [["🔋", "Akku wird knapp", "Ladeplanung nicht selbst ausrechnen.", "low-battery"], ["⚡", "Ladesäule funktioniert nicht", "Prüfe Kabel, App und Hinweise an der Säule.", "failed-charge"], ["🗺️", "Ich weiß nicht, wo ich laden soll", "Suche mit Chargemap oder dem Tesla-Navi.", "find-charge"], ["💶", "Ich möchte günstig laden", "Vergleiche aktuelle Preise mit Chargeprice.", "cheap-charge"], ["❓", "Ich verstehe eine Anzeige nicht", "Mach ein Foto und frag Alex.", "screen-help"]] },
  "low-battery": { eyebrow: "Akku wird knapp", title: "Jetzt ruhig bleiben", steps: ["Ziel oder einen Tesla Supercharger ins Tesla-Navi eingeben.", "Den vorgeschlagenen Ladestopp prüfen.", "Wenn du unsicher bist: Alex fragen."] },
  "failed-charge": { eyebrow: "Ladesäule funktioniert nicht", title: "Probier diese Reihenfolge", steps: ["Kabel abziehen und noch einmal einstecken.", "Die passende App oder Ladekarte prüfen.", "Wenn es weiter nicht klappt: eine andere Säule wählen und Alex fragen."] },
  "find-charge": { eyebrow: "Ladestation suchen", title: "Nimm Chargemap", intro: "Chargemap hilft dir, Ladestationen in der Nähe oder auf deiner Strecke zu finden.", next: ["Chargemap öffnen", "https://chargemap.com"] },
  "cheap-charge": { eyebrow: "Günstig laden", title: "Nimm Chargeprice", intro: "Chargeprice vergleicht aktuelle Ladepreise. Preise können sich ändern.", next: ["Chargeprice öffnen", "https://chargeprice.app"] },
  "screen-help": { eyebrow: "Anzeige unklar", title: "Du musst das nicht allein herausfinden", intro: "Mach ein Foto von der Anzeige und frag Alex. Er kann dir sagen, was du als Nächstes tun sollst." },
  adac: { eyebrow: "ADAC e-Charge / Aral pulse", title: "Mit deiner Karte laden", steps: ["Ladestation prüfen.", "ADAC-e-Charge-App oder physische Karte bereithalten.", "Den Anweisungen an der Säule folgen.", "Wenn die Karte nicht akzeptiert wird: App-Hinweis prüfen oder andere Säule wählen."] },
  ewe: { eyebrow: "EWE Go", title: "Mit EWE Go laden", steps: ["Ladestation prüfen.", "EWE-Go-App oder physische Karte bereithalten.", "Den Anweisungen an der Säule folgen.", "Wenn die Karte nicht akzeptiert wird: App-Hinweis prüfen oder andere Säule wählen."] },
  chargemap: { eyebrow: "Chargemap", title: "Ladestation finden", intro: "Suche dort eine passende Ladestation. Für die eigentliche Fahrt und Ladeplanung kannst du danach das Tesla-Navi nutzen.", next: ["Chargemap öffnen", "https://chargemap.com"] },
};

function render(id) {
  const page = pages[id] || pages.start;
  backButton.style.visibility = id === "start" ? "hidden" : "visible";
  let html = `<section class="hero"><p class="eyebrow">${page.eyebrow || ""}</p><h1>${page.title}</h1>${page.intro ? `<p>${page.intro}</p>` : ""}</section>`;
  if (page.choices) html += `<div class="grid">${page.choices.map(([icon, title, sub, target, color = ""]) => `<button class="choice ${color}" data-go="${target}"><span>${icon}</span> ${title}<small>${sub}</small></button>`).join("")}</div>`;
  if (page.steps) html += `<div class="steps">${page.steps.map((step, i) => `<div class="step"><span class="number">${i + 1}</span><strong>${step}</strong></div>`).join("")}</div>`;
  if (page.appCards) html += `<div class="grid">${page.appCards.map(([title, sub]) => `<div class="app-card"><strong>${title}</strong><small>${sub}</small></div>`).join("")}</div>`;
  if (page.note) html += `<div class="notice">${page.note}</div>`;
  if (page.next) html += `<div class="next"><a class="action-button primary" href="${page.next[1]}" target="_blank" rel="noopener">${page.next[0]} ↗</a></div>`;
  app.innerHTML = html;
  app.focus();
  app.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));
}

function navigate(id) { history.push(location.hash.slice(1) || "start"); location.hash = id; render(id); }
function goBack() { const previous = history.pop() || "start"; location.hash = previous; render(previous); }

document.querySelector("#alexButton").addEventListener("click", () => alexDialog.showModal());
backButton.addEventListener("click", goBack);
document.querySelectorAll(".quick-actions button").forEach(button => button.addEventListener("click", () => {
  CONFIG.whatsappText = button.dataset.message;
  updateContactLinks();
}));
function updateContactLinks() {
  const phone = CONFIG.contactPhone.replace(/\D/g, "");
  const whatsappPhone = CONFIG.contactWhatsAppPhone.replace(/\D/g, "");
  document.querySelector("#callLink").href = phone ? `tel:+${phone}` : "#";
  document.querySelector("#whatsappLink").href = whatsappPhone ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(CONFIG.whatsappText)}` : "#";
}
window.addEventListener("hashchange", () => render(location.hash.slice(1) || "start"));
updateContactLinks();
render(location.hash.slice(1) || "start");
