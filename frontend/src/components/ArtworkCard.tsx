import { Link } from "react-router-dom";

import H3 from "./ui/typography/H3";
import P from "./ui/typography/P";

import type { ArtworkResponse } from "../api/artworkApi";
import { deleteArtwork } from "../api/artworkApi";

interface ArtworkCardProps {
  artwork: ArtworkResponse;
  onDeleted?: (id: string) => void;
}

export default function ArtworkCard({ artwork, onDeleted }: ArtworkCardProps) {
  console.log("ArtworkCard:", artwork);
  console.log("Artists:", artwork.artists);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Möchtest du dieses Artwork wirklich löschen? Die deutsche und englische Version werden gemeinsam gelöscht."
    );

    if (!confirmed) return;

    try {
      await deleteArtwork(artwork.id);

      onDeleted?.(artwork.id);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Das Artwork konnte nicht gelöscht werden."
      );
    }
  };

  return (
    <Link
      to={`/landingpage/artworks/${artwork.id}`}
      className="group overflow-hidden border"
    >
      {/* IMAGE */}

      {artwork.fileUrl ? (
        <img
          src={artwork.fileUrl}
          alt={artwork.title}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="aspect-square w-full bg-neutral-100" />
      )}

      {/* CONTENT */}

      <div className="space-y-2 p-6">
        {/* TITLE */}

        <H3>{artwork.title}</H3>

        {/* SUBTITLE */}

        {artwork.subtitle && <P>{artwork.subtitle}</P>}

        {/* ARTISTS */}

        {artwork.artists?.length > 0 && (
          <div className="space-y-1">
            {/* <p className="text-sm uppercase tracking-[0.15em]">Artists</p> */}

            {artwork.artists.map((artist) => (
              <P key={artist.id}>
                {artist.firstName} {artist.lastName}
              </P>
            ))}
          </div>
        )}

        {/* COUNTRY */}

        {artwork.country && <P>{artwork.country}</P>}

        {/* YEAR */}

        {artwork.year && <P>{artwork.year}</P>}

        {/* ORIGIN */}

        {artwork.origin && <P>{artwork.origin}</P>}

        {/* MATERIAL */}

        {artwork.material && <P>{artwork.material}</P>}

        {/* DIMENSIONS */}

        {artwork.dimensions && <P>{artwork.dimensions}</P>}

        {/* DESCRIPTION */}

        {artwork.description && <P>{artwork.description}</P>}

        {/* CREATED BY */}

        <p className="text-sm text-gray-500">
          Created by: {artwork.createdByName}
        </p>

        {/* DELETE */}

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
