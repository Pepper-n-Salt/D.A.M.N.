import { useState } from "react";
import { useTranslation } from "react-i18next";

import ArtistCard from "./ArtistCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";
import P from "./ui/typography/P";

import type { CreateArtistResponse } from "../api/artistApi";

interface ArtistCarouselProps {
  artists: CreateArtistResponse[];
  onDeleted: (artist: CreateArtistResponse) => void;
}

export default function ArtistCarousel({
  artists,
  onDeleted,
}: ArtistCarouselProps) {
  const { t } = useTranslation("common");

  const [startIndex, setStartIndex] = useState(0);

  const handleDeleted = (artist: CreateArtistResponse) => {
    onDeleted(artist);

    setStartIndex((currentStartIndex) => {
      const remainingCount = artists.length - 1;

      const maxStartIndex = Math.max(
        Math.floor((remainingCount - 1) / 3) * 3,
        0
      );

      return Math.min(currentStartIndex, maxStartIndex);
    });
  };

  // Sichtbare Artists
  const visibleArtists = artists.slice(startIndex, startIndex + 3);

  // Scroll
  const scrollToCurrentArtists = () => {
    document.getElementById("current-artists")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Previous
  const handlePrevious = () => {
    setStartIndex((prev) => {
      const newIndex = Math.max(prev - 3, 0);

      requestAnimationFrame(scrollToCurrentArtists);

      return newIndex;
    });
  };

  // Next
  const handleNext = () => {
    setStartIndex((prev) => {
      const maxStartIndex = Math.floor((artists.length - 1) / 3) * 3;

      const newIndex = Math.min(prev + 3, maxStartIndex);

      requestAnimationFrame(scrollToCurrentArtists);

      return newIndex;
    });
  };

  // Keine Artists
  if (artists.length === 0) {
    return <P>{t("empty.artists")}</P>;
  }

  // Pagination
  const currentPage = Math.floor(startIndex / 3) + 1;
  const totalPages = Math.ceil(artists.length / 3);

  return (
    <div className="space-y-8" id="current-artists">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleArtists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onDeleted={() => handleDeleted(artist)}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <Carouselbutton onClick={handlePrevious} disabled={startIndex === 0}>
          ← {t("carousel.previous")}
        </Carouselbutton>

        <P>
          {String(currentPage).padStart(2, "0")} /{" "}
          {String(totalPages).padStart(2, "0")}
        </P>

        <Carouselbutton
          onClick={handleNext}
          disabled={startIndex >= artists.length - 3}
        >
          {t("carousel.next")} →
        </Carouselbutton>
      </div>
    </div>
  );
}
