import { useTranslation } from "react-i18next";
import { useState } from "react";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";
import ExhibitionForm, {
  type ExhibitionFormData,
  type Language,
} from "../components/ExhibitionForm";

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

  const [exhibitionSaved, setExhibitionSaved] = useState(false);

  const [translationLanguage, setTranslationLanguage] =
    useState<Language | null>(null);

  const [translationSaved, setTranslationSaved] = useState(false);

  const [formData, setFormData] = useState<ExhibitionFormData>(
    createEmptyFormData()
  );

  const [translationFormData, setTranslationFormData] =
    useState<ExhibitionFormData>(createEmptyFormData());

  const handleTranslate = () => {
    const newLanguage: Language = language === "german" ? "english" : "german";

    setTranslationLanguage(newLanguage);

    /*
     * Die Daten des ersten Formulars werden
     * zunächst als Grundlage für die Übersetzung
     * übernommen.
     */
    setTranslationFormData({
      ...formData,
    });

    setTranslationSaved(false);
  };

  return (
    <section className="space-y-10 py-8">
      <div className="border-b border-neutral-200 pt-12 space-y-8">
        <H1>{t("title")}</H1>

        <P>{t("paragraph")}</P>

        <br />
      </div>

      <div
        className={`flex w-full gap-8 ${
          translationLanguage ? "flex-col lg:flex-row" : "flex-col"
        }`}
      >
        {/* Original */}
        <div className="w-full">
          <ExhibitionForm
            language={language}
            onLanguageChange={setLanguage}
            formData={formData}
            setFormData={setFormData}
            exhibitionSaved={exhibitionSaved}
            onSave={() => setExhibitionSaved(true)}
            onTranslate={handleTranslate}
            showTranslateButton={translationLanguage === null}
            languageDisabled={translationLanguage !== null}
          />
        </div>

        {/* Translation */}
        {translationLanguage !== null && (
          <div className="w-full">
            <ExhibitionForm
              language={translationLanguage}
              onLanguageChange={setTranslationLanguage}
              formData={translationFormData}
              setFormData={setTranslationFormData}
              exhibitionSaved={translationSaved}
              onSave={() => setTranslationSaved(true)}
              showTranslateButton={false}
              languageDisabled={true}
            />
          </div>
        )}
      </div>
    </section>
  );
}
