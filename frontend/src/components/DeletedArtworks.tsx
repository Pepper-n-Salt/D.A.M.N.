import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import P from "./ui/typography/P";

import {
  getDeletedArtworks,
  restoreArtwork,
  type ArtworkResponse,
} from "../api/artworkApi";

export default function DeletedArtworks() {
  const { i18n, t } = useTranslation("artworks");

  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  /*
   * ------------------------------------------------------------------------
   * Gelöschte Artworks laden
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    const loadDeletedArtworks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getDeletedArtworks(languageCode);

        setArtworks(result);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die gelöschten Artworks konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDeletedArtworks();
  }, [languageCode]);

  /*
   * ------------------------------------------------------------------------
   * Artwork wiederherstellen
   * ------------------------------------------------------------------------
   */

  const handleRestore = async (artworkId: string) => {
    const confirmed = window.confirm(
      "Möchtest du dieses Artwork wirklich wiederherstellen?"
    );

    if (!confirmed) return;

    try {
      await restoreArtwork(artworkId);

      setArtworks((currentArtworks) =>
        currentArtworks.filter((artwork) => artwork.id !== artworkId)
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Das Artwork konnte nicht wiederhergestellt werden."
      );
    }
  };

  /*
   * ------------------------------------------------------------------------
   * Loading
   * ------------------------------------------------------------------------
   */

  if (isLoading) {
    return <p className="text-sm uppercase tracking-[0.2em]">Loading...</p>;
  }

  /*
   * ------------------------------------------------------------------------
   * Fehler
   * ------------------------------------------------------------------------
   */

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  /*
   * ------------------------------------------------------------------------
   * Keine Artworks
   * ------------------------------------------------------------------------
   */

  if (artworks.length === 0) {
    return <P>{t("deleted.notfound")}</P>;
  }

  return (
    <div className="space-y-4">
      {artworks.map((artwork) => (
        <div
          key={artwork.id}
          className="flex flex-col gap-4 border border-black px-8 py-4 uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="font-medium">{artwork.title}</h3>

            {artwork.subtitle && (
              <p className="text-sm text-gray-500">{artwork.subtitle}</p>
            )}

            {artwork.year && (
              <p className="text-sm text-gray-500">{artwork.year}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="text-sm text-gray-500">
              {artwork.dimensions || ""}
            </div>

            <button
              type="button"
              onClick={() => handleRestore(artwork.id)}
              className="border border-green-600 px-4 py-2 text-sm uppercase tracking-[0.15em] text-green-600 transition-colors duration-300 hover:bg-green-600 hover:text-white"
            >
              Restore
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
