import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";

export default function User() {
  const { t } = useTranslation("user");

  return (
    <section className="space-y-20">
      <section className="space-y-12">
        <H1>{t("hero.title")}</H1>

        <P>{t("hero.subtitle")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <H2>{t("account.title")}</H2>
          </div>

          <form className="lg:col-span-8 max-w-md flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstname"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.firstName")}
              </label>

              <input
                type="text"
                id="firstname"
                name="firstname"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastname"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.lastName")}
              </label>

              <input
                type="text"
                id="lastname"
                name="lastname"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.email")}
              </label>

              <input
                type="email"
                id="email"
                name="email"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.password")}
              </label>

              <input
                type="password"
                id="password"
                name="password"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            <button
              type="submit"
              className="self-start mt-4 border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("account.form.submit")}
            </button>
          </form>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <H2>{t("management.title")}</H2>
          </div>

          <div className="lg:col-span-8">
            <H3>{t("management.heading")}</H3>
            <br />
            <P>{t("management.description")}</P>
            <br />
            <br />
            <Link to="/landingpage/user/new">
              <Borderbutton>{t("management.button")}</Borderbutton>
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
