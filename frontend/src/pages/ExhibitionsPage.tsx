import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import DeletedExhibitions from "../components/DeletedExhibition";
import ArchivedExhibitions from "../components/ArchivedExhibitions";
import ExhibitionCarousel from "../components/ExhibitionCarousel";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";

export default function ExhibitionsPage() {
  const { t } = useTranslation("exhibitions");
  return (
    <section className="space-y-20 py-8">
      <div className="space-y-8">
        <H1>{t("hero.title")}</H1>
        <P>{t("hero.paragraph")}</P>
      </div>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>{t("current.title")}</H2>

        <ExhibitionCarousel />
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>{t("create.title")}</H2>
        <Link to="/landingpage/exhibitions/new">
          <Borderbutton>{t("create.button")}</Borderbutton>
        </Link>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>{t("archived.title")}</H2>

        <ArchivedExhibitions />
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>{t("deleted.title")}</H2>

        <DeletedExhibitions />
      </section>
    </section>
  );
}
