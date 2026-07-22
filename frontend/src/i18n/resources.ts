// hier sind alle texte für alle sprachen verzeichnet

import deCommon from "./de/common.json";
import deHome from "./de/home.json";

import enCommon from "./en/common.json";
import enHome from "./en/home.json";

export const resources = {
  de: {
    common: deCommon,
    home: deHome,
  },
  en: {
    common: enCommon,
    home: enHome,
  },
} as const;

// as const weist ts dazu an, das resources-objekt als unveränderliche konfiguration zu behandeln und die exakten werte (z. B. "de" oder "en") statt allgemeiner typen wie string zu verwenden, wodurch eine bessere typprüfung und autovervollständigung ermöglicht wird.
