// Diese Datei initialisiert und konfiguriert i18next für unsere React-App. Sie verbindet die Bib. mit React, lädt die verfügbaren Übersetzungen und legt grundlegende Einstellungen wie Standardsprache, Fallback-Sprache und Namespaces fest.

import i18n from "i18next"; // import Bib. i18n
import { initReactI18next } from "react-i18next"; // Importiert das React-Plugin, das i18next mit React verbindet und die Verwendung des Hooks useTranslation() ermöglicht.
import { resources } from "./resources"; // importiert das Übersetzungsobjekt

i18n.use(initReactI18next).init({
  // Die Methode use() bindet das React-Plugin an i18next. Anschließend initialisiert init() die Bibliothek mit den Übersetzungen und den definierten Konfigurationsoptionen.
  resources,
  lng: "en",
  fallbackLng: "de",

  defaultNS: "common", // festgelegte Schlüssel, lassen sich nicht umbenennen :(
  ns: ["common", "home"],

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
