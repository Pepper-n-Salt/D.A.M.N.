import ScreenPreviewCarousel from "./ui/ScreenPreviewCarousel";

import type { CreateArtistResponse } from "../api/artistApi";

interface ArtistScreenCarouselProps {
  artists: CreateArtistResponse[];
}

export default function ArtistScreenCarousel({
  artists,
}: ArtistScreenCarouselProps) {
  const artistScreens = artists.filter((artist) => artist.isScreen === true);

  const artistItems = artistScreens.map((artist) => ({
    id: artist.id,
    title: `${artist.firstName} ${artist.lastName}`,
    uri: `/display/static/artist/${artist.id}`,
  }));

  return <ScreenPreviewCarousel items={artistItems} />;
}
