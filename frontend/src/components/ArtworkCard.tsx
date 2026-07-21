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
        <h3 className="text-sm font-semibold">{artwork.title}</h3>
        <p className="text-sm text-neutral-600">{artwork.artist}</p>
        <p className="text-xs text-neutral-500">Created: {artwork.created}</p>
      </div>
    </article>
  );
}
