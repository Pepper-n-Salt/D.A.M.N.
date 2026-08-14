import { useTranslation } from "react-i18next";
import { useState } from "react";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";
import ExhibitionForm, {
  type ExhibitionFormData,
  type Language,
} from "../components/ExhibitionForm";

import { createExhibition } from "../api/exhibitionApi";
import {
  previewExhibitionTranslation,
  createExhibitionTranslation,
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

  /*
   * ------------------------------------------------------------------------
   * Exhibition speichern
   * ------------------------------------------------------------------------
   */

  const handleSave = async () => {
    if (isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      const result = await createExhibition(formData, language);

      /*
       * Dein Backend gibt die ID unter "id" zurück.
       */
      setExhibitionId(result.id);

      setExhibitionSaved(true);

      console.log("Exhibition gespeichert:", result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Die Exhibition konnte nicht gespeichert werden."
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
      setError(
        "Die Exhibition muss zuerst gespeichert werden, bevor sie übersetzt werden kann."
      );

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

      /*
       * Jetzt verwenden wir tatsächlich die Übersetzung
       * von Mistral und kopieren nicht mehr einfach
       * das Originalformular.
       */

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
   * Übersetzung endgültig speichern
   * ------------------------------------------------------------------------
   */

  const handleSaveTranslation = async () => {
    if (!exhibitionId || !translationLanguage) {
      setError("Die Exhibition muss zuerst gespeichert und übersetzt werden.");

      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await createExhibitionTranslation(
        exhibitionId,
        translationFormData,
        translationLanguage
      );

      setTranslationSaved(true);

      console.log("Übersetzung gespeichert.");
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
          <ExhibitionForm
            language={language}
            onLanguageChange={setLanguage}
            formData={formData}
            setFormData={setFormData}
            exhibitionSaved={exhibitionSaved}
            onSave={handleSave}
            onTranslate={handleTranslate}
            showTranslateButton={translationLanguage === null}
            languageDisabled={translationLanguage !== null}
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
            <ExhibitionForm
              language={translationLanguage}
              onLanguageChange={setTranslationLanguage}
              formData={translationFormData}
              setFormData={setTranslationFormData}
              exhibitionSaved={translationSaved}
              onSave={handleSaveTranslation}
              showTranslateButton={false}
              languageDisabled={true}
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
