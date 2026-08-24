import { useState } from "react";
import { useTranslation } from "react-i18next";

import ScreenPreviewCard from "../ScreenPreviewCard";
import Carouselbutton from "./buttons/Carouselbutton";
import P from "./typography/P";

interface CarouselItem {
  id: string;
  title: string;
  uri: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

export default function ScreenPreviewCarousel({ items }: CarouselProps) {
  const { t } = useTranslation("common");
  const [startIndex, setStartIndex] = useState(0);

  const visibleItems = items.slice(startIndex, startIndex + 2);

  const currentPage = Math.floor(startIndex / 2) + 1;
  const totalPages = Math.ceil(items.length / 2);

  const clickPrevious = () => {
    setStartIndex((prev) => Math.max(prev - 2, 0));
  };

  const clickNext = () => {
    setStartIndex((prev) => Math.min(prev + 2));
  };

  if (items.length === 0) {
    return <P>{t("carousel.noScreens")}</P>;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleItems.map((item) => (
            <ScreenPreviewCard
              key={item.id}
              title={item.title}
              uri={item.uri}
            />
          ))}
        </div>
      </div>

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
          disabled={startIndex >= items.length - 2}
        >
          {t("carousel.next")} →
        </Carouselbutton>
      </div>
    </>
  );
}
