// Hier sind alle Texte für alle Sprachen verzeichnet.

import deCommon from "./de/common.json";
import deHome from "./de/home.json";
import deAbout from "./de/about.json";
import deContact from "./de/contact.json";
import deLogin from "./de/login.json";
import deUser from "./de/user.json";
import deArtworks from "./de/artworks.json";

import enCommon from "./en/common.json";
import enHome from "./en/home.json";
import enAbout from "./en/about.json";
import enContact from "./en/contact.json";
import enLogin from "./en/login.json";
import enUser from "./en/user.json";
import enArtworks from "./en/artworks.json";

export const resources = {
  de: {
    common: deCommon,
    home: deHome,
    about: deAbout,
    contact: deContact,
    login: deLogin,
    user: deUser,
    artworks: deArtworks,
  },
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    contact: enContact,
    login: enLogin,
    user: enUser,
    artworks: enArtworks,
  },
} as const;

// "as const" weist ts dazu an, das resources-objekt als unveränderliche Konfiguration zu behandeln und die exakten Werte (z. B. "de" oder "en") statt allgemeiner Typen wie string zu verwenden, wodurch eine bessere Typprüfung und Autovervollständigung ermöglicht wird.
