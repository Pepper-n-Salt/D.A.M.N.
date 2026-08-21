import ScreenPreviewCarousel from "./ui/ScreenPreviewCarousel";
import type { ArtworkResponse } from "../api/artworkApi";

interface ArtworkScreenCarouselProps {
  artworks: ArtworkResponse[];
}

export default function ArtworkScreenCarousel({
  artworks,
}: ArtworkScreenCarouselProps) {
  const artworkScreens = artworks.filter((art) => art.isScreen === true);

  const artworkItems = artworkScreens.map((artwork) => ({
    id: artwork.id,
    title: artwork.title,
    uri: `/display/static/artwork/${artwork.id}`,
  }));

  return <ScreenPreviewCarousel items={artworkItems} />;
}
