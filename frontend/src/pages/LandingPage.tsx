export default function LandingPage() {
  return (
    <section className="space-y-20">
      <h1 className="text-5xl md:text-7xl sm:text-5xl lg:text-9xl font-light">
        Digital Display Platform
      </h1>
      <p className="max-w-2xl tracking-widest leading-loose">
        Create, manage and present digital artworks across connected screens.
      </p>
      {/* Karussell */}
      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Current Collection
          </p>
        </div>

        <div className="border border-neutral-300">
          <div className="aspect-[16/9] bg-neutral-100 flex items-center justify-center">
            {" "}
            {/* später keine Umrandung mehr verwenden, lieber overflow-hidden */}
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
              Artwork Preview
            </p>
          </div>

          <div className="border-t border-neutral-300 flex justify-between items-end p-6">
            <div>
              <p className="text-sm text-neutral-400">01 / 12</p>

              <h2 className="mt-3 text-2xl font-light">Untitled No. 24</h2>

              <p className="mt-2 text-sm text-neutral-500">
                Digital Artwork · 2026
              </p>
            </div>

            <div className="flex gap-6 px-6">
              <button
                aria-label="Previous artwork"
                className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Prev
              </button>

              <button
                aria-label="Next artwork"
                className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
              >
                Next
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-neutral-200 pt-12">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Collection
          </p>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-3xl font-light">124</p>
            <p className="text-sm text-neutral-500">artworks</p>
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Exhibitions
          </p>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-3xl font-light">8</p>
            <p className="text-sm text-neutral-500">active projects</p>
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Screens
          </p>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-3xl font-light">16</p>
            <p className="text-sm text-neutral-500">connected displays</p>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500 mb-8">
          Recent Activity
        </p>

        <div className="divide-y divide-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-12 py-6">
            <p className="md:col-span-2 text-sm text-neutral-400">12.02.2026</p>

            <p className="md:col-span-4 tracking-widest leading-loose">
              New artwork added
            </p>

            <p className="md:col-span-6 text-neutral-500">Untitled No. 24</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 py-6">
            <p className="md:col-span-2 text-sm text-neutral-400">08.02.2026</p>

            <p className="md:col-span-4 tracking-widest leading-loose">
              Exhibition updated
            </p>

            <p className="md:col-span-6 text-neutral-500">Digital Landscapes</p>
          </div>
        </div>
      </section>
      <section className="border-t border-neutral-200 pt-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Current Exhibition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-light">Digital Landscapes</h2>

            <p className="mt-4 max-w-xl tracking-widest leading-loose">
              A synchronized presentation of digital artworks across connected
              information screens.
            </p>
          </div>

          <div className="text-sm space-y-4">
            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <span className="text-neutral-500">Screens</span>
              <span>4</span>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <span className="text-neutral-500">Artworks</span>
              <span>12</span>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <span className="text-neutral-500">Status</span>
              <span>Active</span>
            </div>
          </div>
        </div>
      </section>
    </section>

    // {/* alte Landing Page */}
    // <section className=" mx-auto py-20 space-y-10">
    //   <div className="space-y-6">
    //     <h1 className="text-6xl font-semibold">Welcome to the Landingpage</h1>

    //     <p className="max-w-2xl text-gray-600">
    //       This is a temporary filler page for the landing experience. The more
    //       detailed artwork content now lives under the dedicated artworks route.
    //     </p>
    //   </div>

    //   <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-gray-700">
    //     <p>
    //       Use this space for future intro text, branding, or a teaser section.
    //     </p>
    //   </div>
    // </section>
  );
}
