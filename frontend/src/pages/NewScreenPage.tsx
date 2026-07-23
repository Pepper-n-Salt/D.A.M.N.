import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";

import { useState } from "react";

export default function NewScreenPage() {
  const [selectedType, setSelectedType] = useState<
    "exhibition" | "artwork" | "artist" | null
  >(null);

  function createScreen() {
    if (!selectedType) return;

    window.open(`/display/${selectedType}`, "_blank"); // Die window.open()-Methode in JavaScript öffnet ein neues Browserfenster, um die darin angegebene URL zu laden.
  }

  return (
    <section className="space-y-20">
      <div className="space-y-6">
        <H1>Create Screen</H1>

        <P>Configure a digital presentation for your museum displays.</P>
      </div>

      <section className="space-y-8">
        <H2>Select Screen Type</H2>

        <div className="space-y-6">
          <H3>Static Screens</H3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setSelectedType("exhibition")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "exhibition"
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light">Exhibition</h3>

              <p className="mt-3 text-sm text-neutral-500 group-hover:text-neutral-500">
                Display current exhibitions and related information.
              </p>
            </button>

            <button
              onClick={() => setSelectedType("artwork")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "artwork"
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light">Artwork</h3>

              <p className="mt-3 text-sm text-neutral-500">
                Present individual artworks with metadata.
              </p>
            </button>

            <button
              onClick={() => setSelectedType("artist")}
              className={`
                border p-6 text-left transition
                ${
                  selectedType === "artist"
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:bg-black hover:text-white"
                }
              `}
            >
              <h3 className="text-xl font-light">Artist</h3>

              <p className="mt-3 text-sm text-neutral-500">
                Show artist information and selected works.
              </p>
            </button>
          </div>
        </div>

        {/* <div className="space-y-6 pt-8">
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
        </div>*/}
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <H2>Screen Information</H2>
        <br />

        <div className="max-w-xl space-y-8">
          <div>
            <label className="text-sm text-neutral-500 leading-loose tracking-widest">
              Screen Name
            </label>

            <input
              type="text"
              placeholder="Main Gallery Screen"
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="text-sm leading-loose tracking-widest text-neutral-500">
              Location
            </label>

            <input
              type="text"
              placeholder="Entrance Hall"
              className="mt-3 w-full border-b border-black bg-transparent py-3 outline-none placeholder:text-neutral-400"
            />
          </div>

          <button
            onClick={createScreen}
            disabled={!selectedType}
            className="
              border
              border-black
              px-8
              py-3
              text-sm
              uppercase
              tracking-[0.25em]
              transition
              hover:bg-black
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            Create Screen
          </button>
        </div>
      </section>
    </section>
  );
}
