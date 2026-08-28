/*
  Darstellung und Navigation. Inhalte stehen in content.js,
  Kontaktdaten in config.js bzw. config.local.js.
*/
const app = document.querySelector("#app");
const backButton = document.querySelector("#backButton");
const alexDialog = document.querySelector("#alexDialog");
const alexButton = document.querySelector("#alexButton");
const callLink = document.querySelector("#callLink");
const whatsappLink = document.querySelector("#whatsappLink");
const contactFallback = document.querySelector("#contactFallback");
const quickActions = document.querySelector("#quickActions");

const START = "start";

/* Inhalte sind statisch, aber Escaping kostet nichts und schliesst
   eine ganze Fehlerklasse aus, falls spaeter Fremdtexte dazukommen. */
function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageId() {
  const id = decodeURIComponent(location.hash.slice(1));
  return Object.prototype.hasOwnProperty.call(PAGES, id) ? id : START;
}

function renderChoices(choices) {
  const items = choices.map(([icon, title, sub, target, color = ""]) =>
    `<button class="choice ${esc(color)}" type="button" data-go="${esc(target)}">
       <span aria-hidden="true">${esc(icon)}</span> ${esc(title)}
       <small>${esc(sub)}</small>
     </button>`).join("");
  return `<div class="grid">${items}</div>`;
}

function renderSteps(steps) {
  const items = steps.map((step, i) =>
    `<li class="step"><span class="number" aria-hidden="true">${i + 1}</span><strong>${esc(step)}</strong></li>`).join("");
  return `<ol class="steps">${items}</ol>`;
}

function renderCards(cards) {
  const items = cards.map(([title, sub, url]) => {
    const body = `<strong>${esc(title)}</strong><small>${esc(sub)}</small>`;
    return url
      ? `<a class="app-card" href="${esc(url)}" rel="noopener">${body}<small class="open-hint">Öffnen ↗</small></a>`
      : `<div class="app-card">${body}</div>`;
  }).join("");
  return `<div class="grid">${items}</div>`;
}

function renderLinks(links) {
  const items = links.map(([label, url], i) => {
    const external = !url.startsWith("tel:");
    const style = i === 0 ? "primary" : "secondary";
    return `<a class="action-button ${style}" href="${esc(url)}" rel="noopener">${esc(label)}${external ? " ↗" : ""}</a>`;
  }).join("");
  return `<div class="next">${items}</div>`;
}

/* Diese Adressen sind bei Apple als Universal Link der jeweiligen App
   hinterlegt. Ist die App auf dem iPhone installiert, oeffnet iOS beim
   Antippen die App statt Safari. Ist sie es nicht, kommt die Webseite.
   Belege stehen in der README. Nur geprüfte Adressen gehoeren hierher. */
function renderAppLinks(appLinks) {
  const items = appLinks.map(([icon, label, url, hint = "Öffnet die App auf dem iPhone", modifier = ""]) =>
    `<a class="open-app ${esc(modifier)}" href="${esc(url)}" rel="noopener">
       <span class="open-app-icon" aria-hidden="true">${esc(icon)}</span>
       <span class="open-app-text">
         <strong>${esc(label)}</strong>
         <small>${esc(hint)}</small>
       </span>
     </a>`).join("");
  return `<div class="open-apps">${items}</div>`;
}

function render(id) {
  const page = PAGES[id] || PAGES[START];
  backButton.classList.toggle("is-invisible", id === START);

  let html = `<section class="hero">
      ${page.eyebrow ? `<p class="eyebrow">${esc(page.eyebrow)}</p>` : ""}
      <h1>${esc(page.title)}</h1>
      ${page.intro ? `<p>${esc(page.intro)}</p>` : ""}
    </section>`;

  if (page.choices) html += renderChoices(page.choices);
  /* Im Notfall darf die Handlung nicht unter sieben Schritten liegen.
     actionsFirst zieht die Schaltflaechen ueber die Erklaerung. */
  if (page.appLinks && page.actionsFirst) html += renderAppLinks(page.appLinks);
  if (page.steps) html += renderSteps(page.steps);
  if (page.appLinks && !page.actionsFirst) html += renderAppLinks(page.appLinks);
  if (page.cards) html += renderCards(page.cards);
  if (page.links) html += renderLinks(page.links);
  if (page.note) html += `<p class="notice">${esc(page.note)}</p>`;
  if (page.form === "contact") html += renderContactForm();

  app.innerHTML = html;
  app.querySelectorAll("[data-go]").forEach(button =>
    button.addEventListener("click", () => navigate(button.dataset.go)));
  if (page.form === "contact") wireContactForm();

  document.title = id === START ? "Deine Tesla-Hilfe" : `${page.title} – Deine Tesla-Hilfe`;
  window.scrollTo(0, 0);
  app.focus();
}

function navigate(id) {
  if (id === pageId()) return render(id);
  location.hash = id;
}

/* Zurueck folgt der Seitenstruktur, nicht dem Klickverlauf.
   Damit landet man nie auf einer alten oder unerwarteten Seite. */
function goBack() {
  navigate(PAGES[pageId()]?.parent || START);
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

/* Die Telefonnummer soll nicht im Repository stehen. Sie kommt deshalb
   aus einer der beiden Quellen, die beide nicht eingecheckt werden:

   1. config.local.js  - liegt nur auf dem eigenen Rechner (.gitignore)
   2. localStorage     - liegt nur auf dem iPhone, ueber die Seite #setup

   Fehlt beides, blendet die App die Schaltflaechen aus und erklaert, wie
   man die Nummer eintraegt. Sie wird nirgends hochgeladen. */
const CONTACT_KEY = "tesla-hilfe.kontakt";

function storedContact() {
  try {
    return JSON.parse(localStorage.getItem(CONTACT_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveContact(phone) {
  try {
    if (phone) localStorage.setItem(CONTACT_KEY, JSON.stringify({ contactPhone: phone, contactWhatsAppPhone: phone }));
    else localStorage.removeItem(CONTACT_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

/* typeof-Pruefung, damit eine fehlende config.local.js kein Fehler ist. */
function contact() {
  const local = typeof CONFIG_LOCAL === "object" && CONFIG_LOCAL ? CONFIG_LOCAL : {};
  return Object.assign({}, CONFIG, local, storedContact());
}

function renderContactForm() {
  const current = digitsOnly(contact().contactPhone);
  return `<form class="setup" id="contactForm">
      <label for="contactInput">Handynummer mit Ländervorwahl</label>
      <input id="contactInput" name="phone" type="tel" inputmode="tel" autocomplete="tel"
             placeholder="+49 171 1234567" value="${current ? esc("+" + current) : ""}">
      <button class="action-button primary" type="submit">Nummer speichern</button>
      <button class="action-button secondary" type="button" id="contactClear">Nummer löschen</button>
      <p class="setup-status" id="contactStatus" role="status"></p>
    </form>`;
}

function wireContactForm() {
  const form = app.querySelector("#contactForm");
  const input = app.querySelector("#contactInput");
  const status = app.querySelector("#contactStatus");

  const report = (ok, text) => {
    status.textContent = text;
    status.classList.toggle("is-error", !ok);
  };

  form.addEventListener("submit", event => {
    event.preventDefault();
    const phone = digitsOnly(input.value);
    if (phone.length < 8) return report(false, "Das sieht nicht nach einer vollständigen Nummer aus.");
    if (!saveContact(phone)) return report(false, "Der Browser erlaubt kein Speichern. Privates Surfen ausschalten und erneut versuchen.");
    setContactLinks(CONFIG.defaultWhatsAppText);
    report(true, "Gespeichert. Die Nummer bleibt nur auf diesem Gerät.");
  });

  app.querySelector("#contactClear").addEventListener("click", () => {
    saveContact("");
    input.value = "";
    setContactLinks(CONFIG.defaultWhatsAppText);
    report(true, "Gelöscht.");
  });
}

function setContactLinks(message) {
  const data = contact();
  const phone = digitsOnly(data.contactPhone);
  const whatsappPhone = digitsOnly(data.contactWhatsAppPhone);

  callLink.hidden = !phone;
  if (phone) callLink.href = `tel:+${phone}`;

  whatsappLink.hidden = !whatsappPhone;
  if (whatsappPhone) {
    whatsappLink.href = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  }

  const hasContact = Boolean(phone || whatsappPhone);
  contactFallback.hidden = hasContact;
  quickActions.hidden = !whatsappPhone;
}

alexButton.addEventListener("click", () => {
  setContactLinks(CONFIG.defaultWhatsAppText);
  alexDialog.showModal();
});

/* Der Link steht im Dialog. Ohne close() bliebe der Dialog offen und
   verdeckte die Seite, zu der er gerade gesprungen ist. */
document.querySelector("#setupLink").addEventListener("click", () => alexDialog.close());

backButton.addEventListener("click", goBack);

quickActions.querySelectorAll("button").forEach(button =>
  button.addEventListener("click", () => setContactLinks(button.dataset.message)));

window.addEventListener("hashchange", () => render(pageId()));

setContactLinks(CONFIG.defaultWhatsAppText);
render(pageId());
