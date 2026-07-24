import { Link } from "react-router-dom";

const mockArtwork = {
  id: "starry-night",
  title: "The Starry Night",
  subtitle: "De sterrennacht",
  artist: "Vincent van Gogh",
  artistId: "vincent-van-gogh",
  year: 1889,
  artistBio:
    "Vincent van Gogh (1853–1890) was a Dutch Post-Impressionist painter whose expressive use of color and brushwork profoundly influenced modern art. Despite producing over 2,000 artworks, he achieved little commercial success during his lifetime.",
  land: "Netherlands",
  origin: "Saint-Rémy-de-Provence, France",
  material: "Oil on canvas",
  dimensions: "73.7 × 92.1 cm",
  description:
    "Painted during Van Gogh's stay at the Saint-Paul-de-Mausole asylum in Saint-Rémy, The Starry Night depicts a dreamlike view from his window before sunrise. The swirling sky, luminous stars, and towering cypress tree create one of the most iconic and emotionally powerful landscapes in the history of Western art.",
  image: "/van-gogh.jpg",
};

type Artwork = {
  id: string;
  title: string;
  subtitle: string;
  artist: string;
  artistId: string;
  year: number;
  artistBio: string;
  land: string;
  origin: string;
  material: string;
  dimensions: string;
  description: string;
  image: string;
};

type ArtworkScreenProps = {
  artwork: Artwork;
};

function ArtworkScreen({ artwork }: ArtworkScreenProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={artwork.image}
        alt={artwork.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 flex min-h-screen flex-col justify-end px-12 py-16 text-white">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-6xl font-light leading-tight md:text-8xl">
            {artwork.title}
          </h1>

          <p>
            by{" "}
            <Link
              to={`/display/static/artist/${artwork.artistId}`}
              className="underline underline-offset-4 hover:text-white/80"
            >
              {artwork.artist}
            </Link>
          </p>

          <p className="max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
            {artwork.year} in {artwork.land}
          </p>

          <h2 className="text-3xl font-light text-white/80 md:text-5xl">
            {artwork.subtitle}
          </h2>

          <p className="max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
            {artwork.description}
          </p>
        </div>
      </section>
    </main>
  );
}

export default function ArtworkScreenPreview() {
  return <ArtworkScreen artwork={mockArtwork} />;
}
