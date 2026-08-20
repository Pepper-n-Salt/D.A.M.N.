import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getPublicArtist, type CreateArtistResponse } from "../api/artistApi";

export default function ArtistScreen() {
  const { t, i18n } = useTranslation("display");
  const { id } = useParams<{ id: string }>();

  const [artist, setArtist] = useState<CreateArtistResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const language = i18n.language.startsWith("de") ? "de" : "en";

    const loadArtist = async (artistId: string) => {
      try {
        setLoading(true);
        setError(false);

        const data = await getPublicArtist(artistId, language);

        setArtist(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadArtist(id);
  }, [id, i18n.language]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-light">{t("loading")}</p>
      </main>
    );
  }

  if (error || !artist) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-light">{t("artist.notFound")}</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={artist.fileUrl ?? ""}
        alt={`${artist.firstName} ${artist.lastName}`}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 flex min-h-screen flex-col justify-end px-12 py-16 text-white">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-6xl font-light md:text-8xl">
            {artist.firstName} {artist.lastName}
          </h1>

          {(artist.dateOfBirth || artist.dateOfDeath) && (
            <h2 className="text-3xl font-light text-white/80 md:text-5xl">
              {artist.dateOfBirth} – {artist.dateOfDeath}
            </h2>
          )}

          {artist.country && (
            <p className="uppercase tracking-[0.3em] text-white/80">
              {artist.country}
            </p>
          )}

          <p className="max-w-3xl text-lg leading-relaxed text-white/90">
            {artist.description}
          </p>
        </div>
      </section>
    </main>
  );
}
