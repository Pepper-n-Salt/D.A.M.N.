import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getArtists } from "../api/artistApi";
import type { CreateArtistResponse } from "../api/artistApi";

import { getArtworks } from "../api/artworkApi";
import type { ArtworkResponse } from "../api/artworkApi";

import { getExhibitions } from "../api/exhibitionApi";
import type { CreateExhibitionResponse } from "../api/exhibitionApi";

import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import Carouselbutton from "../components/ui/buttons/Carouselbutton";

export default function LandingPage() {
  const { t, i18n } = useTranslation("home");

  const [artists, setArtists] = useState<CreateArtistResponse[]>([]);
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [exhibitions, setExhibitions] = useState<CreateExhibitionResponse[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [artworkIndex, setArtworkIndex] = useState(0);
  const [artistIndex, setArtistIndex] = useState(0);
  const [exhibitionIndex, setExhibitionIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  /*
   * --------------------------------------------------------------------------
   * Daten laden
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    const loadLandingPage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [artistsData, artworksData, exhibitionsData] = await Promise.all([
          getArtists(languageCode),
          getArtworks(languageCode),
          getExhibitions(languageCode),
        ]);

        setArtists(artistsData);
        setArtworks(artworksData);
        setExhibitions(exhibitionsData);

        setArtworkIndex(0);
        setArtistIndex(0);
        setExhibitionIndex(0);
        setScreenIndex(0);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die Daten der Landingpage konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadLandingPage();
  }, [languageCode]);

  /*
   * --------------------------------------------------------------------------
   * Collection Overview
   * --------------------------------------------------------------------------
   */

  const screenExhibitions = useMemo(() => {
    return exhibitions.filter((exhibition) => exhibition.isScreen);
  }, [exhibitions]);

  /*
   * --------------------------------------------------------------------------
   * Aktuelle Ausstellungen
   * --------------------------------------------------------------------------
   */

  const currentExhibitions = useMemo(() => {
    const today = new Date();

    const active = exhibitions.filter((exhibition) => {
      const startDate = new Date(exhibition.startDate);
      const endDate = new Date(exhibition.endDate);

      return startDate <= today && today <= endDate;
    });

    return active.length > 0 ? active : exhibitions;
  }, [exhibitions]);

  /*
   * --------------------------------------------------------------------------
   * Artwork Carousel
   * --------------------------------------------------------------------------
   */

  const currentArtwork =
    artworks.length > 0 ? artworks[artworkIndex % artworks.length] : null;

  const showPreviousArtwork = () => {
    if (artworks.length === 0) {
      return;
    }

    setArtworkIndex((current) =>
      current === 0 ? artworks.length - 1 : current - 1
    );
  };

  const showNextArtwork = () => {
    if (artworks.length === 0) {
      return;
    }

    setArtworkIndex((current) => (current + 1) % artworks.length);
  };

  /*
   * --------------------------------------------------------------------------
   * Artist Carousel
   * --------------------------------------------------------------------------
   */

  const artistsPerPage = 3;

  const visibleArtists = useMemo(() => {
    if (artists.length === 0) {
      return [];
    }

    return Array.from({
      length: Math.min(artistsPerPage, artists.length),
    }).map((_, offset) => {
      return artists[(artistIndex + offset) % artists.length];
    });
  }, [artists, artistIndex]);

  const showPreviousArtists = () => {
    if (artists.length === 0) {
      return;
    }

    setArtistIndex((current) =>
      current === 0 ? artists.length - 1 : current - 1
    );
  };

  const showNextArtists = () => {
    if (artists.length === 0) {
      return;
    }

    setArtistIndex((current) => (current + 1) % artists.length);
  };

  /*
   * --------------------------------------------------------------------------
   * Exhibition Carousel
   * --------------------------------------------------------------------------
   */

  const currentExhibition =
    currentExhibitions.length > 0
      ? currentExhibitions[exhibitionIndex % currentExhibitions.length]
      : null;

  const showPreviousExhibition = () => {
    if (currentExhibitions.length === 0) {
      return;
    }

    setExhibitionIndex((current) =>
      current === 0 ? currentExhibitions.length - 1 : current - 1
    );
  };

  const showNextExhibition = () => {
    if (currentExhibitions.length === 0) {
      return;
    }

    setExhibitionIndex((current) => (current + 1) % currentExhibitions.length);
  };

  /*
   * --------------------------------------------------------------------------
   * Screen Carousel
   * --------------------------------------------------------------------------
   */

  const currentScreen =
    screenExhibitions.length > 0
      ? screenExhibitions[screenIndex % screenExhibitions.length]
      : null;

  const showPreviousScreen = () => {
    if (screenExhibitions.length === 0) {
      return;
    }

    setScreenIndex((current) =>
      current === 0 ? screenExhibitions.length - 1 : current - 1
    );
  };

  const showNextScreen = () => {
    if (screenExhibitions.length === 0) {
      return;
    }

    setScreenIndex((current) => (current + 1) % screenExhibitions.length);
  };

  /*
   * --------------------------------------------------------------------------
   * Datumsformatierung
   * --------------------------------------------------------------------------
   */

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(languageCode === "en" ? "en-GB" : "de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  /*
   * --------------------------------------------------------------------------
   * Loading / Error
   * --------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <section className="space-y-20 py-8">
        <P>Loading ...</P>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-20 py-8">
        <P>{error}</P>
      </section>
    );
  }

  return (
    <section className="space-y-20 py-8">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-8">
        <H1>{t("hero.title")}</H1>

        <div className="flex flex-row flex-wrap gap-12">
          <div className="flex-1 min-w-[250px]">
            <P>{t("intro.paragraph1")}</P>
          </div>

          <div className="flex-1 min-w-[250px]">
            <P>{t("intro.paragraph2")}</P>
          </div>

          <div className="flex-1 min-w-[250px]">
            <P>{t("intro.paragraph3")}</P>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SYSTEM OVERVIEW                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("overview.title")}</H2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {(
            t("overview.items", {
              returnObjects: true,
            }) as {
              title: string;
              description: string;
            }[]
          ).map((item) => (
            <div key={item.title} className="space-y-3">
              <H3>{item.title}</H3>
              <P>{item.description}</P>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* COLLECTION OVERVIEW                                                */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("landing.collectionOverview")}</H2>

        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-neutral-200">
          <div className="py-6 pr-6 border-b md:border-b-0 md:border-r border-neutral-200">
            <H3>{exhibitions.length}</H3>
            <P>{t("landing.exhibitions")}</P>
          </div>

          <div className="py-6 pr-6 md:px-6 border-b md:border-b-0 md:border-r border-neutral-200">
            <H3>{artists.length}</H3>
            <P>{t("landing.artists")}</P>
          </div>

          <div className="py-6 md:px-6 border-b md:border-b-0 md:border-r border-neutral-200">
            <H3>{artworks.length}</H3>
            <P>{t("landing.artworks")}</P>
          </div>

          <div className="py-6 pl-0 md:pl-6">
            <H3>{screenExhibitions.length}</H3>
            <P>{t("landing.screens")}</P>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* EXHIBITION CAROUSEL                                                */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <div className="flex justify-between items-end gap-6">
          <H2>{t("landing.currentExhibition")}</H2>

          <Link
            to="/landingpage/exhibitions"
            className="text-sm uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            {t("landing.viewAll")}
          </Link>
        </div>

        {currentExhibition ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-300">
              <div className="aspect-[4/3] md:aspect-auto  overflow-hidden min-h-[280px] flex items-center justify-center">
                {currentExhibition.fileUrl ? (
                  <img
                    src={currentExhibition.fileUrl}
                    alt={currentExhibition.title}
                    className="max-w-full max-h-[500px] w-auto h-auto object-contain"
                  />
                ) : (
                  <P>{t("landing.preview")}</P>
                )}
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between gap-8">
                <div className="space-y-4">
                  <H3>{currentExhibition.title}</H3>

                  {currentExhibition.subtitle && (
                    <P>{currentExhibition.subtitle}</P>
                  )}

                  {currentExhibition.description && (
                    <P>{currentExhibition.description}</P>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  {currentExhibition.location && (
                    <div className="flex justify-between gap-6 border-b border-neutral-200 pb-3">
                      <P>{t("landing.locationLabel")}</P>
                      <P>{currentExhibition.location}</P>
                    </div>
                  )}

                  <div className="flex justify-between gap-6 border-b border-neutral-200 pb-3">
                    <P>{t("landing.startDateLabel")}</P>
                    <P>{formatDate(currentExhibition.startDate)}</P>
                  </div>

                  <div className="flex justify-between gap-6">
                    <P>{t("landing.endDateLabel")}</P>
                    <P>{formatDate(currentExhibition.endDate)}</P>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Carouselbutton
                aria-label={t("landing.previousExhibition")}
                onClick={showPreviousExhibition}
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                {t("landing.previous")}
              </Carouselbutton>

              <P>
                {String(exhibitionIndex + 1).padStart(2, "0")} /{" "}
                {String(currentExhibitions.length).padStart(2, "0")}
              </P>

              <Carouselbutton
                aria-label={t("landing.nextExhibition")}
                onClick={showNextExhibition}
                className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
              >
                {t("landing.next")}

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Carouselbutton>
            </div>
          </>
        ) : (
          <P>{t("landing.noExhibition")}</P>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ARTWORK CAROUSEL                                                   */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <div className="flex justify-between items-end gap-6">
          <H2>{t("landing.currentCollection")}</H2>

          <Link
            to="/landingpage/artworks"
            className="text-sm uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            {t("landing.viewAll")}
          </Link>
        </div>

        {currentArtwork ? (
          <>
            <div className="border border-neutral-300">
              <div className="w-full overflow-hidden flex items-center justify-center max-h-500">
                {currentArtwork.fileUrl ? (
                  <img
                    src={currentArtwork.fileUrl}
                    alt={currentArtwork.title}
                    className="block w-full h-full max-w-none"
                  />
                ) : (
                  <P>{t("landing.preview")}</P>
                )}
              </div>

              <div className="border-t border-neutral-300 p-6">
                <H3>{currentArtwork.title}</H3>

                {currentArtwork.subtitle && <P>{currentArtwork.subtitle}</P>}

                <div className="mt-2">
                  <P>
                    {[
                      currentArtwork.year,
                      currentArtwork.material,
                      currentArtwork.origin,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </P>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <Carouselbutton
                aria-label={t("landing.previousArtwork")}
                onClick={showPreviousArtwork}
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                {t("landing.previous")}
              </Carouselbutton>

              <P>
                {String(artworkIndex + 1).padStart(2, "0")} /{" "}
                {String(artworks.length).padStart(2, "0")}
              </P>

              <Carouselbutton
                aria-label={t("landing.nextArtwork")}
                onClick={showNextArtwork}
                className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
              >
                {t("landing.next")}

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Carouselbutton>
            </div>
          </>
        ) : (
          <P>{t("landing.noArtworks")}</P>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ARTIST CAROUSEL                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <div className="flex justify-between items-end gap-6">
          <H2>{t("landing.artists")}</H2>

          <Link
            to="/landingpage/artists"
            className="text-sm uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            {t("landing.viewAll")}
          </Link>
        </div>

        {artists.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="border border-neutral-300 overflow-hidden"
                >
                  <div className="aspect-[4/3]  overflow-hidden flex items-center justify-center">
                    {artist.fileUrl ? (
                      <img
                        src={artist.fileUrl}
                        alt={`${artist.firstName} ${artist.lastName}`}
                        className="max-w-full max-h-[280px] w-auto h-auto object-contain"
                      />
                    ) : (
                      <P>{t("landing.preview")}</P>
                    )}
                  </div>

                  <div className="p-5">
                    <H3>
                      {artist.firstName} {artist.lastName}
                    </H3>

                    {artist.country && <P>{artist.country}</P>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Carouselbutton
                aria-label={t("landing.previousArtist")}
                onClick={showPreviousArtists}
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                {t("landing.previous")}
              </Carouselbutton>

              <P>
                {String(artistIndex + 1).padStart(2, "0")} /{" "}
                {String(artists.length).padStart(2, "0")}
              </P>

              <Carouselbutton
                aria-label={t("landing.nextArtist")}
                onClick={showNextArtists}
                className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
              >
                {t("landing.next")}

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Carouselbutton>
            </div>
          </>
        ) : (
          <P>{t("landing.noArtists")}</P>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* RECENT ACTIVITY                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-neutral-200 pt-12">
        <H2>{t("landing.recentActivity")}</H2>

        <div className="divide-y divide-neutral-200">
          {artworks.slice(0, 2).map((artwork) => (
            <div
              key={`artwork-${artwork.id}`}
              className="grid grid-cols-1 md:grid-cols-3 py-6 gap-2 md:gap-6"
            >
              <p className="text-sm text-neutral-400">
                {artwork.createdByName || "—"}
              </p>

              <P>
                {t("landing.activityCreated")} {t("landing.activityArtwork")}
              </P>

              <p className="text-neutral-500">{artwork.title}</p>
            </div>
          ))}

          {artists.slice(0, 2).map((artist) => (
            <div
              key={`artist-${artist.id}`}
              className="grid grid-cols-1 md:grid-cols-3 py-6 gap-2 md:gap-6"
            >
              <p className="text-sm text-neutral-400">
                {artist.createdByName || "—"}
              </p>

              <P>
                {t("landing.activityCreated")} {t("landing.activityArtist")}
              </P>

              <p className="text-neutral-500">
                {artist.firstName} {artist.lastName}
              </p>
            </div>
          ))}

          {exhibitions.slice(0, 2).map((exhibition) => (
            <div
              key={`exhibition-${exhibition.id}`}
              className="grid grid-cols-1 md:grid-cols-3 py-6 gap-2 md:gap-6"
            >
              <p className="text-sm text-neutral-400">
                {exhibition.createdByName || "—"}
              </p>

              <P>
                {t("landing.activityCreated")} {t("landing.activityExhibition")}
              </P>

              <p className="text-neutral-500">{exhibition.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SCREENS CAROUSEL                                                   */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <div className="flex justify-between items-end gap-6">
          <H2>{t("landing.screens")}</H2>

          <Link
            to="/landingpage/screens"
            className="text-sm uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            {t("landing.viewAll")}
          </Link>
        </div>

        {currentScreen ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-300">
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden min-h-[280px] flex items-center justify-center">
                {currentScreen.fileUrl ? (
                  <img
                    src={currentScreen.fileUrl}
                    alt={currentScreen.title}
                    className="max-w-full max-h-[500px] w-auto h-auto object-contain"
                  />
                ) : (
                  <P>{t("landing.preview")}</P>
                )}
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between gap-8">
                <div className="space-y-4">
                  <H3>{currentScreen.title}</H3>

                  {currentScreen.subtitle && <P>{currentScreen.subtitle}</P>}

                  {currentScreen.description && (
                    <P>{currentScreen.description}</P>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  {currentScreen.location && (
                    <div className="flex justify-between gap-6 border-b border-neutral-200 pb-3">
                      <P>{t("landing.locationLabel")}</P>
                      <P>{currentScreen.location}</P>
                    </div>
                  )}

                  <div className="flex justify-between gap-6 border-b border-neutral-200 pb-3">
                    <P>{t("landing.startDateLabel")}</P>
                    <P>{formatDate(currentScreen.startDate)}</P>
                  </div>

                  <div className="flex justify-between gap-6">
                    <P>{t("landing.endDateLabel")}</P>
                    <P>{formatDate(currentScreen.endDate)}</P>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Carouselbutton
                aria-label={t("landing.previousScreen")}
                onClick={showPreviousScreen}
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                {t("landing.previous")}
              </Carouselbutton>

              <P>
                {String(screenIndex + 1).padStart(2, "0")} /{" "}
                {String(screenExhibitions.length).padStart(2, "0")}
              </P>

              <Carouselbutton
                aria-label={t("landing.nextScreen")}
                onClick={showNextScreen}
                className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
              >
                {t("landing.next")}

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Carouselbutton>
            </div>
          </>
        ) : (
          <P>{t("landing.noScreens")}</P>
        )}
      </section>
    </section>
  );
}
