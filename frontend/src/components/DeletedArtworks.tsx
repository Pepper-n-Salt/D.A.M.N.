import { useTranslation } from "react-i18next";

import P from "./ui/typography/P";

import { restoreArtwork, type ArtworkResponse } from "../api/artworkApi";

interface DeletedArtworksProps {
  artworks: ArtworkResponse[];
  onRestore: (artworkId: string) => void;
}

export default function DeletedArtworks({
  artworks,
  onRestore,
}: DeletedArtworksProps) {
  const { t } = useTranslation("artworks");

  const handleRestore = async (artworkId: string) => {
    const confirmed = window.confirm(t("deleted.restoreConfirm"));

    if (!confirmed) return;

    try {
      await restoreArtwork(artworkId);

      onRestore(artworkId);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : t("deleted.restoreError"));
    }
  };

  if (artworks.length === 0) {
    return <P>{t("deleted.notfound")}</P>;
  }

  return (
    <div className="space-y-4">
      {artworks.map((artwork) => (
        <div
          key={artwork.id}
          className="flex flex-col gap-2 border border-black px-8 py-4 uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between"
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
              {t("deleted.restore")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
