import { useState } from "react";
import { useTranslation } from "react-i18next";

import ScreenPreviewCard from "./ScreenPreviewCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";
import P from "./ui/typography/P";

import type { CreateExhibitionResponse } from "../api/exhibitionApi";

interface ExhibitionScreenCarouselProps {
  exhibitions: CreateExhibitionResponse[];
}

export default function ExhibitionScreenCarousel({
  exhibitions,
}: ExhibitionScreenCarouselProps) {
  const { t } = useTranslation();

  const screens = exhibitions.filter((exh) => {
    return exh.isScreen === true;
  });
  const [startIndex, setStartIndex] = useState(0);
  const visibleScreens = screens.slice(startIndex, startIndex + 3);

  const currentPage = Math.floor(startIndex / 3) + 1;
  const totalPages = Math.ceil(screens.length / 3);

  const maxStartIndex = Math.floor((screens.length - 1) / 3) * 3;

  const clickPrevious = () => {
    setStartIndex((prev) => Math.max(prev - 3, 0));
  };

  const clickNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 3, Math.max(screens.length - 3, maxStartIndex))
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
          ← {t("carousel.previous")}
        </Carouselbutton>

        <P>
          {String(currentPage).padStart(2, "0")} /{" "}
          {String(totalPages).padStart(2, "0")}
        </P>

        <Carouselbutton
          onClick={clickNext}
          disabled={startIndex >= screens.length - 3}
        >
          {t("carousel.next")} →
        </Carouselbutton>
      </div>
      {/* )} */}
    </>
  );
}
