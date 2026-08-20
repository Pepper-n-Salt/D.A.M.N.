import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getArtwork, type ArtworkResponse } from "../api/artworkApi";

const PUZZLE_SIZE = 3;

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export default function ArtworkScreenPuzzle() {
  const { t, i18n } = useTranslation("display");
  const { id } = useParams<{ id: string }>();

  const [artwork, setArtwork] = useState<ArtworkResponse | null>(null);
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const language = i18n.language.startsWith("de") ? "german" : "english";

    const loadArtwork = async (artworkId: string) => {
      try {
        setLoading(true);
        setError(false);
        setSelectedPiece(null);

        const data = await getArtwork(artworkId, language);

        setArtwork(data);

        const totalPieces = PUZZLE_SIZE * PUZZLE_SIZE;

        const initialPieces = Array.from(
          { length: totalPieces },
          (_, index) => index
        );

        setPieces(shuffle(initialPieces));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadArtwork(id);
  }, [id, i18n.language]);

  const isSolved =
    pieces.length > 0 && pieces.every((pieceId, index) => pieceId === index);

  useEffect(() => {
    if (!isSolved) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const totalPieces = PUZZLE_SIZE * PUZZLE_SIZE;

      const initialPieces = Array.from(
        { length: totalPieces },
        (_, index) => index
      );

      setPieces(shuffle(initialPieces));
      setSelectedPiece(null);
    }, 10000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isSolved]);

  const handlePieceClick = (index: number) => {
    if (isSolved) {
      return;
    }

    if (selectedPiece === null) {
      setSelectedPiece(index);
      return;
    }

    if (selectedPiece === index) {
      setSelectedPiece(null);
      return;
    }

    setPieces((currentPieces) => {
      const newPieces = [...currentPieces];

      [newPieces[selectedPiece], newPieces[index]] = [
        newPieces[index],
        newPieces[selectedPiece],
      ];

      return newPieces;
    });

    setSelectedPiece(null);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-2xl font-light">{t("loading")}</p>
      </main>
    );
  }

  if (error || !artwork || !artwork.fileUrl) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-2xl font-light">{t("error")}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-12 text-white">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-light md:text-6xl">{artwork.title}</h1>

        <p className="mt-3 text-white/60">
          {isSolved ? `${t("puzzle.solved")}` : t("puzzle.instruction")}
        </p>
      </div>

      <div
        className="grid w-full max-w-3xl overflow-hidden rounded-lg border border-white/20 shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${PUZZLE_SIZE}, 1fr)`,
        }}
      >
        {pieces.map((pieceId, index) => {
          const x = pieceId % PUZZLE_SIZE;
          const y = Math.floor(pieceId / PUZZLE_SIZE);

          const isSelected = selectedPiece === index;

          return (
            <button
              key={`${pieceId}-${index}`}
              type="button"
              onClick={() => handlePieceClick(index)}
              className={`
                aspect-square border border-white/20
                transition
                hover:scale-[1.02] hover:z-10
                ${isSelected ? "z-20 scale-[1.02] ring-4 ring-white" : ""}
              `}
              style={{
                backgroundImage: `url(${artwork.fileUrl})`,
                backgroundSize: `${PUZZLE_SIZE * 100}% ${PUZZLE_SIZE * 100}%`,
                backgroundPosition: `
                  ${(x / (PUZZLE_SIZE - 1)) * 100}%
                  ${(y / (PUZZLE_SIZE - 1)) * 100}%
                `,
              }}
            />
          );
        })}
      </div>
    </main>
  );
}
