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

/* Eigene Fotos ersetzen Zeichnungen.

   Die Bild-Kennung ist der Dateiname ohne Ordner und Endung, also wird aus
   "bilder/waschmodus.svg" die Kennung "waschmodus". Liegt dazu ein selbst
   aufgenommenes Foto im Geraetespeicher, gewinnt dieses. Damit laesst sich
   jedes Bild einzeln ersetzen, ohne eine Zeile Code zu aendern. */
const FOTO_PREFIX = "tesla-hilfe.foto.";

function bildKennung(datei) {
  return String(datei).replace(/^.*\//, "").replace(/\.[^.]+$/, "");
}

function eigenesFoto(kennung) {
  try {
    return localStorage.getItem(FOTO_PREFIX + kennung);
  } catch (error) {
    return null;
  }
}

/* Zeichnungen und Fotos. Tesla weist selbst darauf hin, dass der Bildschirm
   je nach Softwarestand anders aussieht; eine Skizze zeigt den Weg und
   veraltet nicht mit jedem Update. Ausserdem sind die Abbildungen im
   Tesla-Handbuch urheberrechtlich geschuetzt und duerfen hier nicht liegen.

   Fotos stammen von Wikimedia Commons unter freier Lizenz. Die Lizenz
   verlangt Urhebernennung, Lizenzangabe und einen Hinweis auf Aenderungen -
   deshalb der Quellen-Link unter dem Bild. Bei einem eigenen Foto entfaellt
   dieser Nachweis, denn dann stammt das Bild nicht mehr von dort. */
function renderFigure([datei, beschreibung, hinweis = "Zeichnung, kein Foto.", quelle]) {
  const eigenes = eigenesFoto(bildKennung(datei));
  const quelltext = eigenes ? "Eigenes Foto." : esc(hinweis);
  const nachweis = quelle && !eigenes
    ? ` <a class="bild-quelle" href="${esc(quelle[1])}" rel="noopener">${esc(quelle[0])} ↗</a>`
    : "";
  return `<figure class="bild">
      <img src="${eigenes ? eigenes : esc(datei)}" alt="${esc(beschreibung)}" decoding="async">
      <figcaption>${quelltext}${nachweis}</figcaption>
    </figure>`;
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
  /* Die Zeichnung steht vor den Schritten. Sie beantwortet die Frage
     "wo muss ich hintippen" schneller als jeder Text, und hinter sieben
     Schritten wuerde sie erst nach anderthalb Bildschirmlaengen auftauchen. */
  if (page.figure) html += renderFigure(page.figure);
  if (page.steps) html += renderSteps(page.steps);
  if (page.appLinks) html += renderAppLinks(page.appLinks);
  if (page.cards) html += renderCards(page.cards);
  if (page.links) html += renderLinks(page.links);
  if (page.note) html += `<p class="notice">${esc(page.note)}</p>`;
  if (page.form === "contact") html += renderContactForm();
  if (page.form === "fotos") html += renderFotoForm();

  app.innerHTML = html;
  app.querySelectorAll("[data-go]").forEach(button =>
    button.addEventListener("click", () => navigate(button.dataset.go)));
  if (page.form === "contact") wireContactForm();
  if (page.form === "fotos") wireFotoForm();

  document.title = id === START ? "Deine Tesla-Hilfe" : `${page.title} – Deine Tesla-Hilfe`;
  window.scrollTo(0, 0);
  /* preventScroll ist zwingend: focus() scrollt sonst zum Element und macht
     das scrollTo darueber zunichte. Die Ueberschrift lag dadurch auf jeder
     Seite unter der Kopfleiste. */
  app.focus({ preventScroll: true });
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

/* Deutsche Schreibweisen in eine Nummer bringen, die tel: und wa.me
   verstehen. Ohne das wird aus dem ueblichen "+49 (0)171 1234567" die
   unbrauchbare Nummer 490171..., und WhatsApp findet niemanden.

     0171 1234567      -> 491711234567   (fuehrende 0 ist die Vorwahl im Inland)
     0049 171 1234567  -> 491711234567
     +49 (0)171 123... -> 491711234567   (die 0 in Klammern faellt weg) */
function normalizePhone(value) {
  let digits = digitsOnly(value);
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = "49" + digits.slice(1);
  if (digits.startsWith("490")) digits = "49" + digits.slice(3);
  return digits;
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

/* typeof-Pruefung, damit eine fehlende config.local.js kein Fehler ist.
   Leere Felder werden uebersprungen: sonst wuerde die eingecheckte
   config.js mit ihren leeren Feldern eine echte Nummer ueberschreiben. */
function contact() {
  const local = typeof CONFIG_LOCAL === "object" && CONFIG_LOCAL ? CONFIG_LOCAL : {};
  const merged = Object.assign({}, CONFIG);
  [local, storedContact()].forEach(source => {
    Object.keys(source).forEach(key => {
      if (source[key] !== "" && source[key] != null) merged[key] = source[key];
    });
  });
  /* Eine Nummer reicht: WhatsApp nutzt dieselbe, wenn nichts anderes dasteht. */
  if (!merged.contactWhatsAppPhone) merged.contactWhatsAppPhone = merged.contactPhone;
  return merged;
}

function renderContactForm() {
  const current = normalizePhone(contact().contactPhone);
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
    const phone = normalizePhone(input.value);
    if (phone.length < 8) return report(false, "Das sieht nicht nach einer vollständigen Nummer aus.");
    if (!saveContact(phone)) return report(false, "Der Browser erlaubt kein Speichern. Privates Surfen ausschalten und erneut versuchen.");
    /* Die fertige Nummer zurueckschreiben, damit man sieht, was gespeichert wurde. */
    input.value = "+" + phone;
    setContactLinks(CONFIG.defaultWhatsAppText);
    report(true, "Gespeichert als +" + phone + ". Die Nummer bleibt nur auf diesem Gerät.");
  });

  app.querySelector("#contactClear").addEventListener("click", () => {
    saveContact("");
    input.value = "";
    setContactLinks(CONFIG.defaultWhatsAppText);
    report(true, "Gelöscht.");
  });
}

/* ---- Eigene Fotos aufnehmen -------------------------------------------

   Die App laeuft ohne Server, ein Upload im Wortsinn ist also nicht
   moeglich. Stattdessen bleibt das Foto im Geraetespeicher und wird sofort
   angezeigt. Fuer die Uebernahme ins Projekt gibt es "Herunterladen".

   iPhone-Fotos sind drei bis fuenf Megabyte gross und wuerden den Speicher
   sofort sprengen. Deshalb wird jedes Bild ueber ein Canvas auf 1000 Pixel
   lange Kante gerechnet und als JPEG mit Qualitaet 0.82 abgelegt - das
   ergibt rund 100 bis 200 Kilobyte. */
const FOTO_MAX_KANTE = 1000;
const FOTO_QUALITAET = 0.82;

function verkleinereFoto(datei) {
  return new Promise((erfolg, fehler) => {
    const leser = new FileReader();
    leser.onerror = () => fehler(new Error("Die Datei ließ sich nicht lesen."));
    leser.onload = () => {
      const bild = new Image();
      bild.onerror = () => fehler(new Error("Das ist kein Bild, das der Browser öffnen kann."));
      bild.onload = () => {
        const faktor = Math.min(1, FOTO_MAX_KANTE / Math.max(bild.width, bild.height));
        const flaeche = document.createElement("canvas");
        flaeche.width = Math.round(bild.width * faktor);
        flaeche.height = Math.round(bild.height * faktor);
        const stift = flaeche.getContext("2d");
        stift.drawImage(bild, 0, 0, flaeche.width, flaeche.height);
        erfolg({
          daten: flaeche.toDataURL("image/jpeg", FOTO_QUALITAET),
          breite: flaeche.width,
          hoehe: flaeche.height
        });
      };
      bild.src = leser.result;
    };
    leser.readAsDataURL(datei);
  });
}

function speichereFoto(kennung, daten) {
  try {
    localStorage.setItem(FOTO_PREFIX + kennung, daten);
    return { ok: true };
  } catch (error) {
    /* Der Speicher ist voll. Das passiert nach ein paar Fotos und muss
       erklaert werden, sonst wirkt es wie ein Absturz. */
    return { ok: false, grund: "Der Speicher dieses Browsers ist voll. Lade die vorhandenen Fotos herunter und lösche sie hier, dann geht es weiter." };
  }
}

function loescheFoto(kennung) {
  try {
    localStorage.removeItem(FOTO_PREFIX + kennung);
  } catch (error) {
    /* Nichts zu tun: ist der Speicher nicht lesbar, gibt es auch nichts zu loeschen. */
  }
}

function fotoGroesse(daten) {
  /* Base64 traegt rund ein Drittel Ballast. Fuer die Anzeige reicht diese
     Naeherung, sie muss nur die Groessenordnung stimmen. */
  return Math.round((daten.length * 3) / 4 / 1024);
}

function renderFotoForm() {
  const zeilen = FOTO_AUFTRAEGE.map(auftrag => {
    const vorhanden = eigenesFoto(auftrag.id);
    return `<li class="foto-auftrag" data-kennung="${esc(auftrag.id)}">
        <div class="foto-kopf">
          <strong>${esc(auftrag.titel)}</strong>
          <span class="foto-status">${vorhanden ? "Eigenes Foto (" + fotoGroesse(vorhanden) + " KB)" : "ersetzt " + esc(auftrag.ersetzt)}</span>
        </div>
        <p class="foto-wie">${esc(auftrag.wie)}</p>
        <p class="foto-achte">${esc(auftrag.achte)}</p>
        ${vorhanden ? `<img class="foto-vorschau" src="${vorhanden}" alt="Eigenes Foto: ${esc(auftrag.titel)}">` : ""}
        <div class="foto-knoepfe">
          <label class="action-button primary">
            ${vorhanden ? "Neu aufnehmen" : "Foto aufnehmen"}
            <input type="file" accept="image/*" hidden data-foto="${esc(auftrag.id)}">
          </label>
          ${vorhanden ? `<button class="action-button secondary" type="button" data-foto-weg="${esc(auftrag.id)}">Entfernen</button>` : ""}
        </div>
        <p class="foto-meldung" role="status"></p>
      </li>`;
  }).join("");

  return `<ul class="foto-liste">${zeilen}</ul>
    <div class="foto-gesamt">
      <button class="action-button secondary" type="button" id="fotoExport">Alle Fotos herunterladen</button>
      <p class="foto-meldung" id="fotoExportMeldung" role="status"></p>
    </div>`;
}

function wireFotoForm() {
  const zeigeMeldung = (element, text, fehler = false) => {
    element.textContent = text;
    element.classList.toggle("is-error", fehler);
  };

  app.querySelectorAll("input[data-foto]").forEach(feld => {
    feld.addEventListener("change", async () => {
      const kennung = feld.dataset.foto;
      const eintrag = feld.closest(".foto-auftrag");
      const meldung = eintrag.querySelector(".foto-meldung");
      const datei = feld.files && feld.files[0];
      if (!datei) return;

      zeigeMeldung(meldung, "Foto wird verkleinert …");
      try {
        const bild = await verkleinereFoto(datei);
        const ergebnis = speichereFoto(kennung, bild.daten);
        if (!ergebnis.ok) return zeigeMeldung(meldung, ergebnis.grund, true);
        /* Neu zeichnen, damit Vorschau und Knopfbeschriftung stimmen. */
        render(pageId());
        const frisch = app.querySelector(`.foto-auftrag[data-kennung="${kennung}"] .foto-meldung`);
        if (frisch) zeigeMeldung(frisch, `Gespeichert: ${bild.breite}×${bild.hoehe} Pixel, ${fotoGroesse(bild.daten)} KB.`);
      } catch (error) {
        zeigeMeldung(meldung, error.message || "Das Foto ließ sich nicht verarbeiten.", true);
      } finally {
        feld.value = "";
      }
    });
  });

  app.querySelectorAll("[data-foto-weg]").forEach(knopf => {
    knopf.addEventListener("click", () => {
      loescheFoto(knopf.dataset.fotoWeg);
      render(pageId());
    });
  });

  const exportKnopf = app.querySelector("#fotoExport");
  exportKnopf.addEventListener("click", () => {
    const meldung = app.querySelector("#fotoExportMeldung");
    const vorhandene = FOTO_AUFTRAEGE.filter(a => eigenesFoto(a.id));
    if (!vorhandene.length) return zeigeMeldung(meldung, "Es ist noch kein eigenes Foto da.", true);

    vorhandene.forEach((auftrag, i) => {
      /* Nacheinander mit Abstand, sonst blockt der Browser die Downloads. */
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = eigenesFoto(auftrag.id);
        link.download = auftrag.id + ".jpg";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, i * 700);
    });
    zeigeMeldung(meldung, vorhandene.length === 1
      ? "Ein Foto wird heruntergeladen. Danach in den Ordner bilder/ legen."
      : `${vorhandene.length} Fotos werden heruntergeladen. Danach in den Ordner bilder/ legen.`);
  });
}

function setContactLinks(message) {
  const data = contact();
  const phone = normalizePhone(data.contactPhone);
  const whatsappPhone = normalizePhone(data.contactWhatsAppPhone);

  /* Beim Ausblenden wird die Adresse geleert. Sonst bliebe eine geloeschte
     Nummer im HTML stehen und waere weiter auslesbar. */
  callLink.hidden = !phone;
  callLink.href = phone ? `tel:+${phone}` : "#setup";

  whatsappLink.hidden = !whatsappPhone;
  whatsappLink.href = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
    : "#setup";

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
