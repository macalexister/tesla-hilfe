# Deine Tesla-Hilfe

Mobile-first, statische Hilfe-App für ein Tesla Model 3. Sie beantwortet eine
Frage: *Was ist jetzt der nächste Schritt?*

Kein Backend, keine Datenbank, keine Abhängigkeiten. Nur HTML, CSS und
JavaScript.

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

- Die Telefonnummer steht **nicht** im Repository und in keinem Commit. Sie
  stand ursprünglich in den ersten vier Commits. Ein Umschreiben der Historie
  hat nicht gereicht: GitHub lieferte die alten Commits weiterhin über ihre
  SHA aus. Dieses Repository wurde deshalb neu angelegt, die bereinigte
  Historie hineingeschoben und das alte Repository gelöscht. Nachgeprüft:
  `git fetch origin <alte-sha>` läuft für beide alten Commits in
  `not our ref`.
- Wird die Nummer über `#setup` eingetragen, liegt sie im `localStorage` des
  Browsers auf dem Gerät. Löschen geht auf derselben Seite.
- Externe Links führen zu Tesla, ADAC, EWE Go, Chargemap, Chargeprice und Apple.
  Für deren Datenverarbeitung gelten deren eigene Bestimmungen.

Wird die App öffentlich ausgeliefert, etwa über GitHub Pages, ist nur das
sichtbar, was auch im Repository steht — die Nummer also nicht. Auf dem Gerät
der Nutzerin wird sie einmal über `#setup` eingetragen.

## Inhaltliche Grenzen

Die App fasst zusammen und ersetzt keine offizielle Anleitung.

- Der Ladeablauf an fremden Säulen ist **betreiberabhängig**. Die App behauptet
  deshalb keine feste Reihenfolge, sondern verweist auf das Display der Säule.
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
