interface Exhibition {
  id: string | number;
  image: string;
  title: string;
  date: string;
  location: string;
  created: string;
}

interface ExhibitionCardProps {
  exhibition: Exhibition;
}

export default function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  return (
    <article className="overflow-hidden border border-neutral-300 bg-white">
      <img
        src={exhibition.image}
        alt={exhibition.title}
        className="aspect-[4/3] w-full object-cover"
      />

      <div className="space-y-2 p-6">
        <h3 className="text-xl font-light">{exhibition.title}</h3>
        <p className="text-sm text-neutral-600">{exhibition.date}</p>
        <p className="text-sm text-neutral-600">{exhibition.location}</p>
        <p className="text-sm text-neutral-500">
          Created: {exhibition.created}
        </p>
      </div>
    </article>
  );
}
