import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ArtistCarousel from "../components/ArtistsCarousel";
import DeletedArtists from "../components/DeletedArtists";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";

export default function ArtistsPage() {
  const { t } = useTranslation("artists");

  return (
    <section className="space-y-20 py-8">
      {/* HERO */}

      <div className="space-y-8">
        <H1>{t("hero.title")}</H1>

        <P>{t("hero.paragraph")}</P>
      </div>

      {/* CURRENT ARTISTS */}

      <section className="space-y-8 border-t border-neutral-200 pt-12">
        <H2>{t("current.title")}</H2>

        <ArtistCarousel />
      </section>

      {/* CREATE */}

      <section className="space-y-12 border-t border-neutral-200 pt-12">
        <H2>{t("create.title")}</H2>

        <Link to="/landingpage/artists/new">
          <Borderbutton>{t("create.button")}</Borderbutton>
        </Link>
      </section>

      {/* DELETED */}

      <section className="space-y-12 border-t border-neutral-200 pt-12">
        <H2>{t("deleted.title")}</H2>

        <DeletedArtists />
      </section>
    </section>
  );
}
