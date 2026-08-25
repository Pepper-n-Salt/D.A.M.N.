import { useRef, useState } from "react";
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

  onSave: (imageId: string | null, newImageUrl: string | null) => void;
  imageUrl?: string | null;
  imagePreviewUrl?: string | null;
  onRemoveImage?: () => void;
  onImageSelect?: (file: File | null) => void;

  onTranslate?: () => void;

  artistSaved: boolean;
  isEditMode?: boolean;
  showTranslateButton?: boolean;
  languageDisabled?: boolean;

  isSaving?: boolean;
  isTranslating?: boolean;

  showImage?: boolean;
};

const API_URL = `${import.meta.env.VITE_API_URL || ""}`;

export default function ArtistForm({
  language,
  onLanguageChange,
  formData,
  setFormData,
  onSave,
  imageUrl,
  imagePreviewUrl,
  onRemoveImage,
  onImageSelect,
  onTranslate,
  artistSaved,
  isEditMode = false,
  showTranslateButton = true,
  languageDisabled = false,
  isSaving = false,
  isTranslating = false,
  showImage = true,
}: ArtistFormProps) {
  const { t } = useTranslation("newArtist");
  const { validateArtistForm } = useArtistValidation();

  const [isSavingImage, setIsSavingImage] = useState(false);

  // Verhindert mehrfaches Absenden, bevor der Parent
  // isSaving/artistSaved aktualisiert hat.
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleRemoveImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    onRemoveImage?.();
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

    // Kein erneutes Absenden erlauben, wenn:
    // - bereits gespeichert wurde
    // - gerade gespeichert wird
    // - bereits ein Submit gestartet wurde
    if (isSaving || (!isEditMode && (artistSaved || hasSubmitted))) {
      return;
    }

    const validationErrors = validateArtistForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Sofort sperren, damit auch sehr schnelle Doppelklicks
    // keinen zweiten Speichervorgang starten.
    setHasSubmitted(true);

    try {
      let imageId: string | null = null;
      let imageUrl: string | null = null;

      if (formData.image) {
        setIsSavingImage(true);

        try {
          const uploadedImage = await uploadImage(formData.image);

          console.log("Das Bild wurde erfolgreich hochgeladen:", uploadedImage);

          imageId = uploadedImage.id;
          imageUrl = uploadedImage.fileUrl;
        } finally {
          setIsSavingImage(false);
        }
      }

      onSave(imageId, imageUrl);
    } catch (error) {
      // Wenn der Speichervorgang fehlschlägt,
      // darf der Benutzer erneut versuchen zu speichern.
      setHasSubmitted(false);

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
          className="border-b border-black bg-transparent py-3 outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
          />

          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName}</p>
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
          />

          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName}</p>
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
          />

          {errors.dateOfBirth && (
            <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
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
          />

          {errors.dateOfDeath && (
            <p className="text-sm text-red-600">{errors.dateOfDeath}</p>
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
          />

          {errors.country && (
            <p className="text-sm text-red-600">{errors.country}</p>
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

      {showImage && (
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
            ref={imageInputRef}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;

              updateField("image", file);
              onImageSelect?.(file);
            }}
            className="hidden"
          />

          <label
            htmlFor={`image-${language}`}
            className="inline-block cursor-pointer border border-black px-4 py-3 text-sm uppercase tracking-[0.2em]"
          >
            {t("form.uploadImage")}
          </label>

          {isSavingImage && (
            <p className="text-sm uppercase tracking-[0.2em]">
              {t("messages.savingImage")}
            </p>
          )}

          {(imagePreviewUrl || imageUrl) && !isSavingImage && (
            <>
              <div className="relative mt-4 w-32 border border-black">
                <img
                  src={imagePreviewUrl || imageUrl || ""}
                  alt={t("form.thumbnail")}
                  className="h-32 w-32 object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center bg-black text-white hover:bg-gray-800"
                >
                  ×
                </button>
              </div>

              <p className="mt-2 text-sm uppercase tracking-[0.2em]">
                {t("messages.imageSelected")}
              </p>
            </>
          )}
        </div>
      )}

      {/* SAVE MESSAGE */}

      {(isSaving || hasSubmitted) && !artistSaved && (
        <p className="text-sm uppercase tracking-[0.2em]">
          {t("messages.saving")}
        </p>
      )}

      {/* ACTIONS */}

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={isSaving || (!isEditMode && (artistSaved || hasSubmitted))}
          className={`border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${
            isSaving || (!isEditMode && (artistSaved || hasSubmitted))
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-black hover:text-white"
          }`}
        >
          {isSaving || (!isEditMode && hasSubmitted)
            ? "..."
            : artistSaved && !isEditMode
              ? "Gespeichert"
              : t("actions.save")}
        </button>

        {showTranslateButton && (
          <button
            type="button"
            disabled={!artistSaved || isTranslating}
            onClick={onTranslate}
            className={`border px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${
              artistSaved && !isTranslating
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
