import { useState } from "react";
import { useTranslation } from "react-i18next";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";
import ArtistForm, {
  type ArtistFormData,
  type Language,
} from "../components/ArtistForm";

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

  const [language, setLanguage] = useState<Language>("german");

  const [artistSaved, setArtistSaved] = useState(false);

  const [translationLanguage, setTranslationLanguage] =
    useState<Language | null>(null);

  const [translationSaved, setTranslationSaved] = useState(false);

  const [formData, setFormData] = useState<ArtistFormData>(
    createEmptyFormData()
  );

  const [translationFormData, setTranslationFormData] =
    useState<ArtistFormData>(createEmptyFormData());

  const handleTranslate = () => {
    const newLanguage: Language = language === "german" ? "english" : "german";

    setTranslationLanguage(newLanguage);

    /*
     * Die Daten des ersten Formulars werden
     * zunächst als Grundlage für die Übersetzung
     * übernommen.
     *
     * Dadurch bleiben z. B. Bild, Geburtsdatum,
     * Sterbedatum etc. erhalten.
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
        {/* Original language */}
        <div className="w-full">
          <ArtistForm
            language={language}
            onLanguageChange={setLanguage}
            formData={formData}
            setFormData={setFormData}
            artistSaved={artistSaved}
            onSave={() => setArtistSaved(true)}
            onTranslate={handleTranslate}
            showTranslateButton={translationLanguage === null}
            languageDisabled={translationLanguage !== null}
          />
        </div>

        {/* Translation */}
        {translationLanguage !== null && (
          <div className="w-full">
            <ArtistForm
              language={translationLanguage}
              onLanguageChange={setTranslationLanguage}
              formData={translationFormData}
              setFormData={setTranslationFormData}
              artistSaved={translationSaved}
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
