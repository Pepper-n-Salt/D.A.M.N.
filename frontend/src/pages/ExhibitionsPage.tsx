import { Link } from "react-router-dom";
import DeletedExhibitions from "../components/DeletedExhibition";
import ArchivedExhibitions from "../components/ArchivedExhibitions";
import ExhibitionCarousel from "../components/ExhibitionCarousel";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";

export default function ExhibitionsPage() {
  return (
    <section className="space-y-20 py-8">
      <div className="space-y-8">
        <H1>Exhibitions</H1>
        <P>
          Build and manage exhibitions that connect artworks, spaces, and
          presentation formats.
        </P>
      </div>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <H2>Current Exhibitions</H2>

        <ExhibitionCarousel />
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>Add new Exhibition</H2>
        <Link to="/landingpage/exhibitions/new">
          <Borderbutton>Click here to add a new Exhibition →</Borderbutton>
        </Link>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>Archived Exhibitions</H2>

        <ArchivedExhibitions />
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>Deleted Exhibitions</H2>

        <DeletedExhibitions />
      </section>
    </section>
  );
}
