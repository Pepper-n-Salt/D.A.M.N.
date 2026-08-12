import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";

type ScreenType = "exhibition" | "artwork" | "artist";

type Translation = {
  languageCode: string;
  title?: string;
  firstName?: string;
  lastName?: string;
};

type Exhibition = {
  id: string;
  translations?: Translation[];
};

type Artwork = {
  id: string;
  year: number | null;
  translations?: Translation[];
};

type Artist = {
  id: string;
  translations?: Translation[];
};

export default function NewScreenPage() {
  const { t } = useTranslation("newScreen");

  const [selectedType, setSelectedType] = useState<ScreenType | null>(null);

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [language] = useState("en");

  useEffect(() => {
    if (!selectedType) {
      setSelectedObjectId(null);
      return;
    }

    const fetchObjects = async () => {
      setIsLoading(true);
      setError(null);
      setSelectedObjectId(null);

      try {
        let endpoint = "";

        if (selectedType === "exhibition") {
          endpoint = "/api/screens/available/exhibitions";
        }

        if (selectedType === "artwork") {
          endpoint = "/api/screens/available/artworks";
        }

        if (selectedType === "artist") {
          endpoint = "/api/screens/available/artists";
        }

        const response = await fetch(`${endpoint}?languageCode=${language}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Fehler beim Laden der ${selectedType}-Daten.`);
        }

        const data = await response.json();

        if (selectedType === "exhibition") {
          setExhibitions(data);
        }

        if (selectedType === "artwork") {
          setArtworks(data);
        }

        if (selectedType === "artist") {
          setArtists(data);
        }
      } catch (error) {
        console.error(error);

        setError("Die verfügbaren Inhalte konnten nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjects();
  }, [selectedType, language]);

  function getExhibitionName(exhibition: Exhibition) {
    const translation = exhibition.translations?.find(
      (translation) => translation.languageCode === language
    );

    return translation?.title ?? exhibition.id;
  }

  function getArtworkName(artwork: Artwork) {
    const translation = artwork.translations?.find(
      (translation) => translation.languageCode === language
    );

    return translation?.title ?? artwork.id;
  }

  function getArtistName(artist: Artist) {
    const translation = artist.translations?.find(
      (translation) => translation.languageCode === language
    );

    if (!translation) {
      return artist.id;
    }

    return `${translation.firstName ?? ""} ${
      translation.lastName ?? ""
    }`.trim();
  }

  function createScreen() {
    if (!selectedType || !selectedObjectId) {
      return;
    }

    window.open(`/display/${selectedType}/${selectedObjectId}`, "_blank");
  }

  return (
    <section className="space-y-20">
      <div className="space-y-6">
        <H1>{t("newScreen.title")}</H1>

        <P>{t("newScreen.paragraph")}</P>
      </div>

      <section className="space-y-8">
        <H2>{t("newScreen.selectType")}</H2>

        <div className="space-y-6">
          <H3>{t("newScreen.staticScreens.title")}</H3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setSelectedType("exhibition")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "exhibition"
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light">
                {t("newScreen.staticScreens.exhibition.title")}
              </h3>

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
              onClick={() => setSelectedType("artwork")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "artwork"
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light">
                {t("newScreen.staticScreens.artwork.title")}
              </h3>

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
              onClick={() => setSelectedType("artist")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "artist"
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light">
                {t("newScreen.staticScreens.artist.title")}
              </h3>

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
        </div>

        {selectedType && (
          <div className="space-y-6 border-t border-neutral-200 pt-12">
            <H2>
              {selectedType === "exhibition" && (
                <p>{t("newScreen.staticScreens.exhibition.show")}</p>
              )}

              {selectedType === "artwork" && (
                <p>{t("newScreen.staticScreens.artwork.show")}</p>
              )}

              {selectedType === "artist" && (
                <p>{t("newScreen.staticScreens.artist.show")}</p>
              )}
            </H2>

            {isLoading && <P>Inhalte werden geladen...</P>}

            {error && (
              <p className="text-sm text-red-600">{t("newScreen.error")}</p>
            )}

            {!isLoading && !error && selectedType === "exhibition" && (
              <div className="divide-y divide-neutral-200">
                {exhibitions.map((exhibition) => (
                  <button
                    key={exhibition.id}
                    type="button"
                    onClick={() => setSelectedObjectId(exhibition.id)}
                    className={`
                        w-full py-6 text-left transition
                        ${
                          selectedObjectId === exhibition.id
                            ? "bg-black px-4 text-white"
                            : "hover:bg-neutral-50"
                        }
                      `}
                  >
                    <p className="text-xl font-light">
                      {getExhibitionName(exhibition)}
                    </p>
                  </button>
                ))}

                {exhibitions.length === 0 && (
                  <P>Keine Ausstellungen verfügbar.</P>
                )}
              </div>
            )}

            {!isLoading && !error && selectedType === "artwork" && (
              <div className="divide-y divide-neutral-200">
                {artworks.map((artwork) => (
                  <button
                    key={artwork.id}
                    type="button"
                    onClick={() => setSelectedObjectId(artwork.id)}
                    className={`
                        w-full py-6 text-left transition
                        ${
                          selectedObjectId === artwork.id
                            ? "bg-black px-4 text-white"
                            : "hover:bg-neutral-50"
                        }
                      `}
                  >
                    <p className="text-xl font-light">
                      {getArtworkName(artwork)}
                    </p>

                    {artwork.year && (
                      <p
                        className={`
                            mt-2 text-sm
                            ${
                              selectedObjectId === artwork.id
                                ? "text-neutral-300"
                                : "text-neutral-500"
                            }
                          `}
                      >
                        {artwork.year}
                      </p>
                    )}
                  </button>
                ))}

                {artworks.length === 0 && <P>Keine Kunstwerke verfügbar.</P>}
              </div>
            )}

            {!isLoading && !error && selectedType === "artist" && (
              <div className="divide-y divide-neutral-200">
                {artists.map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => setSelectedObjectId(artist.id)}
                    className={`
                        w-full py-6 text-left transition
                        ${
                          selectedObjectId === artist.id
                            ? "bg-black px-4 text-white"
                            : "hover:bg-neutral-50"
                        }
                      `}
                  >
                    <p className="text-xl font-light">
                      {getArtistName(artist)}
                    </p>
                  </button>
                ))}

                {artists.length === 0 && <P>Keine Künstler verfügbar.</P>}
              </div>
            )}
          </div>
        )}
      </section>
      {/* 
      <section className="border-t border-neutral-200 pt-12">
        <H2>{t("newScreen.screenInformation.title")}</H2>

        <br />

        <div className="max-w-xl space-y-8">
          <div>
            <label className="text-sm leading-loose tracking-widest text-neutral-500">
              {t("newScreen.screenInformation.screenName.label")}
            </label>

            <input
              type="text"
              placeholder={t(
                "newScreen.screenInformation.screenName.placeholder"
              )}
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="text-sm leading-loose tracking-widest text-neutral-500">
              {t("newScreen.screenInformation.location.label")}
            </label>

            <input
              type="text"
              placeholder={t(
                "newScreen.screenInformation.location.placeholder"
              )}
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div> */}

      <button
        type="button"
        onClick={createScreen}
        disabled={!selectedType || !selectedObjectId}
        className="
              border
              border-black
              px-8
              py-3
              text-sm
              uppercase
              tracking-[0.25em]
              transition
              hover:bg-black
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
      >
        {t("newScreen.screenInformation.submit")}
      </button>
      {/* </div> 
      </section>*/}
    </section>
  );
}
