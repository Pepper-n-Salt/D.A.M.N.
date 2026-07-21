import ArtworkCarousel from "../components/ArtworkCarousel";

export default function ArtworksPage() {
  return (
    <section className="space-y-20 py-8">
      <div className="space-y-8">
        <h1 className="text-5xl md:text-7xl sm:text-5xl lg:text-9xl font-light">
          Artworks
        </h1>
        <p className="max-w-2xl tracking-widest leading-loose">
          Manage and review your digital artwork collection with a simple
          overview and clear structure.
        </p>
      </div>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <h2 className="text-3xl md:text-5xl font-light">Current Artworks</h2>
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
