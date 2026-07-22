import { useTranslation } from "react-i18next";

import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";

export default function About() {
  const { t } = useTranslation("about");

  return (
    <section className="space-y-20">
      <section className="space-y-20">
        <H1>{t("hero.title")}</H1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 tracking-widest leading-loose">
          <P>{t("intro.paragraph1")}</P>

          <P>{t("intro.paragraph2")}</P>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>{t("team.title")}</H2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <article className="space-y-8">
            <div className="aspect-4/5 border border-neutral-300 bg-neutral-100 flex items-center justify-center text-neutral-400 uppercase tracking-[0.3em] text-sm">
              {t("team.portrait")}
            </div>

            <div>
              <H3>{t("team.members.mela.name")}</H3>

              <P>{t("team.members.mela.role")}</P>
            </div>

            <P>{t("team.members.mela.description")}</P>
          </article>

          <article className="space-y-8">
            <div className="aspect-4/5 border border-neutral-300 bg-neutral-100 flex items-center justify-center text-neutral-400 uppercase tracking-[0.3em] text-sm">
              Portrait
            </div>

            <div>
              <H3>{t("team.members.imke.name")}</H3>

              <P>{t("team.members.imke.role")}</P>
            </div>

            <P>{t("team.members.imke.description")}</P>
          </article>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <P>{t("collaboration.label")}</P>

            <H3>{t("collaboration.title")}</H3>
          </div>

          <div className="md:col-span-8">
            <P>{t("collaboration.paragraph")}</P>
          </div>
        </div>
      </section>
    </section>
  );
}
