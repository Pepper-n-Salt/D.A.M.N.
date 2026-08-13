import { useTranslation } from "react-i18next";

type Language = "german" | "english";

type ExhibitionFormProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onSave: () => void;
  onTranslate?: () => void;
  exhibitionSaved: boolean;
  showTranslateButton?: boolean;
  languageDisabled?: boolean;
};

export default function ExhibitionForm({
  language,
  onLanguageChange,
  onSave,
  onTranslate,
  exhibitionSaved,
  showTranslateButton = true,
  languageDisabled = false,
}: ExhibitionFormProps) {
  const { t } = useTranslation("newExhibition");

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

      <div className="grid gap-12 md:grid-cols-2">
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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

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
            className="border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

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
          htmlFor={`events-${language}`}
          className="text-sm uppercase tracking-[0.2em]"
        >
          {t("form.events")}
        </label>

        <textarea
          id={`events-${language}`}
          name={`events-${language}`}
          rows={4}
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
