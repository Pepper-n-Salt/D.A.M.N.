import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import Carouselbutton from "../components/ui/buttons/Carouselbutton";

export default function LandingPage() {
  return (
    <section className="space-y-20">
      <H1>Digital Display Platform</H1>
      <P>
        Create, manage and present digital artworks across connected screens.
      </P>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <div className="mb-8">
          <H2>Current Collection</H2>
        </div>

        <div className="border border-neutral-300">
          <div className="aspect-video bg-neutral-100 flex items-center justify-center">
            {" "}
            {/* später keine Umrandung mehr verwenden, lieber overflow-hidden */}
            <P>Artwork Preview</P>
          </div>

          <div className="border-t border-neutral-300 flex justify-between items-end p-6">
            <div>
              <H3>Untitled No. 24</H3>

              <P>Digital Artwork · 2026</P>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <Carouselbutton aria-label="Previous artwork">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Previous
          </Carouselbutton>
          <P>01 / 12</P>
          <Carouselbutton
            aria-label="Next artwork"
            className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em]"
          >
            Next
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Carouselbutton>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-neutral-200 pt-12">
        <div>
          <H2>Collection</H2>

          <div className="mt-4 flex items-baseline gap-3">
            <H3>124</H3>
            <P>artworks</P>
          </div>
        </div>

        <div>
          <H2>Exhibitions</H2>
          <div className="mt-4 flex items-baseline gap-3">
            <H3>8</H3>
            <P>active projects</P>
          </div>
        </div>

        <div>
          <H2>Screens</H2>
          <div className="mt-4 flex items-baseline gap-3">
            <H3>16</H3>
            <P>connected displays</P>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <H2>Recent Activity</H2>

        <div className="divide-y divide-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 py-6">
            <p className="text-sm text-neutral-400 md:col-span-1">12.02.2026</p>

            <P>New artwork added</P>

            <p className="md:col-span-1 text-neutral-500">Untitled No. 24</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 py-6">
            <p className="md:col-span-1 text-sm text-neutral-400">08.02.2026</p>

            <P>Exhibition updated</P>

            <p className="md:col-span-1 text-neutral-500">Digital Landscapes</p>
          </div>
        </div>
      </section>
      <section className="border-t border-neutral-200 pt-12">
        <div className="mb-8">
          <H2>Current Exhibition</H2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <H3>Digital Landscapes</H3>

            <P>
              A synchronized presentation of digital artworks across connected
              information screens.
            </P>
          </div>

          <div className="text-sm space-y-4">
            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <P>Screens</P>
              <P>4</P>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <P>Artworks</P>
              <P>12</P>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-3">
              <P>Status</P>
              <P>Active</P>
            </div>
          </div>
        </div>
      </section>
      <br />
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
