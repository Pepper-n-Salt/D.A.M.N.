import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import H3 from "./ui/typography/H3";
import P from "./ui/typography/P";

import type { CreateArtistResponse } from "../api/artistApi";
import { deleteArtist } from "../api/artistApi";

interface ArtistCardProps {
  artist: CreateArtistResponse;
  onDeleted?: (id: string) => void;
}

export default function ArtistCard({ artist, onDeleted }: ArtistCardProps) {
  const { t } = useTranslation("artists");

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(t("card.deleteConfirm"));

    if (!confirmed) return;

    try {
      console.log("artist:", artist);
      console.log("artist.id:", artist.id);

      await deleteArtist(artist.id);

      onDeleted?.(artist.id);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : t("card.deleteError"));
    }
  };

  return (
    <Link
      to={`/landingpage/artists/${artist.id}`}
      className="group overflow-hidden border"
    >
      {artist.fileUrl ? (
        <img
          src={artist.fileUrl}
          alt={`${artist.firstName} ${artist.lastName}`}
          className="aspect-4/3 w-full object-cover"
        />
      ) : (
        <div className="aspect-4/3 w-full bg-neutral-100" />
      )}

      <div className="space-y-2 p-6">
        <H3>
          {artist.firstName} {artist.lastName}
        </H3>

        {artist.country && <P>{artist.country}</P>}

        {(artist.dateOfBirth || artist.dateOfDeath) && (
          <P>
            {artist.dateOfBirth || ""}
            {artist.dateOfDeath ? ` - ${artist.dateOfDeath}` : ""}
          </P>
        )}

        {artist.description && <P>{artist.description}</P>}

        <p className="text-sm text-gray-500">
          {t("card.createdBy")}: {artist.createdByName}
        </p>

        <button
          type="button"
          onClick={handleDelete}
          className="mt-4 border border-red-600 px-4 py-2 text-sm uppercase tracking-[0.15em] text-red-600 transition-colors duration-300 hover:bg-red-600 hover:text-white"
        >
          {t("card.delete")}
        </button>
      </div>
    </Link>
  );
}
