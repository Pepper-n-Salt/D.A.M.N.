const mockArtist = {
  name: "Vincent van Gogh",
  years: "1853–1890",
  nationality: "Dutch",
  image: "/van-gogh.jpeg",
  biography:
    "Vincent van Gogh was a Dutch Post-Impressionist painter whose expressive brushwork and vibrant colors transformed modern art. Although he sold very few paintings during his lifetime, his work became one of the most influential bodies of art in history.",
};

type Artist = {
  name: string;
  years: string;
  nationality: string;
  image: string;
  biography: string;
};

type ArtistScreenProps = {
  artist: Artist;
};

function ArtistScreen({ artist }: ArtistScreenProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={artist.image}
        alt={artist.name}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 flex min-h-screen flex-col justify-end px-12 py-16 text-white">
        <div className="max-w-4xl space-y-6">
          <p className="uppercase tracking-[0.3em] text-white/80">
            {artist.nationality}
          </p>

          <h1 className="text-6xl md:text-8xl font-light">{artist.name}</h1>

          <h2 className="text-3xl text-white/80">{artist.years}</h2>

          <p className="max-w-3xl text-lg leading-relaxed text-white/90">
            {artist.biography}
          </p>
        </div>
      </section>
    </main>
  );
}
export default function ArtistScreenPreview() {
  return <ArtistScreen artist={mockArtist} />;
}
