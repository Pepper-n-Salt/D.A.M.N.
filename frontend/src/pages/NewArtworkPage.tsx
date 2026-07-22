import { useState } from "react";
import { useTranslation } from "react-i18next";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";

export default function NewArtworkPage() {
  const { t } = useTranslation("newArtwork");

  const [showImport, setShowImport] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [language, setLanguage] = useState("german");
  const [artworkSaved, setArtworkSaved] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    artist: "",
    biography: "",
    year: "",
    origin: "",
    originDescription: "",
    material: "",
    dimensions: "",
    description: "",
  });

  const artworkResults = [
    {
      objectID: "123",
      title: "The Starry Night",
      artistName: "Vincent van Gogh",
      year: "1889",
      material: "Oil on canvas",
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setArtworkSaved(true);
  };

  return (
    <section className="space-y-10 py-8">
      <div className="space-y-8">
        <H1>{t("hero.title")}</H1>
        <P>{t("hero.paragraph")}</P>
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => setShowImport(!showImport)}
          className="border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
        >
          {showImport ? t("import.close") : t("import.open")}
        </button>
        <p className="text-sm text-neutral-500 tracking-wide">
          {t("import.hint")}
        </p>
      </div>

      {showImport && (
        <section className="border-t border-neutral-200 pt-12 space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
              {t("import.label")}
            </p>
            <h2 className="mt-4 text-3xl font-light">{t("import.title")}</h2>
          </div>

          <div className="max-w-xl flex gap-4">
            <input
              type="text"
              placeholder={t("import.placeholder")}
              className="flex-1 border-b border-black bg-transparent py-3 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setSearchResults(artworkResults);
                setHasSearched(true);
              }}
              className="border border-black px-6 py-3 uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white transition-colors"
            >
              {t("import.search")}
            </button>
          </div>

          {searchResults.length > 0 && (
            <p className="text-sm text-neutral-500">
              {searchResults.length} result(s) found.
            </p>
          )}

          {hasSearched && (
            <div className="divide-y divide-neutral-200">
              {artworkResults.map((artwork) => (
                <div key={artwork.objectID} className="py-8">
                  <h3 className="text-xl font-light">{artwork.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    {artwork.artistName} · {artwork.year}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        title: artwork.title ?? "",
                        artist: artwork.artistName ?? "",
                        year: artwork.year ?? "",
                        material: artwork.material ?? "",
                      });
                      setShowImport(false);
                    }}
                    className="mt-6 border border-black px-6 py-3 uppercase tracking-[0.2em] text-sm transition-colors duration-300 hover:bg-black hover:text-white"
                  >
                    Import
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <form
        className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-none border border-black p-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="language"
            className="text-sm uppercase tracking-[0.2em]"
          >
            Form language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border-b border-black bg-transparent py-3 outline-none"
          >
            <option value="german">German</option>
            <option value="english">English</option>
          </select>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="subtitle"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="artist"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Artist
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="biography"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Biography (optional)
            </label>
            <input
              type="text"
              id="biography"
              name="biography"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="year"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Year of creation
            </label>
            <input
              type="number"
              id="year"
              name="year"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="land"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Land
            </label>
            <input
              type="text"
              id="land"
              name="land"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="origin"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Origin
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="material"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dimensions"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Dimensions
            </label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm uppercase tracking-[0.2em]"
          >
            Description
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
            Upload image
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
            Save Artwork
          </button>
          <button
            type="button"
            disabled={!artworkSaved}
            className={`border px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 ${artworkSaved ? "border-black hover:bg-black hover:text-white" : "cursor-not-allowed border-gray-300 text-gray-400"}`}
          >
            {language === "german"
              ? "Translate into English"
              : "Translate into German"}
          </button>
        </div>
      </form>
    </section>
  );
}
