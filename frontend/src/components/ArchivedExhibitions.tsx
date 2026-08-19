import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import P from "./ui/typography/P";
import {
  getExhibitions,
  type CreateExhibitionResponse,
} from "../api/exhibitionApi";

export default function ArchivedExhibitions() {
  const { i18n, t } = useTranslation("exhibitions");

  const [exhibitions, setExhibitions] = useState<CreateExhibitionResponse[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        setError(null);

        const languageCode = i18n.language.startsWith("en") ? "en" : "de";

        const result = await getExhibitions(languageCode);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const archived = result.filter((exhibition) => {
          const endDate = new Date(exhibition.endDate);
          endDate.setHours(0, 0, 0, 0);

          return endDate < today;
        });

        setExhibitions(archived);
      } catch (error) {
        console.error(error);

        setError(error instanceof Error ? error.message : t("archived.error"));
      }
    };

    loadExhibitions();
  }, [i18n.language, t]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (exhibitions.length === 0) {
    return <P>{t("archived.notfound")}</P>;
  }

  return (
    <div className="space-y-4">
      {exhibitions.map((exhibition) => (
        <Link
          key={exhibition.id}
          to={`/landingpage/exhibitions/${exhibition.id}`}
          className="flex flex-col gap-2 border border-black px-8 py-4 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="font-medium">{exhibition.title}</h3>

            <p className="text-sm text-gray-500">{exhibition.location}</p>
          </div>

          <p className="text-sm text-gray-500">
            {exhibition.startDate} - {exhibition.endDate}
          </p>
        </Link>
      ))}
    </div>
  );
}
