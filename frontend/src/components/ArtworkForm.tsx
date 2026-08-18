import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

import { useArtworkValidation } from "../validation/artworkValidation";

export type Language = "german" | "english";

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
  image: File | null;
  imageId: string;
};

export type Artist = {
  id: string;

  imageId: string | null;

  dateOfBirth: string | null;
  dateOfDeath: string | null;

  createdBy: string;
  createdByName?: string | null;

  lastEditedBy: string | null;

  isDeleted: boolean;

  languageCode: "de" | "en";

  firstName: string;
  lastName: string;

  country: string | null;
  description: string | null;

  isScreen?: boolean;
};

type ArtworkFormProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;

  languageDisabled?: boolean;

  formData: ArtworkFormData;
  setFormData: Dispatch<SetStateAction<ArtworkFormData>>;

  artists: Artist[];

  artworkSaved: boolean;

  onSave: () => void;
  onTranslate?: () => void;

  showTranslateButton?: boolean;

  isSaving?: boolean;
  isTranslating?: boolean;
};

export default function ArtworkForm({
  language,
  onLanguageChange,
  languageDisabled = false,
  formData,
  setFormData,
  artists,
  artworkSaved,
  onSave,
  onTranslate,
  showTranslateButton = true,
  isSaving = false,
  isTranslating = false,
}: ArtworkFormProps) {
  const { t } = useTranslation("newArtwork");

  const { validateArtworkForm } = useArtworkValidation();

  const errors = validateArtworkForm(formData);

  const updateField = <K extends keyof ArtworkFormData>(
    field: K,
    value: ArtworkFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateArtworkForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave();
  };

  return (
    <form
      className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-none border border-black p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* LANGUAGE */}

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
          <option value="german">{t("form.languages.german")}</option>

          <option value="english">{t("form.languages.english")}</option>
        </select>
      </div>

      {/* MAIN FORM FIELDS */}

      <div className="grid gap-8 md:grid-cols-2">
        {/* TITLE */}

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
            onChange={(e) => updateField("title", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.title ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.title}
          />

          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* SUBTITLE */}

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
            onChange={(e) => updateField("subtitle", e.target.value)}
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        {/* ARTISTS */}

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
                updateField("artists", [...formData.artists, selectedArtistId]);
              }
            }}
            className="tracking-widest leading-loose border-b border-black bg-transparent py-3 outline-none uppercase text-neutral-500"
          >
            <option value="">{t("form.selectArtist")}</option>

            {artists
              .filter((artist) => !artist.isDeleted)
              .map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.firstName} {artist.lastName}
                </option>
              ))}
          </select>

          {/* AUSGEWÄHLTE ARTISTS */}

          {formData.artists.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.artists.map((artistId) => {
                const artist = artists.find((artist) => artist.id === artistId);

                return (
                  <div
                    key={artistId}
                    className="flex items-center gap-2 border border-black px-3 py-2 text-sm uppercase leading-loose tracking-widest"
                  >
                    {artist
                      ? `${artist.firstName} ${artist.lastName}`
                      : artistId}

                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "artists",
                          formData.artists.filter((id) => id !== artistId)
                        )
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

          {errors.artists && (
            <p className="text-sm text-red-600">{errors.artists}</p>
          )}
        </div>

        {/* YEAR */}

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`year-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.year")}
          </label>

          <input
            type="text"
            inputMode="numeric"
            id={`year-${language}`}
            name={`year-${language}`}
            value={formData.year}
            onChange={(e) => updateField("year", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.year ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.year}
          />

          {errors.year && <p className="text-sm text-red-600">{errors.year}</p>}
        </div>

        {/* COUNTRY */}

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
            onChange={(e) => updateField("country", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.country ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.country}
          />

          {errors.country && (
            <p className="text-sm text-red-600">{errors.country}</p>
          )}
        </div>

        {/* ORIGIN */}

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
            onChange={(e) => updateField("origin", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.origin ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.origin}
          />

          {errors.origin && (
            <p className="text-sm text-red-600">{errors.origin}</p>
          )}
        </div>

        {/* MATERIAL */}

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
            onChange={(e) => updateField("material", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.material ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.material}
          />

          {errors.material && (
            <p className="text-sm text-red-600">{errors.material}</p>
          )}
        </div>

        {/* DIMENSIONS */}

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
            onChange={(e) => updateField("dimensions", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.dimensions ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.dimensions}
          />

          {errors.dimensions && (
            <p className="text-sm text-red-600">{errors.dimensions}</p>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}

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
          onChange={(e) => updateField("description", e.target.value)}
          className="resize-none border-b border-black bg-transparent py-3 outline-none"
        />

        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* IMAGE */}

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
          onChange={(e) => updateField("image", e.target.files?.[0] ?? null)}
          className="cursor-pointer border border-black bg-transparent p-3"
        />
      </div>

      {/* IMAGE ID */}

      {/* <div className="flex flex-col gap-2">
        <label
          htmlFor={`imageId-${language}`}
          className="text-sm uppercase tracking-[0.2em]"
        >
          Image ID
        </label>

        <input
          type="text"
          id={`imageId-${language}`}
          name={`imageId-${language}`}
          value={formData.imageId}
          onChange={(e) => updateField("imageId", e.target.value)}
          placeholder="UUID"
          className={`border-b bg-transparent py-3 outline-none ${
            !formData.imageId ? "border-red-600" : "border-black"
          }`}
        />

        {!formData.imageId && (
          <p className="text-sm text-red-600">
            Für ein neues Artwork wird aktuell eine vorhandene Image-ID
            benötigt.
          </p>
        )}
      </div> */}

      {/* ACTIONS */}

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className={`border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${
            isSaving
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-black hover:text-white"
          }`}
        >
          {isSaving ? "..." : t("actions.save")}
        </button>

        {showTranslateButton && (
          <button
            type="button"
            disabled={!artworkSaved || isTranslating}
            onClick={onTranslate}
            className={`border px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${
              artworkSaved && !isTranslating
                ? "border-black hover:bg-black hover:text-white"
                : "cursor-not-allowed border-gray-300 text-gray-400"
            }`}
          >
            {isTranslating
              ? "..."
              : language === "german"
                ? t("actions.translateToEnglish")
                : t("actions.translateToGerman")}
          </button>
        )}
      </div>
    </form>
  );
}
