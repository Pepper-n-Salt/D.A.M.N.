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
    </div>
  );
}
