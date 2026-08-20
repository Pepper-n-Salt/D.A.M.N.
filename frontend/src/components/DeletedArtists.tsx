import { useTranslation } from "react-i18next";

import P from "./ui/typography/P";

import { restoreArtist, type CreateArtistResponse } from "../api/artistApi";

interface DeletedArtistsProps {
  artists: CreateArtistResponse[];
  onRestore: (artistId: string) => void;
}

export default function DeletedArtists({
  artists,
  onRestore,
}: DeletedArtistsProps) {
  const { t } = useTranslation("artists");

  const handleRestore = async (artistId: string) => {
    const confirmed = window.confirm(t("deleted.restoreConfirm"));

    if (!confirmed) return;

    try {
      await restoreArtist(artistId);

      onRestore(artistId);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : t("deleted.restoreError"));
    }
  };

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
