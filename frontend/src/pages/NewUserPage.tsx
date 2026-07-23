import { useTranslation } from "react-i18next";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";

export default function NewUserPage() {
  const { t } = useTranslation("newUser");

  return (
    <section className="space-y-20 py-8">
      <section className="space-y-8">
        <H1>{t("newUser.title")}</H1>
        <P>{t("newUser.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <H2>{t("newUser.userInformation")}</H2>
          </div>

          <form className="lg:col-span-8 max-w-md flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstname"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("newUser.form.firstName")}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastname"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("newUser.form.lastName")}
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("newUser.form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("newUser.form.password")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="repeat-password"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("newUser.form.repeatPassword")}
              </label>
              <input
                type="password"
                id="repeat-password"
                name="repeat-password"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <button
              type="submit"
              className="self-start mt-4 border border-black px-8 py-3 uppercase tracking-[0.25em] text-sm transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("newUser.form.submit")}
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}
