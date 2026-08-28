/*
  Grundeinstellungen der App.

  Hier steht bewusst KEINE Telefonnummer. Die Nummer soll nicht im
  Repository und nicht in der Git-Historie landen. Sie kommt aus einer
  von zwei Quellen, die beide nicht eingecheckt werden:

    1. config.local.js  - Datei daneben, steht in .gitignore.
                          Vorlage: config.local.example.js
    2. localStorage     - direkt auf dem iPhone eingetragen ueber die
                          Seite "#setup" der App.

  Fehlt beides, blendet die App die Anruf- und WhatsApp-Schaltflaeche aus
  und erklaert stattdessen, wie man die Nummer eintraegt.
*/
const CONFIG = {
  contactName: "Alex",
  contactPhone: "",
  contactWhatsAppPhone: "",
  defaultWhatsAppText: "Hi Alex, ich brauche gerade Hilfe mit dem Tesla."
};
