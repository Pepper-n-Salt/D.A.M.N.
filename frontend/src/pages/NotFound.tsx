import { useTranslation } from "react-i18next";

import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";

export default function NotFound() {
  const { t } = useTranslation("notFound");

  return (
    <section className="min-h-[70vh] flex items-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <span className="text-[clamp(6rem,18vw,14rem)] leading-none font-light tracking-[-0.08em]">
            404
          </span>
        </div>

        <div className="md:col-span-8 flex flex-col justify-center space-y-8">
          <H1>{t("title")}</H1>

          <P>{t("description")}</P>

          <a
            href="/"
            className="inline-flex w-fit border-b border-neutral-900 pb-1 uppercase tracking-[0.2em] text-sm hover:opacity-50 transition-opacity"
          >
            {t("backHome")}
          </a>
        </div>
      </div>
    </section>
  );
}
