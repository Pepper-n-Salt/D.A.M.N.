import ScreenPreviewCarousel from "./ui/ScreenPreviewCarousel";

import type { CreateExhibitionResponse } from "../api/exhibitionApi";

interface ExhibitionScreenCarouselProps {
  exhibitions: CreateExhibitionResponse[];
}

export default function ExhibitionScreenCarousel({
  exhibitions,
}: ExhibitionScreenCarouselProps) {
  const exhibitionScreens = exhibitions.filter(
    (exhibition) => exhibition.isScreen === true
  );

  const exhibitionItems = exhibitionScreens.map((exhibition) => ({
    id: exhibition.id,
    title: exhibition.title,
    uri: `/display/static/exhibition/${exhibition.id}`,
  }));

  return <ScreenPreviewCarousel items={exhibitionItems} />;
}
