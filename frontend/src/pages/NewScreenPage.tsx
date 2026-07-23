import { useTranslation } from "react-i18next";

export default function NewScreenPage() {
  const { t } = useTranslation("newScreen");
  return (
    <section className="space-y-20 py-8">
      <div className="space-y-6">
        <h1 className="text-5xl font-light sm:text-6xl md:text-7xl">
          {t("newScreen.title")}
        </h1>
        <p className="max-w-2xl text-neutral-500">{t("newScreen.paragraph")}</p>
      </div>

      <section className="space-y-8">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          {t("newScreen.selectType")}
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-light">
            {t("newScreen.staticScreens.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group border border-neutral-300 p-6 text-left transition-colors duration-300 hover:bg-black hover:text-white">
              <h3 className="text-xl font-light">
                {t("newScreen.staticScreens.exhibition.title")}
              </h3>
              <p className="mt-3 text-sm text-neutral-500 group-hover:text-neutral-500">
                {t("newScreen.staticScreens.exhibition.description")}
              </p>
            </button>
            <button className="border border-neutral-300 p-6 text-left transition hover:bg-black hover:text-white">
              <h3 className="text-xl font-light">
                {t("newScreen.staticScreens.artwork.title")}
              </h3>
              <p className="mt-3 text-sm text-neutral-500">
                {t("newScreen.staticScreens.artwork.description")}
              </p>
            </button>
            <button className="border border-neutral-300 p-6 text-left transition hover:bg-black hover:text-white">
              <h3 className="text-xl font-light">
                {t("newScreen.staticScreens.artist.title")}
              </h3>
              <p className="mt-3 text-sm text-neutral-500">
                {t("newScreen.staticScreens.artist.description")}
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-6 pt-8">
          <h2 className="text-2xl font-light">
            {t("newScreen.dynamicScreens.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              disabled
              className="border border-neutral-200 p-6 text-left opacity-40 cursor-not-allowed"
            >
              <h3 className="text-xl font-light">
                {t("newScreen.dynamicScreens.interactiveArtwork.title")}
              </h3>
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
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500 mb-8">
          Screen Information
        </p>

        <div className="max-w-xl space-y-8">
          <div>
            <label className="text-sm text-neutral-500">Screen Name</label>
            <input
              type="text"
              placeholder="Main Gallery Screen"
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-500">Location</label>
            <input
              type="text"
              placeholder="Entrance Hall"
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>
          <button className="border border-black px-8 py-3 text-sm uppercase tracking-[0.25em] transition hover:bg-black hover:text-white">
            Create Screen
          </button>
        </div>
      </section>
    </section>
  );
}
