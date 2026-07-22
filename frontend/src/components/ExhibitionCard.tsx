import { Link } from "react-router-dom";
import H3 from "./ui/typography/H3";
import P from "./ui/typography/P";
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
    <Link
      to={`/exhibitions/${exhibition.id}`}
      className="group overflow-hidden border"
    >
      <img
        src={exhibition.image}
        alt={exhibition.title}
        className="aspect-4/3 w-full object-cover"
      />

      <div className="space-y-2 p-6">
        <H3>{exhibition.title}</H3>
        <P>{exhibition.date}</P>
        <P>{exhibition.location}</P>
        <p className="text-sm text-gray-500">Created: {exhibition.created}</p>
      </div>
    </Link>
  );
}
