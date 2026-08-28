# Deine Tesla-Hilfe

Mobile-first, statische Hilfe-App für ein aktuelles Tesla Model 3 Standard Range.

## Lokal starten

```sh
python3 -m http.server 8080 --directory .
```

Dann `http://localhost:8080` öffnen. Die App benötigt kein Backend und speichert keine personenbezogenen Daten.

## Kontakt konfigurieren

Die Telefonnummern stehen ausschließlich zentral in `app.js` in `CONFIG`, nicht in HTML oder mehreren Komponenten.

Die Inhalte machen keine Zusagen über versionsabhängige Tesla-Funktionen. Für konkrete Fahrzeugfragen gilt die offizielle Tesla-Bedienungsanleitung.
