import { useTranslation } from "react-i18next";

export default function ImprintPage() {
  const { t } = useTranslation("imprint");

  return (
    <section className="space-y-6 py-8">
      <h1 className="text-5xl font-light">{t("hero.title")}</h1>
      <p className="max-w-2xl tracking-widest leading-loose">
        {t("hero.paragraph")}
      </p>
    </section>
  );
}
