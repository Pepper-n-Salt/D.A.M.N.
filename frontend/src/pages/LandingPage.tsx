import { useTranslation } from "react-i18next";

import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import Carouselbutton from "../components/ui/buttons/Carouselbutton";

export default function LandingPage() {
  const { t } = useTranslation("home");

  return (
    <section className="space-y-20">
      <H1>{t("hero.title")}</H1>
      <div className="flex flex-row flex-wrap gap-12">
        <div className="flex-1 min-w-[250px]">
          <P>{t("intro.paragraph1")}</P>
        </div>

        <div className="flex-1 min-w-[250px]">
          <P>{t("intro.paragraph2")}</P>
        </div>

        <div className="flex-1 min-w-[250px]">
          <P>{t("intro.paragraph3")}</P>
        </div>
      </div>
      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <div className="mb-8">
          <H2>{t("landing.currentCollection")}</H2>
        </div>

        <div className="border border-neutral-300">
          <div className="aspect-video bg-neutral-100 flex items-center justify-center">
            {" "}
            {/* später keine Umrandung mehr verwenden, lieber overflow-hidden */}
            <P>{t("landing.preview")}</P>
          </div>

          <div className="border-t border-neutral-300 flex justify-between items-end p-6">
            <div>
              <H3>{t("landing.artworkTitle")}</H3>

              <P>{t("landing.artworkMeta")}</P>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <Carouselbutton aria-label={t("landing.previousArtwork")}>
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            {t("landing.previous")}
          </Carouselbutton>
          <P>01 / 12</P>
          <Carouselbutton
            aria-label={t("landing.nextArtwork")}
            className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
          >
            {t("landing.next")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Carouselbutton>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-neutral-200 pt-12">
        <div>
          <H2>{t("landing.collection")}</H2>

          <div className="mt-4 flex items-baseline gap-3">
            <H3>124</H3>
            <P>{t("landing.artworks")}</P>
          </div>
        </div>

        <div>
          <H2>{t("landing.exhibitions")}</H2>
          <div className="mt-4 flex items-baseline gap-3">
            <H3>8</H3>
            <P>{t("landing.activeProjects")}</P>
          </div>
        </div>

        <div>
          <H2>{t("landing.screens")}</H2>
          <div className="mt-4 flex items-baseline gap-3">
            <H3>16</H3>
            <P>{t("landing.connectedDisplays")}</P>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <H2>{t("landing.recentActivity")}</H2>

        <div className="divide-y divide-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 py-6">
            <p className="text-sm text-neutral-400 md:col-span-1">12.02.2026</p>

            <P>{t("landing.activityArtwork")}</P>

            <p className="md:col-span-1 text-neutral-500">
              {t("landing.activityArtworkTitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 py-6">
            <p className="md:col-span-1 text-sm text-neutral-400">08.02.2026</p>

            <P>{t("landing.activityExhibition")}</P>

            <p className="md:col-span-1 text-neutral-500">
              {t("landing.activityExhibitionTitle")}
            </p>
          </div>
        </div>
      </section>
      <section className="border-t border-neutral-200 pt-12">
        <div className="mb-8">
          <H2>{t("landing.currentExhibition")}</H2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <H3>{t("landing.exhibitionTitle")}</H3>

            <P>{t("landing.exhibitionDescription")}</P>
          </div>

          <div className="text-sm space-y-4">
            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <P>{t("landing.screensLabel")}</P>
              <P>4</P>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <P>{t("landing.artworksLabel")}</P>
              <P>12</P>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <P>{t("landing.statusLabel")}</P>
              <P>{t("landing.statusValue")}</P>
            </div>
          </div>
        </div>
      </section>
      <br />
    </section>

    // {/* alte Landing Page */}
    // <section className=" mx-auto py-20 space-y-10">
    //   <div className="space-y-6">
    //     <h1 className="text-6xl font-semibold">Welcome to the Landingpage</h1>

    //     <p className="max-w-2xl text-gray-600">
    //       This is a temporary filler page for the landing experience. The more
    //       detailed artwork content now lives under the dedicated artworks route.
    //     </p>
    //   </div>

    //   <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-gray-700">
    //     <p>
    //       Use this space for future intro text, branding, or a teaser section.
    //     </p>
    //   </div>
    // </section>
  );
}
