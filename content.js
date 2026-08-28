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
    title: "In vier Schritten",
    steps: [
      "Einsteigen und Tür schließen.",
      "Auf die Bremse treten und getreten halten.",
      "Fahrstufe wählen: D für vorwärts, R für rückwärts.",
      "Fuß von der Bremse nehmen und losfahren."
    ],
    note: "Bei einer längeren Strecke: Ziel ins Tesla-Navi eingeben. Der Tesla schlägt die Route vor und plant nötige Ladestopps mit ein."
  },

  charge: {
    parent: "start",
    eyebrow: "Ich möchte laden",
    title: "Welche Ladesäule ist es?",
    choices: [
      ["🔴", "Tesla Supercharger", "Rote Tesla-Säule. Meist ohne Karte.", "supercharger", "red"],
      ["🔵", "Andere Ladesäule", "Alles, was nicht von Tesla ist.", "other-charge", "blue"]
    ],
    note: "Du erkennst einen Supercharger am Tesla-Logo. Alles andere ist eine fremde Ladesäule."
  },

  supercharger: {
    parent: "charge",
    eyebrow: "Tesla Supercharger",
    title: "So lädst du",
    steps: [
      "Ins Auto setzen und im Tesla-Navi einen Supercharger auswählen.",
      "Hinfahren und rückwärts am Ladeplatz parken.",
      "Aussteigen, Ladekabel von der Säule nehmen.",
      "Kabel hinten links am Auto einstecken, bis es einrastet.",
      "Warten. Der Bildschirm im Auto zeigt, dass geladen wird. Eine Ladekarte brauchst du hier normalerweise nicht.",
      "Zum Beenden: Taste am Kabelgriff drücken, Kabel abziehen, zurückhängen, weiterfahren."
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
      ["💳", "ADAC e-Charge / Aral pulse", "Deine ADAC-Ladekarte und App.", "adac", "blue"],
      ["💳", "EWE Go", "Deine EWE-Go-Karte und App.", "ewe", "green"],
      ["🗺️", "Ladestation suchen", "Chargemap zeigt Ladestationen.", "chargemap"]
    ]
  },

  "public-charge-flow": {
    parent: "other-charge",
    eyebrow: "Andere Ladesäule",
    title: "Der Ablauf",
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
      "Kabel zuerst am Auto einstecken, hinten links, bis es einrastet.",
      "Anderes Ende in die Steckdose der Säule stecken. Meist musst du dafür eine kleine Klappe hochschieben.",
      "Ladekarte an das Kartenfeld halten und einen Moment liegen lassen.",
      "Jetzt zum Auto schauen, nicht zur Säule: Blinkt das Tesla-T am Ladeanschluss grün, läuft alles.",
      "Zum Beenden: dieselbe Karte noch einmal an das Kartenfeld halten.",
      "Danach die Taste am Kabelgriff drücken und das Kabel abziehen."
    ],
    cards: [
      ["🟢 Woran du siehst, dass es lädt", "Am Auto, nicht an der Säule. Das Tesla-T am Ladeanschluss blinkt beim Laden grün, langsamer werdend, je voller der Akku ist. Ist der Ladevorgang fertig, leuchtet es durchgehend grün. Leuchtet es rot, gibt es eine Störung — dann steht auf dem Bildschirm im Auto, was los ist."],
      ["🔌 Kabel dabei?", "An vielen dieser Säulen hängt kein Kabel. Dann brauchst du ein eigenes Ladekabel vom Typ 2. Schau vorher nach, ob eines im Auto liegt — wenn du unsicher bist, frag Alex. An Schnellladesäulen hängt das Kabel dagegen immer fest dran."],
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
      "Freischalten: Ladekarte an das Kartenfeld halten oder in der App den Ladepunkt starten.",
      "Kabel einstecken, wenn es die Säule verlangt. Manche Säulen wollen das zuerst.",
      "Prüfen, ob geladen wird. Der Bildschirm im Tesla zeigt es an.",
      "Zum Beenden: in der App oder mit der Karte beenden, dann Kabel abziehen."
    ],
    links: [["ADAC e-Charge ansehen", "https://www.adac.de/rund-ums-fahrzeug/e-angebote/ladekarte/"]],
    note: "Die ADAC-App lässt sich von hier aus nicht öffnen. Tippe sie auf dem Startbildschirm deines iPhones an. Die ADAC-Ladekarte funktioniert an vielen Säulen, aber nicht an allen. Wenn sie nicht angenommen wird, ist die Säule nicht kaputt."
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
    note: "Die EWE-Go-App lässt sich von hier aus nicht öffnen. Tippe sie auf dem Startbildschirm deines iPhones an. Die EWE-Go-Karte funktioniert an vielen Säulen, aber nicht an allen. Wenn sie nicht angenommen wird, ist die Säule nicht kaputt."
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
    steps: [
      "Ziel ins Tesla-Navi eingeben.",
      "Route berechnen lassen.",
      "Die vorgeschlagenen Ladestopps ansehen.",
      "Losfahren und den Ladestopps folgen.",
      "Am Ladestopp laden, bis das Navi weiterfahren sagt."
    ],
    note: "Du musst nicht selbst ausrechnen, wann geladen wird. Das macht der Tesla. Wenn dir der Akkustand bei Ankunft zu knapp vorkommt, lade am Stopp einfach ein paar Minuten länger."
  },

  carwash: {
    parent: "start",
    eyebrow: "Waschanlage",
    title: "Erst der Waschmodus",
    intro: "Der Tesla hat einen eigenen Modus fürs Waschen. Ohne ihn können Ladeklappe und Scheibenwischer Schaden nehmen — und dafür zahlt die Garantie nicht.",
    steps: [
      "Vor der Einfahrt anhalten. Das Auto muss stehen und darf nicht laden.",
      "Auf dem Bildschirm tippen: Fahrzeug, dann Service, dann Waschanlagen-Modus.",
      "Das Auto schließt alle Fenster, verriegelt die Ladeklappe und schaltet Scheibenwischer, Wächter-Modus und Parksensor-Töne ab.",
      "Bei einer Anlage, die das Auto durchzieht: auf die Bremse treten und „Freies Rollen ein“ tippen. Sonst zieht das Auto beim Aussteigen die Handbremse an.",
      "Türen zu, Auto verriegelt lassen und den Bildschirm während der Wäsche in Ruhe lassen.",
      "Nach der Wäsche losfahren. Ab 15 km/h schaltet sich der Modus von selbst ab, oder du tippst „Beenden“.",
      "Auf den ersten Metern ein paar Mal sanft bremsen. Das trocknet die Bremsen."
    ],
    cards: [
      ["🧼 Nur kontaktlose Waschanlagen", "Tesla schreibt ausdrücklich Anlagen ohne Bürsten vor — also solche, die das Auto nicht berühren. Bürsten und Textillappen können den Lack beschädigen. Frag im Zweifel das Personal nach einer kontaktlosen Wäsche."],
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
      ["🔋", "Akku wird knapp", "Nicht rechnen. Navi machen lassen.", "low-battery"],
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
      "Den nächsten Supercharger auswählen.",
      "Hinfahren und laden.",
      "Wenn du unsicher bist: Alex anrufen."
    ],
    note: "Der Tesla warnt dich rechtzeitig und schlägt selbst einen Ladestopp vor. Fahr ruhig weiter, bis du dort bist."
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
      "Alternativ: unten auf eine der Schaltflächen tippen. Die App öffnet sich auf deinem iPhone."
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
    note: "Solange das Auto normal fährt, ist eine unklare Anzeige selten dringend. Fahr an eine sichere Stelle, bevor du das Foto machst."
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
      ["💳 ADAC e-Charge", "Mit der ADAC-Ladekarte laden. Diese App tippst du auf dem Startbildschirm an, sie lässt sich von hier aus nicht öffnen.", "https://www.adac.de/rund-ums-fahrzeug/e-angebote/ladekarte/"],
      ["💳 EWE Go", "Mit der EWE-Go-Karte laden. Diese App tippst du auf dem Startbildschirm an, sie lässt sich von hier aus nicht öffnen.", "https://www.ewe-go.de/"]
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
  }
};
