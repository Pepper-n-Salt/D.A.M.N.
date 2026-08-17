import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";
import ArtworkForm, {
  type ArtworkFormData,
  type Language,
} from "../components/ArtworkForm";

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
  translations: {
    artistId: string;
    languageCode: string;
    firstName: string;
    lastName: string;
    description: string | null;
    country: string;
    aiGenerated: boolean;
    isScreen: boolean;
  }[];
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

const createEmptyFormData = (): ArtworkFormData => ({
  title: "",
  subtitle: "",
  artists: [],
  year: "",
  country: "",
  origin: "",
  material: "",
  dimensions: "",
  description: "",
});

export default function NewArtworkPage() {
  const { t } = useTranslation("newArtwork");

  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  const [language, setLanguage] = useState<Language>("de");
  const [artworkSaved, setArtworkSaved] = useState(false);

  const [translationLanguage, setTranslationLanguage] =
    useState<Language | null>(null);
  const [translationSaved, setTranslationSaved] = useState(false);

  const [formData, setFormData] = useState<ArtworkFormData>(
    createEmptyFormData()
  );

  const [translationFormData, setTranslationFormData] =
    useState<ArtworkFormData>(createEmptyFormData());

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
      (translation: ArtistTranslation) => translation.languageCode === language
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

  const handleTranslate = () => {
    const newLanguage: Language = language === "de" ? "en" : "de";

    setTranslationLanguage(newLanguage);

    setTranslationFormData({
      ...formData,
    });

    setTranslationSaved(false);
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
                            country: "",
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

          <div
            className={`flex w-full gap-8 ${
              translationLanguage ? "flex-col lg:flex-row" : "flex-col"
            }`}
          >
            <div className="w-full ">
              <ArtworkForm
                language={language}
                onLanguageChange={setLanguage}
                languageDisabled={translationLanguage !== null}
                formData={formData}
                setFormData={setFormData}
                artists={artists}
                getArtistName={getArtistName}
                artworkSaved={artworkSaved}
                onSave={() => setArtworkSaved(true)}
                onTranslate={handleTranslate}
                showTranslateButton={translationLanguage === null}
              />
            </div>

            {translationLanguage !== null && (
              <div className="w-full">
                <ArtworkForm
                  language={translationLanguage}
                  onLanguageChange={setTranslationLanguage}
                  languageDisabled={true}
                  formData={translationFormData}
                  setFormData={setTranslationFormData}
                  artists={artists}
                  getArtistName={getArtistName}
                  artworkSaved={translationSaved}
                  onSave={() => setTranslationSaved(true)}
                  showTranslateButton={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
