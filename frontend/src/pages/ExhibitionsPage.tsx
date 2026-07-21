import ExhibitionCard from "../components/ExhibitionCard";

const exhibitions = [
  {
    id: 1,
    image: "https://placehold.co/900x600",
    title: "Digital Landscapes",
    date: "12.09.2026",
    location: "Berlin",
    created: "05.07.2026",
  },
  {
    id: 2,
    image: "https://placehold.co/900x600",
    title: "Future Forms",
    date: "20.10.2026",
    location: "Hamburg",
    created: "14.07.2026",
  },
];

export default function ExhibitionsPage() {
  return (
    <section className="space-y-20 py-8">
      <div className="space-y-8">
        <h1 className="text-5xl md:text-7xl sm:text-5xl lg:text-9xl font-light">
          Exhibitions
        </h1>
        <p className="max-w-2xl tracking-widest leading-loose">
          Build and manage exhibitions that connect artworks, spaces, and
          presentation formats.
        </p>
      </div>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <h2 className="text-3xl md:text-5xl font-light">Current Exhibitions</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {exhibitions.map((exhibition) => (
            <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
          ))}
        </div>
      </section>
    </section>
  );
}
