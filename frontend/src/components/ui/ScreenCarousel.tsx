import { useState } from "react";
import { useTranslation } from "react-i18next";

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

export default function ScreenCarousel({ items }: CarouselProps) {
  const { t } = useTranslation();
  const [startIndex, setStartIndex] = useState(0);

  const visibleItems = items.slice(startIndex, startIndex + 3);

  const currentPage = Math.floor(startIndex / 3) + 1;
  const totalPages = Math.ceil(items.length / 3);

  const clickPrevious = () => {
    setStartIndex((prev) => Math.max(prev - 3, 0));
  };

  const clickNext = () => {
    setStartIndex((prev) => Math.min(prev + 3, Math.max(items.length - 3, 0)));
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <div key={item.id}>
              <iframe
                src={item.uri}
                title={item.title}
                className="h-full min-h-[400px] w-full border-0"
              />
            </div>
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
          disabled={startIndex >= items.length - 3}
        >
          {t("carousel.next")} →
        </Carouselbutton>
      </div>
    </>
  );
}
