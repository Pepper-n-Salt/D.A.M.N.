import { useTranslation } from "react-i18next";

import Carouselbutton from "../components/ui/buttons/Carouselbutton";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";

export default function HomePage() {
  const { t } = useTranslation("home"); // t ist eine von i18n bereitgestellte Übersetzungsfunktion, die normalerweise einen string zurückgibt

  const showcaseSteps = t("showcase.steps", {
    returnObjects: true,
  }) as string[];

  const overviewItems = t("overview.items", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <section className="space-y-20">
      <H1>{t("hero.title")}</H1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 tracking-widest leading-loose">
        <P>{t("intro.paragraph1")}</P>

        <P>{t("intro.paragraph2")}</P>

        <P>{t("intro.paragraph3")}</P>
      </div>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* <div className="lg:col-span-8">
            <div className="aspect-[16/9] border border-neutral-300 bg-neutral-100 overflow-hidden"> */}
          {/* hier dann Screenshot als <Image> einsetzen */}
          {/* <div className="flex h-full items-center justify-center uppercase tracking-[0.3em] text-neutral-400 text-sm">
                Screenshot Dashboard 16:9
              </div>
            </div>
          </div> */}
          <div className="lg:col-span-8">
            <div className="aspect-video border border-neutral-300 bg-neutral-100 overflow-hidden">
              {/* hier später Image-Komponente einsetzen */}
              <div className="flex h-full items-center justify-center uppercase tracking-[0.3em] text-neutral-400 text-sm">
                Screenshot Dashboard
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <Carouselbutton aria-label="Previous screenshot">
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                {t("showcase.previous")}
              </Carouselbutton>
              <P>01 / 04</P>
              <Carouselbutton aria-label="Next screenshot">
                {t("showcase.next")}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Carouselbutton>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <H2>{t("showcase.workflow")}/H2>
            <br />
            <br />
            <div className="space-y-6">
              {showcaseSteps.map((step, index) => (
                <div key={index}>
                  <div className="flex items-center gap-5">
                    <span className="w-8 text-sm text-neutral-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <H3>{step}</H3>
                  </div>

                  {index < showcaseSteps.length - 1 && (
                    <div className="ml-4 mt-3 h-8 border-l border-neutral-300" />
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          {t("overview.title")}
        </p>

        <div className="divide-y divide-neutral-200">
          {overviewItems.map((item, index) => (
            <div
              key={item.title}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8"
            >
              <div className="md:col-span-2 text-sm text-neutral-400">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-4">
                <H3>{item.title}</H3>
              </div>
              <div className="md:col-span-6 tracking-widest leading-loose">
                <P>{item.description}</P>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
