import ArtworkCard from "./ArtworkCard";
import ExhibitionCard from "./ExhibitionCard";

interface ScreenArtwork {
  id: string | number;
  image: string;
  title: string;
  artist: string;
  created: string;
}

interface ScreenExhibition {
  id: string | number;
  image: string;
  title: string;
  date: string;
  location: string;
  created: string;
}

interface ScreenCardProps {
  screen: {
    id: string | number;
    exhibition: ScreenExhibition;
    artworks: ScreenArtwork[];
  };
}

export default function ScreenCard({ screen }: ScreenCardProps) {
  return (
    <div className="flex flex-col gap-4 border border-black p-4">
      <ExhibitionCard exhibition={screen.exhibition} />
      <div className="grid gap-3 md:grid-cols-3">
        {screen.artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
}
