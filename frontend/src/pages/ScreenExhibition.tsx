import { useTranslation } from "react-i18next";

const mockExhibition = {
  id: "van-gogh-light-and-color",
  title: "Van Gogh",
  subtitle: "Light and Color",
  period: "15 April – 30 August 2026",
  description:
    "This exhibition presents a selection of works that highlight the evolution of Vincent van Gogh's artistic language. Through expressive color, dynamic brushwork, and carefully curated pieces, visitors are invited to explore the depth and impact of his oeuvre.",
  image: "/van-gogh.jpg",
};

type Exhibition = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  image: string;
};

type ExhibitionScreenProps = {
  exhibition: Exhibition;
};

function ExhibitionScreen({ exhibition }: ExhibitionScreenProps) {
  const { t } = useTranslation("display");

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={exhibition.image}
        alt={exhibition.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <section className="relative z-10 flex min-h-screen flex-col justify-end px-12 py-16 text-white">
        <div className="max-w-4xl space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/80">
            {t("exhibition.period")}
          </p>

          <h1 className="text-6xl font-light leading-tight md:text-8xl">
            {t("exhibition.title")}
          </h1>

          <h2 className="text-3xl font-light text-white/80 md:text-5xl">
            {t("exhibition.subtitle")}
          </h2>

          <p className="max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
            {t("exhibition.description")}
          </p>
        </div>
      </section>
    </main>
  );
}

export default function ExhibitionScreenPreview() {
  return <ExhibitionScreen exhibition={mockExhibition} />;
}
