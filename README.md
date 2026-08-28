# Deine Tesla-Hilfe

Mobile-first, statische Hilfe-App für ein Tesla Model 3. Sie beantwortet eine
Frage: *Was ist jetzt der nächste Schritt?*

Kein Backend, keine Datenbank, keine Abhängigkeiten. Nur HTML, CSS und
JavaScript.

## Lokal starten

```sh
python3 -m http.server 8080 --directory .
```

Dann `http://localhost:8080` öffnen.

## Aufbau

| Datei         | Inhalt                                              |
| ------------- | --------------------------------------------------- |
| `index.html`  | Grundgerüst, Kopfzeile, Alex-Dialog                 |
| `config.js`   | Kontaktdaten                                        |
| `content.js`  | Alle Texte und Abläufe                              |
| `app.js`      | Darstellung und Navigation                          |
| `styles.css`  | Layout                                              |

Texte ändert man in `content.js`, ohne den Code anzufassen. Die Zurück-Schaltfläche
folgt dem `parent`-Feld einer Seite, nicht dem Klickverlauf.

## Kontakt konfigurieren

Alle Kontaktdaten stehen in `config.js`. Sind die Felder leer, blendet die App
die betroffenen Schaltflächen aus und zeigt stattdessen einen Hinweis.

## Datenschutz

Die App sendet nichts an einen eigenen Server, setzt keine Cookies und legt
nichts im Browser ab.

**Aber:** `config.js` enthält bewusst eine echte private Telefonnummer, damit die
App ohne weitere Einrichtung funktioniert. Diese Nummer steht damit im Quelltext
und in der Git-Historie.

Daraus folgt:

- Das Repository muss **privat** bleiben.
- Wird die App öffentlich ausgeliefert, etwa über GitHub Pages, ist die Nummer
  für jeden lesbar, der die Seite aufruft. Vorher in `config.js` eine Nummer
  eintragen, die öffentlich sein darf, oder die Felder leeren.
- Ein nachträgliches Entfernen aus `config.js` reicht nicht: Die Nummer bleibt
  in älteren Commits stehen und müsste per History-Rewrite entfernt werden.

Externe Links führen zu Tesla, ADAC, EWE Go, Chargemap und Chargeprice. Für
deren Datenverarbeitung gelten deren eigene Bestimmungen.

## Inhaltliche Grenzen

Die App fasst zusammen und ersetzt keine offizielle Anleitung.

- Der Ladeablauf an fremden Säulen ist **betreiberabhängig**. Die App behauptet
  deshalb keine feste Reihenfolge, sondern verweist auf das Display der Säule.
- Es werden keine Telefonnummern für Pannenhilfe genannt, da diese sich ändern.
  Stattdessen wird auf die Tesla-App und die offiziellen Seiten verwiesen.
- Preise und Tarife ändern sich. Chargeprice ist nur ein Hinweis, keine Zusage.
- Die Seite „Quellen“ in der App verlinkt die offiziellen Belege.

Verbindlich ist immer die Bedienungsanleitung des Fahrzeugs.
