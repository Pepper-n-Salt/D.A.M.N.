import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ExhibitionCard from "./ExhibitionCard";
import Carouselbutton from "./ui/buttons/Carouselbutton";
import P from "./ui/typography/P";

import { getExhibitions } from "../api/exhibitionApi";
import type { CreateExhibitionResponse } from "../api/exhibitionApi";

export default function ExhibitionCarousel() {
  const { i18n } = useTranslation("exhibitions");

  const [exhibitions, setExhibitions] = useState<CreateExhibitionResponse[]>(
    []
  );

  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * Aktuelle Sprache von i18next in den API-Sprachcode übersetzen.
   *
   * de / de-DE -> de
   * en / en-GB / en-US -> en
   */
  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  /*
   * ------------------------------------------------------------------------
   * Exhibitions laden
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getExhibitions(
          languageCode === "de" ? "de" : "en"
        );

        setExhibitions(result);
        setStartIndex(0);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die Exhibitions konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadExhibitions();
  }, [languageCode]);

  /*
   * ------------------------------------------------------------------------
   * Exhibition löschen
   * ------------------------------------------------------------------------
   *
   * Die eigentliche Löschung passiert in ExhibitionCard.
   *
   * Sobald das Backend erfolgreich gelöscht hat, ruft die Card
   * diese Funktion mit der ID der gelöschten Exhibition auf.
   *
   * Wir entfernen sie anschließend aus unserem lokalen State.
   */

  const handleDeleted = (id: string) => {
    setExhibitions((previous) => {
      const updatedExhibitions = previous.filter(
        (exhibition) => exhibition.id !== id
      );

      /*
       * Falls wir gerade auf einer späteren Carousel-Seite waren
       * und durch das Löschen diese Seite nicht mehr existiert,
       * gehen wir automatisch auf die letzte mögliche Seite zurück.
       */

      setStartIndex((currentStartIndex) => {
        const maxStartIndex = Math.max(
          Math.floor((updatedExhibitions.length - 1) / 3) * 3,
          0
        );

        return Math.min(currentStartIndex, maxStartIndex);
      });

      return updatedExhibitions;
    });
  };

  /*
   * ------------------------------------------------------------------------
   * Sichtbare Exhibitions
   * ------------------------------------------------------------------------
   */

  const visibleExhibitions = exhibitions.slice(startIndex, startIndex + 3);

  /*
   * ------------------------------------------------------------------------
   * Scroll
   * ------------------------------------------------------------------------
   */

  const scrollToCurrentExhibitions = () => {
    document.getElementById("current-exhibitions")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /*
   * ------------------------------------------------------------------------
   * Previous
   * ------------------------------------------------------------------------
   */

  const handlePrevious = () => {
    setStartIndex((prev) => {
      const newIndex = Math.max(prev - 3, 0);

      requestAnimationFrame(scrollToCurrentExhibitions);

      return newIndex;
    });
  };

  /*
   * ------------------------------------------------------------------------
   * Next
   * ------------------------------------------------------------------------
   */

  const handleNext = () => {
    setStartIndex((prev) => {
      const newIndex = Math.min(prev + 3, Math.max(exhibitions.length - 3, 0));

      requestAnimationFrame(scrollToCurrentExhibitions);

      return newIndex;
    });
  };

  /*
   * ------------------------------------------------------------------------
   * Loading
   * ------------------------------------------------------------------------
   */

  if (isLoading) {
    return <p className="text-sm uppercase tracking-[0.2em]">Loading...</p>;
  }

  /*
   * ------------------------------------------------------------------------
   * Fehler
   * ------------------------------------------------------------------------
   */

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  /*
   * ------------------------------------------------------------------------
   * Keine Exhibitions
   * ------------------------------------------------------------------------
   */

  if (exhibitions.length === 0) {
    return <P>Keine Exhibitions gefunden.</P>;
  }

  /*
   * ------------------------------------------------------------------------
   * Pagination
   * ------------------------------------------------------------------------
   */

  const currentPage = Math.floor(startIndex / 3) + 1;
  const totalPages = Math.ceil(exhibitions.length / 3);

  return (
    <div className="space-y-8" id="current-exhibitions">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleExhibitions.map((exhibition) => (
          <ExhibitionCard
            key={exhibition.id}
            exhibition={exhibition}
            onDeleted={handleDeleted}
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
          disabled={startIndex >= exhibitions.length - 3}
        >
          Next →
        </Carouselbutton>
      </div>
    </div>
  );
}
