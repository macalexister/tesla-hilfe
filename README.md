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
| `bilder/`                 | Zeichnungen, selbst erstellt                   |
| `karte/`                  | QR-Code und druckbare Karte fürs Handschuhfach |

Texte ändert man in `content.js`, ohne den Code anzufassen. Die Zurück-Schaltfläche
folgt dem `parent`-Feld einer Seite, nicht dem Klickverlauf.

## Bilder

Vier Seiten zeigen eine Zeichnung: der Weg zum Waschanlagen-Modus, die Leuchte
am Ladeanschluss, die Lage des Ladeanschlusses am Auto und die Ladebuchse aus
der Nähe. Sie stehen bewusst **vor** den Schritten — sie beantworten „wo muss
ich hintippen“ schneller als Text, und hinter sieben Schritten würden sie erst
nach anderthalb Bildschirmlängen auftauchen.

### Warum gezeichnet und nicht fotografiert

1. Die Abbildungen im Tesla-Handbuch sind urheberrechtlich geschützt
   („© Tesla“) und dürfen nicht in dieses Repository. **Bilder aus Foren oder
   von Herstellerseiten scheiden aus demselben Grund aus**, auch wenn sie
   frei abrufbar sind.
2. Tesla weist selbst darauf hin, dass die Anzeige je nach Softwarestand,
   Ausstattung und Region abweicht. Eine Zeichnung zeigt den Weg und veraltet
   nicht mit jedem Update.

Es gäbe brauchbare Fotos unter freier Lizenz auf Wikimedia Commons. Eines war
kurzzeitig eingebaut, ist aber wieder entfernt worden: Ein einzelnes Foto
zwischen vier Zeichnungen wirkt uneinheitlich, und die Lizenz zieht dauerhafte
Pflichten nach sich. Sobald eigene Fotos vorliegen, ersetzen sie die
Zeichnungen — dafür gibt es die Seite unten.

Die SVG-Dateien sind zusammen 16 KB. Jede trägt `<title>` und `<desc>`, im
`alt`-Text steht der Inhalt noch einmal ausformuliert.

## Eigene Fotos aufnehmen

Die versteckte Seite **`#fotos`** ersetzt jede Zeichnung durch ein eigenes
Foto. Gedacht ist sie für den Moment, in dem man im Auto sitzt.

1. `https://macalexister.github.io/tesla-hilfe/#fotos` auf dem iPhone öffnen
2. Auf „Foto aufnehmen“ tippen — iOS bietet Kamera oder Mediathek an
3. Das Foto erscheint sofort in der App und ersetzt die Zeichnung

Zu jedem Bild steht dort, **was genau zu fotografieren ist** und worauf zu
achten ist. Die Aufträge stehen in `content.js` unter `FOTO_AUFTRAEGE`.

**Wichtig:** Die App hat keinen Server, ein Upload im Wortsinn ist nicht
möglich. Die Fotos liegen im Speicher des Browsers und sind nur auf dem Gerät
sichtbar, auf dem sie aufgenommen wurden. Über „Alle Fotos herunterladen“
landen sie im Download-Ordner und können nach `bilder/` übernommen werden —
erst dann sieht sie auch die Nutzerin.

Jedes Foto wird beim Aufnehmen über ein Canvas auf 1000 Pixel lange Kante
gerechnet und als JPEG mit Qualität 0,82 abgelegt. Aus 8,7 MB werden so
rund 160 KB; ohne diesen Schritt wäre der Speicher nach zwei Bildern voll.

Die Zuordnung läuft über den Dateinamen: Aus `bilder/waschmodus.svg` wird die
Kennung `waschmodus`, und ein Foto unter dieser Kennung gewinnt gegen die
Zeichnung. Ein neues Bild braucht deshalb keine Codeänderung.

### Neues Bild einbauen

Datei nach `bilder/` legen und auf der Seite in `content.js` ergänzen:

```js
figure: ["bilder/datei.svg", "Was zu sehen ist.", "Hinweis unter dem Bild."]
```

Bei fremdem Material zusätzlich den Nachweis angeben, den die Lizenz verlangt:

```js
figure: ["bilder/datei.jpg", "Was zu sehen ist.", "Hinweis.",
         ["Urheber, Lizenz, Änderung", "https://quelle"]]
```

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

## Fahrassistenz

Die Seite `tempomat` erklärt **nur den Abstandstempomat**. Der Lenkassistent
ist beim Model 3 ebenfalls serienmäßig, wird aber bewusst nicht erklärt: Er
verlangt dauerhaft Hände am Lenkrad, überwacht die Aufmerksamkeit und sperrt
sich bei Nichtreaktion unter Warnblinken und Zwangsbremsung. Für eine
unsichere Erstfahrerin ist das keine Hilfe, sondern eine zusätzliche
Stressquelle.

Erwähnt wird er nur in einer Karte — damit sie ihn nicht versehentlich
einschaltet und weiß, wie sie ihn loswird (Bremse). Wichtig: Steht die
Einstellung auf „Einzelklick", aktiviert **ein** Druck aufs Rädchen beide
Funktionen. Auf „Doppelklick" schaltet ein Druck nur den Tempomat.

Kein Zusatzpaket nötig. Das kostenpflichtige Paket (rund 99 €/Monat) enthält
Spurwechsel, Navigieren mit Lenkassistent, Autoparken und Herbeirufen — davon
steht nichts in dieser App.

Quelle: [Handbuch Abstandsgeschwindigkeitsregler](https://www.tesla.com/ownersmanual/model3/de_de/GUID-DA920829-F1FA-44F9-8754-6D914C524A79.html)

## Ladepreise pflegen

Die Seite „Die einfache Regel" (`welche-karte` in `content.js`) nennt konkrete
Preise. Das ist Absicht: Eine Regel, die man sich merken kann, hilft mehr als
eine Preisabfrage, die im Funkloch nicht lädt.

**Stand 31.08.2026:**

| | Aral pulse | alle anderen Säulen |
| --- | --- | --- |
| ADAC e-Charge | 0,55 €/kWh | 0,75 €/kWh |
| EWE Go | 0,62 €/kWh (Partner) | 0,52 €/kWh (eigene), 0,62 € (Partner) |

Blockiergebühr: ADAC 0,15 €/min ab 120 min AC bzw. **45 min DC** an
Fremdsäulen, keine bei Aral. EWE Go 0,10 €/min ab 240 min an Partnersäulen,
höchstens 24 €, keine an eigenen.

Daraus folgt die Regel: **an Aral die ADAC-Karte, überall sonst EWE Go.**

Quellen: [ADAC e-Charge](https://www.adac.de/rund-ums-fahrzeug/e-angebote/ladekarte/) ·
[EWE Go Ladetarif](https://www.ewe-go.de/ladetarif)

Alle paar Monate prüfen. Zu ändern sind dann: die Preise in `welche-karte`,
das Datum im `note`-Feld derselben Seite und die Zahlen in
`bilder/karten-regel.svg`.

### Warum keine Preis-API

Geprüft wurden Chargeprice, Open Charge Map, Ladefuchs, GoingElectric,
Chargemap und das Ladesäulenregister der Bundesnetzagentur. Ergebnis: Für
einen stationsgenauen Vergleich genau dieser beiden Tarife gibt es keine
Schnittstelle, die sich aus einer reinen Browser-App nutzen lässt.

- **Chargeprice** könnte es fachlich, verlangt aber einen geheim zu haltenden
  Schlüssel. In einer statischen Seite auf GitHub Pages steht der im Quelltext
  und ist für jeden lesbar — das verstößt gegen die Nutzungsbedingungen.
  Zusätzlich untersagen diese das Zwischenspeichern der Preise.
- **Open Charge Map** und das **Ladesäulenregister** kennen Standorte und
  Betreiber, aber keine Tarifpreise. Preise stehen dort nur als Freitext.
- **Ladefuchs** hat die Daten, stellt sie aber nicht offen bereit.
- Weder ADAC noch EWE Go veröffentlichen ihre Preise maschinenlesbar.

Eine Live-Abfrage bräuchte also einen eigenen kleinen Server als Vermittler.
Für eine App, die ohne Backend auskommen soll, ist das der falsche Preis —
zumal die Regel selbst seit November 2024 unverändert gilt.

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
