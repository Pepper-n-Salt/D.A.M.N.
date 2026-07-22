import { Link } from "react-router-dom";

const deletedExhibitions = [
  {
    id: 301,
    title: "Quiet Rooms",
    deleted: "12.06.2026",
  },
  {
    id: 302,
    title: "Frames of Time",
    deleted: "28.04.2026",
  },
];

export default function DeletedExhibitions() {
  return (
    <div className="space-y-4">
      {deletedExhibitions.map((exhibition) => (
        <Link
          key={exhibition.id}
          to={`/exhibitions/deleted/${exhibition.id}`}
          className="flex justify-between items-center border self-start border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
        >
          <div>
            <h3 className="font-medium">{exhibition.title}</h3>
          </div>

          <p className="text-sm text-gray-500">Deleted: {exhibition.deleted}</p>
        </Link>
      ))}
    </div>
  );
}
