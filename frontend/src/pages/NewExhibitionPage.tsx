import { useTranslation } from "react-i18next";

export default function NewExhibitionPage() {
  const { t } = useTranslation("newExhibition");

  return (
    <section className="space-y-10 py-8">
      <div className="space-y-8">
        <h1 className="text-5xl font-light sm:text-5xl md:text-7xl lg:text-9xl">
          {t("newExhibition.title")}
        </h1>
        <p className="max-w-2xl tracking-widest leading-loose">
          {t("newExhibition.paragraph")}
        </p>
      </div>

      <form className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-none border border-black p-8">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("newExhibition.form.title")}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="subtitle"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("newExhibition.form.subtitle")}
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="startDate"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("newExhibition.form.startDate")}
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="endDate"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("newExhibition.form.endDate")}
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              htmlFor="location"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("newExhibition.form.location")}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("newExhibition.form.description")}
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="resize-none border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="events"
            className="text-sm uppercase tracking-[0.2em]"
          >
            {t("newExhibition.form.events")}
          </label>
          <textarea
            id="events"
            name="events"
            rows={4}
            className="resize-none border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <button
          type="submit"
          className="self-start border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
        >
          {t("newExhibition.form.submit")}
        </button>
      </form>
    </section>
  );
}
