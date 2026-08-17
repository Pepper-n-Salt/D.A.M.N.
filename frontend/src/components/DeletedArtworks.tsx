import { Link } from "react-router-dom";

const deletedArtworks = [
  {
    id: 101,
    title: "Old Landscape",
    artist: "Jane Doe",
    deleted: "10.07.2026",
  },
  {
    id: 102,
    title: "Abstract No. 4",
    artist: "Max Mustermann",
    deleted: "03.07.2026",
  },
];

export default function DeletedArtworks() {
  return (
    <div className="space-y-4">
      {deletedArtworks.map((artwork) => (
        <Link
          key={artwork.id}
          to={`/artworks/deleted/${artwork.id}`}
          className="flex justify-between items-center border self-start border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
        >
          <div>
            <h3 className="font-medium">{artwork.title}</h3>
            <p className="text-sm text-gray-500">{artwork.artist}</p>
          </div>

          <p className="text-sm text-gray-500">Deleted: {artwork.deleted}</p>
        </Link>
      ))}
    </div>
  );
}
