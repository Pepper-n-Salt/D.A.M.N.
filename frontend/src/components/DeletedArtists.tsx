import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import P from "./ui/typography/P";

import {
  getDeletedArtists,
  restoreArtist,
  type CreateArtistResponse,
} from "../api/artistApi";

export default function DeletedArtists() {
  const { i18n, t } = useTranslation("artists");

  const [artists, setArtists] = useState<CreateArtistResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  useEffect(() => {
    const loadDeletedArtists = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getDeletedArtists(languageCode);

        setArtists(result);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die gelöschten Artists konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDeletedArtists();
  }, [languageCode]);

  const handleRestore = async (artistId: string) => {
    const confirmed = window.confirm(t("deleted.restoreConfirm"));

    if (!confirmed) return;

    try {
      await restoreArtist(artistId);

      setArtists((currentArtists) =>
        currentArtists.filter((artist) => artist.id !== artistId)
      );
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : t("deleted.restoreError"));
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm uppercase tracking-[0.2em]">
        {t("deleted.loading")}
      </p>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (artists.length === 0) {
    return <P>{t("deleted.notfound")}</P>;
  }

  return (
    <div className="space-y-4">
      {artists.map((artist) => (
        <div
          key={artist.id}
          className="flex flex-col gap-4 border border-black px-8 py-4 uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="font-medium">
              {artist.firstName} {artist.lastName}
            </h3>

            {artist.country && (
              <p className="text-sm text-gray-500">{artist.country}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="text-sm text-gray-500">
              {artist.dateOfBirth || ""}
              {artist.dateOfDeath ? ` - ${artist.dateOfDeath}` : ""}
            </div>

            <button
              type="button"
              onClick={() => handleRestore(artist.id)}
              className="border border-green-600 px-4 py-2 text-sm uppercase tracking-[0.15em] text-green-600 transition-colors duration-300 hover:bg-green-600 hover:text-white"
            >
              {t("deleted.restore")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
