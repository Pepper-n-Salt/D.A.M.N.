// import H3 from "./ui/typography/H3";

interface ScreenPreviewCardProps {
  title: string;
  uri: string;
}

export default function ScreenPreviewCard({
  title,
  uri,
}: ScreenPreviewCardProps) {
  return (
    <div className="overflow-hidden border border-black">
      <div className="h-[400px] w-full overflow-hidden bg-neutral-100">
        {" "}
        {/* hier lieber doch eine feste Höhe statt "aspect-video" verwendet,  */}
        <iframe src={uri} title={title} className="h-full w-full border-0" />
      </div>

      {/* <div className="p-4">
        <H3>{title}</H3>
      </div> */}
    </div>
  );
}
