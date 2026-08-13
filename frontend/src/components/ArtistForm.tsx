import { useTranslation } from "react-i18next";

import { useArtistValidation } from "../validation/artistValidation";

export type Language = "german" | "english";

export type ArtistFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  country: string;
  description: string;
  image: File | null;
};

type ArtistFormProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;

  formData: ArtistFormData;
  setFormData: React.Dispatch<React.SetStateAction<ArtistFormData>>;

  onSave: () => void;
  onTranslate?: () => void;

  artistSaved: boolean;
  showTranslateButton?: boolean;
  languageDisabled?: boolean;
};

export default function ArtistForm({
  language,
  onLanguageChange,
  formData,
  setFormData,
  onSave,
  onTranslate,
  artistSaved,
  showTranslateButton = true,
  languageDisabled = false,
}: ArtistFormProps) {
  const { t } = useTranslation("newArtist");
  const { validateArtistForm } = useArtistValidation();

  /*
   * Die Fehler werden bei jedem Render neu berechnet.
   *
   * Das ist wichtig für die Mehrsprachigkeit:
   * Wenn im Header die Sprache gewechselt wird, rendert
   * die Komponente neu und useArtistValidation() verwendet
   * automatisch die neue Sprache aus dem "validation"-Namespace.
   */
  const errors = validateArtistForm(formData);

  const updateField = <K extends keyof ArtistFormData>(
    field: K,
    value: ArtistFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateArtistForm(formData);

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
          className="border-b border-black bg-transparent py-3 outline-none"
        >
          <option value="german">{t("form.languages.german")}</option>

          <option value="english">{t("form.languages.english")}</option>
        </select>
      </div>

      {/* FIRST NAME / LAST NAME */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* FIRST NAME */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`firstname-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.firstname")}
          </label>

          <input
            type="text"
            id={`firstname-${language}`}
            name={`firstname-${language}`}
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.firstName ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.firstName}
            aria-describedby={
              errors.firstName ? `firstname-error-${language}` : undefined
            }
          />

          {errors.firstName && (
            <p
              id={`firstname-error-${language}`}
              className="text-sm text-red-600"
            >
              {errors.firstName}
            </p>
          )}
        </div>

        {/* LAST NAME */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`lastname-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.lastname")}
          </label>

          <input
            type="text"
            id={`lastname-${language}`}
            name={`lastname-${language}`}
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.lastName ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.lastName}
            aria-describedby={
              errors.lastName ? `lastname-error-${language}` : undefined
            }
          />

          {errors.lastName && (
            <p
              id={`lastname-error-${language}`}
              className="text-sm text-red-600"
            >
              {errors.lastName}
            </p>
          )}
        </div>

        {/* DATE OF BIRTH */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`dateOfBirth-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.dateOfBirth")}
          </label>

          <input
            type="date"
            id={`dateOfBirth-${language}`}
            name={`dateOfBirth-${language}`}
            value={formData.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.dateOfBirth ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.dateOfBirth}
            aria-describedby={
              errors.dateOfBirth ? `dateOfBirth-error-${language}` : undefined
            }
          />

          {errors.dateOfBirth && (
            <p
              id={`dateOfBirth-error-${language}`}
              className="text-sm text-red-600"
            >
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* DATE OF DEATH */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`dateOfDeath-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.dateOfDeath")}
          </label>

          <input
            type="date"
            id={`dateOfDeath-${language}`}
            name={`dateOfDeath-${language}`}
            value={formData.dateOfDeath}
            onChange={(e) => updateField("dateOfDeath", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.dateOfDeath ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.dateOfDeath}
            aria-describedby={
              errors.dateOfDeath ? `dateOfDeath-error-${language}` : undefined
            }
          />

          {errors.dateOfDeath && (
            <p
              id={`dateOfDeath-error-${language}`}
              className="text-sm text-red-600"
            >
              {errors.dateOfDeath}
            </p>
          )}
        </div>

        {/* COUNTRY */}
        <div className="flex flex-col gap-2 md:col-span-2">
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
            aria-describedby={
              errors.country ? `country-error-${language}` : undefined
            }
          />

          {errors.country && (
            <p
              id={`country-error-${language}`}
              className="text-sm text-red-600"
            >
              {errors.country}
            </p>
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

      {/* ACTIONS */}
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
            disabled={!artistSaved}
            onClick={onTranslate}
            className={`border px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${
              artistSaved
                ? "border-black hover:bg-black hover:text-white"
                : "cursor-not-allowed border-gray-300 text-gray-400"
            }`}
          >
            {language === "german"
              ? t("actions.translateToEnglish")
              : t("actions.translateToGerman")}
          </button>
        )}
      </div>
    </form>
  );
}
