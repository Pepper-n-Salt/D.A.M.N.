import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

type Artist = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  country: string;
  image: string;
  biography: string;
};

const artists: Artist[] = [
  {
    id: "vincent-van-gogh",
    firstName: "Vincent",
    lastName: "van Gogh",
    dateOfBirth: "30.03.1853",
    dateOfDeath: "29.07.1890",
    country: "The Netherlands",
    image: "/van-gogh.jpeg",
    biography:
      "Vincent van Gogh was a Dutch Post-Impressionist painter whose expressive brushwork and vibrant colors transformed modern art. Although he sold very few paintings during his lifetime, his work became one of the most influential bodies of art in history.",
  },
];

export default function ArtistScreen() {
  const { t } = useTranslation("display");
  const { id } = useParams();

  const artist = artists.find((artist) => artist.id === id);

  if (!artist) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-light">{t("artist.notFound")}</h1>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={artist.image}
        alt={`${artist.firstName} ${artist.lastName}`}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 flex min-h-screen flex-col justify-end px-12 py-16 text-white">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-6xl md:text-8xl font-light">
            {artist.firstName} {artist.lastName}
          </h1>

          <h2 className="text-3xl text-white/80">
            {artist.dateOfBirth} – {artist.dateOfDeath}
          </h2>

          <p className="uppercase tracking-[0.3em] text-white/80">
            {artist.country}
          </p>

          <p className="max-w-3xl text-lg leading-relaxed text-white/90">
            {t("artist.biography")}
          </p>
        </div>
      </section>
    </main>
  );
}
