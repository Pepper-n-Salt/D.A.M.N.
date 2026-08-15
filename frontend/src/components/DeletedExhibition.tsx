import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import P from "./ui/typography/P";

import {
  getDeletedExhibitions,
  type CreateExhibitionResponse,
} from "../api/exhibitionApi";

export default function DeletedExhibitions() {
  const { i18n } = useTranslation("exhibitions");

  const [exhibitions, setExhibitions] = useState<CreateExhibitionResponse[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  useEffect(() => {
    const loadDeletedExhibitions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getDeletedExhibitions(
          languageCode === "de" ? "de" : "en"
        );

        setExhibitions(result);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die gelöschten Exhibitions konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDeletedExhibitions();
  }, [languageCode]);

  if (isLoading) {
    return <p className="text-sm uppercase tracking-[0.2em]">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (exhibitions.length === 0) {
    return <P>Keine gelöschten Exhibitions gefunden.</P>;
  }

  return (
    <div className="space-y-4">
      {exhibitions.map((exhibition) => (
        <div
          key={exhibition.id}
          className="flex flex-col gap-2 border border-black px-8 py-4 uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="font-medium">{exhibition.title}</h3>

            <p className="text-sm text-gray-500">{exhibition.location}</p>
          </div>

          <div className="text-sm text-gray-500">
            {exhibition.startDate} - {exhibition.endDate}
          </div>
        </div>
      ))}
    </div>
  );
}
