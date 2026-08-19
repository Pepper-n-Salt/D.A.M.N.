import H3 from "./ui/typography/H3";

interface ScreenPreviewCardProps {
  title: string;
  uri: string;
}

export default function ScreenPreviewCard({
  title,
  uri,
}: ScreenPreviewCardProps) {
  return (
    <div>
      <div>
        <iframe src={uri} title={title} className="h-full w-full border-0" />
      </div>

      <div>
        <H3>{title}</H3>
      </div>
    </div>
  );
}
