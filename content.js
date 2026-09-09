/*
  Alle Texte der App an einem Ort. Bewusst getrennt von der Darstellung
  in app.js, damit Inhalte ohne Code-Aenderung angepasst werden koennen.

  Felder je Seite:
    parent   - Ziel der Zurueck-Schaltflaeche
    eyebrow  - kleine Zeile ueber der Ueberschrift
    title    - Ueberschrift
    intro    - kurzer Einleitungstext
    choices  - Auswahlkacheln [icon, Titel, Untertitel, Zielseite, Farbe]
    steps    - nummerierte Schritte
    cards    - Info-Kacheln, optional mit Link
    note     - Hinweisbox am Ende
    links    - Schaltflaechen zu externen Seiten
    appLinks - grosse Schaltflaechen, die auf dem iPhone direkt die App oeffnen
    figure   - Bild [Datei, alt-Text, Hinweis, optional [Quelltext, URL]]
    weiter   - Kacheln ganz am Ende, fuer Themen die danach kommen
    form     - Sonderfall: "contact" zeigt das Formular fuer die Nummer
    topics   - kompakte Themen-Navigation
    before   - wichtige Hinweise vor der Anleitung
    detailsTitle - Zusatzwissen zum Aufklappen (cards und optional figure)
    figureInDetails - Zeichnung beim Zusatzwissen statt vor den Schritten
    shortcuts - kompakte Links vor dem Inhalt [Titel, Zielseite]
    walkthrough - visueller Bedienweg [Ort/Element, Handlung]
    batteryComparison - Vergleich mit Beispiel-Akkuständen
*/

/*
  Direkte App-Schaltflaechen.

  Jede dieser Adressen ist beim jeweiligen Anbieter als Universal Link
  hinterlegt. Auf dem iPhone oeffnet iOS damit die installierte App statt
  Safari. Nachpruefbar in der Datei
  https://<domain>/.well-known/apple-app-site-association

    tesla.com      /1/app/home       -> "Open Tesla App"
    chargemap.com  /*-*\/map          -> Chargemap
    chargeprice.app  alle Pfade      -> Chargeprice
    adac.de        /hilfe            -> ADAC Pannenhilfe
    maps.apple.com                   -> Apple Karten

  Bewusst NICHT dabei: EWE Go, ADAC e-Charge und Aral pulse. Diese Anbieter
  haben keine Universal Links. Eine Schaltflaeche "App oeffnen" wuerde dort
  die Webseite oeffnen und damit etwas Falsches versprechen.
*/
const OPEN_APP = {
  tesla: ["🚗", "Tesla-App öffnen", "https://www.tesla.com/1/app/home"],
  chargemap: ["🗺️", "Chargemap öffnen", "https://chargemap.com/de-de/map", "Zeigt, wo Ladesäulen stehen"],
  chargeprice: ["💶", "Chargeprice öffnen", "https://www.chargeprice.app/", "Zeigt, was das Laden hier kostet"],
  adacHelp: ["🛟", "ADAC Pannenhilfe öffnen", "https://www.adac.de/hilfe"],
  maps: ["📍", "Ladestationen in der Karte suchen", "https://maps.apple.com/?q=Ladestation", "Öffnet die Karten-App auf dem iPhone"]
};

/*
  Fotoauftraege fuer die versteckte Seite "#fotos".

  Die id entspricht dem Dateinamen ohne Endung in bilder/. Liegt zu einer id
  ein selbst aufgenommenes Foto im Geraetespeicher, zeigt die App dieses
  statt der Zeichnung. So laesst sich jedes Bild einzeln ersetzen, ohne
  Code zu aendern.

  Die Beschreibungen sind absichtlich sehr konkret: Sie werden im Auto
  gelesen, oft in der Sonne und mit wenig Geduld.
*/
const FOTO_AUFTRAEGE = [
  {
    id: "fahrstufe",
    titel: "Fahrstufenwahl auf dem Bildschirm",
    ersetzt: "eine Zeichnung",
    wie: "Im sicher geparkten Auto auf die Bremse treten. Eine zweite Person fotografiert den linken Bildschirmrand mit der Fahrstufenwahl. Keine Fahrstufe wechseln.",
    achte: "Der Streifen und die angezeigte Parkstellung sollen gut lesbar sein. Persönliche Ziele auf der Karte nicht mit aufnehmen."
  },
  {
    id: "tempomat",
    titel: "Rechtes Rädchen am Lenkrad",
    ersetzt: "eine Zeichnung",
    wie: "Im geparkten Auto das Lenkrad von vorn fotografieren. Das rechte Rädchen soll deutlich zu sehen sein.",
    achte: "Keine Finger davor und keine Spiegelung. Das Rädchen nicht zur Demonstration während der Fahrt bedienen."
  },
  {
    id: "ladebuchse",
    titel: "Ladebuchse offen, aus der Nähe",
    ersetzt: "eine Zeichnung",
    wie: "Auto aufschließen, Klappe hinten links öffnen. Etwa einen Schritt Abstand, Buchse mittig im Bild.",
    achte: "Beide Teile der Buchse sollen drauf sein, oben und unten. Kein Gegenlicht, sonst wird das Schwarz zu dunkel."
  },
  {
    id: "waschmodus",
    titel: "Bildschirm: Waschanlagen-Modus",
    ersetzt: "eine Zeichnung",
    wie: "Im Auto: Fahrzeug, dann Service. So weit scrollen, dass „Waschanlagen-Modus“ mit seinem Schalter zu sehen ist.",
    achte: "Gerade von vorn fotografieren, nicht schräg. Bildschirm füllt das Bild. Auf Spiegelungen achten."
  },
  {
    id: "ladeleuchte",
    titel: "Leuchte am Ladeanschluss beim Laden",
    ersetzt: "eine Zeichnung",
    wie: "Während geladen wird: Nahaufnahme des Tesla-T neben der Buchse, solange es grün leuchtet.",
    achte: "Am besten in der Dämmerung oder im Schatten, dann sieht man das Grün deutlich."
  },
  {
    id: "ladeanschluss",
    titel: "Auto von der Seite, Fahrerseite",
    ersetzt: "eine Zeichnung",
    wie: "Ganzes Auto von der linken Seite, Klappe geschlossen. Etwa drei Schritte Abstand, Auto füllt das Bild.",
    achte: "Auf Augenhöhe der Türgriffe, nicht von oben. Ruhiger Hintergrund."
  }
];

const DRIVING_TOPICS = [
  ["🚗", "Losfahren", "drive"],
  ["🛣️", "Tempomat", "tempomat"],
  ["🆕", "Anders", "anders"]
];

const PAGES = {
  start: {
    eyebrow: "Eine Frage. Eine Handlung.",
    title: "Was möchtest du gerade machen?",
    intro: "Bitte nur im Stand benutzen. Tippe dann auf das, was gerade dran ist.",
    choices: [
      ["🚗", "Ich fahre los", "Einsteigen und sicher starten.", "drive"],
      ["⚡", "Ich möchte laden", "Supercharger oder andere Ladesäule.", "charge"],
      ["🆘", "Ich weiß nicht weiter", "Kurze Antwort für deine Situation.", "stuck"],
      ["🏖️", "Längere Fahrt", "Das Tesla-Navi plant die Ladestopps.", "holiday"],
      ["📱", "Welche App brauche ich?", "Die richtige App für deine Aufgabe.", "apps"],
      ["🧽", "Ich fahre in die Waschanlage", "Vorher den Waschanlagen-Modus einschalten.", "carwash"]
    ]
  },

  drive: {
    parent: "start",
    topics: DRIVING_TOPICS,
    eyebrow: "Ich fahre los",
    title: "Losfahren",
    intro: "Dein Tesla hat keinen Schalthebel. Vorwärts und rückwärts wählst du auf dem Bildschirm: P heißt Parken, R rückwärts, N Leerlauf, D vorwärts.",
    figure: ["bilder/fahrstufe.svg", "Am linken Rand des Bildschirms, also auf deiner Seite, erscheint ein schmaler Streifen mit P, R, N und D. Nach oben wischen wählt D für vorwärts, nach unten wischen wählt R für rückwärts.", "Zeichnung. Der Streifen erscheint erst, wenn du im geparkten Auto auf die Bremse trittst."],
    steps: [
      "Einsteigen, Tür schließen, anschnallen. Das Auto ist jetzt an — es gibt keinen Startknopf.",
      "Fuß auf die Bremse und dort lassen. Erst dann erscheint der Streifen mit P, R, N und D — auf deiner Seite des Bildschirms.",
      "Gewünschte Richtung wählen: nach oben wischen für D (vorwärts), nach unten für R (rückwärts).",
      "Gewählte Fahrstufe auf dem Bildschirm prüfen. Beim Rückwärtsfahren auch über die Schulter und in die Spiegel schauen, nicht nur auf die Kamera.",
      "Wenn der Weg frei ist: Fuß von der Bremse nehmen und behutsam das Fahrpedal drücken."
    ],
    cards: [
      ["🅿️ Wieder parken", "Auf die Bremse treten und auf dem Streifen P antippen. Danach nachsehen, ob wirklich P angezeigt wird — verlass dich nicht darauf, dass das Auto von selbst parkt."],
      ["🔁 Vor und zurück wechseln", "Zwischen vorwärts und rückwärts geht es nur, wenn du fast stehst. Also erst anhalten, dann umschalten."],
      ["👆 Der Streifen ist weg", "Während der Fahrt blendet er sich aus. Er kommt zurück, wenn du vom Bildschirmrand zur Beifahrerseite wischst."],
      ["🛟 Wenn der Bildschirm nicht reagiert", "Über dem Innenspiegel an der Decke sitzen vier Tasten: P, R, N und D. Sie sind für den Notfall gedacht und werden dann von selbst aktiv. Bremse treten, dann D drücken."]
    ],
    note: "Bei einer längeren Strecke: Ziel ins Tesla-Navi eingeben. Der Tesla plant die nötigen Ladestopps selbst mit ein."
  },

  /* Nur der Abstandstempomat. Der Lenkassistent ist zwar auch serienmaessig,
     wird hier aber bewusst NICHT erklaert: Er verlangt dauernd Haende am
     Lenkrad, ueberwacht die Aufmerksamkeit und sperrt sich bei Nichtreaktion
     unter Warnblinken. Fuer eine unsichere Erstfahrerin ist das keine Hilfe,
     sondern eine zusaetzliche Stressquelle. Erwaehnt wird er nur, damit sie
     ihn nicht versehentlich einschaltet. */
  tempomat: {
    parent: "drive",
    topics: DRIVING_TOPICS,
    eyebrow: "Tempomat",
    title: "Tempo und Abstand halten",
    intro: "Das Auto hält Tempo und Abstand. Du lenkst selbst.",
    before: [
      ["Einmal im Stand mit Alex einstellen", "Fahrzeug > Autonomes Fahren: Abstandsgeschwindigkeitsregler wählen. Ist der Lenkassistent gewählt, muss die Aktivierung auf „Doppelklick“ stehen, nicht „Einzelklick“. Für das Starttempo „Aktuelle Geschwindigkeit“ wählen. Ist eine Einstellung unklar, zuerst Alex fragen."],
      ["Wichtig, bevor du ihn benutzt", "Hände ans Lenkrad, Augen auf die Straße, Fuß bremsbereit. Er hält nicht an Ampeln oder Stoppschildern und erkennt ein Stauende möglicherweise zu spät. Nicht in der Stadt, an Baustellen oder bei schlechter Sicht und Fahrbahn benutzen."]
    ],
    figure: ["bilder/tempomat.svg", "Am rechten Daumen des Lenkrads sitzt ein Rädchen. Hineindrücken schaltet den Tempomat ein und aus. Nach oben oder unten rollen ändert die Geschwindigkeit. Seitlich drücken ändert den Abstand.", "Zeichnung. Alles läuft über das rechte Rädchen am Lenkrad."],
    figureInDetails: true,
    detailsTitle: "Das Rädchen im Bild und weitere Hinweise",
    steps: [
      "Auf der Autobahn oder Landstraße die Geschwindigkeit fahren, die du halten willst.",
      "Das rechte Rädchen am Lenkrad einmal hineindrücken. Die eingestellte Geschwindigkeit wird blau angezeigt. Prüfe die Zahl: Je nach Einstellung kann sie höher sein als dein bisheriges Tempo.",
      "Fuß vom Gas nehmen. Das Auto hält jetzt Tempo und Abstand von selbst.",
      "Schneller oder langsamer: das Rädchen nach oben oder unten rollen.",
      "Abstand ändern: das Rädchen nach links oder rechts drücken und die angezeigte Stufe prüfen. Eine größere Zahl bedeutet mehr Abstand.",
      "Ausschalten: auf die Bremse treten. Die Zahl wird wieder grau."
    ],
    cards: [
      ["🖐️ Du fährst weiter", "Der Tempomat ist keine Selbstfahrfunktion. Er hilft beim Gasgeben und Bremsen; du behältst die Kontrolle. Hände ans Lenkrad, Augen auf die Straße, Fuß bremsbereit."],
      ["🚦 Er hält nicht an roten Ampeln", "Auch nicht an Stoppschildern. Dort musst du selbst bremsen. Der Tempomat achtet nur auf Fahrzeuge, die vor dir fahren."],
      ["🛑 Wo du ihn nicht benutzt", "In der Stadt, an Baustellen, bei starkem Regen, Schnee oder Nebel, und bei tiefstehender Sonne. Dann lieber selbst fahren."],
      ["⚡ Er kann plötzlich beschleunigen", "Biegt der Vordermann ab, fährt das Auto wieder auf die eingestellte Geschwindigkeit hoch. Das kommt manchmal überraschend — Fuß bremsbereit halten."],
      ["🚗 Stehende Autos erkennt er schlecht", "Ein Stauende oder ein liegengebliebenes Auto wird unter Umständen zu spät erkannt. Verlass dich nie darauf, dass er bremst."],
      ["🎯 Nur Tempomat, nicht mitlenken", "Der Lenkassistent ist eine andere Funktion. Diese Anleitung erklärt nur den Abstandstempomat. Falls unerwartet der Lenkassistent aktiv wird: selbst sicher weiterlenken und mit dem Bremspedal die Assistenz beenden. Die Einstellung erst wieder im Stand ändern."]
    ],
    note: "Der Tempomat ist bei deinem Auto serienmäßig dabei — du brauchst kein Zusatzpaket dafür. Bei Tempo unter 30 km/h schaltet er sich nur ein, wenn ein Auto vor dir fährt."
  },

  anders: {
    parent: "drive",
    topics: DRIVING_TOPICS,
    eyebrow: "Anders als gewohnt",
    title: "Fünf Dinge, die dich überraschen",
    intro: "Ein Elektroauto verhält sich an ein paar Stellen anders. Nichts davon ist ein Fehler.",
    cards: [
      ["🛑 Es bremst, wenn du vom Gas gehst", "Nimmst du den Fuß vom Gaspedal, wird das Auto von selbst langsamer — deutlich spürbar. Das ist gewollt, der Akku holt sich dabei Energie zurück. Bei stärkerem Bremsen gehen die Bremslichter automatisch an, der Hintermann sieht dich also. Zum Anhalten trittst du trotzdem auf die Bremse."],
      ["🔇 Kein Motorgeräusch", "Du hörst nichts, wenn das Auto an ist. Dass es fahrbereit ist, siehst du am leuchtenden Bildschirm. Es gibt keinen Startknopf und keinen Zündschlüssel."],
      ["🚪 Die Tür geht mit einem Knopf auf", "Von innen drückst du die Taste oben am Türgriff und schiebst die Tür auf. Der Hebel darunter ist eine Notentriegelung für den Stromausfall — benutz ihn nicht im Alltag, sonst kann die Scheibe Schaden nehmen."],
      ["🅿️ An der Ampel", "Wenn du stehst, zeigt der Bildschirm oft „Halten“. Dann kannst du den Fuß von der Bremse nehmen, das Auto bleibt stehen. Steht es nicht da, halte lieber die Bremse."],
      ["🌧️ Scheibenwischer sitzen am Lenkrad", "Links am Lenkrad ist eine Taste mit Wischersymbol. Einmal drücken wischt einmal. Gedrückt halten sprüht Wasser. Für Dauerbetrieb: Taste drücken, dann im Menü „Auto“ wählen."]
    ],
    note: "Wenn dich etwas anderes am Auto wundert: erst sicher parken, dann ein Foto machen und Alex fragen."
  },

  charge: {
    parent: "start",
    eyebrow: "Ich möchte laden",
    title: "Welche Ladesäule ist es?",
    choices: [
      ["🔴", "Tesla Supercharger", "Am Tesla-Logo erkennen. Keine Karte nötig.", "supercharger", "red"],
      ["🔵", "Andere Ladesäule", "Alles, was nicht von Tesla ist.", "other-charge", "blue"],
      ["❓", "Wo lade ich am besten?", "Zuhause, Supercharger, ADAC oder EWE Go.", "welche-karte", "green"],
      ["🔋", "Akku einstellen & Alltag", "Ladelimit, Akku am Ziel und tägliches Laden.", "akku-alltag"],
      ["⚡", "Es klappt nicht", "Die Säule lädt nicht.", "failed-charge", "red"],
      ["💶", "Günstig laden", "Preise vergleichen.", "cheap-charge"]
    ],
    note: "Du erkennst einen Supercharger am Tesla-Logo. Alles andere ist eine öffentliche Ladesäule von anderen Anbietern."
  },

  "welche-karte": {
    parent: "charge",
    eyebrow: "Welche Karte wann",
    title: "Die einfache Regel",
    intro: "Bei Aral pulse die ADAC-Ladekarte, an anderen unterstützten Säulen EWE Go. Das ist die Faustregel für Deutschland — der aktuelle Preis beim Anbieter zählt.",
    detailsTitle: "Tarife, Karten und mögliche Zusatzgebühren",
    figure: ["bilder/karten-regel.svg", "Tarifvergleich vom August 2026: An Aral-pulse-Säulen ADAC e-Charge 55 Cent je Kilowattstunde. An unterstützten anderen Ladepunkten EWE Go 52 bis 62 Cent gegenüber ADAC e-Charge mit 75 Cent. Aktuellen Preis und Verfügbarkeit vor dem Start in der Anbieter-App prüfen.", "Historischer Vergleich, Stand August 2026. Keine Preis- oder Akzeptanzgarantie."],
    steps: [
      "Zuhause? Meist ist das günstig. Es hängt aber von deinem Stromtarif ab.",
      "Lange Fahrt? Supercharger. Das Navi plant sie ein, du brauchst keine Karte.",
      "Steht Aral pulse an der Ladesäule? Dann den hinterlegten ADAC-e-Charge-Tarif in der Aral-pulse-App prüfen — nicht nur auf das Tankstellenschild schauen.",
      "An anderen Säulen: in EWE Go prüfen, ob der Ladepunkt unterstützt wird und was er kostet.",
      "Wird eine Karte abgelehnt: prüfen, ob die andere den Ladepunkt unterstützt. Sonst die Anleitung an der Säule befolgen oder einen anderen Ladepunkt wählen."
    ],
    cards: [
      ["⛽ Warum bei Aral pulse ADAC?", "Im Preisvergleich vom August 2026 war der ADAC-e-Charge-Tarif dort günstiger. Er muss in der Aral-pulse-App aktiviert sein. Eine ADAC-Mitgliedskarte allein ist keine Ladekarte."],
      ["🔌 Warum sonst EWE Go?", "Im damaligen Vergleich war EWE Go an unterstützten eigenen und Partner-Säulen günstiger. Das gilt nicht automatisch an jeder Säule oder im Ausland."],
      ["🤷 Unsicher, wo du stehst?", "Ladepunkt in der Anbieter-App öffnen und Preis sowie Anschluss prüfen. Chargeprice hilft beim Vergleichen; verbindlich ist das Angebot des Anbieters."],
      ["⏱️ Nicht erst bei vollem Akku auf die Uhr schauen", "Blockiergebühren können schon während des Ladens beginnen. Vor dem Start prüfen, ab wann sie gelten, und einen Wecker stellen. Auch Parkregeln am Standort beachten."]
    ],
    note: "Preisvergleich vom 31. August 2026, nicht live aktualisiert. Vor jedem Start gelten der aktuelle Tarif und mögliche Zusatzgebühren in der Anbieter-App.",
    appLinks: [OPEN_APP.chargeprice]
  },

  supercharger: {
    parent: "charge",
    eyebrow: "Tesla Supercharger",
    title: "So lädst du",
    steps: [
      "Ins Auto setzen und im Tesla-Navi einen Supercharger auswählen.",
      "Hinfahren und rückwärts am Ladeplatz parken.",
      "Aussteigen und das Ladekabel von der Säule nehmen.",
      "Die Klappe hinten links öffnen: unten draufdrücken, sie springt auf. Am Supercharger geht das auch über die Taste am Stecker.",
      "Kabel einstecken, bis es einrastet.",
      "Warten. Der Bildschirm im Auto zeigt, dass geladen wird. Eine Ladekarte brauchst du hier nicht.",
      "Zum Beenden: Taste am Stecker drücken und das Kabel abziehen. Geht es nicht, muss das Auto erst aufgeschlossen werden."
    ],
    figure: ["bilder/ladebuchse.svg", "Die Ladebuchse hat zwei Teile: oben der runde Bereich für normales Laden, darunter zwei große Löcher, die nur beim Schnellladen benutzt werden. Links leuchtet das Tesla-T.", "Zeichnung. Am Supercharger wird auch der untere Teil benutzt."],
    cards: [
      ["💳 Einmalig vorher einrichten", "Damit der Supercharger abrechnen kann, muss in der Tesla-App eine gültige Zahlungsart hinterlegt sein. Vor der ersten Fahrt gemeinsam mit Alex prüfen."]
    ],
    note: "Wenn nach etwa einer Minute nichts passiert: Kabel einmal abziehen und neu einstecken. Hilft das nicht, nimm den Nachbarplatz."
  },

  "other-charge": {
    parent: "charge",
    eyebrow: "Andere Ladesäule",
    title: "Öffentlich laden",
    intro: "Bei Aral pulse die ADAC-Ladekarte, sonst EWE Go. Die Säule muss die Karte unterstützen; vor dem Start den Preis beim Anbieter ansehen.",
    choices: [
      ["🔌", "So läuft es ab", "Der Ablauf Schritt für Schritt.", "public-charge-flow", "blue"],
      ["🚫", "Die Säule hat kein Display", "Nur Karte, Kabel und ein Lämpchen.", "no-display", "blue"],
      ["💳", "Mit der EWE-Go-Karte laden", "Meistens die günstigere.", "ewe", "green"],
      ["💳", "Mit der ADAC-Karte laden", "ADAC-Tarif bei Aral pulse prüfen.", "adac", "blue"],
      ["🗺️", "Ladestation suchen", "Chargemap zeigt Ladestationen.", "chargemap"]
    ],
    appLinks: [OPEN_APP.chargeprice],
    note: "Chargeprice hilft beim Vergleich. Verbindlich sind die aktuellen Preise und Bedingungen der Anbieter-App."
  },

  "public-charge-flow": {
    parent: "other-charge",
    eyebrow: "Andere Ladesäule",
    title: "Der Ablauf",
    figure: ["bilder/ladeanschluss.svg", "Blick auf die Fahrerseite: Der Ladeanschluss sitzt hinten links im Rücklicht.", "Zeichnung. Auto aufschließen, dann unten auf die Klappe drücken — sie springt auf."],
    steps: [
      "Ins Auto setzen und die Ladestation ins Tesla-Navi eingeben.",
      "Hinfahren und am Ladeplatz parken.",
      "Aussteigen und auf das Display der Ladesäule schauen. Dort steht, was als Nächstes kommt.",
      "Fragt die Säule zuerst nach Karte oder App? Dann erst freischalten, danach das Kabel einstecken.",
      "Steht nichts da? Dann Kabel einstecken und danach mit Karte oder App freischalten.",
      "Prüfen, ob geladen wird: Der Bildschirm im Tesla zeigt es an.",
      "Zum Beenden: in der App oder mit der Karte beenden, dann Kabel abziehen."
    ],
    note: "Es gibt keine Reihenfolge, die überall gilt. Das Display an der Säule sagt dir immer, was dran ist. Wenn du unsicher bist: mach ein Foto und frag Alex."
  },

  "no-display": {
    parent: "other-charge",
    eyebrow: "Säule ohne Display",
    title: "Dann zählt das Auto",
    detailsTitle: "Kein Kabel, andere Lichtfarbe oder Stecker klemmt?",
    intro: "Manche Ladesäulen haben nur ein Kartenfeld, zwei Steckdosen und ein kleines Lämpchen. Das ist normal und keine kaputte Säule.",
    steps: [
      "Als Erstes versuchen: Klappe hinten links öffnen und das Kabel am Auto einstecken. Steht auf der Säule etwas anderes, folge dem.",
      "Anderes Ende in die Steckdose der Säule stecken. Meist musst du dafür eine kleine Klappe hochschieben.",
      "Ladekarte an das Kartenfeld halten und einen Moment liegen lassen.",
      "Jetzt zum Auto schauen, nicht zur Säule: Blinkt das Tesla-T am Ladeanschluss grün, läuft alles.",
      "Zum Beenden: dieselbe Karte noch einmal an das Kartenfeld halten.",
      "Auto aufschließen und den Ladeanschluss am Bildschirm entriegeln. Dann Kabel abziehen. Hat der Stecker eine Taste, geht das auch darüber. Nie mit Gewalt ziehen."
    ],
    figure: ["bilder/ladeleuchte.svg", "Die Leuchte am Ladeanschluss: blinkt sie grün, wird geladen. Leuchtet sie durchgehend grün, ist der Ladevorgang fertig. Leuchtet sie rot, gibt es eine Störung.", "Grün blinkend: es lädt. Durchgehend grün: fertig. Rot: Störung."],
    cards: [
      ["🔌 Hier hängt kein Kabel", "An vielen dieser Säulen musst du dein eigenes Kabel nehmen. Es liegt im Kofferraum. An Schnellladesäulen hängt das Kabel dagegen fest dran."],
      ["🔵 Die Leuchte ist blau", "Durchgehend blau: verbunden, aber es lädt noch nicht — etwa wegen einer geplanten Startzeit. Blau blinkend: Das Auto bereitet das Laden vor. Prüfe die Ladeanzeige im Auto, bevor du die Karte erneut vorhältst."],
      ["🟡 Die Leuchte ist gelb", "Durchgehend gelb: Stecker nicht ganz eingesteckt. Gelb blinkend: Das Auto lädt mit verringerter Stromstärke. Die Meldung auf dem Bildschirm erklärt mehr."],
      ["🔒 Der Stecker rastet nicht ein", "Steck ihn noch einmal ein und halte ihn dabei leicht nach oben, bis das Auto ihn erkennt und verriegelt."],
      ["🚗 Das Kabel geht nicht mehr raus", "Das Auto verriegelt das Kabel absichtlich. Mit Schlüssel oder iPhone am Auto aufschließen. Unter Fahrzeug > Laden den Ladevorgang stoppen und den Ladeanschluss entriegeln. Eine Taste am Kabelgriff ist dafür nicht nötig."]
    ],
    note: "Die Lämpchen an der Säule bedeuten bei jedem Hersteller etwas anderes. Verlass dich deshalb auf das grüne Blinken am Auto. Wenn nichts passiert: Foto machen und Alex fragen."
  },

  adac: {
    parent: "other-charge",
    eyebrow: "ADAC e-Charge / Aral pulse",
    title: "Mit der ADAC-Karte laden",
    steps: [
      "Ins Auto setzen und zur Ladestation fahren, am Ladeplatz parken.",
      "Auf das Display der Säule schauen und der Anzeige folgen.",
      "Freischalten: Ladekarte an das Kartenfeld halten oder in der App Aral pulse den Ladepunkt starten.",
      "Kabel einstecken, wenn es die Säule verlangt. Manche Säulen wollen das zuerst.",
      "Prüfen, ob geladen wird. Der Bildschirm im Tesla zeigt es an.",
      "Zum Beenden: in der App oder mit der Karte beenden, dann Kabel abziehen."
    ],
    cards: [
      ["⛽ Wann diese Karte?", "An Aral-pulse-Säulen mit aktiviertem ADAC-e-Charge-Tarif. Aktuellen Preis in der Aral-pulse-App prüfen; das Tankstellenschild allein reicht nicht."],
      ["💶 Genau wissen?", "Chargeprice zeigt dir für die Säule, vor der du stehst, was beide Karten kosten."]
    ],
    appLinks: [OPEN_APP.chargeprice],
    links: [["ADAC e-Charge ansehen", "https://www.adac.de/rund-ums-fahrzeug/e-angebote/ladekarte/"]],
    note: "Wird die Karte nicht angenommen, probier die EWE-Go-Karte."
  },

  ewe: {
    parent: "other-charge",
    eyebrow: "EWE Go",
    title: "Mit der EWE-Go-Karte laden",
    steps: [
      "Ins Auto setzen und zur Ladestation fahren, am Ladeplatz parken.",
      "Auf das Display der Säule schauen und der Anzeige folgen.",
      "Freischalten: Ladekarte an das Kartenfeld halten oder in der App den Ladepunkt starten.",
      "Kabel einstecken, wenn es die Säule verlangt. Manche Säulen wollen das zuerst.",
      "Prüfen, ob geladen wird. Der Bildschirm im Tesla zeigt es an.",
      "Zum Beenden: in der App oder mit der Karte beenden, dann Kabel abziehen."
    ],
    cards: [
      ["🔌 Wann diese Karte?", "An eigenen und unterstützten Partner-Säulen. Vorher in EWE Go prüfen, ob der Ladepunkt dabei ist und was er kostet."],
      ["💶 Genau wissen?", "Chargeprice zeigt dir für die Säule, vor der du stehst, was beide Karten kosten."]
    ],
    appLinks: [OPEN_APP.chargeprice],
    links: [["EWE Go ansehen", "https://www.ewe-go.de/"]],
    note: "Wird die Karte nicht angenommen, probier die ADAC-Karte."
  },

  chargemap: {
    parent: "other-charge",
    eyebrow: "Chargemap",
    title: "Ladestation finden",
    intro: "Chargemap zeigt dir Ladestationen in der Nähe. Für die Fahrt selbst nimmst du danach wieder das Tesla-Navi.",
    appLinks: [OPEN_APP.chargemap]
  },

  holiday: {
    parent: "start",
    eyebrow: "Längere Fahrt",
    title: "Lass den Tesla planen",
    detailsTitle: "Reserve, Kabel und Laden am Ziel",
    intro: "Die Strecke plant das Auto. Du musst nur eine Sache vorher wissen: ob du am Ziel laden kannst.",
    shortcuts: [["Akku bei Ankunft einstellen", "zielakku"]],
    steps: [
      "Vor der Abfahrt: Kannst du am Ziel laden? Bei Hotel oder Ferienwohnung vorher anrufen und fragen.",
      "Ziel ins Tesla-Navi eingeben und Route berechnen lassen.",
      "Auf die Anzeige schauen: Das Navi zeigt, mit wie viel Prozent du ankommst. Über „% bei Ankunft einstellen“ kannst du, sofern verfügbar, deinen Wunschwert vorgeben.",
      "Kannst du am Ziel laden? Dann losfahren und den Ladestopps folgen.",
      "Kannst du dort nicht laden? Plane auch die Fahrt vom Ziel zur nächsten nutzbaren Ladesäule. Lade am letzten Stopp so viel Reserve, wie du dafür brauchst.",
      "Am Ladestopp bleiben, bis das Navi weiterfahren sagt."
    ],
    cards: [
      ["🔋 Wie viel Akku bei der Ankunft?", "Plane Reserve ein und prüfe, ob die Lademöglichkeit am Ziel wirklich nutzbar ist. 30 Prozent können ein Puffer sein, garantieren aber nicht die Rückfahrt. Entscheidend sind Strecke, Wetter und erreichbare Ladepunkte."],
      ["⏱️ Mehr Reserve gewünscht?", "Wenn verfügbar, im Navi „% bei Ankunft einstellen“ verwenden. Fehlt die Funktion, die Ankunftsschätzung beobachten und bei Bedarf am Ladestopp länger laden. Prüfe dabei, ob dein Ladelimit weiteres Laden erlaubt."],
      ["🔌 Kabel dabei?", "An manchen Ladesäulen hängt kein Kabel. Schau vor einer längeren Fahrt nach, ob dein eigenes Kabel im Kofferraum liegt."],
      ["🏨 Am Ziel angekommen", "Eine geeignete Ladesäule oder Wallbox nutzen. Eine unbekannte Haushaltssteckdose nicht einfach zum Dauerladen verwenden — vorher die Eignung und Erlaubnis klären."],
      ["🗺️ Vorher nachsehen", "In Chargemap kannst du schon zu Hause nachschauen, ob es in der Nähe deines Ziels Ladesäulen gibt."]
    ],
    appLinks: [OPEN_APP.chargemap],
    note: "Das Tesla-Navi hilft bei der Ladeplanung. Prüfe vor der Fahrt, ob du am Ziel oder auf der Weiterfahrt tatsächlich laden kannst."
  },

  carwash: {
    parent: "start",
    eyebrow: "Waschanlage",
    title: "Erst der Waschmodus",
    intro: "Schalte vor der Wäsche den Waschmodus ein. Sonst können Ladeklappe und Scheibenwischer Schaden nehmen.",
    steps: [
      "Vor der Einfahrt anhalten. Das Auto muss stehen und darf nicht laden.",
      "Auf dem Bildschirm tippen: Fahrzeug, dann Service, dann Waschanlagen-Modus.",
      "Das Auto schließt die Fenster, verriegelt die Ladeklappe und schaltet Scheibenwischer und Warntöne ab. Das passiert von selbst.",
      "Bei einer Anlage, die das Auto durchzieht: auf die Bremse treten und „Freies Rollen ein“ tippen. Das Auto bleibt dann im Leerlauf und lässt sich ziehen.",
      "Türen zu, Auto verriegelt lassen und den Bildschirm während der Wäsche in Ruhe lassen.",
      "Nach der Wäsche losfahren. Sobald du schneller als 15 km/h fährst, schaltet sich der Modus von selbst ab. Oder du tippst „Beenden“.",
      "Auf den ersten Metern ein paar Mal sanft bremsen. Das trocknet die Bremsen."
    ],
    figure: ["bilder/waschmodus.svg", "Der Weg auf dem Bildschirm: erst unten links auf das Auto-Symbol tippen, dann in der Liste auf Service, dann den Schalter neben Waschanlagen-Modus einschalten.", "Zeichnung. Auf deinem Bildschirm kann es etwas anders aussehen."],
    cards: [
      ["🚿 Selbst waschen mit Hochdruck", "Mindestens 30 cm Abstand halten, die Düse in Bewegung lassen und nicht auf eine Stelle zielen. Nicht direkt auf Dichtungen, Parksensoren oder Kameras halten. Während des Ladens niemals mit Hochdruck an den Ladeanschluss."],
      ["☀️ Nicht in der prallen Sonne", "Und kein heißes Wasser, keine scharfen Reiniger. Ein Mikrofasertuch ist besser als ein Waschhandschuh."]
    ],
    note: "Wenn du den Waschmodus vergisst, ist das kein Notfall — aber mach es beim nächsten Mal vorher. Findest du den Punkt auf dem Bildschirm nicht: Foto machen und Alex fragen."
  },

  stuck: {
    parent: "start",
    eyebrow: "Ich weiß nicht weiter",
    title: "Was ist gerade los?",
    choices: [
      ["🔋", "Akku wird knapp", "Nicht rechnen. Das Navi zeigt Ladesäulen.", "low-battery"],
      ["⚡", "Ladesäule funktioniert nicht", "Der Reihe nach durchgehen.", "failed-charge"],
      ["🚨", "Das Auto steht", "Panne, platter Reifen, nichts geht.", "panne", "red"],
      ["🔄", "Der Bildschirm sagt Update", "Kein Fehler. Was jetzt gilt.", "update", "blue"],
      ["🗺️", "Ich weiß nicht, wo ich laden soll", "Tesla-Navi oder Chargemap.", "find-charge"],
      ["❓", "Ich verstehe eine Anzeige nicht", "Foto machen und Alex fragen.", "screen-help"]
    ]
  },

  "low-battery": {
    parent: "stuck",
    eyebrow: "Akku wird knapp",
    title: "Ruhig bleiben",
    steps: [
      "Im Tesla-Navi auf das Blitz-Symbol tippen. Es zeigt Ladestationen in der Nähe.",
      "Den nächsten Supercharger auswählen — das rote Tesla-Symbol.",
      "Ist keiner erreichbar: eine andere erreichbare Säule wählen. Bei Aral pulse die ADAC-Ladekarte, sonst EWE Go — sofern die Säule die Karte unterstützt.",
      "Hinfahren und laden.",
      "Wenn du unsicher bist: Alex anrufen."
    ],
    cards: [
      ["🔋 Wann wird es wirklich knapp?", "Unter 20 Prozent solltest du ans Laden denken. Unter 10 Prozent nur noch zur nächsten Ladesäule fahren, nicht weiter. Ganz leer darf der Akku nie werden — das schadet dem Auto."]
    ],
    note: "Reichweitenangaben sind Schätzungen. Zeigt das Navi keine sicher erreichbare Säule mehr, nicht auf gut Glück weiterfahren: sicher abstellen und Pannenhilfe kontaktieren.",
    weiter: [["🛟", "Pannenhilfe finden", "Wenn kein Ladepunkt mehr erreichbar ist.", "panne"]]
  },

  /* Ruhige Alltagsregeln. Bewusst NICHT auf der Notfallseite: Wer mit
     wenig Akku unterwegs ist, braucht eine Handlung, keine Pflegetipps. */
  "akku-alltag": {
    parent: "charge",
    eyebrow: "Akku im Alltag",
    title: "Welchen Akkustand meinst du?",
    detailsTitle: "Warum diese Regeln helfen und was im Winter gilt",
    intro: "Bis wie viel Prozent laden und mit wie viel Prozent ankommen sind zwei verschiedene Einstellungen.",
    batteryComparison: true,
    shortcuts: [
      ["Akku am Reiseziel einstellen", "zielakku"],
      ["Ladelimit einstellen", "ladelimit"]
    ],
    steps: [
      "Plane zu Hause etwas Reserve ein. Rund 20 Prozent sind ein praktischer Puffer, keine feste Grenze.",
      "Unter Fahrzeug > Laden das vom Auto empfohlene tägliche Ladelimit einstellen. Nicht pauschal 80 Prozent wählen — die Empfehlung hängt vom Akku ab."
    ],
    cards: [
      ["🏠 Warum Reserve zu Hause?", "Damit du am nächsten Morgen losfahren kannst, auch wenn etwas dazwischenkommt. Auch im Stand wird Strom verbraucht; wie viel, hängt unter anderem von Einstellungen und Temperatur ab."],
      ["🔌 80 oder 100 Prozent?", "Maßgeblich ist die Empfehlung deines Autos, nicht eine allgemeine Prozentregel. Beachte auch Hinweise zum regelmäßigen Vollladen, falls dein Fahrzeug sie anzeigt."],
      ["⚡ Lieber öfter als selten", "Du musst nicht warten, bis der Akku leer ist. Häufiges Laden ist für den Akku sogar besser als seltenes."],
      ["❄️ Im Winter kommst du weniger weit", "Bei Kälte braucht das Auto mehr Strom — fürs Fahren und fürs Heizen. Das ist normal, der Akku ist nicht kaputt. Die Anzeige rechnet das schon mit ein."],
      ["🌡️ Vor der Fahrt vorheizen", "Im Winter in der Tesla-App auf Klima gehen und einschalten, am besten vor der Abfahrt und am Ladekabel. Das kann den Akku entlasten. Vor dem Losfahren trotzdem prüfen, ob alle Scheiben frei sind."],
      ["🧊 Etwas ist eingefroren", "In der Tesla-App gibt es „Fahrzeug enteisen“. Das taut Scheiben, Fenster und auch die Ladeklappe auf. Klemmt ein Türgriff, drück fest auf den vorderen Teil, um das Eis zu brechen — nicht mit Werkzeug hebeln."]
    ],
    note: "Das sind Empfehlungen, keine Vorschriften. Wenn du einmal mit 10 Prozent nach Hause kommst, ist nichts passiert."
  },

  zielakku: {
    parent: "holiday",
    eyebrow: "Akku am Reiseziel",
    title: "Mit mehr Akku ankommen",
    intro: "Du gibst dem Navi vor, wie viel Akku am Ziel übrig sein soll. Stelle das vor der Fahrt im geparkten Auto ein.",
    walkthrough: [
      ["Ziel im Tesla-Navi", "Dein Reiseziel eingeben und die Route berechnen lassen."],
      ["„% bei Ankunft einstellen“", "Diese Option in der Routenanzeige mit den Abbiegehinweisen auswählen, sofern sie angezeigt wird."],
      ["Schieberegler", "Auf den gewünschten Prozentwert schieben. Beispiel: 30 Prozent am Ziel — das ist nur ein Beispiel, keine Empfehlung für jede Fahrt."],
      ["Neue Routenplanung ansehen", "Die angezeigte Ankunftsschätzung und die Ladestopps prüfen. Folge der Ladeplanung und behalte die Schätzung unterwegs im Blick."]
    ],
    cards: [
      ["Die Option fehlt?", "Dann ist sie auf deinem aktuellen Fahrzeug- oder Softwarestand möglicherweise nicht verfügbar. Du hast nichts falsch gemacht. Nutze die Ankunftsschätzung im Navi und plane bei Bedarf mehr Ladezeit ein; das Ladelimit muss dafür hoch genug sein."],
      ["Ein Wunschwert, keine Garantie", "Wetter, Tempo und Umwege verändern den Verbrauch. Plane auch die Weiterfahrt, wenn du am Ziel nicht laden kannst."]
    ],
    shortcuts: [["Nicht verwechseln: Ladelimit", "ladelimit"]],
    links: [["Tesla-Anleitung: Akku bei Ankunft", "https://www.tesla.com/ownersmanual/model3/de_de/GUID-01F1A582-99D1-4933-B5FB-B2F0203FFE6F.html"]],
    note: "Hier stellst du nichts am Auto um. Diese Hilfe zeigt nur den Bedienweg. Die Ankunftseinstellung gehört ins Tesla-Navi, nicht in die Ladeeinstellungen."
  },

  ladelimit: {
    parent: "akku-alltag",
    eyebrow: "Ladelimit",
    title: "Bis wie viel Prozent laden?",
    intro: "Das Ladelimit ist der Akkustand, bis zu dem das Auto aufladen soll. Es ist nicht der Akkustand bei Ankunft.",
    walkthrough: [
      ["Batteriesymbol im Auto", "Im geparkten Auto auf das Batteriesymbol am Bildschirm tippen. Alternativ: Fahrzeug > Laden bzw. Aufladen."],
      ["„Limit einstellen“", "Den Schieberegler in den Ladeeinstellungen suchen."],
      ["Gewünschten Wert wählen", "Den Regler verschieben und die Prozentzahl prüfen. Für den Alltag die Empfehlung deines Autos verwenden — nicht pauschal 80 oder 100 Prozent."],
      ["Einstellung kontrollieren", "Der Wert gilt für sofortiges und geplantes Laden. Vor dem Verlassen des Autos prüfen, ob der Ladevorgang tatsächlich gestartet ist."]
    ],
    detailsTitle: "Am iPhone und vor einer längeren Fahrt",
    cards: [
      ["Auch in der Tesla-App", "Dein Auto öffnen und das Laden-Symbol antippen. Dort das Ladelimit anpassen und den angezeigten Wert kontrollieren. Die Ansicht kann je nach App-Version anders aussehen."],
      ["Nur für eine lange Fahrt höher laden", "Wenn das Auto beim Erhöhen ein einmaliges höheres Ladelimit anbietet, kannst du diese Option nutzen. Sie kehrt danach zum vorherigen Wert zurück. Sonst nach der Fahrt die Alltagsempfehlung wieder einstellen."],
      ["Mehr Akku am Reiseziel?", "Das planst du im Navi über „% bei Ankunft einstellen“, sofern verfügbar. Ein höheres Ladelimit allein sagt dem Navi nicht, wie viel Reserve du am Ziel möchtest."]
    ],
    shortcuts: [["Stattdessen Akku am Reiseziel", "zielakku"]],
    links: [["Tesla-Anleitung: Ladelimit", "https://www.tesla.com/ownersmanual/model3/de_de/GUID-BEE08D47-0CE0-4BDD-83F2-9854FB3D578F.html"]],
    note: "Diese Seite ist nur eine Anleitung. Der echte Regler befindet sich im Auto oder in der Tesla-App."
  },

  "failed-charge": {
    parent: "stuck",
    eyebrow: "Ladesäule funktioniert nicht",
    title: "Der Reihe nach",
    steps: [
      "Ladevorgang beenden und das Kabel entriegeln. Lässt es sich leicht abziehen, kurz warten und wieder fest einstecken. Nie mit Gewalt ziehen.",
      "Auf das Display der Säule schauen: Steht dort eine Meldung?",
      "Hat die Säule kein Display? Dann schau auf das Tesla-T am Ladeanschluss: grünes Blinken heißt, es lädt.",
      "In der App prüfen, ob der Ladepunkt frei und in Betrieb ist.",
      "Es mit einem anderen Ladeplatz an derselben Station versuchen.",
      "Klappt es immer noch nicht: Foto machen und Alex fragen."
    ]
  },

  "find-charge": {
    parent: "stuck",
    eyebrow: "Ladestation suchen",
    title: "Zwei Wege",
    steps: [
      "Am schnellsten: im Tesla-Navi auf das Blitz-Symbol tippen.",
      "Oder: unten auf einen der Knöpfe tippen. Die App öffnet sich dann auf deinem iPhone."
    ],
    appLinks: [OPEN_APP.chargemap, OPEN_APP.maps]
  },

  "cheap-charge": {
    parent: "charge",
    eyebrow: "Günstig laden",
    title: "Preise vergleichen",
    intro: "Chargeprice zeigt, was das Laden an einer Station mit deiner Karte kostet. Die Preise können sich ändern.",
    appLinks: [OPEN_APP.chargeprice]
  },

  panne: {
    parent: "stuck",
    eyebrow: "Das Auto steht",
    title: "Ruhig bleiben",
    intro: "Erst in Sicherheit bringen, dann telefonieren. Selbst reparieren musst du nichts.",
    steps: [
      "Warnblinker einschalten und wenn möglich rechts ranfahren.",
      "Aussteigen und hinter die Leitplanke gehen, nicht neben dem Auto stehen bleiben.",
      "Alex anrufen. Wenn er nicht erreichbar ist: ADAC-Pannenhilfe.",
      "Warten, bis Hilfe da ist."
    ],
    cards: [
      ["🚛 Ganz wichtig beim Abschleppen", "Ein Tesla darf NICHT mit Rädern auf der Straße gezogen werden — auch nicht mit angehobener Achse. Er muss komplett auf einen Anhänger. Sag das dem Abschleppdienst. Wenn jemand ihn trotzdem ziehen will: nicht zustimmen und Alex anrufen."],
      ["🛞 Platter Reifen", "Es gibt kein Ersatzrad und keinen Wagenheber — das ist bei diesem Auto normal. Langsam bis zur nächsten sicheren Stelle rollen, dann Pannenhilfe rufen. Nicht mit platten Reifen weiterfahren."],
      ["🔌 Das Auto reagiert auf gar nichts", "Bildschirm bleibt schwarz, das Handy schließt nicht auf? Dann ist meist die kleine Zusatzbatterie leer, nicht der große Akku. Das kann nur die Pannenhilfe lösen."],
      ["🛑 Die Bremse geht nicht", "Im Notfall: die Parken-Taste an der Dachkonsole gedrückt halten. Das Auto bremst dann kontrolliert bis zum Stillstand. Nicht mit dem Bremspedal pumpen."],
      ["📇 Handy leer, Auto geht nicht auf", "Nimm die Schlüsselkarte. Halte sie an die Säule zwischen Fahrer- und Fondtür, etwa auf einem Drittel der Höhe. Zum Losfahren die Karte auf die Ablage für das Handy in der Mittelkonsole legen, dann Bremse treten."]
    ],
    appLinks: [OPEN_APP.adacHelp],
    note: "Die Tesla-Pannenhilfe erreichst du auch über die Tesla-App unter Service. Ruf im Zweifel lieber einmal zu früh an als zu spät."
  },

  update: {
    parent: "stuck",
    eyebrow: "Update",
    title: "Das Auto aktualisiert sich",
    intro: "Der Bildschirm zeigt einen Fortschrittsbalken und du kannst nicht losfahren. Das ist kein Fehler.",
    steps: [
      "Ruhig bleiben. Das Auto bekommt eine neue Version, wie das iPhone.",
      "Warten. Meist dauert es etwa eine halbe Stunde, manchmal länger.",
      "Im Auto sitzen bleiben oder in der Nähe warten. Abbrechen geht nicht.",
      "Wenn der Balken durch ist, fährst du wie immer los."
    ],
    cards: [
      ["📅 Einen passenden Zeitpunkt wählen", "Die Installation lässt sich für einen Zeitpunkt planen, an dem du das Auto nicht brauchst. Gemeinsam mit Alex einstellen; eine dauerhafte Garantie „nur nachts“ ist das nicht."],
      ["⏳ Du hast einen Termin?", "Ruf an und sag Bescheid, dass es später wird. Das Update lässt sich nicht abbrechen, sobald es läuft."]
    ],
    note: "Solange nur ein Pfeil oder eine Uhr oben im Bildschirm zu sehen ist, läuft noch kein Update — dann kannst du normal fahren."
  },

  "screen-help": {
    parent: "stuck",
    eyebrow: "Anzeige unklar",
    title: "Das musst du nicht allein herausfinden",
    intro: "Erst sicher parken, dann ein Foto von der Anzeige machen und Alex schicken.",
    note: "Lies den Wortlaut der Meldung: Fordert das Auto dich zum Anhalten auf, halte an einer sicheren Stelle an. Eine rote Anzeige nicht ignorieren. Die Farbe allein sagt nicht, welche Handlung nötig ist."
  },

  apps: {
    parent: "start",
    eyebrow: "Welche App brauche ich?",
    title: "Eine Aufgabe, eine App",
    intro: "Tippe auf eine Schaltfläche. Die App öffnet sich direkt auf deinem iPhone.",
    appLinks: [
      ["🚗", "Tesla-App öffnen", "https://www.tesla.com/1/app/home", "Fahren, Navigation und Ladeplanung"],
      ["🗺️", "Chargemap öffnen", "https://chargemap.com/de-de/map", "Wo steht die nächste Ladesäule?"],
      ["💶", "Chargeprice öffnen", "https://www.chargeprice.app/", "Was kostet das Laden mit welcher Karte?"],
      ["🛟", "ADAC Pannenhilfe öffnen", "https://www.adac.de/hilfe", "Wenn das Auto stehen bleibt"]
    ],
    cards: [
      ["💳 ADAC e-Charge", "Mit der ADAC-Ladekarte laden. Die passende App heißt Aral pulse — dort steckt dein ADAC-Tarif drin.", "https://www.adac.de/rund-ums-fahrzeug/e-angebote/ladekarte/"],
      ["💳 EWE Go", "Mit der EWE-Go-Karte laden. Öffne die App direkt auf dem Startbildschirm deines iPhones.", "https://www.ewe-go.de/"]
    ],
    note: "Im Zweifel reicht die Tesla-App. Die anderen brauchst du nur beim Laden an fremden Säulen."
  },

  sources: {
    parent: "start",
    eyebrow: "Woher die Angaben kommen",
    title: "Quellen",
    intro: "Diese App fasst nur zusammen. Verbindlich ist immer die offizielle Anleitung deines Fahrzeugs und die Anzeige an der Ladesäule.",
    links: [
      ["Tesla Model 3 Bedienungsanleitung", "https://www.tesla.com/ownersmanual/model3/de_de/"],
      ["Tesla Anleitung: Reinigung und Waschanlage", "https://www.tesla.com/ownersmanual/model3/de_de/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html"],
      ["Tesla Anleitung: Anweisungen zum Laden", "https://www.tesla.com/ownersmanual/model3/de_de/GUID-BEE08D47-0CE0-4BDD-83F2-9854FB3D578F.html"],
      ["Tesla Anleitung: Navigation und Akku bei Ankunft", "https://www.tesla.com/ownersmanual/model3/de_de/GUID-01F1A582-99D1-4933-B5FB-B2F0203FFE6F.html"],
      ["Tesla Anleitung: Abstandstempomat", "https://www.tesla.com/ownersmanual/model3/de_de/GUID-DA920829-F1FA-44F9-8754-6D914C524A79.html"],
      ["Tesla Anleitung: Transport", "https://www.tesla.com/ownersmanual/model3/de_de/GUID-FA9E3DC9-805C-45BD-A64D-C4B3F491B8C0.html"],
      ["Tesla Anleitung: Software-Updates", "https://www.tesla.com/ownersmanual/model3/de_de/GUID-A5A60CB3-7659-4B08-B2FD-AFD12C2D6EE1.html"],
      ["Tesla Support: Supercharger", "https://www.tesla.com/de_DE/support/charging/supercharger"],
      ["Tesla Support: Tesla App", "https://www.tesla.com/de_DE/support/tesla-app"],
      ["Tesla Pannenhilfe", "https://www.tesla.com/de_DE/support/roadside-assistance"],
      ["ADAC e-Charge", "https://www.adac.de/rund-ums-fahrzeug/e-angebote/ladekarte/"],
      ["EWE Go: Häufige Fragen", "https://www.ewe-go.de/faq"],
      ["EWE Go", "https://www.ewe-go.de/"],
      ["Chargemap", "https://chargemap.com/de-de"],
      ["Chargeprice", "https://www.chargeprice.app/"]
    ],
    cards: [
      ["📷 Bilder", "Alle Zeichnungen in dieser App sind selbst erstellt. Es werden keine Abbildungen aus dem Tesla-Handbuch verwendet, die sind urheberrechtlich geschützt."]
    ],
    note: "Preise, Tarife und Funktionen ändern sich. Angaben in dieser App können veraltet sein."
  },

  /* Versteckte Seite. Sie steht in keiner Auswahl und wird nur ueber den
     Hinweis im Alex-Dialog oder direkt ueber "#setup" erreicht. */
  setup: {
    parent: "start",
    eyebrow: "Einmalige Einrichtung",
    title: "Nummer für „Alex fragen“",
    intro: "Trag hier einmal die Handynummer ein. Danach funktionieren Anrufen und WhatsApp.",
    form: "contact",
    note: "Die Nummer wird lokal in diesem Browser gespeichert, nicht ins Repository hochgeladen. Andere Personen mit Zugriff auf dieses Browserprofil können sie sehen. Beim Öffnen von WhatsApp wird sie an WhatsApp übergeben."
  },

  /* Zweite versteckte Seite, nur fuer Alex. Steht in keiner Auswahl und
     wird ueber "#fotos" erreicht. Ersetzt Zeichnungen durch eigene Fotos. */
  fotos: {
    parent: "start",
    eyebrow: "Nur für Alex",
    title: "Eigene Fotos",
    intro: "Hier lassen sich die Zeichnungen durch echte Fotos ersetzen. Die Fotos bleiben auf diesem Gerät, bis du sie herunterlädst.",
    form: "fotos",
    note: "Die Fotos werden beim Aufnehmen automatisch verkleinert. Sie liegen nur in diesem Browser — auf Mutters iPhone sind sie erst zu sehen, wenn sie über „Herunterladen“ ins Projekt übernommen wurden."
  }
};
