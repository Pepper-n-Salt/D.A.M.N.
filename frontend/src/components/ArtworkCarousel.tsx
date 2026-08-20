import { useState } from "react";

import ArtworkCard from "./ArtworkCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";
import P from "./ui/typography/P";

import type { ArtworkResponse } from "../api/artworkApi";

interface ArtworkCarouselProps {
  artworks: ArtworkResponse[];
  onDeleted: (artwork: ArtworkResponse) => void;
}

export default function ArtworkCarousel({
  artworks,
  onDeleted,
}: ArtworkCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);

  const handleDeleted = (artwork: ArtworkResponse) => {
    onDeleted(artwork);

    setStartIndex((currentStartIndex) => {
      const remainingCount = artworks.length - 1;

      const maxStartIndex = Math.max(
        Math.floor((remainingCount - 1) / 3) * 3,
        0
      );

      return Math.min(currentStartIndex, maxStartIndex);
    });
  };

  // Sichtbare Artworks
  const visibleArtworks = artworks.slice(startIndex, startIndex + 3);

  // Scroll
  const scrollToCurrentArtworks = () => {
    document.getElementById("current-artworks")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Previous
  const handlePrevious = () => {
    setStartIndex((previous) => {
      const newIndex = Math.max(previous - 3, 0);

      requestAnimationFrame(scrollToCurrentArtworks);

      return newIndex;
    });
  };

  // Next
  const handleNext = () => {
    setStartIndex((previous) => {
      const newIndex = Math.min(previous + 3, Math.max(artworks.length - 3, 0));

      requestAnimationFrame(scrollToCurrentArtworks);

      return newIndex;
    });
  };

  // Keine Artworks
  if (artworks.length === 0) {
    return <P>Keine Artworks gefunden.</P>;
  }

  // Pagination
  const currentPage = Math.floor(startIndex / 3) + 1;
  const totalPages = Math.ceil(artworks.length / 3);

  return (
    <div className="space-y-8" id="current-artworks">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleArtworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onDeleted={() => handleDeleted(artwork)}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <Carouselbutton onClick={handlePrevious} disabled={startIndex === 0}>
          ← Previous
        </Carouselbutton>

        <P>
          {String(currentPage).padStart(2, "0")} /{" "}
          {String(totalPages).padStart(2, "0")}
        </P>

        <Carouselbutton
          onClick={handleNext}
          disabled={startIndex >= artworks.length - 3}
        >
          Next →
        </Carouselbutton>
      </div>
    </div>
  );
}
