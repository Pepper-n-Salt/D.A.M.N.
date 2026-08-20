import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ArtistCarousel from "../components/ArtistsCarousel";
import DeletedArtists from "../components/DeletedArtists";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";

import {
  getArtists,
  getDeletedArtists,
  type CreateArtistResponse,
} from "../api/artistApi";

export default function ArtistsPage() {
  const { t, i18n } = useTranslation("artists");

  const [artists, setArtists] = useState<CreateArtistResponse[]>([]);

  const [deletedArtists, setDeletedArtists] = useState<CreateArtistResponse[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  useEffect(() => {
    const loadArtists = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [current, deleted] = await Promise.all([
          getArtists(languageCode),
          getDeletedArtists(languageCode),
        ]);

        setArtists(current);
        setDeletedArtists(deleted);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die Artists konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadArtists();
  }, [languageCode]);

  const handleDeleted = (artist: CreateArtistResponse) => {
    setArtists((current) => current.filter((item) => item.id !== artist.id));

    setDeletedArtists((current) => {
      const alreadyExists = current.some((item) => item.id === artist.id);

      if (alreadyExists) {
        return current;
      }

      return [...current, { ...artist, isDeleted: true }];
    });
  };

  const handleRestore = (artistId: string) => {
    const restoredArtist = deletedArtists.find(
      (artist) => artist.id === artistId
    );

    setDeletedArtists((current) =>
      current.filter((artist) => artist.id !== artistId)
    );

    if (restoredArtist) {
      setArtists((current) => [
        ...current,
        { ...restoredArtist, isDeleted: false },
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

        <ArtistCarousel artists={artists} onDeleted={handleDeleted} />
      </section>

      <section className="space-y-12 border-t border-neutral-200 pt-12">
        <H2>{t("create.title")}</H2>

        <Link to="/landingpage/artists/new">
          <Borderbutton>{t("create.button")}</Borderbutton>
        </Link>
      </section>

      <section className="space-y-12 border-t border-neutral-200 pt-12">
        <H2>{t("deleted.title")}</H2>

        <DeletedArtists artists={deletedArtists} onRestore={handleRestore} />
      </section>
    </section>
  );
}
