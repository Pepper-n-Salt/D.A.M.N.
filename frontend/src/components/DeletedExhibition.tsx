import { useTranslation } from "react-i18next";

import P from "./ui/typography/P";

import {
  restoreExhibition,
  type CreateExhibitionResponse,
} from "../api/exhibitionApi";

interface DeletedExhibitionsProps {
  exhibitions: CreateExhibitionResponse[];
  onRestore: (exhibitionId: string) => void;
}

export default function DeletedExhibitions({
  exhibitions,
  onRestore,
}: DeletedExhibitionsProps) {
  const { t } = useTranslation("exhibitions");

  const handleRestore = async (exhibitionId: string) => {
    const confirmed = window.confirm(t("deleted.restoreConfirm"));

    if (!confirmed) return;

    try {
      await restoreExhibition(exhibitionId);

      onRestore(exhibitionId);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : t("deleted.restoreError"));
    }
  };

  if (exhibitions.length === 0) {
    return <P>{t("deleted.notfound")}</P>;
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

          <button
            type="button"
            onClick={() => handleRestore(exhibition.id)}
            className="border border-green-600 px-4 py-2 text-sm uppercase tracking-[0.15em] text-green-600 transition-colors duration-300 hover:bg-green-600 hover:text-white"
          >
            {t("deleted.restore")}
          </button>
        </div>
      ))}
    </div>
  );
}
