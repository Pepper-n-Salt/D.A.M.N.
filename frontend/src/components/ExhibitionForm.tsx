import { useTranslation } from "react-i18next";
import { useExhibitionValidation } from "../validation/exhibitionValidation";
import { API_URL } from "../api/config.js";

export type Language = "german" | "english";

export type ExhibitionFormData = {
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  events: string;
  image: File | null;
};

type ExhibitionFormProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;

  formData: ExhibitionFormData;
  setFormData: React.Dispatch<React.SetStateAction<ExhibitionFormData>>;

  onSave: () => void;
  onTranslate?: () => void;

  exhibitionSaved: boolean;
  showTranslateButton?: boolean;
  languageDisabled?: boolean;
};

const BASE_URL = API_URL;

export default function ExhibitionForm({
  language,
  onLanguageChange,
  formData,
  setFormData,
  onSave,
  onTranslate,
  exhibitionSaved,
  showTranslateButton = true,
  languageDisabled = false,
}: ExhibitionFormProps) {
  const { t } = useTranslation("newExhibition");

  const { validateExhibitionForm } = useExhibitionValidation();

  /*
   * Die Validierungsfehler werden bei jedem Render neu berechnet.
   *
   * Dadurch wird automatisch die aktuell aktive Sprache aus
   * dem validation-Namespace verwendet.
   *
   * Wenn also im Header von EN auf DE gewechselt wird,
   * rendert die Komponente neu und die Fehlermeldungen werden
   * ebenfalls auf Deutsch angezeigt.
   */
  const errors = validateExhibitionForm(formData);

  const updateField = <K extends keyof ExhibitionFormData>(
    field: K,
    value: ExhibitionFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(`${API_URL}/media/uploadImage`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Bild konnte nicht hochgeladen werden.");
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateExhibitionForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      let imageId = null;

      // Bild hochladen
      if (formData.image) {
        const uploadedImage = await uploadImage(formData.image);

        console.log("Bild erfolgreich hochgeladen:", uploadedImage);

        imageId = uploadedImage.id;
      }

      console.log(imageId);

      onSave();
    } catch (error) {
      console.error(error);
    }
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

      {/* TITLE / SUBTITLE / DATES / LOCATION */}
      <div className="grid gap-12 md:grid-cols-2">
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
            aria-describedby={
              errors.title ? `title-error-${language}` : undefined
            }
          />

          {errors.title && (
            <p id={`title-error-${language}`} className="text-sm text-red-600">
              {errors.title}
            </p>
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

        {/* START DATE */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`startDate-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.startDate")}
          </label>

          <input
            type="date"
            id={`startDate-${language}`}
            name={`startDate-${language}`}
            value={formData.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.startDate ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.startDate}
            aria-describedby={
              errors.startDate ? `startDate-error-${language}` : undefined
            }
          />

          {errors.startDate && (
            <p
              id={`startDate-error-${language}`}
              className="text-sm text-red-600"
            >
              {errors.startDate}
            </p>
          )}
        </div>

        {/* END DATE */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`endDate-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.endDate")}
          </label>

          <input
            type="date"
            id={`endDate-${language}`}
            name={`endDate-${language}`}
            value={formData.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.endDate ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.endDate}
            aria-describedby={
              errors.endDate ? `endDate-error-${language}` : undefined
            }
          />

          {errors.endDate && (
            <p
              id={`endDate-error-${language}`}
              className="text-sm text-red-600"
            >
              {errors.endDate}
            </p>
          )}
        </div>

        {/* LOCATION */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            htmlFor={`location-${language}`}
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.location")}
          </label>

          <input
            type="text"
            id={`location-${language}`}
            name={`location-${language}`}
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
            className={`border-b bg-transparent py-3 outline-none ${
              errors.location ? "border-red-600" : "border-black"
            }`}
            aria-invalid={!!errors.location}
            aria-describedby={
              errors.location ? `location-error-${language}` : undefined
            }
          />

          {errors.location && (
            <p
              id={`location-error-${language}`}
              className="text-sm text-red-600"
            >
              {errors.location}
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
          className={`resize-none border-b bg-transparent py-3 outline-none ${
            errors.description ? "border-red-600" : "border-black"
          }`}
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? `description-error-${language}` : undefined
          }
        />

        {errors.description && (
          <p
            id={`description-error-${language}`}
            className="text-sm text-red-600"
          >
            {errors.description}
          </p>
        )}
      </div>

      {/* EVENTS */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`events-${language}`}
          className="text-sm uppercase tracking-[0.2em]"
        >
          {t("form.events")}
        </label>

        <textarea
          id={`events-${language}`}
          name={`events-${language}`}
          rows={4}
          value={formData.events}
          onChange={(e) => updateField("events", e.target.value)}
          className={`resize-none border-b bg-transparent py-3 outline-none ${
            errors.events ? "border-red-600" : "border-black"
          }`}
          aria-invalid={!!errors.events}
          aria-describedby={
            errors.events ? `events-error-${language}` : undefined
          }
        />

        {errors.events && (
          <p id={`events-error-${language}`} className="text-sm text-red-600">
            {errors.events}
          </p>
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
          className={`cursor-pointer border bg-transparent p-3 ${
            errors.image ? "border-red-600" : "border-black"
          }`}
          aria-invalid={!!errors.image}
          aria-describedby={
            errors.image ? `image-error-${language}` : undefined
          }
        />

        {errors.image && (
          <p id={`image-error-${language}`} className="text-sm text-red-600">
            {errors.image}
          </p>
        )}
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
            disabled={!exhibitionSaved}
            onClick={onTranslate}
            className={`border px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${
              exhibitionSaved
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
