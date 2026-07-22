import { useState } from "react";
import ExhibitionCard from "./ExhibitionCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";
import P from "./ui/typography/P";
const exhibitions = [
  {
    id: 1,
    image: "https://placehold.co/600x400?text=Exhibition+One",
    title: "Open Forms",
    date: "12.08.2026 - 15.10.2026",
    location: "Berlin",
    created: "05.07.2026",
  },
  {
    id: 2,
    image: "https://placehold.co/600x400?text=Exhibition+Two",
    title: "Material Memory",
    date: "21.09.2026 - 08.11.2026",
    location: "München",
    created: "02.07.2026",
  },
  {
    id: 3,
    image: "https://placehold.co/600x400?text=Exhibition+Three",
    title: "Afterglow",
    date: "01.10.2026 - 22.12.2026",
    location: "Köln",
    created: "09.07.2026",
  },
  {
    id: 4,
    image: "https://placehold.co/600x400?text=Exhibition+Four",
    title: "Echoes of Light",
    date: "18.11.2026 - 03.01.2027",
    location: "Hamburg",
    created: "11.07.2026",
  },
  {
    id: 5,
    image: "https://placehold.co/600x400?text=Exhibition+Five",
    title: "Still Motion",
    date: "05.12.2026 - 20.02.2027",
    location: "Dresden",
    created: "14.07.2026",
  },
  {
    id: 6,
    image: "https://placehold.co/600x400?text=Exhibition+Six",
    title: "Shadow Study",
    date: "09.01.2027 - 25.03.2027",
    location: "Stuttgart",
    created: "16.07.2026",
  },
];

export default function ExhibitionCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const visibleExhibitions = exhibitions.slice(startIndex, startIndex + 3);

  const scrollToCurrentExhibitions = () => {
    document.getElementById("current-exhibitions")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePrevious = () => {
    setStartIndex((prev) => {
      const newIndex = Math.max(prev - 3, 0);
      requestAnimationFrame(scrollToCurrentExhibitions);
      return newIndex;
    });
  };

  const handleNext = () => {
    setStartIndex((prev) => {
      const newIndex = Math.min(prev + 3, exhibitions.length - 3);
      requestAnimationFrame(scrollToCurrentExhibitions);
      return newIndex;
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleExhibitions.map((exhibition) => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>

      <div className="flex justify-between">
        <Carouselbutton onClick={handlePrevious} disabled={startIndex === 0}>
          ← Previous
        </Carouselbutton>
        <P>01 / 03</P>
        <Carouselbutton
          onClick={handleNext}
          disabled={startIndex >= exhibitions.length - 3}
        >
          Next →
        </Carouselbutton>
      </div>
    </div>
  );
}
