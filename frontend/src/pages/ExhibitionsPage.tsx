import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import DeletedExhibitions from "../components/DeletedExhibition";
import ArchivedExhibitions from "../components/ArchivedExhibitions";
import ExhibitionCarousel from "../components/ExhibitionCarousel";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";

import {
  getExhibitions,
  getDeletedExhibitions,
  type CreateExhibitionResponse,
} from "../api/exhibitionApi";

export default function ExhibitionsPage() {
  const { user } = useAuth();

  const isSuperUser = user?.role === "super";
  const { t, i18n } = useTranslation("exhibitions");

  const [exhibitions, setExhibitions] = useState<CreateExhibitionResponse[]>(
    []
  );

  const [deletedExhibitions, setDeletedExhibitions] = useState<
    CreateExhibitionResponse[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const current = await getExhibitions(languageCode);

        // Nur aktuelle Exhibitions anzeigen.
        // Exhibitions, deren Enddatum vor heute liegt,
        // werden ausschließlich im Archiv angezeigt.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeExhibitions = current.filter((exhibition) => {
          const endDate = new Date(exhibition.endDate);
          endDate.setHours(0, 0, 0, 0);

          return endDate >= today;
        });

        setExhibitions(activeExhibitions);

        // Gelöschte Exhibitions dürfen ausschließlich Superuser laden.
        if (isSuperUser) {
          const deleted = await getDeletedExhibitions(languageCode);
          setDeletedExhibitions(deleted);
        } else {
          setDeletedExhibitions([]);
        }
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
  }, [languageCode, isSuperUser]);

  const handleDeleted = (exhibition: CreateExhibitionResponse) => {
    setExhibitions((current) =>
      current.filter((item) => item.id !== exhibition.id)
    );

    setDeletedExhibitions((current) => {
      const alreadyExists = current.some((item) => item.id === exhibition.id);

      if (alreadyExists) {
        return current;
      }

      return [...current, { ...exhibition, isDeleted: true }];
    });
  };

  const handleRestore = (exhibitionId: string) => {
    const restoredExhibition = deletedExhibitions.find(
      (exhibition) => exhibition.id === exhibitionId
    );

    setDeletedExhibitions((current) =>
      current.filter((item) => item.id !== exhibitionId)
    );

    if (restoredExhibition) {
      setExhibitions((current) => [
        ...current,
        { ...restoredExhibition, isDeleted: false },
      ]);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-20 py-8">
        <P>Loading ...</P>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-20 py-8">
        <P>{error}</P>
      </section>
    );
  }

  return (
    <section className="space-y-20 py-8">
      <div className="space-y-8">
        <H1>{t("hero.title")}</H1>
        <P>{t("hero.paragraph")}</P>
      </div>

      <section className="space-y-8 border-t border-neutral-200 pt-12">
        <H2>{t("current.title")}</H2>

        <ExhibitionCarousel
          exhibitions={exhibitions}
          onDeleted={handleDeleted}
        />
      </section>

      <section className="space-y-12 border-t border-neutral-200 pt-12">
        <H2>{t("create.title")}</H2>

        <Link to="/landingpage/exhibitions/new">
          <Borderbutton>{t("create.button")}</Borderbutton>
        </Link>
      </section>

      <section className="space-y-12 border-t border-neutral-200 pt-12">
        <H2>{t("archived.title")}</H2>

        <ArchivedExhibitions />
      </section>

      {isSuperUser && (
        <section className="space-y-12 border-t border-neutral-200 pt-12">
          <H2>{t("deleted.title")}</H2>

          <DeletedExhibitions
            exhibitions={deletedExhibitions}
            onRestore={handleRestore}
          />
        </section>
      )}
    </section>
  );
}
