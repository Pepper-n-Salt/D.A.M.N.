import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getPublicArtwork, type ArtworkResponse } from "../api/artworkApi";

export default function ArtworkScreen() {
  const { t, i18n } = useTranslation("display");
  const { id } = useParams<{ id: string }>();

  const [artwork, setArtwork] = useState<ArtworkResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const language = i18n.language.startsWith("de") ? "de" : "en";

    const loadArtwork = async (artworkId: string) => {
      try {
        setLoading(true);
        setError(false);

        const data = await getPublicArtwork(artworkId, language);

        setArtwork(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadArtwork(id);
  }, [id, i18n.language]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-light">{t("loading")}</p>
      </main>
    );
  }

  if (error || !artwork) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-light">{t("error")}</p>
      </main>
    );
  }

  const artist = artwork.artists?.[0];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={artwork.fileUrl ?? ""}
        alt={artwork.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 flex min-h-screen flex-col justify-end px-12 py-16 text-white">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-6xl font-light leading-tight md:text-8xl">
            {artwork.title}
          </h1>

          {artist && (
            <p>
              {t("artwork.by")}{" "}
              <Link
                to={`/display/static/artist/${artist.id}`}
                className="underline underline-offset-4 hover:text-white/80"
              >
                {artist.firstName} {artist.lastName}
              </Link>
            </p>
          )}

          {(artwork.dimensions || artwork.material) && (
            <p className="max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
              {artwork.dimensions}
              {artwork.dimensions && artwork.material && ", "}
              {artwork.material}
            </p>
          )}

          <p className="max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
            {t("artwork.yearLocation", {
              year: artwork.year,
              land: artwork.country,
            })}
          </p>

          {artwork.subtitle && (
            <h2 className="text-3xl font-light text-white/80 md:text-5xl">
              {artwork.subtitle}
            </h2>
          )}

          <p className="max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
            {artwork.description}
          </p>
        </div>
      </section>
    </main>
  );
}
