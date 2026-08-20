import { useTranslation } from "react-i18next";

import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";

export default function ImprintPage() {
  const { t } = useTranslation("imprint");

  return (
    <section className="space-y-20 py-8">
      <section className="space-y-8">
        <H1>{t("hero.title")}</H1>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("provider.title")}</H2>

        <div className="space-y-2">
          <P>{t("provider.name")}</P>
          <P>{t("provider.address")}</P>
          <P>{t("provider.city")}</P>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("contact.title")}</H2>

        <P>
          {t("contact.email.label")}{" "}
          <a
            href="mailto:melaniehe@t-online.de"
            className="underline underline-offset-4 hover:opacity-50 transition-opacity"
          >
            melaniehe@t-online.de
          </a>
        </P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("contentLiability.title")}</H2>

        <P>{t("contentLiability.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("linkLiability.title")}</H2>

        <P>{t("linkLiability.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("copyright.title")}</H2>

        <P>{t("copyright.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("disputeResolution.title")}</H2>

        <P>{t("disputeResolution.paragraph")}</P>
      </section>
    </section>
  );
}
