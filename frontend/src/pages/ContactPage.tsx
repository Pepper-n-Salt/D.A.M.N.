import { useTranslation } from "react-i18next";

import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";

export default function ContactPage() {
  const { t } = useTranslation("contact");

  return (
    <section className="space-y-20">
      <section className="space-y-12">
        <H1>
          {t("hero.titleLine1")}
          <br />
          {t("hero.titleLine2")}
        </H1>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 tracking-widest leading-loose">
        <div className="space-y-8">
          <H2>{t("content.title")}</H2>

          <P>{t("content.paragraph1")}</P>

          <P>{t("content.paragraph2")}</P>
        </div>

        <form action="" className="flex flex-col gap-8 max-w-md w-full mx-auto">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.name")}
            </label>

            <input
              type="text"
              id="name"
              name="name"
              className="border-b border-black bg-transparent py-3 outline-none focus:border-2 focus:border-t-0 focus:border-l-0 focus:border-r-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.email")}
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className="border-b border-black bg-transparent py-3 outline-none focus:border-2 focus:border-t-0 focus:border-l-0 focus:border-r-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.message")}
            </label>

            <textarea
              id="message"
              name="message"
              rows={6}
              className="border-b border-black bg-transparent py-3 outline-none resize-none focus:border-2 focus:border-t-0 focus:border-l-0 focus:border-r-0"
            />
          </div>
          <button
            type="submit"
            className="self-start border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
          >
            {t("form.submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
