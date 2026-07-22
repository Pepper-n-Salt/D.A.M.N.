// Diese Datei initialisiert und konfiguriert i18next für unsere React-Anwendung. Sie verbindet i18next mit React, lädt die verfügbaren Übersetzungsressourcen und definiert zentrale Einstellungen wie Standardsprache, Fallback-Sprache und Namespaces.

import i18n from "i18next"; // Importiert die i18next-Bibliothek für die Verwaltung von Übersetzungen.
import { initReactI18next } from "react-i18next"; // Verbindet i18next mit React und ermöglicht die Nutzung von Hooks wie useTranslation().
import { resources } from "./resources"; // Importiert das Übersetzungsobjekt.

i18n.use(initReactI18next).init({
  // use() bindet das React-Plugin an i18next.
  // init() startet die Konfiguration mit den definierten Übersetzungen und Einstellungen.
  resources,
  // Legt die Standardsprache der Anwendung fest.
  lng: "en",
  fallbackLng: "de",

  // Definiert den Standard-Namespace, der verwendet wird, wenn kein Namespace angegeben wird. // festgelegte Schlüssel, lassen sich nicht umbenennen :(
  defaultNS: "common",
  // Verfügbare Namespaces für die verschiedenen Bereiche der Anwendung.
  ns: [
    "common",
    "home",
    "about",
    "contact",
    "login",
    "user",
    "artworks",
    "exhibitions",
    "screens",
    "newUser",
    "newArtwork",
    "newExhibition",
    "newScreen",
    "imprint",
    "privacy",
  ],

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
