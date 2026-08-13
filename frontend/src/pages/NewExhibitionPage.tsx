import { useTranslation } from "react-i18next";
import { useState } from "react";
import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";
import ExhibitionForm from "../components/ExhibitionForm";

type Language = "german" | "english";

export default function NewExhibitionPage() {
  const { t } = useTranslation("newExhibition");

  const [language, setLanguage] = useState<Language>("german");
  const [exhibitionSaved, setExhibitionSaved] = useState(false);
  const [translationLanguage, setTranslationLanguage] =
    useState<Language | null>(null);
  const [translationSaved, setTranslationSaved] = useState(false);

  const handleTranslate = () => {
    setTranslationLanguage(language === "german" ? "english" : "german");
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
        <div className="w-full ">
          <ExhibitionForm
            language={language}
            onLanguageChange={setLanguage}
            exhibitionSaved={exhibitionSaved}
            onSave={() => setExhibitionSaved(true)}
            onTranslate={handleTranslate}
            showTranslateButton={!translationLanguage}
            languageDisabled={!!translationLanguage}
          />
        </div>

        {translationLanguage && (
          <div className="w-full">
            <ExhibitionForm
              language={translationLanguage}
              onLanguageChange={setTranslationLanguage}
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
