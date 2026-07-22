import { useState } from "react";
import ArtworkCard from "./ArtworkCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";
import P from "./ui/typography/P";

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
        <Carouselbutton
          onClick={() => setStartIndex((prev) => Math.max(prev - 3, 0))}
          disabled={startIndex === 0}
        >
          ← Previous
        </Carouselbutton>
        <P>01 / 03</P>
        <Carouselbutton
          onClick={() =>
            setStartIndex((prev) => Math.min(prev + 3, artworks.length - 3))
          }
          disabled={startIndex >= artworks.length - 3}
        >
          Next →
        </Carouselbutton>
      </div>
    </div>
  );
}
