// Hier sind alle Texte für alle Sprachen verzeichnet.

import deCommon from "./de/common.json";
import deHome from "./de/home.json";
import deAbout from "./de/about.json";
import deContact from "./de/contact.json";
import deLogin from "./de/login.json";
import deUser from "./de/user.json";
import deArtworks from "./de/artworks.json";
import deArtists from "./de/artists.json";
import deExhibitions from "./de/exhibitions.json";
import deScreens from "./de/screens.json";
import deImprint from "./de/imprint.json";
import dePrivacy from "./de/privacy.json";
import deNewUser from "./de/newUser.json";
import deNewArtwork from "./de/newArtwork.json";
import deNewArtist from "./de/newArtist.json";
import deNewExhibition from "./de/newExhibition.json";
import deNewScreen from "./de/newScreen.json";
import deDisplay from "./de/display.json";

import enCommon from "./en/common.json";
import enHome from "./en/home.json";
import enAbout from "./en/about.json";
import enContact from "./en/contact.json";
import enLogin from "./en/login.json";
import enUser from "./en/user.json";
import enArtworks from "./en/artworks.json";
import enArtists from "./en/artists.json";
import enExhibitions from "./en/exhibitions.json";
import enScreens from "./en/screens.json";
import enImprint from "./en/imprint.json";
import enPrivacy from "./en/privacy.json";
import enNewUser from "./en/newUser.json";
import enNewArtwork from "./en/newArtwork.json";
import enNewArtist from "./en/newArtist.json";
import enNewExhibition from "./en/newExhibition.json";
import enNewScreen from "./en/newScreen.json";
import enDisplay from "./en/display.json";

export const resources = {
  de: {
    common: deCommon,
    home: deHome,
    about: deAbout,
    contact: deContact,
    login: deLogin,
    user: deUser,
    artworks: deArtworks,
    artists: deArtists,
    exhibitions: deExhibitions,
    screens: deScreens,
    imprint: deImprint,
    privacy: dePrivacy,
    newUser: deNewUser,
    newArtwork: deNewArtwork,
    newArtist: deNewArtist,
    newExhibition: deNewExhibition,
    newScreen: deNewScreen,
    display: deDisplay,
  },
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    contact: enContact,
    login: enLogin,
    user: enUser,
    artworks: enArtworks,
    artists: enArtists,
    exhibitions: enExhibitions,
    screens: enScreens,
    imprint: enImprint,
    privacy: enPrivacy,
    newUser: enNewUser,
    newArtwork: enNewArtwork,
    newArtist: enNewArtist,
    newExhibition: enNewExhibition,
    newScreen: enNewScreen,
    display: enDisplay,
  },
} as const;

// "as const" weist ts dazu an, das resources-objekt als unveränderliche Konfiguration zu behandeln und die exakten Werte (z. B. "de" oder "en") statt allgemeiner Typen wie string zu verwenden, wodurch eine bessere Typprüfung und Autovervollständigung ermöglicht wird.
