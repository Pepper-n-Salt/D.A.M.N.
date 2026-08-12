import { useTranslation } from "react-i18next";
import { useState } from "react";
import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";

export default function NewArtistPage() {
  const { t } = useTranslation("newArtist");
  const [language, setLanguage] = useState("german");
  const [artistSaved, setArtistSaved] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setArtistSaved(true);
  };

  return (
    <section className="space-y-10 py-8">
      <div className="border-b border-neutral-200 pt-12 space-y-8">
        <H1>{t("title")}</H1>
        <P>{t("paragraph")}</P>
        <br />
      </div>

      <form
        className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-none border border-black p-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 mb-10 border-b border-black ">
          <label
            htmlFor="language"
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.language")}
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border-b border-black bg-transparent py-3 outline-none"
          >
            <option value="german">{t("form.languages.german")}</option>
            <option value="english">{t("form.languages.english")}</option>
          </select>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="firstname"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.firstname")}
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastname"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.lastname")}
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="dateOfBirth"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.dateOfBirth")}
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="dateOfDeath"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.dateOfDeath")}
            </label>
            <input
              type="date"
              id="dateOfDeath"
              name="dateOfDeath"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              htmlFor="country"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.country")}
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("form.description")}
          </label>

          <textarea
            id="description"
            name="description"
            rows={6}
            className="resize-none border-b border-black bg-transparent py-3 outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="text-sm uppercase tracking-[0.2em]">
            {t("form.image")}
          </label>
          <input
            type="file"
            id="image"
            name="image"
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
          <button
            type="button"
            disabled={!artistSaved}
            className={`border px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${artistSaved ? "border-black hover:bg-black hover:text-white" : "cursor-not-allowed border-gray-300 text-gray-400"}`}
          >
            {language === "german"
              ? t("actions.translateToEnglish")
              : t("actions.translateToGerman")}
          </button>
        </div>
      </form>
    </section>
  );
}
