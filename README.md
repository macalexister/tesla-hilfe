# Deine Tesla-Hilfe

Mobile-first, statische Hilfe-App für ein Tesla Model 3. Sie beantwortet eine
Frage: *Was ist jetzt der nächste Schritt?*

**Live: https://macalexister.github.io/tesla-hilfe/**

Kein Backend, keine Datenbank, keine Abhängigkeiten. Nur HTML, CSS und
JavaScript.

## Auf dem iPhone einrichten

Einmalig, danach läuft es von allein:

1. `https://macalexister.github.io/tesla-hilfe/` in Safari öffnen
2. `#setup` aufrufen und die Nummer für „Alex fragen“ eintragen —
   sie bleibt nur auf diesem Gerät
3. Teilen-Symbol → **Zum Home-Bildschirm** — dann startet die Hilfe
   wie eine App, ohne Adresszeile

## Lokal starten

```sh
cp config.local.example.js config.local.js   # einmalig, echte Nummer eintragen
python3 -m http.server 8080 --directory .
```

Dann `http://localhost:8080` öffnen.

## Aufbau

| Datei                     | Inhalt                                         |
| ------------------------- | ---------------------------------------------- |
| `index.html`              | Grundgerüst, Kopfzeile, Alex-Dialog            |
| `config.js`               | Grundeinstellungen, **ohne** Telefonnummer     |
| `config.local.example.js` | Vorlage für die private Nummer                 |
| `config.local.js`         | echte Nummer, steht in `.gitignore`            |
| `content.js`              | Alle Texte und Abläufe                         |
| `app.js`                  | Darstellung und Navigation                     |
| `styles.css`              | Layout                                         |
| `karte/`                  | QR-Code und druckbare Karte fürs Handschuhfach |

Texte ändert man in `content.js`, ohne den Code anzufassen. Die Zurück-Schaltfläche
folgt dem `parent`-Feld einer Seite, nicht dem Klickverlauf.

## Telefonnummer

Die Nummer steht bewusst **nicht** im Repository. Die App holt sie aus einer von
zwei Quellen, die beide nicht eingecheckt werden:

1. **`config.local.js`** — liegt neben den anderen Dateien und steht in
   `.gitignore`. Wird beim Ausliefern mitkopiert.
2. **Browser-Speicher** — über die versteckte Seite `#setup` direkt auf dem
   iPhone eingetragen. Die Nummer verlässt das Gerät nicht und überschreibt
   `config.local.js`, falls beides vorhanden ist.

Fehlt beides, blendet die App die Anruf- und WhatsApp-Schaltfläche aus und
verlinkt stattdessen auf `#setup`.

Die Eingabe darf in jeder üblichen Schreibweise erfolgen. `0171 1234567`,
`0049 171 1234567` und `+49 (0)171 1234567` ergeben alle dieselbe Nummer
`+491711234567`; ohne diese Umrechnung würde `wa.me` niemanden finden.
Nach dem Speichern zeigt das Feld, was tatsächlich hinterlegt wurde.

Weil `config.local.js` fehlen darf, meldet die Konsole beim Laden gegebenenfalls
einen 404 für diese Datei. Das ist erwartet und ohne Wirkung.

## Apps direkt öffnen

Auf einigen Seiten gibt es große Schaltflächen, die auf dem iPhone die
installierte App öffnen statt Safari. Das funktioniert über Universal Links.
Jede verwendete Adresse ist beim Anbieter offiziell hinterlegt und lässt sich
nachprüfen unter `https://<domain>/.well-known/apple-app-site-association`:

| App               | Adresse                            | Eintrag beim Anbieter   |
| ----------------- | ---------------------------------- | ----------------------- |
| Tesla             | `tesla.com/1/app/home`             | `"Open Tesla App"`      |
| Chargemap         | `chargemap.com/de-de/map`          | Pfadmuster `/*-*/map`   |
| Chargeprice       | `chargeprice.app/`                 | alle Pfade              |
| ADAC Pannenhilfe  | `adac.de/hilfe`                    | Pfad `/hilfe`           |
| Apple Karten      | `maps.apple.com/?q=Ladestation`    | Systemapp von Apple     |

**EWE Go, ADAC e-Charge und Aral pulse haben keine Universal Links.** Dort steht
deshalb bewusst keine Schaltfläche „App öffnen“, sondern der ehrliche Hinweis,
die App auf dem Startbildschirm anzutippen. Eine Schaltfläche, die stattdessen
die Werbeseite öffnet, würde etwas Falsches versprechen.

Ist eine App nicht installiert, öffnet iOS die normale Webseite. Es geht also
nichts kaputt.

## Datenschutz

Die App sendet nichts an einen eigenen Server und setzt keine Cookies.

Das Repository ist **öffentlich** und wird über GitHub Pages ausgeliefert.
Sichtbar ist deshalb nur, was auch im Repository steht.

- Die Telefonnummer steht **nicht** im Repository und in keinem Commit. Sie
  stand ursprünglich in den ersten vier Commits. Ein Umschreiben der Historie
  hat nicht gereicht: GitHub lieferte die alten Commits weiterhin über ihre
  SHA aus. Deshalb wurde das Repository neu angelegt und die bereinigte
  Historie hineingeschoben. Nachgeprüft: `git fetch origin <alte-sha>` läuft
  für alle alten Commits in `not our ref`.
- Aus demselben Grund steht in den Commits **keine private Mailadresse**,
  sondern die GitHub-noreply-Adresse. Auch dieser Schritt brauchte ein frisch
  angelegtes Repository, weil ein Force-Push allein die alten Commits auf
  GitHub nicht entfernt.
- Wird die Nummer über `#setup` eingetragen, liegt sie im `localStorage` des
  Browsers auf dem Gerät. Löschen geht auf derselben Seite.
- Externe Links führen zu Tesla, ADAC, EWE Go, Chargemap, Chargeprice und Apple.
  Für deren Datenverarbeitung gelten deren eigene Bestimmungen.

Wer die Seite ohne eingetragene Nummer öffnet, sieht keine Anruf- oder
WhatsApp-Schaltfläche, sondern einen Hinweis auf `#setup`.

## Karte fürs Handschuhfach

`karte/index.html` im Browser öffnen und drucken. Es entstehen zwei gleiche
Karten in A6 — eine fürs Handschuhfach, eine für die Handtasche. Der QR-Code
führt direkt auf die Startseite.

Der Code liegt zusätzlich als `karte/qr-tesla-hilfe.svg` und `.png` bereit
(Fehlerkorrektur H, verträgt bis zu 30 % Verschmutzung). Auf der Karte ist er
45 mm groß; getestet ist er bis hinunter zu etwa 12 mm.

Ändert sich die URL, muss der Code neu erzeugt werden:

```sh
python3 -c "import segno; segno.make('https://macalexister.github.io/tesla-hilfe/', error='h').save('karte/qr-tesla-hilfe.svg', scale=10, border=4, dark='#17212a', light='#ffffff')"
```

## Inhaltliche Grenzen

Die App fasst zusammen und ersetzt keine offizielle Anleitung.

- Der Ladeablauf an fremden Säulen ist **betreiberabhängig**. Die App behauptet
  deshalb keine feste Reihenfolge, sondern verweist auf das Display der Säule.
- Hat eine Säule **kein Display**, verweist die App bewusst nicht auf die
  Lämpchen der Säule — deren Farben bedeuten bei jedem Hersteller etwas
  anderes. Stattdessen zählt die Ladeanschlussleuchte am Auto: grünes Blinken
  heißt laden, durchgehend grün heißt fertig, rot heißt Störung. Das steht so
  in der Tesla-Anleitung und gilt unabhängig vom Betreiber.
- Beim Thema **Waschanlage** folgt die App der Tesla-Anleitung, auch wo diese
  unbequem ist: nur kontaktlose Anlagen ohne Bürsten, mindestens 30 cm Abstand
  beim Hochdruckreiniger. Schäden durch falsches Waschen sind laut Tesla nicht
  von der Garantie gedeckt.
- Es werden keine Telefonnummern für Pannenhilfe genannt, da diese sich ändern.
  Stattdessen wird auf die Tesla-App und die offiziellen Seiten verwiesen.
- Die App enthält **bewusst keine Notfallseite**. Sie deckt das ab, was im
  Alltag passiert: fahren, laden, Ladesäule streikt, Akku wird knapp. Was im
  echten Notfall zu tun ist, gehört nicht in eine Seite, die man erst suchen
  muss — der Notruf 112 wird auf jedem iPhone direkt über die Telefon-App
  gewählt, auch bei gesperrtem Bildschirm.
- Preise und Tarife ändern sich. Chargeprice ist nur ein Hinweis, keine Zusage.
- Die Seite „Quellen“ in der App verlinkt die offiziellen Belege.

Verbindlich ist immer die Bedienungsanleitung des Fahrzeugs.
