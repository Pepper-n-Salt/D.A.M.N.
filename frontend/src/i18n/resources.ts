// Hier sind alle Texte für alle Sprachen verzeichnet.

import deCommon from "./de/common.json";
import deHome from "./de/home.json";
import deAbout from "./de/about.json";

import enCommon from "./en/common.json";
import enHome from "./en/home.json";
import enAbout from "./en/about.json";

export const resources = {
  de: {
    common: deCommon,
    home: deHome,
    about: deAbout,
  },
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
  },
} as const;

// "as const" weist ts dazu an, das resources-objekt als unveränderliche Konfiguration zu behandeln und die exakten Werte (z. B. "de" oder "en") statt allgemeiner Typen wie string zu verwenden, wodurch eine bessere Typprüfung und Autovervollständigung ermöglicht wird.
