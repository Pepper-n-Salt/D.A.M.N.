import H3 from "./ui/typography/H3";
import P from "./ui/typography/P";
interface Artwork {
  id: string | number;
  image: string;
  title: string;
  artist: string;
  created: string;
}

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <article className="group overflow-hidden border border-neutral-300 bg-white">
      <img
        src={artwork.image}
        alt={artwork.title}
        className="aspect-square w-full object-cover"
      />

      <div className="space-y-1 p-4">
        <H3>{artwork.title}</H3>
        <P>{artwork.artist}</P>
        <p className="text-xs text-neutral-500">Created: {artwork.created}</p>
      </div>
    </article>
  );
}
