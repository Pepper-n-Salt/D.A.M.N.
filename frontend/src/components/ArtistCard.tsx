import { Link } from "react-router-dom";
import H3 from "./ui/typography/H3";
import P from "./ui/typography/P";

import type { CreateArtistResponse } from "../api/artistApi";
import { deleteArtist } from "../api/artistApi";

interface ArtistCardProps {
  artist: CreateArtistResponse;
  onDeleted?: (id: string) => void;
}

export default function ArtistCard({ artist, onDeleted }: ArtistCardProps) {
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Möchtest du diesen Artist wirklich löschen? Die deutsche und englische Version werden gemeinsam gelöscht."
    );

    if (!confirmed) return;

    try {
      console.log("artist:", artist);
      console.log("artist.id:", artist.id);

      await deleteArtist(artist.id);

      onDeleted?.(artist.id);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Der Artist konnte nicht gelöscht werden."
      );
    }
  };

  return (
    <Link
      to={`/landingpage/artists/${artist.id}`}
      className="group overflow-hidden border"
    >
      {/* Hier jetzt das Bild aus Cloudinary */}
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
          Created by: {artist.createdByName}
        </p>

        <button
          type="button"
          onClick={handleDelete}
          className="mt-4 border border-red-600 px-4 py-2 text-sm uppercase tracking-[0.15em] text-red-600 transition-colors duration-300 hover:bg-red-600 hover:text-white"
        >
          Delete
        </button>
      </div>
    </Link>
  );
}
