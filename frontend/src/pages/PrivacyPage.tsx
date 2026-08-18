import { useTranslation } from "react-i18next";

import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";

export default function PrivacyPage() {
  const { t } = useTranslation("privacy");

  return (
    <section className="space-y-20 py-8">
      <section className="space-y-8">
        <H1>{t("hero.title")}</H1>

        <P>{t("hero.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("responsible.title")}</H2>

        <div className="space-y-2">
          <P>{t("responsible.name")}</P>
          <P>{t("responsible.address")}</P>
          <P>{t("responsible.city")}</P>
          <P>{t("responsible.email")}</P>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("general.title")}</H2>

        <P>{t("general.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("contact.title")}</H2>

        <P>{t("contact.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("accounts.title")}</H2>

        <P>{t("accounts.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("cookies.title")}</H2>

        <P>{t("cookies.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("platform.title")}</H2>

        <P>{t("platform.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("media.title")}</H2>

        <P>{t("media.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("cloudinary.title")}</H2>

        <P>{t("cloudinary.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("ai.title")}</H2>

        <P>{t("ai.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("email.title")}</H2>

        <P>{t("email.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("technical.title")}</H2>

        <P>{t("technical.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("infrastructure.title")}</H2>

        <P>{t("infrastructure.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("legalBasis.title")}</H2>

        <P>{t("legalBasis.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("recipients.title")}</H2>

        <P>{t("recipients.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("thirdCountries.title")}</H2>

        <P>{t("thirdCountries.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("retention.title")}</H2>

        <P>{t("retention.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("security.title")}</H2>

        <P>{t("security.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("rights.title")}</H2>

        <P>{t("rights.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("complaint.title")}</H2>

        <P>{t("complaint.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("automatedDecisionMaking.title")}</H2>

        <P>{t("automatedDecisionMaking.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("changes.title")}</H2>

        <P>{t("changes.paragraph")}</P>
      </section>
    </section>
  );
}
