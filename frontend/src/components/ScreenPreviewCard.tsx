// import H3 from "./ui/typography/H3";
import { Link } from "react-router-dom";

interface ScreenPreviewCardProps {
  title: string;
  uri: string;
}

export default function ScreenPreviewCard({
  title,
  uri,
}: ScreenPreviewCardProps) {
  return (
    <Link
      to={uri}
      target="_blank"
      rel="noopener noreferrer"
      className="block cursor pointer overflow-hidden border border-black"
    >
      {/* <div className="overflow-hidden border border-black"> */}
      <div className="h-100 w-full overflow-hidden bg-neutral-100">
        {/* hier lieber doch eine feste Höhe statt "aspect-video" verwendet,  */}
        <iframe
          src={uri}
          title={title}
          className="h-full w-full border-0 pointer-events-none"
        />
      </div>

      {/* <div className="p-4">
        <H3>{title}</H3>
      </div> */}
      {/* </div> */}
    </Link>
  );
}
