import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";

import ArtistForm, {
  type ArtistFormData,
  type Language,
} from "../components/ArtistForm";

import { createArtist, getArtist, updateArtist } from "../api/artistApi";

import {
  previewArtistTranslation,
  createArtistTranslation,
  updateArtistTranslation,
} from "../api/artistTranslationApi";

const createEmptyFormData = (): ArtistFormData => ({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  dateOfDeath: "",
  country: "",
  description: "",
  image: null,
});

export default function NewArtistPage() {
  const { t } = useTranslation("newArtist");

  const { id } = useParams<{ id: string }>();

  /*
   * Wenn eine ID vorhanden ist, befinden wir uns
   * im Bearbeitungsmodus.
   */
  const isEditMode = !!id;

  const [language, setLanguage] = useState<Language>("german");

  const [artistId, setArtistId] = useState<string | null>(null);

  const [artistSaved, setArtistSaved] = useState(false);

  const [translationLanguage, setTranslationLanguage] =
    useState<Language | null>(null);

  const [translationSaved, setTranslationSaved] = useState(false);

  const [formData, setFormData] = useState<ArtistFormData>(
    createEmptyFormData()
  );

  const [translationFormData, setTranslationFormData] =
    useState<ArtistFormData>(createEmptyFormData());

  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      setImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreviewUrl(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImagePreviewUrl(null);

    setFormData((previous) => ({
      ...previous,
      image: null,
    }));
  };

  /*
   * ------------------------------------------------------------------------
   * Bestehenden Artist laden
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!id) return;

    const loadArtist = async () => {
      try {
        setError(null);

        let germanResult = null;
        let englishResult = null;

        /*
         * Deutsche Translation laden
         */

        try {
          germanResult = await getArtist(id, "german");
        } catch {
          console.log("Keine deutsche Translation gefunden.");
        }

        /*
         * Englische Translation laden
         */

        try {
          englishResult = await getArtist(id, "english");
        } catch {
          console.log("Keine englische Translation gefunden.");
        }

        /*
         * Keine Translation vorhanden
         */

        if (!germanResult && !englishResult) {
          throw new Error(
            "Der Artist oder seine Übersetzungen konnten nicht geladen werden."
          );
        }

        setArtistId(id);

        /*
         * ------------------------------------------------------------------
         * Nur Deutsch vorhanden
         * ------------------------------------------------------------------
         */

        if (germanResult && !englishResult) {
          setLanguage("german");

          setFormData({
            firstName: germanResult.firstName,
            lastName: germanResult.lastName,
            dateOfBirth: germanResult.dateOfBirth ?? "",
            dateOfDeath: germanResult.dateOfDeath ?? "",
            country: germanResult.country ?? "",
            description: germanResult.description ?? "",
            image: null,
          });

          setImageUrl(germanResult.fileUrl ?? null);

          setTranslationLanguage(null);
          setTranslationSaved(false);
        }

        /*
         * ------------------------------------------------------------------
         * Nur Englisch vorhanden
         * ------------------------------------------------------------------
         */

        if (!germanResult && englishResult) {
          setLanguage("english");

          setFormData({
            firstName: englishResult.firstName,
            lastName: englishResult.lastName,
            dateOfBirth: englishResult.dateOfBirth ?? "",
            dateOfDeath: englishResult.dateOfDeath ?? "",
            country: englishResult.country ?? "",
            description: englishResult.description ?? "",
            image: null,
          });

          setImageUrl(englishResult.fileUrl ?? null);

          setTranslationLanguage(null);
          setTranslationSaved(false);
        }

        /*
         * ------------------------------------------------------------------
         * Deutsch + Englisch vorhanden
         * ------------------------------------------------------------------
         *
         * Deutsch wird links angezeigt.
         * Englisch wird rechts angezeigt.
         */

        if (germanResult && englishResult) {
          setLanguage("german");

          setFormData({
            firstName: germanResult.firstName,
            lastName: germanResult.lastName,
            dateOfBirth: germanResult.dateOfBirth ?? "",
            dateOfDeath: germanResult.dateOfDeath ?? "",
            country: germanResult.country ?? "",
            description: germanResult.description ?? "",
            image: null,
          });

          setImageUrl(germanResult.fileUrl ?? englishResult.fileUrl ?? null);

          setTranslationLanguage("english");

          setTranslationFormData({
            firstName: englishResult.firstName,
            lastName: englishResult.lastName,
            dateOfBirth: englishResult.dateOfBirth ?? "",
            dateOfDeath: englishResult.dateOfDeath ?? "",
            country: englishResult.country ?? "",
            description: englishResult.description ?? "",
            image: null,
          });

          setTranslationSaved(true);
        }

        setArtistSaved(true);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Der Artist konnte nicht geladen werden."
        );
      }
    };

    loadArtist();
  }, [id]);

  /*
   * ------------------------------------------------------------------------
   * Artist speichern / aktualisieren
   * ------------------------------------------------------------------------
   */

  const handleSave = async (
    imageId: string | null,
    newImageUrl: string | null
  ) => {
    setImageUrl(newImageUrl);

    if (isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      /*
       * NEUER Artist
       *
       * /new
       * -> POST
       */

      if (!isEditMode) {
        const result = await createArtist(formData, language, imageId);

        setArtistId(result.id);
        setArtistSaved(true);

        console.log("Artist gespeichert:", result);

        return;
      }

      /*
       * BESTEHENDER Artist
       *
       * /:id
       * -> PATCH
       */

      if (!id) {
        throw new Error("Keine Artist-ID vorhanden.");
      }

      const result = await updateArtist(id, language, formData, imageId);

      setArtistId(result.id);
      setArtistSaved(true);

      console.log("Artist aktualisiert:", result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Der Artist konnte nicht gespeichert werden."
      );

      setArtistSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * ------------------------------------------------------------------------
   * Übersetzung von Mistral anfordern
   * ------------------------------------------------------------------------
   */

  const handleTranslate = async () => {
    if (!artistId) {
      setError(
        "Der Artist muss zuerst gespeichert werden, bevor er übersetzt werden kann."
      );

      return;
    }

    if (isTranslating) return;

    const newLanguage: Language = language === "german" ? "english" : "german";

    setError(null);
    setIsTranslating(true);

    try {
      const result = await previewArtistTranslation(artistId, newLanguage);

      setTranslationFormData({
        firstName: result.firstName,
        lastName: result.lastName,
        dateOfBirth: formData.dateOfBirth,
        dateOfDeath: formData.dateOfDeath,
        country: result.country ?? "",
        description: result.description ?? "",
        image: null,
      });

      setTranslationLanguage(newLanguage);
      setTranslationSaved(false);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Die Übersetzung konnte nicht erstellt werden."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  /*
   * ------------------------------------------------------------------------
   * Übersetzung speichern / aktualisieren
   * ------------------------------------------------------------------------
   */

  const handleSaveTranslation = async () => {
    if (!artistId || !translationLanguage) {
      setError("Der Artist muss zuerst gespeichert und übersetzt werden.");

      return;
    }

    if (isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      /*
       * Neue Translation
       *
       * POST
       */

      if (!translationSaved) {
        await createArtistTranslation(
          artistId,
          translationFormData,
          translationLanguage
        );

        setTranslationSaved(true);

        console.log("Übersetzung gespeichert.");

        return;
      }

      /*
       * Bestehende Translation
       *
       * PATCH
       */

      await updateArtistTranslation(
        artistId,
        translationLanguage,
        translationFormData
      );

      setTranslationSaved(true);

      console.log("Übersetzung aktualisiert.");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Die Übersetzung konnte nicht gespeichert werden."
      );

      setTranslationSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-10 py-8">
      <div className="space-y-8 border-b border-neutral-200 pt-12">
        <H1>{t("title")}</H1>

        <P>{t("paragraph")}</P>

        <br />
      </div>

      {error && (
        <div className="border border-red-600 p-4 text-red-600">{error}</div>
      )}

      <div
        className={`flex w-full gap-8 ${
          translationLanguage ? "flex-col lg:flex-row" : "flex-col"
        }`}
      >
        {/* ORIGINAL */}

        <div className="w-full">
          <ArtistForm
            language={language}
            onLanguageChange={setLanguage}
            formData={formData}
            setFormData={setFormData}
            artistSaved={artistSaved}
            onSave={handleSave}
            onTranslate={handleTranslate}
            showTranslateButton={translationLanguage === null}
            languageDisabled={translationLanguage !== null}
            isSaving={isSaving}
            isTranslating={isTranslating}
            imageUrl={imageUrl}
            imagePreviewUrl={imagePreviewUrl}
            onImageSelect={handleImageSelect}
            onRemoveImage={handleRemoveImage}
          />

          {isSaving && !translationLanguage && (
            <p className="mt-4 text-sm uppercase tracking-[0.2em]">
              Speichern...
            </p>
          )}

          {isTranslating && (
            <p className="mt-4 text-sm uppercase tracking-[0.2em]">
              Übersetzung wird erstellt...
            </p>
          )}
        </div>

        {/* TRANSLATION */}

        {translationLanguage !== null && (
          <div className="w-full">
            <ArtistForm
              language={translationLanguage}
              onLanguageChange={setTranslationLanguage}
              formData={translationFormData}
              setFormData={setTranslationFormData}
              artistSaved={translationSaved}
              onSave={handleSaveTranslation}
              showTranslateButton={false}
              languageDisabled={true}
              isSaving={isSaving}
              showImage={false}
            />

            {translationSaved && (
              <p className="mt-4 text-sm uppercase tracking-[0.2em]">
                Übersetzung gespeichert.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
