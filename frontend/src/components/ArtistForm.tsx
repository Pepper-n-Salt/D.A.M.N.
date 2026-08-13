import { useTranslation } from "react-i18next";

type Language = "german" | "english";

type ArtistFormProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onSave: () => void;
  onTranslate?: () => void;
  artistSaved: boolean;
  showTranslateButton?: boolean;
  languageDisabled?: boolean;
};

export default function ArtistForm({
  language,
  onLanguageChange,
  onSave,
  onTranslate,
  artistSaved,
  showTranslateButton = true,
  languageDisabled = false,
}: ArtistFormProps) {
  const { t } = useTranslation("newArtist");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form
      className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-none border border-black p-8"
      onSubmit={handleSubmit}
    >
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

      <div className="grid gap-8 md:grid-cols-2">
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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>
      </div>

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
          className="resize-none border-b border-black bg-transparent py-3 outline-none"
        />
      </div>

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
          className="cursor-pointer border border-black bg-transparent p-3"
        />
      </div>

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
