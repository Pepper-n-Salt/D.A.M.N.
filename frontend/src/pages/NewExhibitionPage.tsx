import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";

import ExhibitionForm, {
  type ExhibitionFormData,
  type Language,
} from "../components/ExhibitionForm";

import {
  createExhibition,
  getExhibition,
  updateExhibition,
} from "../api/exhibitionApi";

import {
  previewExhibitionTranslation,
  createExhibitionTranslation,
  updateExhibitionTranslation,
} from "../api/exhibitionTranslationApi";

const createEmptyFormData = (): ExhibitionFormData => ({
  title: "",
  subtitle: "",
  startDate: "",
  endDate: "",
  location: "",
  description: "",
  events: "",
  image: null,
});

export default function NewExhibitionPage() {
  const { t } = useTranslation("newExhibition");

  const { id } = useParams<{ id: string }>();

  /*
   * Wenn eine ID vorhanden ist, befinden wir uns im Bearbeitungsmodus.
   */
  const isEditMode = !!id;

  const [language, setLanguage] = useState<Language>("german");

  const [exhibitionId, setExhibitionId] = useState<string | null>(null);

  const [exhibitionSaved, setExhibitionSaved] = useState(false);

  const [translationLanguage, setTranslationLanguage] =
    useState<Language | null>(null);

  const [translationSaved, setTranslationSaved] = useState(false);

  const [formData, setFormData] = useState<ExhibitionFormData>(
    createEmptyFormData()
  );

  const [translationFormData, setTranslationFormData] =
    useState<ExhibitionFormData>(createEmptyFormData());

  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImagePreviewUrl(null);

    setFormData((previous) => ({
      ...previous,
      image: null,
    }));
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      setImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreviewUrl(previewUrl);
  };

  /*
   * ------------------------------------------------------------------------
   * Bestehende Exhibition laden
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!id) return;

    const loadExhibition = async () => {
      try {
        setError(null);

        let germanResult = null;
        let englishResult = null;

        /*
         * Deutsche Translation laden.
         */

        try {
          germanResult = await getExhibition(id, "german");
        } catch {
          console.log("Keine deutsche Translation gefunden.");
        }

        /*
         * Englische Translation laden.
         */

        try {
          englishResult = await getExhibition(id, "english");
        } catch {
          console.log("Keine englische Translation gefunden.");
        }

        /*
         * Wenn gar keine Translation existiert,
         * ist etwas mit der Exhibition nicht in Ordnung.
         */

        if (!germanResult && !englishResult) {
          throw new Error(t("messages.loadError"));
        }

        setExhibitionId(id);

        /*
         * ------------------------------------------------------------------
         * Nur Deutsch vorhanden
         * ------------------------------------------------------------------
         */

        if (germanResult && !englishResult) {
          setLanguage("german");

          setFormData({
            title: germanResult.title,
            subtitle: germanResult.subtitle ?? "",
            startDate: germanResult.startDate,
            endDate: germanResult.endDate,
            location: germanResult.location ?? "",
            description: germanResult.description ?? "",
            events: "",
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
            title: englishResult.title,
            subtitle: englishResult.subtitle ?? "",
            startDate: englishResult.startDate,
            endDate: englishResult.endDate,
            location: englishResult.location ?? "",
            description: englishResult.description ?? "",
            events: "",
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
            title: germanResult.title,
            subtitle: germanResult.subtitle ?? "",
            startDate: germanResult.startDate,
            endDate: germanResult.endDate,
            location: germanResult.location ?? "",
            description: germanResult.description ?? "",
            events: "",
            image: null,
          });

          setImageUrl(englishResult.fileUrl ?? null);

          setTranslationLanguage("english");

          setTranslationFormData({
            title: englishResult.title,
            subtitle: englishResult.subtitle ?? "",
            startDate: englishResult.startDate,
            endDate: englishResult.endDate,
            location: englishResult.location ?? "",
            description: englishResult.description ?? "",
            events: "",
            image: null,
          });

          setTranslationSaved(true);
        }

        setExhibitionSaved(true);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : t("messages.loadErrorFallback")
        );
      }
    };

    loadExhibition();
  }, [id]);

  /*
   * ------------------------------------------------------------------------
   * Exhibition speichern / aktualisieren
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
       * NEUE Exhibition
       *
       * /new
       * -> POST
       */

      if (!isEditMode) {
        const result = await createExhibition(formData, language, imageId);

        setExhibitionId(result.id);
        setExhibitionSaved(true);

        console.log("Exhibition gespeichert:", result);

        return;
      }

      /*
       * BESTEHENDE Exhibition
       *
       * /:id
       * -> PATCH
       */

      if (!id) {
        throw new Error(t("messages.noExhibitionId"));
      }

      const result = await updateExhibition(id, language, formData, imageId);

      setExhibitionId(result.id);
      setExhibitionSaved(true);

      console.log("Exhibition aktualisiert:", result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : t("messages.saveError")
      );

      setExhibitionSaved(false);
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
    if (!exhibitionId) {
      setError(t("messages.translateRequiresSave"));

      return;
    }

    if (isTranslating) return;

    const newLanguage: Language = language === "german" ? "english" : "german";

    setError(null);
    setIsTranslating(true);

    try {
      const result = await previewExhibitionTranslation(
        exhibitionId,
        newLanguage
      );

      setTranslationFormData({
        title: result.title,
        subtitle: result.subtitle ?? "",
        location: result.location ?? "",
        description: result.description ?? "",
        startDate: formData.startDate,
        endDate: formData.endDate,
        events: "",
        image: null,
      });

      setTranslationLanguage(newLanguage);
      setTranslationSaved(false);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : t("messages.translationError")
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
    if (!exhibitionId || !translationLanguage) {
      setError(t("messages.translationRequiresSave"));

      return;
    }

    if (isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      /*
       * Bei einer neuen Translation:
       *
       * POST /exhibitiontranslation/:id/translations
       */

      if (!translationSaved) {
        await createExhibitionTranslation(
          exhibitionId,
          translationFormData,
          translationLanguage
        );

        setTranslationSaved(true);

        console.log("Übersetzung gespeichert.");

        return;
      }

      /*
       * Bei einer bereits existierenden Translation:
       *
       * PATCH /exhibitiontranslation/:id/translations/:languageCode
       */

      await updateExhibitionTranslation(
        exhibitionId,
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
          : t("messages.translationSaveError")
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
          <ExhibitionForm
            language={language}
            onLanguageChange={setLanguage}
            formData={formData}
            setFormData={setFormData}
            exhibitionSaved={exhibitionSaved}
            onSave={handleSave}
            imageUrl={imageUrl}
            imagePreviewUrl={imagePreviewUrl}
            onRemoveImage={handleRemoveImage}
            onImageSelect={handleImageSelect}
            onTranslate={handleTranslate}
            showTranslateButton={translationLanguage === null}
            languageDisabled={translationLanguage !== null}
          />

          {isSaving && !translationLanguage && (
            <p className="mt-4 text-sm uppercase tracking-[0.2em]">
              {t("messages.saving")}
            </p>
          )}

          {isTranslating && (
            <p className="mt-4 text-sm uppercase tracking-[0.2em]">
              {t("messages.translationSaved")}
            </p>
          )}
        </div>

        {/* TRANSLATION */}
        {translationLanguage !== null && (
          <div className="w-full">
            <ExhibitionForm
              language={translationLanguage}
              onLanguageChange={setTranslationLanguage}
              formData={translationFormData}
              setFormData={setTranslationFormData}
              exhibitionSaved={translationSaved}
              onSave={handleSaveTranslation}
              imageUrl={imageUrl}
              imagePreviewUrl={imagePreviewUrl}
              onRemoveImage={handleRemoveImage}
              onImageSelect={handleImageSelect}
              showTranslateButton={false}
              languageDisabled={true}
              showImage={false}
            />

            {translationSaved && (
              <p className="mt-4 text-sm uppercase tracking-[0.2em]">
                {t("messages.translationSaved")}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
