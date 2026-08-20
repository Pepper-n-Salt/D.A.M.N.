import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ArtworkCarousel from "../components/ArtworkCarousel";
import DeletedArtworks from "../components/DeletedArtworks";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";

import {
  getArtworks,
  getDeletedArtworks,
  type ArtworkResponse,
} from "../api/artworkApi";

export default function ArtworksPage() {
  const { t, i18n } = useTranslation("artworks");

  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [deletedArtworks, setDeletedArtworks] = useState<ArtworkResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [current, deleted] = await Promise.all([
          getArtworks(languageCode),
          getDeletedArtworks(languageCode),
        ]);

        setArtworks(current);
        setDeletedArtworks(deleted);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die Artworks konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, [languageCode]);

  const handleDeleted = (artwork: ArtworkResponse) => {
    setArtworks((current) => current.filter((item) => item.id !== artwork.id));

    setDeletedArtworks((current) => {
      const alreadyExists = current.some((item) => item.id === artwork.id);

      if (alreadyExists) {
        return current;
      }

      return [...current, { ...artwork, isDeleted: true }];
    });
  };

  const handleRestore = (artworkId: string) => {
    const restoredArtwork = deletedArtworks.find(
      (artwork) => artwork.id === artworkId
    );

    setDeletedArtworks((current) =>
      current.filter((item) => item.id !== artworkId)
    );

    if (restoredArtwork) {
      setArtworks((current) => [
        ...current,
        { ...restoredArtwork, isDeleted: false },
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

        <ArtworkCarousel artworks={artworks} onDeleted={handleDeleted} />
      </section>

      <section className="space-y-12 border-t border-neutral-200 pt-12">
        <H2>{t("create.title")}</H2>

        <Link to="/landingpage/artworks/new">
          <Borderbutton>{t("create.button")}</Borderbutton>
        </Link>
      </section>

      <section className="space-y-12 border-t border-neutral-200 pt-12">
        <H2>{t("deleted.title")}</H2>

        <DeletedArtworks artworks={deletedArtworks} onRestore={handleRestore} />
      </section>
    </section>
  );
}
