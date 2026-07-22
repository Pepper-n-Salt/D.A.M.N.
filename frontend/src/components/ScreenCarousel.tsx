"use client";

import { useState } from "react";
import ScreenCard from "./ScreenCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";

const screens = [
  {
    id: 1,
    exhibition: {
      id: 101,
      image: "https://placehold.co/600x400?text=Exhibition+One",
      title: "Open Forms",
      date: "12.08.2026 - 15.10.2026",
      location: "Berlin",
      created: "05.07.2026",
    },
    artworks: [
      {
        id: 201,
        image: "https://placehold.co/600x600?text=Artwork+1",
        title: "Sunset",
        artist: "Jane Doe",
        created: "17.07.2026",
      },
      {
        id: 202,
        image: "https://placehold.co/600x600?text=Artwork+2",
        title: "Forest",
        artist: "Max Mustermann",
        created: "12.07.2026",
      },
      {
        id: 203,
        image: "https://placehold.co/600x600?text=Artwork+3",
        title: "Ocean",
        artist: "Anna Smith",
        created: "08.07.2026",
      },
    ],
  },
  {
    id: 2,
    exhibition: {
      id: 102,
      image: "https://placehold.co/600x400?text=Exhibition+Two",
      title: "Material Memory",
      date: "21.09.2026 - 08.11.2026",
      location: "München",
      created: "02.07.2026",
    },
    artworks: [
      {
        id: 204,
        image: "https://placehold.co/600x600?text=Artwork+4",
        title: "Mountains",
        artist: "John Doe",
        created: "01.07.2026",
      },
      {
        id: 205,
        image: "https://placehold.co/600x600?text=Artwork+5",
        title: "Flowers",
        artist: "Emily White",
        created: "28.06.2026",
      },
      {
        id: 206,
        image: "https://placehold.co/600x600?text=Artwork+6",
        title: "Night Sky",
        artist: "Peter Black",
        created: "20.06.2026",
      },
    ],
  },
  {
    id: 3,
    exhibition: {
      id: 103,
      image: "https://placehold.co/600x400?text=Exhibition+Three",
      title: "Afterglow",
      date: "01.10.2026 - 22.12.2026",
      location: "Köln",
      created: "09.07.2026",
    },
    artworks: [
      {
        id: 207,
        image: "https://placehold.co/600x600?text=Artwork+7",
        title: "River",
        artist: "Sophie Klein",
        created: "19.06.2026",
      },
      {
        id: 208,
        image: "https://placehold.co/600x600?text=Artwork+8",
        title: "Stone",
        artist: "Lukas Hart",
        created: "14.06.2026",
      },
      {
        id: 209,
        image: "https://placehold.co/600x600?text=Artwork+9",
        title: "Dawn",
        artist: "Mia Weber",
        created: "09.06.2026",
      },
    ],
  },
];

export default function ScreenCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const visibleScreens = screens.slice(startIndex, startIndex + 3);

  const scrollToCurrentScreens = () => {
    document.getElementById("current-screens")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePrevious = () => {
    setStartIndex((prev) => {
      const newIndex = Math.max(prev - 3, 0);
      requestAnimationFrame(scrollToCurrentScreens);
      return newIndex;
    });
  };

  const handleNext = () => {
    setStartIndex((prev) => {
      const newIndex = Math.min(prev + 3, screens.length - 3);
      requestAnimationFrame(scrollToCurrentScreens);
      return newIndex;
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-3">
        {visibleScreens.map((screen) => (
          <ScreenCard key={screen.id} screen={screen} />
        ))}
      </div>

      <div className="flex justify-between">
        <Carouselbutton onClick={handlePrevious} disabled={startIndex === 0}>
          ← Previous
        </Carouselbutton>

        <Carouselbutton
          onClick={handleNext}
          disabled={startIndex >= screens.length - 3}
        >
          Next →
        </Carouselbutton>
      </div>
    </div>
  );
}
