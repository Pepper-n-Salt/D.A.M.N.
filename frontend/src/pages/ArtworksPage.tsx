import ArtworkCarousel from "../components/ArtworkCarousel";
import Carouselbutton from "../components/ui/buttons/Carouselbutton";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";

export default function ArtworksPage() {
  return (
    <section className="space-y-20 py-8">
      <div className="space-y-8">
        <H1>Artworks</H1>
        <P>
          Manage and review your digital artwork collection with a simple
          overview and clear structure.
        </P>
      </div>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>Current Artworks</H2>
        <ArtworkCarousel />
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <button className="border border-black px-8 py-3 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white">
          Add new Artwork →
        </button>
      </section>
    </section>
  );
}
