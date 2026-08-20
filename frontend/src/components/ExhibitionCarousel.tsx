import { useState } from "react";
import { useTranslation } from "react-i18next";

import ExhibitionCard from "./ExhibitionCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";
import P from "./ui/typography/P";

import type { CreateExhibitionResponse } from "../api/exhibitionApi";

interface ExhibitionCarouselProps {
  exhibitions: CreateExhibitionResponse[];
  onDeleted: (exhibition: CreateExhibitionResponse) => void;
}

export default function ExhibitionCarousel({
  exhibitions,
  onDeleted,
}: ExhibitionCarouselProps) {
  const { t } = useTranslation("common");

  const [startIndex, setStartIndex] = useState(0);

  // Sichtbare Exhibitions
  const visibleExhibitions = exhibitions.slice(startIndex, startIndex + 3);

  const handleDeleted = (exhibition: CreateExhibitionResponse) => {
    onDeleted(exhibition);

    setStartIndex((currentStartIndex) => {
      const remainingCount = exhibitions.length - 1;

      const maxStartIndex = Math.max(
        Math.floor((remainingCount - 1) / 3) * 3,
        0
      );

      return Math.min(currentStartIndex, maxStartIndex);
    });
  };

  // Scroll
  const scrollToCurrentExhibitions = () => {
    document.getElementById("current-exhibitions")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Previous
  const handlePrevious = () => {
    setStartIndex((prev) => {
      const newIndex = Math.max(prev - 3, 0);

      requestAnimationFrame(scrollToCurrentExhibitions);

      return newIndex;
    });
  };

  // Next
  const handleNext = () => {
    setStartIndex((prev) => {
      const newIndex = Math.min(prev + 3, Math.max(exhibitions.length - 3, 0));

      requestAnimationFrame(scrollToCurrentExhibitions);

      return newIndex;
    });
  };

  // Keine Exhibtions
  if (exhibitions.length === 0) {
    return <P>{t("empty.exhibitions")}</P>;
  }

  // Pagination
  const currentPage = Math.floor(startIndex / 3) + 1;
  const totalPages = Math.ceil(exhibitions.length / 3);

  return (
    <div className="space-y-8" id="current-exhibitions">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleExhibitions.map((exhibition) => (
          <ExhibitionCard
            key={exhibition.id}
            exhibition={exhibition}
            onDeleted={() => handleDeleted(exhibition)}
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
          disabled={startIndex >= exhibitions.length - 3}
        >
          {t("carousel.next")} →
        </Carouselbutton>
      </div>
    </div>
  );
}
