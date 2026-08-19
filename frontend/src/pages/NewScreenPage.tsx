import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";

import {
  getExhibitions,
  setExhibitionScreen,
  type CreateExhibitionResponse,
} from "../api/exhibitionApi";

import { getArtworks, type ArtworkResponse } from "../api/artworkApi";

import { getArtists, type CreateArtistResponse } from "../api/artistApi";

type ScreenType = "exhibition" | "artwork" | "artist";

export default function NewScreenPage() {
  const { i18n, t } = useTranslation("newScreen");
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<ScreenType | null>(null);

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const [exhibitions, setExhibitions] = useState<CreateExhibitionResponse[]>(
    []
  );

  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);

  const [artists, setArtists] = useState<CreateArtistResponse[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  useEffect(() => {
    if (!selectedType) {
      setExhibitions([]);
      setArtworks([]);
      setArtists([]);
      setSelectedObjectId(null);
      setError(null);

      return;
    }

    const loadContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setSelectedObjectId(null);

        if (selectedType === "exhibition") {
          const result = await getExhibitions(languageCode);

          setExhibitions(result);
          setArtworks([]);
          setArtists([]);
        }

        if (selectedType === "artwork") {
          const result = await getArtworks(languageCode);

          setArtworks(result);
          setExhibitions([]);
          setArtists([]);
        }

        if (selectedType === "artist") {
          const result = await getArtists(languageCode);

          setArtists(result);
          setExhibitions([]);
          setArtworks([]);
        }
      } catch (error) {
        console.error(error);

        setError(error instanceof Error ? error.message : t("newScreen.error"));
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [selectedType, languageCode, t]);

  const handleSelectType = (type: ScreenType) => {
    setSelectedType(type);
    setSelectedObjectId(null);
  };

  const handleCreateStaticScreen = async () => {
    if (!selectedType || !selectedObjectId) {
      return;
    }

    try {
      if (selectedType === "exhibition") {
        await setExhibitionScreen(selectedObjectId, languageCode);
      }

      navigate(`/display/static/${selectedType}/${selectedObjectId}`);
    } catch (e) {
      console.error(e);

      setError(e instanceof Error ? e.message : t("newScreen.error")); // evtl. noch in i18n aufnehmen
    }
  };

  return (
    <section className="space-y-20">
      <div className="space-y-6">
        <H1>{t("newScreen.title")}</H1>

        <P>{t("newScreen.paragraph")}</P>
      </div>

      <section className="space-y-8">
        <H2>{t("newScreen.selectType")}</H2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <button
            type="button"
            onClick={() => handleSelectType("exhibition")}
            className={`
              border p-6 text-left transition
              ${
                selectedType === "exhibition"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 hover:bg-black hover:text-white"
              }
            `}
          >
            <H3>{t("newScreen.staticScreens.exhibition.title")}</H3>

            <p
              className={`
                mt-3 text-sm
                ${
                  selectedType === "exhibition"
                    ? "text-neutral-300"
                    : "text-neutral-500"
                }
              `}
            >
              {t("newScreen.staticScreens.exhibition.description")}
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleSelectType("artwork")}
            className={`
              border p-6 text-left transition
              ${
                selectedType === "artwork"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 hover:bg-black hover:text-white"
              }
            `}
          >
            <H3>{t("newScreen.staticScreens.artwork.title")}</H3>

            <p
              className={`
                mt-3 text-sm
                ${
                  selectedType === "artwork"
                    ? "text-neutral-300"
                    : "text-neutral-500"
                }
              `}
            >
              {t("newScreen.staticScreens.artwork.description")}
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleSelectType("artist")}
            className={`
              border p-6 text-left transition
              ${
                selectedType === "artist"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 hover:bg-black hover:text-white"
              }
            `}
          >
            <H3>{t("newScreen.staticScreens.artist.title")}</H3>

            <p
              className={`
                mt-3 text-sm
                ${
                  selectedType === "artist"
                    ? "text-neutral-300"
                    : "text-neutral-500"
                }
              `}
            >
              {t("newScreen.staticScreens.artist.description")}
            </p>
          </button>
        </div>

        {selectedType && (
          <div className="space-y-6 border-t border-neutral-200 pt-12">
            <H2>
              {selectedType === "exhibition" &&
                t("newScreen.staticScreens.exhibition.show")}

              {selectedType === "artwork" &&
                t("newScreen.staticScreens.artwork.show")}

              {selectedType === "artist" &&
                t("newScreen.staticScreens.artist.show")}
            </H2>

            {isLoading && <P>{t("newScreen.loading")}</P>}

            {error && <p className="text-sm text-red-600">{error}</p>}

            {!isLoading && !error && selectedType === "exhibition" && (
              <div className="space-y-6">
                <div className="divide-y divide-neutral-200">
                  {exhibitions.map((exhibition) => {
                    const isSelected = selectedObjectId === exhibition.id;

                    return (
                      <button
                        key={exhibition.id}
                        type="button"
                        onClick={() => setSelectedObjectId(exhibition.id)}
                        className={`
                            w-full py-6 text-left transition
                            ${
                              isSelected
                                ? "bg-neutral-100 px-6"
                                : "hover:bg-neutral-50"
                            }
                          `}
                      >
                        <p className="text-xl font-light">{exhibition.title}</p>

                        <p className="mt-2 text-sm text-neutral-500">
                          {exhibition.startDate} - {exhibition.endDate}
                        </p>

                        {exhibition.location && (
                          <p className="mt-1 text-sm text-neutral-500">
                            {exhibition.location}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {exhibitions.length === 0 && (
                  <P>{t("newScreen.staticScreens.exhibition.empty")}</P>
                )}
              </div>
            )}

            {!isLoading && !error && selectedType === "artwork" && (
              <div className="space-y-6">
                <div className="divide-y divide-neutral-200">
                  {artworks.map((artwork) => {
                    const isSelected = selectedObjectId === artwork.id;

                    return (
                      <button
                        key={artwork.id}
                        type="button"
                        onClick={() => setSelectedObjectId(artwork.id)}
                        className={`
                            w-full py-6 text-left transition
                            ${
                              isSelected
                                ? "bg-neutral-100 px-6"
                                : "hover:bg-neutral-50"
                            }
                          `}
                      >
                        <p className="text-xl font-light">{artwork.title}</p>

                        {artwork.subtitle && (
                          <p className="mt-1 text-sm text-neutral-500">
                            {artwork.subtitle}
                          </p>
                        )}

                        {artwork.year && (
                          <p className="mt-2 text-sm text-neutral-500">
                            {artwork.year}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {artworks.length === 0 && (
                  <P>{t("newScreen.staticScreens.artwork.empty")}</P>
                )}
              </div>
            )}

            {!isLoading && !error && selectedType === "artist" && (
              <div className="space-y-6">
                <div className="divide-y divide-neutral-200">
                  {artists.map((artist) => {
                    const isSelected = selectedObjectId === artist.id;

                    return (
                      <button
                        key={artist.id}
                        type="button"
                        onClick={() => setSelectedObjectId(artist.id)}
                        className={`
                            w-full py-6 text-left transition
                            ${
                              isSelected
                                ? "bg-neutral-100 px-6"
                                : "hover:bg-neutral-50"
                            }
                          `}
                      >
                        <p className="text-xl font-light">
                          {artist.firstName} {artist.lastName}
                        </p>

                        {artist.country && (
                          <p className="mt-1 text-sm text-neutral-500">
                            {artist.country}
                          </p>
                        )}

                        {(artist.dateOfBirth || artist.dateOfDeath) && (
                          <p className="mt-2 text-sm text-neutral-500">
                            {artist.dateOfBirth || ""}
                            {artist.dateOfDeath
                              ? ` - ${artist.dateOfDeath}`
                              : ""}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {artists.length === 0 && (
                  <P>{t("newScreen.staticScreens.artist.empty")}</P>
                )}
              </div>
            )}

            {selectedObjectId && (
              <div className="border-t border-neutral-200 pt-8">
                <button
                  type="button"
                  onClick={handleCreateStaticScreen}
                  className="border border-black px-6 py-3 text-sm uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-black hover:text-white"
                >
                  {t("newScreen.createStaticScreen")}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </section>
  );
}
