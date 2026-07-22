import ScreenCarousel from "../components/ScreenCarousel";
import { Link } from "react-router-dom";
import Borderbutton from "../components/ui/buttons/Borderbutton";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";

export default function LandingPageScreens() {
  return (
    <section className="mx-auto space-y-20 py-20">
      <div className="space-y-6">
        <H1>Display Management</H1>

        <P>
          Manage and curate digital content displayed throughout the museum.
        </P>
      </div>

      <section
        id="current-screens"
        className="border-t border-neutral-200 pt-12 space-y-12"
      >
        <H2>Exhibition Screens</H2>

        <ScreenCarousel />
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>Add new Screen</H2>
        <Link to="/landingpage/screens/new">
          {" "}
          <Borderbutton>Add new screen →</Borderbutton>
        </Link>
      </section>
    </section>
  );
}
