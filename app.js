/*
  Darstellung und Navigation. Inhalte stehen in content.js,
  Kontaktdaten in config.js.
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

function render(id) {
  const page = PAGES[id] || PAGES[START];
  backButton.classList.toggle("is-invisible", id === START);

  let html = `<section class="hero">
      ${page.eyebrow ? `<p class="eyebrow">${esc(page.eyebrow)}</p>` : ""}
      <h1>${esc(page.title)}</h1>
      ${page.intro ? `<p>${esc(page.intro)}</p>` : ""}
    </section>`;

  if (page.choices) html += renderChoices(page.choices);
  if (page.steps) html += renderSteps(page.steps);
  if (page.cards) html += renderCards(page.cards);
  if (page.links) html += renderLinks(page.links);
  if (page.note) html += `<p class="notice">${esc(page.note)}</p>`;

  app.innerHTML = html;
  app.querySelectorAll("[data-go]").forEach(button =>
    button.addEventListener("click", () => navigate(button.dataset.go)));

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

function setContactLinks(message) {
  const phone = digitsOnly(CONFIG.contactPhone);
  const whatsappPhone = digitsOnly(CONFIG.contactWhatsAppPhone);

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

backButton.addEventListener("click", goBack);

quickActions.querySelectorAll("button").forEach(button =>
  button.addEventListener("click", () => setContactLinks(button.dataset.message)));

window.addEventListener("hashchange", () => render(pageId()));

setContactLinks(CONFIG.defaultWhatsAppText);
render(pageId());
