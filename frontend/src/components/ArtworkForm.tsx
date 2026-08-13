import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export type Language = "de" | "en";

export type ArtworkFormData = {
  title: string;
  subtitle: string;
  artists: string[];
  year: string;
  country: string;
  origin: string;
  material: string;
  dimensions: string;
  description: string;
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

type ArtworkFormProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  languageDisabled?: boolean;
  formData: ArtworkFormData;
  setFormData: Dispatch<SetStateAction<ArtworkFormData>>;
  artists: Artist[];
  getArtistName: (artist: Artist) => string;
  artworkSaved: boolean;
  onSave: () => void;
  onTranslate?: () => void;
  showTranslateButton?: boolean;
};

export default function ArtworkForm({
  language,
  onLanguageChange,
  languageDisabled = false,
  formData,
  setFormData,
  artists,
  getArtistName,
  artworkSaved,
  onSave,
  onTranslate,
  showTranslateButton = true,
}: ArtworkFormProps) {
  const { t } = useTranslation("newArtwork");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form
      className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-none border border-black p-8"
      onSubmit={handleSubmit}
    >
      <div className="mb-10 flex flex-col gap-2 border-b border-black">
        <label
          htmlFor={`language-${language}`}
          className="text-sm uppercase tracking-[0.2em]"
        >
          {t("form.language")}
        </label>

        <select
          id={`language-${language}`}
          value={language}
          disabled={languageDisabled}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="border-b border-black bg-transparent py-3 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="de">{t("form.languages.german")}</option>
          <option value="en">{t("form.languages.english")}</option>
        </select>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`title-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.title")}
          </label>

          <input
            type="text"
            id={`title-${language}`}
            name={`title-${language}`}
            value={formData.title}
            onChange={(e) =>
              setFormData((previous) => ({
                ...previous,
                title: e.target.value,
              }))
            }
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`subtitle-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.subtitle")}
          </label>

          <input
            type="text"
            id={`subtitle-${language}`}
            name={`subtitle-${language}`}
            value={formData.subtitle}
            onChange={(e) =>
              setFormData((previous) => ({
                ...previous,
                subtitle: e.target.value,
              }))
            }
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`artists-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.artist")}
          </label>

          <select
            id={`artists-${language}`}
            value=""
            onChange={(e) => {
              const selectedArtistId = e.target.value;

              if (
                selectedArtistId &&
                !formData.artists.includes(selectedArtistId)
              ) {
                setFormData((previous) => ({
                  ...previous,
                  artists: [...previous.artists, selectedArtistId],
                }));
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
                const artist = artists.find((artist) => artist.id === artistId);

                return (
                  <div
                    key={artistId}
                    className="flex items-center gap-2 border border-black px-3 py-2 text-sm tracking-widest leading-loose uppercase"
                  >
                    {artist ? getArtistName(artist) : artistId}

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((previous) => ({
                          ...previous,
                          artists: previous.artists.filter(
                            (id) => id !== artistId
                          ),
                        }))
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
            htmlFor={`year-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.year")}
          </label>

          <input
            type="number"
            id={`year-${language}`}
            name={`year-${language}`}
            value={formData.year}
            onChange={(e) =>
              setFormData((previous) => ({
                ...previous,
                year: e.target.value,
              }))
            }
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`country-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.country")}
          </label>

          <input
            type="text"
            id={`country-${language}`}
            name={`country-${language}`}
            value={formData.country}
            onChange={(e) =>
              setFormData((previous) => ({
                ...previous,
                country: e.target.value,
              }))
            }
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`origin-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.origin")}
          </label>

          <input
            type="text"
            id={`origin-${language}`}
            name={`origin-${language}`}
            value={formData.origin}
            onChange={(e) =>
              setFormData((previous) => ({
                ...previous,
                origin: e.target.value,
              }))
            }
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`material-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.material")}
          </label>

          <input
            type="text"
            id={`material-${language}`}
            name={`material-${language}`}
            value={formData.material}
            onChange={(e) =>
              setFormData((previous) => ({
                ...previous,
                material: e.target.value,
              }))
            }
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`dimensions-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.dimensions")}
          </label>

          <input
            type="text"
            id={`dimensions-${language}`}
            name={`dimensions-${language}`}
            value={formData.dimensions}
            onChange={(e) =>
              setFormData((previous) => ({
                ...previous,
                dimensions: e.target.value,
              }))
            }
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={`description-${language}`}
          className="text-sm uppercase tracking-[0.2em]"
        >
          {t("form.description")}
        </label>

        <textarea
          id={`description-${language}`}
          name={`description-${language}`}
          rows={6}
          value={formData.description}
          onChange={(e) =>
            setFormData((previous) => ({
              ...previous,
              description: e.target.value,
            }))
          }
          className="resize-none border-b border-black bg-transparent py-3 outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={`image-${language}`}
          className="text-sm uppercase tracking-[0.2em]"
        >
          {t("form.image")}
        </label>

        <input
          type="file"
          id={`image-${language}`}
          name={`image-${language}`}
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

        {showTranslateButton && (
          <button
            type="button"
            disabled={!artworkSaved}
            onClick={onTranslate}
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
        )}
      </div>
    </form>
  );
}
