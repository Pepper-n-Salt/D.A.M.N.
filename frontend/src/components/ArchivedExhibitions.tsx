import { Link } from "react-router-dom";

const archivedExhibitions = [
  {
    id: 201,
    title: "Light & Matter",
    date: "17.03.2025 - 22.05.2025",
    location: "Düsseldorf",
  },
  {
    id: 202,
    title: "City Echoes",
    date: "09.01.2025 - 14.02.2025",
    location: "Hamburg",
  },
];

export default function ArchivedExhibitions() {
  return (
    <div className="space-y-4">
      {archivedExhibitions.map((exhibition) => (
        <Link
          key={exhibition.id}
          to={`/exhibitions/archived/${exhibition.id}`}
          className="flex flex-col gap-2 border border-black px-8 py-4 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="font-medium">{exhibition.title}</h3>
            <p className="text-sm text-gray-500">{exhibition.location}</p>
          </div>

          <p className="text-sm text-gray-500">{exhibition.date}</p>
        </Link>
      ))}
    </div>
  );
}
