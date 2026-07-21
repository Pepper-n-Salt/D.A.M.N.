import { useState } from "react";
import ArtworkCard from "./ArtworkCard";

const artworks = [
  {
    id: 1,
    image: "https://placehold.co/600x600",
    title: "Sunset",
    artist: "Jane Doe",
    created: "17.07.2026",
  },
  {
    id: 2,
    image: "https://placehold.co/600x600",
    title: "Forest",
    artist: "Max Mustermann",
    created: "12.07.2026",
  },
  {
    id: 3,
    image: "https://placehold.co/600x600",
    title: "Ocean",
    artist: "Anna Smith",
    created: "08.07.2026",
  },
  {
    id: 4,
    image: "https://placehold.co/600x600",
    title: "Mountains",
    artist: "John Doe",
    created: "01.07.2026",
  },
];

export default function ArtworkCarousel() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleArtworks = artworks.slice(startIndex, startIndex + 3);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={() => setStartIndex((prev) => Math.max(prev - 3, 0))}
          disabled={startIndex === 0}
          className="border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Previous
        </button>

        <button
          onClick={() =>
            setStartIndex((prev) => Math.min(prev + 3, artworks.length - 3))
          }
          disabled={startIndex >= artworks.length - 3}
          className="border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
