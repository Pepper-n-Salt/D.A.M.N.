import Carouselbutton from "../components/ui/buttons/Carouselbutton";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";

export default function HomePage() {
  const workflow = ["Contact", "Artwork", "Exhibition", "Screen"];

  return (
    <section className="space-y-20">
      <H1>A system for collecting, curating and presenting digital art.</H1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 tracking-widest leading-loose">
        <P>
          D.A.M.N. (Digital Artwork Management Network) is a platform designed
          to simplify the organization and presentation of digital artworks. It
          brings together artwork data, collections, exhibitions, and display
          management in one centralized environment, creating a structured
          workflow from archive to presentation.
        </P>

        <P>
          Whether used by artists, galleries, museums, or cultural institutions,
          D.A.M.N. supports the entire curatorial process. Artworks can be
          documented, enriched with metadata, grouped into collections, and
          prepared for exhibitions without relying on scattered files or
          disconnected systems.
        </P>

        <P>
          By connecting collections with exhibitions and digital screens,
          D.A.M.N. creates a seamless link between management and presentation.
          The platform is built to make digital art easier to curate, maintain,
          and share, while providing a flexible foundation that can grow with
          future projects and collaborations.
        </P>
      </div>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* <div className="lg:col-span-8">
            <div className="aspect-[16/9] border border-neutral-300 bg-neutral-100 overflow-hidden"> */}
          {/* hier dann Screenshot als <Image> einsetzen */}
          {/* <div className="flex h-full items-center justify-center uppercase tracking-[0.3em] text-neutral-400 text-sm">
                Screenshot Dashboard 16:9
              </div>
            </div>
          </div> */}
          <div className="lg:col-span-8">
            <div className="aspect-video border border-neutral-300 bg-neutral-100 overflow-hidden">
              {/* hier später Image-Komponente einsetzen */}
              <div className="flex h-full items-center justify-center uppercase tracking-[0.3em] text-neutral-400 text-sm">
                Screenshot Dashboard
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <Carouselbutton aria-label="Previous screenshot">
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Prev
              </Carouselbutton>
              <P>01 / 04</P>
              <Carouselbutton aria-label="Next screenshot">
                Next
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Carouselbutton>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <H2>Workflow</H2>

            <div className="space-y-6">
              {workflow.map((item, index) => (
                <div key={item}>
                  <div className="flex items-center gap-5">
                    <span className="w-8 text-sm text-neutral-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <H3>{item}</H3>
                  </div>

                  {index < workflow.length - 1 && (
                    <div className="ml-4 mt-3 h-8 border-l border-neutral-300" />
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          System Overview
        </p>

        <div className="divide-y divide-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8">
            <div className="md:col-span-2 text-sm text-neutral-400">01</div>

            <div className="md:col-span-4">
              <H3>Archive</H3>
            </div>

            <div className="md:col-span-6 tracking-widest leading-loose">
              <P>
                Store, organize and maintain digital artworks with structured
                information, metadata and documentation.
              </P>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8">
            <div className="md:col-span-2 text-sm text-neutral-400">02</div>

            <div className="md:col-span-4">
              <H3>Curate</H3>
            </div>

            <div className="md:col-span-6 tracking-widest leading-loose">
              <P>
                Build collections, plan exhibitions and create meaningful
                relationships between artworks and contexts.
              </P>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8">
            <div className="md:col-span-2 text-sm text-neutral-400">03</div>

            <div className="md:col-span-4">
              <H3>Publish</H3>
            </div>

            <div className="md:col-span-6 tracking-widest leading-loose">
              <P>
                Connect curated content to digital screens and make artworks
                accessible across different exhibition environments.
              </P>
            </div>
          </div>
        </div>
      </section>

      {/* letzter Abschluss - muss noch korrekt formatiert werden */}
      {/* <section className="border-t border-neutral-200 pt-16 pb-8">
        <div className="max-w-3xl">
          <p className="text-4xl md:text-6xl font-light leading-tight">
            D.A.M.N.
          </p>

          <p className="mt-4 text-lg leading-relaxed">
            Digital Artwork Management Network
          </p>

          <p className="mt-8 text-neutral-600 leading-relaxed">
            A system for collecting, curating and presenting digital art.
          </p>
        </div>
      </section> */}
    </section>
  );
}
