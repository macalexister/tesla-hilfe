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
    form     - Sonderfall: "contact" zeigt das Formular fuer die Nummer
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
  chargemap: ["🗺️", "Chargemap öffnen", "https://chargemap.com/de-de/map"],
  chargeprice: ["💶", "Chargeprice öffnen", "https://www.chargeprice.app/"],
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

const PAGES = {
  start: {
    eyebrow: "Eine Frage. Eine Handlung.",
    title: "Was möchtest du gerade machen?",
    intro: "Tippe auf das, was gerade dran ist.",
    choices: [
      ["🚗", "Ich fahre los", "Einsteigen und sicher starten.", "drive"],
      ["⚡", "Ich möchte laden", "Supercharger oder andere Ladesäule.", "charge"],
      ["🏖️", "Ich fahre in den Urlaub", "Das Tesla-Navi plant die Strecke.", "holiday"],
      ["🆘", "Ich weiß nicht weiter", "Kurze Antwort für deine Situation.", "stuck"],
      ["📱", "Welche App brauche ich?", "Die richtige App für deine Aufgabe.", "apps"],
      ["🧽", "Ich fahre in die Waschanlage", "Vorher den Waschanlagen-Modus einschalten.", "carwash"]
    ]
  },

  drive: {
    parent: "start",
    eyebrow: "Ich fahre los",
    title: "Losfahren",
    intro: "Dein Tesla hat keinen Schalthebel. Vorwärts und rückwärts wählst du auf dem Bildschirm: P heißt Parken, R rückwärts, N Leerlauf, D vorwärts.",
    figure: ["bilder/fahrstufe.svg", "Am linken Rand des Bildschirms, also auf deiner Seite, erscheint ein schmaler Streifen mit P, R, N und D. Nach oben wischen wählt D für vorwärts, nach unten wischen wählt R für rückwärts.", "Zeichnung. Der Streifen erscheint erst, wenn du im geparkten Auto auf die Bremse trittst."],
    steps: [
      "Einsteigen, Tür schließen, anschnallen. Das Auto ist jetzt an — es gibt keinen Startknopf.",
      "Fuß auf die Bremse und dort lassen. Erst dann erscheint der Streifen mit P, R, N und D — auf deiner Seite des Bildschirms.",
      "Vorwärts: mit dem Finger auf dem Streifen nach oben wischen, bis D leuchtet.",
      "Rückwärts: auf dem Streifen nach unten wischen, bis R leuchtet.",
      "Beim Rückwärtsfahren nach hinten schauen — über die Schulter und in die Spiegel, nicht nur auf die Kamera.",
      "Ein kurzer Ton bestätigt den Wechsel. Oben im Bild siehst du, welche Stufe gewählt ist.",
      "Fuß von der Bremse nehmen und losfahren."
    ],
    cards: [
      ["🅿️ Wieder parken", "Auf die Bremse treten und auf dem Streifen P antippen. Danach nachsehen, ob wirklich P angezeigt wird — verlass dich nicht darauf, dass das Auto von selbst parkt."],
      ["🔁 Vor und zurück wechseln", "Zwischen vorwärts und rückwärts geht es nur, wenn du fast stehst. Also erst anhalten, dann umschalten."],
      ["👆 Der Streifen ist weg", "Während der Fahrt blendet er sich aus. Er kommt zurück, wenn du vom Bildschirmrand zur Beifahrerseite wischst."],
      ["🛟 Wenn der Bildschirm nicht reagiert", "Über dem Innenspiegel an der Decke sitzen vier Tasten: P, R, N und D. Sie sind für den Notfall gedacht und werden dann von selbst aktiv. Bremse treten, dann D drücken."]
    ],
    note: "Bei einer längeren Strecke: Ziel ins Tesla-Navi eingeben. Der Tesla plant die nötigen Ladestopps selbst mit ein."
  },

  charge: {
    parent: "start",
    eyebrow: "Ich möchte laden",
    title: "Welche Ladesäule ist es?",
    choices: [
      ["🔴", "Tesla Supercharger", "Rote Tesla-Säule. Keine Karte nötig.", "supercharger", "red"],
      ["🔵", "Andere Ladesäule", "Alles, was nicht von Tesla ist.", "other-charge", "blue"],
      ["❓", "Wo lade ich am besten?", "Zuhause, Supercharger, ADAC oder EWE Go.", "welche-karte", "green"],
      ["🔋", "Akku im Alltag", "Wie viel laden, wie oft.", "akku-alltag"]
    ],
    note: "Du erkennst einen Supercharger am Tesla-Logo. Alles andere ist eine öffentliche Ladesäule von anderen Anbietern."
  },

  "welche-karte": {
    parent: "charge",
    eyebrow: "Welche Karte wann",
    title: "Die einfache Regel",
    intro: "Merk dir nur einen Satz: An Aral die ADAC-Karte, überall sonst die EWE-Go-Karte.",
    figure: ["bilder/karten-regel.svg", "Eine Übersicht: An einer Aral-Tankstelle kostet die ADAC-Karte 55 Cent je Kilowattstunde und ist damit günstiger. An allen anderen Säulen kostet die EWE-Go-Karte 52 bis 62 Cent und ist günstiger als die ADAC-Karte mit 75 Cent.", "Preise können sich ändern."],
    steps: [
      "Zuhause? Dann dort laden, das ist immer am günstigsten.",
      "Lange Fahrt? Supercharger. Das Navi plant sie ein, du brauchst keine Karte.",
      "Stehst du an einer Aral-Tankstelle? Dann die ADAC-Karte.",
      "An jeder anderen Säule: die EWE-Go-Karte.",
      "Wird eine Karte abgelehnt: die andere probieren. Eine von beiden geht fast immer."
    ],
    cards: [
      ["⛽ Warum an Aral die ADAC-Karte?", "Der ADAC-Tarif läuft über Aral pulse. An deren eigenen Säulen kostet er 55 Cent statt 62 Cent mit EWE Go. Aral-Säulen stehen meist an Tankstellen — du erkennst sie am blau-weißen Aral-Zeichen."],
      ["🔌 Warum sonst EWE Go?", "Überall außerhalb von Aral kostet die ADAC-Karte 75 Cent, die EWE-Go-Karte dagegen 52 bis 62 Cent. Bei einer vollen Ladung sind das schnell 6 bis 11 Euro Unterschied."],
      ["🤷 Unsicher, wo du stehst?", "Dann nimm die EWE-Go-Karte. Sie ist öfter die günstigere. Falsch machen kannst du nichts — es wird nur ein paar Euro teurer."],
      ["⏱️ Nicht ewig stehen lassen", "Bei EWE Go an fremden Säulen kommt nach vier Stunden eine Gebühr dazu. Wenn du länger parkst, steck ab, sobald das Auto voll ist."]
    ],
    note: "Die Preise ändern sich hin und wieder. Wenn du es genau wissen willst, zeigt Chargeprice den Preis für die Säule, vor der du gerade stehst.",
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
      ["💳 Einmalig vorher einrichten", "Damit der Supercharger abrechnen kann, muss in der Tesla-App eine Zahlungsart hinterlegt sein. Das hat Alex eingerichtet — wenn die Säule trotzdem nach Bezahlung fragt, ruf ihn an."]
    ],
    note: "Wenn nach etwa einer Minute nichts passiert: Kabel einmal abziehen und neu einstecken. Hilft das nicht, nimm den Nachbarplatz."
  },

  "other-charge": {
    parent: "charge",
    eyebrow: "Andere Ladesäule",
    title: "Öffentlich laden",
    intro: "Nicht jede Karte funktioniert an jeder Säule. Der Ablauf ist bei jedem Anbieter etwas anders.",
    choices: [
      ["🔌", "So läuft es ab", "Der Ablauf Schritt für Schritt.", "public-charge-flow", "blue"],
      ["🚫", "Die Säule hat kein Display", "Nur Karte, Kabel und ein Lämpchen.", "no-display", "blue"],
      ["💳", "Mit der EWE-Go-Karte laden", "Meistens die günstigere.", "ewe", "green"],
      ["💳", "Mit der ADAC-Karte laden", "Günstiger an Aral-Tankstellen.", "adac", "blue"],
      ["🗺️", "Ladestation suchen", "Chargemap zeigt Ladestationen.", "chargemap"]
    ]
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
    intro: "Manche Ladesäulen haben nur ein Kartenfeld, zwei Steckdosen und ein kleines Lämpchen. Das ist normal und keine kaputte Säule.",
    steps: [
      "Als Erstes versuchen: Klappe hinten links öffnen und das Kabel am Auto einstecken. Steht auf der Säule etwas anderes, folge dem.",
      "Anderes Ende in die Steckdose der Säule stecken. Meist musst du dafür eine kleine Klappe hochschieben.",
      "Ladekarte an das Kartenfeld halten und einen Moment liegen lassen.",
      "Jetzt zum Auto schauen, nicht zur Säule: Blinkt das Tesla-T am Ladeanschluss grün, läuft alles.",
      "Zum Beenden: dieselbe Karte noch einmal an das Kartenfeld halten.",
      "Danach das Kabel abziehen. Hat der Stecker eine Taste, diese gedrückt halten. Geht es schwer, muss das Auto aufgeschlossen sein."
    ],
    figure: ["bilder/ladeleuchte.svg", "Die Leuchte am Ladeanschluss: blinkt sie grün, wird geladen. Leuchtet sie durchgehend grün, ist der Ladevorgang fertig. Leuchtet sie rot, gibt es eine Störung.", "Grün blinkend: es lädt. Durchgehend grün: fertig. Rot: Störung."],
    cards: [
      ["🔌 Hier hängt kein Kabel", "An vielen dieser Säulen musst du dein eigenes Kabel nehmen. Es liegt im Kofferraum. An Schnellladesäulen hängt das Kabel dagegen fest dran."],
      ["🔵 Die Leuchte ist blau", "Blau heißt: Kabel steckt, es wird aber noch nicht geladen. Meist fehlt die Freischaltung — Karte noch einmal vorhalten. Gelb heißt: Stecker sitzt nicht richtig, einmal abziehen und fest einstecken."],
      ["🔒 Der Stecker rastet nicht ein", "Steck ihn noch einmal ein und halte ihn dabei leicht nach oben, bis das Auto ihn erkennt und verriegelt."],
      ["🚗 Das Kabel geht nicht mehr raus", "Das Auto verriegelt das Kabel absichtlich. Es muss aufgeschlossen sein, damit du es abziehen kannst. Hab den Schlüssel oder dein iPhone dabei und drücke die Taste am Kabelgriff."]
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
    links: [["ADAC e-Charge ansehen", "https://www.adac.de/rund-ums-fahrzeug/e-angebote/ladekarte/"]],
    note: "Diese Karte lohnt sich vor allem an Aral-Tankstellen. Wird sie nicht angenommen, probier die EWE-Go-Karte."
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
    links: [["EWE Go ansehen", "https://www.ewe-go.de/"]],
    note: "Das ist an den meisten Säulen die günstigere Karte. Wird sie nicht angenommen, probier die ADAC-Karte."
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
    eyebrow: "Ich fahre in den Urlaub",
    title: "Lass den Tesla planen",
    intro: "Die Strecke plant das Auto. Du musst nur eine Sache vorher wissen: ob du am Ziel laden kannst.",
    steps: [
      "Vor der Abfahrt: Kannst du am Ziel laden? Bei Hotel oder Ferienwohnung vorher anrufen und fragen.",
      "Ziel ins Tesla-Navi eingeben und Route berechnen lassen.",
      "Auf die Anzeige schauen: Das Navi zeigt, mit wie viel Prozent du ankommst.",
      "Kannst du am Ziel laden? Dann losfahren und den Ladestopps folgen.",
      "Kannst du dort nicht laden? Dann am letzten Stopp länger stehen bleiben, bis die Ankunft über 30 Prozent zeigt.",
      "Am Ladestopp bleiben, bis das Navi weiterfahren sagt."
    ],
    cards: [
      ["🔋 Wie viel Akku bei der Ankunft?", "Wenn du am Ziel laden kannst, sind 10 bis 15 Prozent völlig in Ordnung — das ist so geplant und nicht knapp. Kannst du dort nicht laden, sollten es mindestens 30 Prozent sein. Dann kommst du auch wieder weg und findest in Ruhe eine Ladesäule."],
      ["⏱️ Zu wenig? Dann länger laden", "Kommt dir die Zahl zu knapp vor, bleib am letzten Ladestopp einfach ein paar Minuten länger stehen. Die Ankunftsanzeige steigt dabei mit."],
      ["🔌 Kabel dabei?", "An manchen Ladesäulen hängt kein Kabel. Schau vor einer längeren Fahrt nach, ob dein eigenes Kabel im Kofferraum liegt."],
      ["🏨 Am Ziel angekommen", "Wenn es dort eine Steckdose oder Ladesäule gibt: über Nacht anstecken. Langsam laden ist für den Akku am besten."],
      ["🗺️ Vorher nachsehen", "In Chargemap kannst du schon zu Hause nachschauen, ob es in der Nähe deines Ziels Ladesäulen gibt."]
    ],
    appLinks: [OPEN_APP.chargemap],
    note: "Du musst nicht selbst ausrechnen, wann geladen wird. Das macht der Tesla. Die einzige Frage, die er dir nicht beantwortet, ist die nach der Steckdose am Ziel."
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
      ["🗺️", "Ich weiß nicht, wo ich laden soll", "Tesla-Navi oder Chargemap.", "find-charge"],
      ["💶", "Ich möchte günstig laden", "Preise vergleichen.", "cheap-charge"],
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
      "Ist keiner in der Nähe: eine andere Säule nehmen und die ADAC-Karte bereitlegen.",
      "Hinfahren und laden.",
      "Wenn du unsicher bist: Alex anrufen."
    ],
    cards: [
      ["🔋 Wann wird es wirklich knapp?", "Unter 20 Prozent solltest du ans Laden denken. Unter 10 Prozent nur noch zur nächsten Ladesäule fahren, nicht weiter. Ganz leer darf der Akku nie werden — das schadet dem Auto."]
    ],
    note: "Der Tesla warnt dich rechtzeitig und schlägt selbst einen Ladestopp vor. Wenn das Navi rot warnt, dass die Reichweite nicht reicht: nicht weiterfahren, sondern die nächstgelegene Säule ansteuern."
  },

  /* Ruhige Alltagsregeln. Bewusst NICHT auf der Notfallseite: Wer mit
     wenig Akku unterwegs ist, braucht eine Handlung, keine Pflegetipps. */
  "akku-alltag": {
    parent: "charge",
    eyebrow: "Akku im Alltag",
    title: "Zwei einfache Regeln",
    intro: "Um den Akku musst du dich kaum kümmern. Zwei Dinge helfen trotzdem.",
    steps: [
      "Zu Hause nie unter 20 Prozent stehen lassen.",
      "Für jeden Tag reicht es, bis etwa 80 Prozent zu laden — oder bis zu der Marke, die das Auto selbst als Empfehlung anzeigt."
    ],
    cards: [
      ["🏠 Warum 20 Prozent zu Hause?", "Damit du am nächsten Morgen losfahren kannst, auch wenn etwas dazwischenkommt. Ein stehendes Auto verliert etwa ein Prozent pro Tag — nach zwei Wochen Urlaub sind das schon 14 Prozent."],
      ["🔌 Warum nur 80 Prozent?", "Der Akku hält länger, wenn er nicht ständig randvoll ist. Ganz voll laden lohnt sich nur vor einer langen Fahrt."],
      ["⚡ Lieber öfter als selten", "Du musst nicht warten, bis der Akku leer ist. Häufiges Laden ist für den Akku sogar besser als seltenes."]
    ],
    note: "Das sind Empfehlungen, keine Vorschriften. Wenn du einmal mit 10 Prozent nach Hause kommst, ist nichts passiert."
  },

  "failed-charge": {
    parent: "stuck",
    eyebrow: "Ladesäule funktioniert nicht",
    title: "Der Reihe nach",
    steps: [
      "Kabel abziehen, kurz warten, wieder fest einstecken. Dabei den Stecker leicht nach oben halten.",
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
    parent: "stuck",
    eyebrow: "Günstig laden",
    title: "Preise vergleichen",
    intro: "Chargeprice zeigt, was das Laden an einer Station mit deiner Karte kostet. Die Preise können sich ändern.",
    appLinks: [OPEN_APP.chargeprice]
  },

  "screen-help": {
    parent: "stuck",
    eyebrow: "Anzeige unklar",
    title: "Das musst du nicht allein herausfinden",
    intro: "Mach ein Foto von der Anzeige und schick es Alex. Er sagt dir, was zu tun ist.",
    note: "Eine ROTE Warnung oder eine Anweisung auf dem Bildschirm bedeutet: sicher anhalten, sobald es geht. Alles andere kannst du in Ruhe fotografieren und Alex fragen."
  },

  apps: {
    parent: "start",
    eyebrow: "Welche App brauche ich?",
    title: "Eine Aufgabe, eine App",
    intro: "Tippe auf eine Schaltfläche. Die App öffnet sich direkt auf deinem iPhone.",
    appLinks: [
      ["🚗", "Tesla-App öffnen", "https://www.tesla.com/1/app/home", "Fahren, Navigation und Ladeplanung"],
      ["🗺️", "Chargemap öffnen", "https://chargemap.com/de-de/map", "Ladestationen finden"],
      ["💶", "Chargeprice öffnen", "https://www.chargeprice.app/", "Preise vergleichen"],
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
    note: "Die Nummer wird nur in diesem Browser auf diesem Gerät gespeichert. Sie steht nicht im Quelltext der App, wird nirgendwo hochgeladen und ist für niemanden sonst sichtbar."
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
