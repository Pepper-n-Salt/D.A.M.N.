import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";

type ArtistTranslation = {
  artistId: string;
  languageCode: string;
  firstName: string;
  lastName: string;
  description: string | null;
  country: string;
  aiGenerated: boolean;
  isScreen: boolean;
};

type Artist = {
  id: string;
  imageId: string | null;
  dateOfBirth: string | null;
  dateOfDeath: string | null;
  createdBy: string;
  lastEditedBy: string | null;
  isDeleted: boolean;
  translations: ArtistTranslation[];
};

type ArtworkTranslation = {
  artworkId: string;
  languageCode: string;
  title: string;
  subtitle: string | null;
  origin: string | null;
  material: string | null;
  description: string | null;
  aiGenerated: boolean;
  isScreen: boolean;
};

type Artwork = {
  id: string;
  year: number | null;
  dimensions: string | null;
  imageId: string;
  createdBy: string;
  lastEditedBy: string | null;
  isDeleted: boolean;
  translations: ArtworkTranslation[];
  artists: Artist[];
};

export default function NewArtworkPage() {
  const { t } = useTranslation("newArtwork");

  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [language, setLanguage] = useState("de");
  const [artworkSaved, setArtworkSaved] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    artists: [] as string[],
    biography: "",
    year: "",
    origin: "",
    originDescription: "",
    material: "",
    dimensions: "",
    description: "",
  });

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch(`/api/artists?languageCode=${language}`);

        if (!response.ok) {
          throw new Error("Artists konnten nicht geladen werden.");
        }

        const data: Artist[] = await response.json();
        setArtists(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArtists();
  }, [language]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(`/api/artworks?languageCode=${language}`);

        if (!response.ok) {
          throw new Error("Artworks konnten nicht geladen werden.");
        }

        const data: Artwork[] = await response.json();
        setArtworks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArtworks();
  }, [language]);

  const getArtistName = (artist: Artist) => {
    const translation = artist.translations?.find(
      (translation) => translation.languageCode === language
    );

    if (!translation) {
      return artist.id;
    }

    return `${translation.firstName} ${translation.lastName}`;
  };

  const getArtworkTranslation = (artwork: Artwork) => {
    return artwork.translations?.find(
      (translation) => translation.languageCode === language
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setArtworkSaved(true);
  };

  return (
    <section className="space-y-10 py-8">
      <div className="border-b border-neutral-200 pt-12 space-y-8">
        <H1>{t("hero.title")}</H1>
        <P>{t("hero.paragraph")}</P>
        <br />
      </div>

      <div className="flex">
        <div className="w-full">
          {/*
          ============================================================
          IMPORT-FUNKTION
          ============================================================

          <div className="items-center gap-6 mb-20 border-b border-neutral-200 pt-12 space-y-8">
            <button
              type="button"
              className="border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("import.open")}
            </button>

            <br />
            <br />

            <P>{t("import.hint")}</P>

            <br />
          </div>

          <section>
            <div>
              <H2>{t("import.label")}</H2>
              <br />
              <H3>{t("import.title")}</H3>
              <br />
            </div>

            <div className="max-w-xl flex gap-8 border-b border-neutral-200 pt-12 space-y-8">
              <input
                type="text"
                placeholder={t("import.placeholder")}
                className="flex-1 border-b border-black bg-transparent py-3 outline-none"
              />

              <button
                type="button"
                className="border border-black px-6 py-3 uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white transition-colors"
              >
                {t("import.search")}
              </button>
            </div>

            <br />
            <br />

            {artworks.length > 0 && (
              <div className="divide-y divide-neutral-200">
                {artworks.map((artwork) => {
                  const translation = getArtworkTranslation(artwork);

                  return (
                    <div key={artwork.id} className="py-8">
                      <h3 className="text-xl font-light">
                        {translation?.title ?? artwork.id}
                      </h3>

                      <p className="mt-2 text-sm text-neutral-500">
                        {artwork.artists
                          ?.map((artist) => getArtistName(artist))
                          .join(", ")}
                        {" · "}
                        {artwork.year ?? ""}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            title: translation?.title ?? "",
                            subtitle: translation?.subtitle ?? "",
                            artists:
                              artwork.artists?.map((artist) => artist.id) ?? [],
                            year: artwork.year?.toString() ?? "",
                            origin: translation?.origin ?? "",
                            material: translation?.material ?? "",
                            dimensions: artwork.dimensions ?? "",
                            description: translation?.description ?? "",
                          });
                        }}
                        className="mt-6 border border-black px-6 py-3 uppercase tracking-[0.2em] text-sm transition-colors duration-300 hover:bg-black hover:text-white"
                      >
                        {t("import.button")}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          */}

          <form
            className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-none border border-black p-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2 mb-10 border-b border-black ">
              <label
                htmlFor="language"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("form.language")}
              </label>

              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border-b border-black bg-transparent py-3 outline-none"
              >
                <option value="de">{t("form.languages.german")}</option>

                <option value="en">{t("form.languages.english")}</option>
              </select>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="title"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("form.title")}
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  className="border-b border-black bg-transparent py-3 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="subtitle"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("form.subtitle")}
                </label>

                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subtitle: e.target.value,
                    })
                  }
                  className="border-b border-black bg-transparent py-3 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="artists"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("form.artist")}
                </label>

                <select
                  id="artists"
                  value=""
                  onChange={(e) => {
                    const selectedArtistId = e.target.value;

                    if (
                      selectedArtistId &&
                      !formData.artists.includes(selectedArtistId)
                    ) {
                      setFormData({
                        ...formData,
                        artists: [...formData.artists, selectedArtistId],
                      });
                    }
                  }}
                  className="tracking-widest leading-loose border-b border-black bg-transparent py-3 outline-none uppercase text-neutral-500"
                >
                  <option value="">{t("form.selectArtist")}</option>

                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {getArtistName(artist)}
                    </option>
                  ))}
                </select>

                {formData.artists.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.artists.map((artistId) => {
                      const artist = artists.find(
                        (artist) => artist.id === artistId
                      );

                      return (
                        <div
                          key={artistId}
                          className="flex items-center gap-2 border border-black px-3 py-2 text-sm tracking-widest leading-loose uppercase"
                        >
                          {artist ? getArtistName(artist) : artistId}

                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                artists: formData.artists.filter(
                                  (id) => id !== artistId
                                ),
                              })
                            }
                            className="text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="year"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("form.year")}
                </label>

                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: e.target.value,
                    })
                  }
                  className="border-b border-black bg-transparent py-3 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="land"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("form.country")}
                </label>

                <input
                  type="text"
                  id="land"
                  name="land"
                  value={formData.origin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      origin: e.target.value,
                    })
                  }
                  className="border-b border-black bg-transparent py-3 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="origin"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("form.origin")}
                </label>

                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      origin: e.target.value,
                    })
                  }
                  className="border-b border-black bg-transparent py-3 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="material"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("form.material")}
                </label>

                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      material: e.target.value,
                    })
                  }
                  className="border-b border-black bg-transparent py-3 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="dimensions"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("form.dimensions")}
                </label>

                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: e.target.value,
                    })
                  }
                  className="border-b border-black bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("form.description")}
              </label>

              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="resize-none border-b border-black bg-transparent py-3 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="image"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("form.image")}
              </label>

              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="cursor-pointer border border-black bg-transparent p-3"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
              >
                {t("actions.save")}
              </button>

              <button
                type="button"
                disabled={!artworkSaved}
                className={`border px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${
                  artworkSaved
                    ? "border-black hover:bg-black hover:text-white"
                    : "cursor-not-allowed border-gray-300 text-gray-400"
                }`}
              >
                {language === "de"
                  ? t("actions.translateToEnglish")
                  : t("actions.translateToGerman")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
