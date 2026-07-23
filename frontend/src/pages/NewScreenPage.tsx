import { useTranslation } from "react-i18next";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";

import { useState } from "react";

export default function NewScreenPage() {
  const { t } = useTranslation("newScreen");
  
  const [selectedType, setSelectedType] = useState<
    "exhibition" | "artwork" | "artist" | null
  >(null);

  function createScreen() {
    if (!selectedType) return;

    window.open(`/display/${selectedType}`, "_blank"); // Die window.open()-Methode in JavaScript öffnet ein neues Browserfenster, um die darin angegebene URL zu laden.
  }

  return (
    <section className="space-y-20">
      <div className="space-y-6">
        <H1>{t("newScreen.title")}</H1>

        <P>{t("newScreen.paragraph")}</P>
      </div>

      <section className="space-y-8">
        <H2>{t("newScreen.selectType")}</H2>

        <div className="space-y-6">
          <H3>{t("newScreen.staticScreens.title")}</H3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setSelectedType("exhibition")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "exhibition"
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light">{t("newScreen.staticScreens.exhibition.title")}</h3>

              <p className="mt-3 text-sm text-neutral-500 group-hover:text-neutral-500">
                {t("newScreen.staticScreens.exhibition.description")}
              </p>
            </button>

            <button
              onClick={() => setSelectedType("artwork")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "artwork"
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light"> {t("newScreen.staticScreens.artwork.title")}</h3>

              <p className="mt-3 text-sm text-neutral-500">
                {t("newScreen.staticScreens.artwork.description")}
              </p>
            </button>

            <button
              onClick={() => setSelectedType("artist")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "artist"
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light">{t("newScreen.staticScreens.artist.title")}</h3>

              <p className="mt-3 text-sm text-neutral-500">
                {t("newScreen.staticScreens.artist.description")}
              </p>
            </button>
          </div>
        </div>

        {/* <div className="space-y-6 pt-8">
          <h2 className="text-2xl font-light">{t("newScreen.dynamicScreens.title")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              disabled
              className="border border-neutral-200 p-6 text-left opacity-40 cursor-not-allowed"
            >
              <h3 className="text-xl font-light">{t("newScreen.dynamicScreens.interactiveArtwork.title")}</h3>

              <p className="mt-3 text-sm text-neutral-500">
                {t("newScreen.dynamicScreens.interactiveArtwork.description")}
              </p>

              <p className="mt-4 text-xs uppercase tracking-[0.2em]">
                {t("newScreen.dynamicScreens.interactiveArtwork.comingSoon")}
              </p>
            </button>

            <button
              disabled
              className="border border-neutral-200 p-6 text-left opacity-40 cursor-not-allowed"
            >
              <h3 className="text-xl font-light">
                {t("newScreen.dynamicScreens.digitalExperience.title")}
              </h3>
              <p className="mt-3 text-sm text-neutral-500">
                {t("newScreen.dynamicScreens.digitalExperience.description")}
              </p>

              <p className="mt-4 text-xs uppercase tracking-[0.2em]">
                {t("newScreen.dynamicScreens.digitalExperience.comingSoon")}
              </p>
            </button>
          </div>
        </div>*/}
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <H2>t("newScreen.screenInformation.title")}</H2>
        <br />

        <div className="max-w-xl space-y-8">
          <div>
            <label className="text-sm text-neutral-500 leading-loose tracking-widest">
              {t("newScreen.screenInformation.screenName.label")}
            </label>

            <input
              type="text"
              placeholder={t(
                "newScreen.screenInformation.screenName.placeholder",
              )}
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="text-sm leading-loose tracking-widest text-neutral-500">
             {t("newScreen.screenInformation.location.label")}
            </label>

            <input
              type="text"
              placeholder={t(
                "newScreen.screenInformation.location.placeholder",
              )}
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>

          <button
            onClick={createScreen}
            disabled={!selectedType}
            className="
              border
              border-black
              px-8
              py-3
              text-sm
              uppercase
              tracking-[0.25em]
              transition
              hover:bg-black
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            {t("newScreen.screenInformation.submit")}
          </button>
        </div>
      </section>
    </section>
  );
}
