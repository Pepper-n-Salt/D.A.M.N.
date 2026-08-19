import { useState } from "react";

import ScreenPreviewCard from "./ScreenPreviewCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";

import type { CreateExhibitionResponse } from "../api/exhibitionApi";

interface ExhibitionScreenCarouselProps {
  exhibitions: CreateExhibitionResponse[];
}

export default function ExhibitionScreenCarousel({
  exhibitions,
}: ExhibitionScreenCarouselProps) {
  const screens = exhibitions.filter((exh) => {
    exh.isScreen === true;
  });
  const [startIndex, setStartIndex] = useState(0);
  const visibleScreens = screens.slice(startIndex, startIndex + 3);

  const clickPrevious = () => {
    setStartIndex((prev) => Math.max(prev - 3, 0));
  };

  const clickNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 3, Math.max(screens.length - 3, 0))
    );
  };

  if (screens.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {visibleScreens.map((exh) => (
            <ScreenPreviewCard
              key={exh.id}
              title={exh.title}
              uri={`/display/static/exhibition/${exh.id}`}
            />
          ))}
        </div>
      </div>
      {/* {screens.length > 3 && ( */}
      <div className="flex justify-between">
        <Carouselbutton onClick={clickPrevious} disabled={startIndex === 0}>
          ← Previous
        </Carouselbutton>
        <Carouselbutton
          onClick={clickNext}
          disabled={startIndex >= screens.length - 3}
        >
          Next →
        </Carouselbutton>
      </div>
      {/* )} */}
    </>
  );
}
