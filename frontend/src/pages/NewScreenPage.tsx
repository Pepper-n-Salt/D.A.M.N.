export default function NewScreenPage() {
  return (
    <section className="space-y-20 py-8">
      <div className="space-y-6">
        <h1 className="text-5xl font-light sm:text-6xl md:text-7xl">
          Create Screen
        </h1>
        <p className="max-w-2xl text-neutral-500">
          Configure a digital presentation for your museum displays.
        </p>
      </div>

      <section className="space-y-8">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          Select Screen Type
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-light">Static Screens</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group border border-neutral-300 p-6 text-left transition-colors duration-300 hover:bg-black hover:text-white">
              <h3 className="text-xl font-light">Exhibition</h3>
              <p className="mt-3 text-sm text-neutral-500 group-hover:text-neutral-500">
                Display current exhibitions and related information.
              </p>
            </button>
            <button className="border border-neutral-300 p-6 text-left transition hover:bg-black hover:text-white">
              <h3 className="text-xl font-light">Artwork</h3>
              <p className="mt-3 text-sm text-neutral-500">
                Present individual artworks with metadata.
              </p>
            </button>
            <button className="border border-neutral-300 p-6 text-left transition hover:bg-black hover:text-white">
              <h3 className="text-xl font-light">Artist</h3>
              <p className="mt-3 text-sm text-neutral-500">
                Show artist information and selected works.
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-6 pt-8">
          <h2 className="text-2xl font-light">Dynamic Screens</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              disabled
              className="border border-neutral-200 p-6 text-left opacity-40 cursor-not-allowed"
            >
              <h3 className="text-xl font-light">Interactive Artwork</h3>
              <p className="mt-3 text-sm text-neutral-500">
                Explore artworks through zoom and interaction.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em]">
                Coming soon
              </p>
            </button>
            <button
              disabled
              className="border border-neutral-200 p-6 text-left opacity-40 cursor-not-allowed"
            >
              <h3 className="text-xl font-light">Digital Experience</h3>
              <p className="mt-3 text-sm text-neutral-500">
                Create immersive and animated presentations.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em]">
                Coming soon
              </p>
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500 mb-8">
          Screen Information
        </p>

        <div className="max-w-xl space-y-8">
          <div>
            <label className="text-sm text-neutral-500">Screen Name</label>
            <input
              type="text"
              placeholder="Main Gallery Screen"
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-500">Location</label>
            <input
              type="text"
              placeholder="Entrance Hall"
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>
          <button className="border border-black px-8 py-3 text-sm uppercase tracking-[0.25em] transition hover:bg-black hover:text-white">
            Create Screen
          </button>
        </div>
      </section>
    </section>
  );
}
