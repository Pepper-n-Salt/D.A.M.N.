import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getExhibitions } from "../api/exhibitionApi";
import type { CreateExhibitionResponse } from "../api/exhibitionApi";
import { getArtworks } from "../api/artworkApi";
import type { ArtworkResponse } from "../api/artworkApi";

import ExhibitionScreenCarousel from "../components/ExhibitionScreenCarousel";
import ArtworkScreenCarousel from "../components/ArtworkScreenCarousel";

import Borderbutton from "../components/ui/buttons/Borderbutton";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";

export default function LandingPageScreens() {
  const { t, i18n } = useTranslation("screens");

  const [exhibitions, setExhibitions] = useState<CreateExhibitionResponse[]>(
    []
  );
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languageCode = i18n.language.startsWith("en") ? "en" : "de";

  useEffect(() => {
    const loadScreens = async () => {
      try {
        setLoading(true);
        setError(null);

        const exhibitionData = await getExhibitions(languageCode);
        setExhibitions(exhibitionData);

        const artworkData = await getArtworks(languageCode);
        setArtworks(artworkData);
      } catch (e) {
        console.error(e);

        setError(
          e instanceof Error
            ? e.message
            : "Die Exhibitions konnten nicht geladen werden."
        );
      } finally {
        setLoading(false);
      }
    };

    loadScreens();
  }, [languageCode]);

  return (
    <section className="space-y-20 py-8">
      <div className="space-y-8">
        <H1>{t("hero.title")}</H1>

        <P>{t("hero.paragraph")}</P>
      </div>

      <section
        id="current-screens"
        className="border-t border-neutral-200 pt-12 space-y-12"
      >
        <H2>{t("current.title")}</H2>
        {loading && <P>Loading ...</P>} {/* noch i18n */}
        {error && <P>{error}</P>}
        <ExhibitionScreenCarousel exhibitions={exhibitions} />
      </section>

      {/* <section
        id="current-screens"
        className="border-t border-neutral-200 pt-12 space-y-12"
      >
        <H2>{t("current.title")}</H2>

        <ScreenCarousel />
      </section> */}

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>{t("current.artworks")}</H2>
        {loading && <P>Loading ...</P>} {/* noch i18n */}
        {error && <P>{error}</P>}
        <ArtworkScreenCarousel artworks={artworks} />
      </section>

      {/* Create new Screen */}
      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>{t("create.title")}</H2>
        <Link to="/landingpage/screens/new">
          <Borderbutton>{t("create.button")}</Borderbutton>
        </Link>
      </section>
    </section>
  );
}
