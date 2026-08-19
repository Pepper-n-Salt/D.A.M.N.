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

      <div>
        <Carouselbutton>← Previous</Carouselbutton>
        <Carouselbutton>Next →</Carouselbutton>
      </div>
    </>
  );
}
