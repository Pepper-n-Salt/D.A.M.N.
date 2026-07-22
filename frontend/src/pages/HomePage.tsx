import H1 from "../components/stylecomponents/H1";

export default function HomePage() {
  const workflow = ["Contact", "Artwork", "Exhibition", "Screen"];

  return (
    <section className="space-y-20">
      <H1>A system for collecting, curating and presenting digital art.</H1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 tracking-widest leading-loose">
        <p>
          D.A.M.N. (Digital Artwork Management Network) is a platform designed
          to simplify the organization and presentation of digital artworks. It
          brings together artwork data, collections, exhibitions, and display
          management in one centralized environment, creating a structured
          workflow from archive to presentation.
        </p>

        <p>
          Whether used by artists, galleries, museums, or cultural institutions,
          D.A.M.N. supports the entire curatorial process. Artworks can be
          documented, enriched with metadata, grouped into collections, and
          prepared for exhibitions without relying on scattered files or
          disconnected systems.
        </p>

        <p>
          By connecting collections with exhibitions and digital screens,
          D.A.M.N. creates a seamless link between management and presentation.
          The platform is built to make digital art easier to curate, maintain,
          and share, while providing a flexible foundation that can grow with
          future projects and collaborations.
        </p>
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
            <div className="aspect-[16/9] border border-neutral-300 bg-neutral-100 overflow-hidden">
              {/* hier später Image-Komponente einsetzen */}
              <div className="flex h-full items-center justify-center uppercase tracking-[0.3em] text-neutral-400 text-sm">
                Screenshot Dashboard
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-6 px-6">
                <button
                  aria-label="Previous screenshot"
                  className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                  Prev
                </button>

                <button
                  aria-label="Next screenshot"
                  className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
                >
                  Next
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>

              <p className="text-sm uppercase tracking-[0.2em] text-neutral-400 px-6">
                01 / 04
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <p className="mb-8 text-sm uppercase tracking-[0.25em] text-neutral-500">
              Workflow
            </p>

            <div className="space-y-6">
              {workflow.map((item, index) => (
                <div key={item}>
                  <div className="flex items-center gap-5">
                    <span className="w-8 text-sm text-neutral-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-2xl font-light">{item}</h3>
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
              <h3 className="text-2xl font-light">Archive</h3>
            </div>

            <div className="md:col-span-6 tracking-widest leading-loose">
              <p>
                Store, organize and maintain digital artworks with structured
                information, metadata and documentation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8">
            <div className="md:col-span-2 text-sm text-neutral-400">02</div>

            <div className="md:col-span-4">
              <h3 className="text-2xl font-light">Curate</h3>
            </div>

            <div className="md:col-span-6 tracking-widest leading-loose">
              <p>
                Build collections, plan exhibitions and create meaningful
                relationships between artworks and contexts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8">
            <div className="md:col-span-2 text-sm text-neutral-400">03</div>

            <div className="md:col-span-4">
              <h3 className="text-2xl font-light">Publish</h3>
            </div>

            <div className="md:col-span-6 tracking-widest leading-loose">
              <p>
                Connect curated content to digital screens and make artworks
                accessible across different exhibition environments.
              </p>
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
