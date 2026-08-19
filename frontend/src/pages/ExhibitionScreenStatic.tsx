import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getExhibition,
  type CreateExhibitionResponse,
} from "../api/exhibitionApi";

export default function ExhibitionScreen() {
  const { t, i18n } = useTranslation("display");
  const { id } = useParams<{ id: string }>();

  const [exhibition, setExhibition] = useState<CreateExhibitionResponse | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const language = i18n.language.startsWith("de") ? "german" : "english";

    const loadExhibition = async (exhibitionId: string) => {
      try {
        setLoading(true);
        setError(false);

        const data = await getExhibition(exhibitionId, language);

        setExhibition(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadExhibition(id);
  }, [id, i18n.language]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-light">{t("loading")}</p>
      </main>
    );
  }

  if (error || !exhibition) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-light">{t("error")}</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={exhibition.fileUrl ?? ""}
        alt={exhibition.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 flex min-h-screen flex-col justify-end px-12 py-16 text-white">
        <div className="max-w-4xl space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/80">
            {exhibition.startDate} – {exhibition.endDate}
          </p>

          <h1 className="text-6xl font-light leading-tight md:text-8xl">
            {exhibition.title}
          </h1>

          {exhibition.subtitle && (
            <h2 className="text-3xl font-light text-white/80 md:text-5xl">
              {exhibition.subtitle}
            </h2>
          )}

          <p className="max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
            {exhibition.description}
          </p>
        </div>
      </section>
    </main>
  );
}
