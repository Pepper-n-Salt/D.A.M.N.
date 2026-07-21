import ScreenCard from "../components/ScreenCard";

const screenDemo = {
  id: 1,
  exhibition: {
    id: 10,
    image: "https://placehold.co/900x600",
    title: "Digital Landscapes",
    date: "12.09.2026",
    location: "Berlin",
    created: "05.07.2026",
  },
  artworks: [
    {
      id: 1,
      image: "https://placehold.co/600x600",
      title: "Sunset",
      artist: "Jane Doe",
      created: "17.07.2026",
    },
    {
      id: 2,
      image: "https://placehold.co/600x600",
      title: "Forest",
      artist: "Max Mustermann",
      created: "12.07.2026",
    },
    {
      id: 3,
      image: "https://placehold.co/600x600",
      title: "Ocean",
      artist: "Anna Smith",
      created: "08.07.2026",
    },
  ],
};

export default function ScreensPage() {
  return (
    <section className="space-y-20 py-8">
      <div className="space-y-8">
        <h1 className="text-5xl md:text-7xl sm:text-5xl lg:text-9xl font-light">
          Display Management
        </h1>
        <p className="max-w-2xl tracking-widest leading-loose">
          Manage connected displays and preview how exhibitions are presented
          across screens.
        </p>
      </div>

      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <h2 className="text-3xl md:text-5xl font-light">Exhibition Screens</h2>
        <ScreenCard screen={screenDemo} />
      </section>
    </section>
  );
}
