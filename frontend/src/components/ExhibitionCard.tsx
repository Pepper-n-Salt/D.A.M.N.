import { Link } from "react-router-dom";
import H3 from "./ui/typography/H3";
import P from "./ui/typography/P";
import type { CreateExhibitionResponse } from "../api/exhibitionApi";
import { deleteExhibition } from "../api/exhibitionApi";

interface ExhibitionCardProps {
  exhibition: CreateExhibitionResponse;
  onDeleted?: (id: string) => void;
}

export default function ExhibitionCard({
  exhibition,
  onDeleted,
}: ExhibitionCardProps) {
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Möchtest du diese Exhibition wirklich löschen? Die deutsche und englische Version werden gemeinsam gelöscht."
    );

    if (!confirmed) return;

    try {
      await deleteExhibition(exhibition.id);

      onDeleted?.(exhibition.id);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Die Exhibition konnte nicht gelöscht werden."
      );
    }
  };

  return (
    <Link
      to={`/landingpage/exhibitions/${exhibition.id}`}
      className="group overflow-hidden border"
    >
      {/* Hier jetzt das Bild aus Cloudinary */}
      {exhibition.fileUrl ? (
        <img
          src={exhibition.fileUrl}
          alt={exhibition.title}
          className="aspect-4/3 w-full object-cover"
        />
      ) : (
        <div className="aspect-4/3 w-full bg-neutral-100" />
      )}

      <div className="space-y-2 p-6">
        <H3>{exhibition.title}</H3>

        <P>
          {exhibition.startDate} - {exhibition.endDate}
        </P>

        <P>{exhibition.location}</P>

        <p className="text-sm text-gray-500">
          Created by: {exhibition.createdByName}
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
