import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";

export default function About() {
  return (
    <section className="space-y-20">
      <section className="space-y-20">
        <H1>Pepper&apos;n&apos;Salt</H1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 tracking-widest leading-loose">
          <P>
            Pepper&apos;n&apos;Salt is a creative collaboration between two
            designers exploring digital experiences, visual communication and
            cultural heritage. Together we combine design thinking and technical
            implementation to create digital products with a clear focus on
            usability and aesthetics.
          </P>

          <P>
            As our finale project of our Web Development training, we developed
            D.A.M.N. — the Digital Artwork Management Network. The platform was
            created to simplify the management, curation and presentation of
            digital artworks while providing museums, galleries and cultural
            institutions with a flexible and future-oriented workflow.
          </P>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <H2>The Team</H2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <article className="space-y-8">
            <div className="aspect-4/5 border border-neutral-300 bg-neutral-100 flex items-center justify-center text-neutral-400 uppercase tracking-[0.3em] text-sm">
              Portrait
            </div>

            <div>
              <H3>Mela Heß</H3>

              <P>UX Design · Frontend Development</P>
            </div>

            <P>
              Passionate about creating intuitive and engaging digital
              experiences through thoughtful UX design and modern frontend
              development. Focused on translating complex ideas into clear,
              accessible interfaces while ensuring a seamless interaction
              between design, functionality and technology throughout the
              development of D.A.M.N.
            </P>
          </article>

          <article className="space-y-8">
            <div className="aspect-4/5 border border-neutral-300 bg-neutral-100 flex items-center justify-center text-neutral-400 uppercase tracking-[0.3em] text-sm">
              Portrait
            </div>

            <div>
              <H3>Imke Högden</H3>

              <P>Frontend Development · Backend Development</P>
            </div>

            <P>
              Focused on frontend and backend development, creating the
              technical foundation of D.A.M.N. Responsible for implementing the
              user interface, designing the application architecture,
              integrating the database and ensuring a reliable connection
              between functionality and user experience.
            </P>
          </article>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <P>Collaboration</P>

            <H3>Design meets Development.</H3>
          </div>

          <div className="md:col-span-8">
            <P>
              We believe that successful digital products emerge through close
              collaboration. By combining different perspectives and skill sets,
              we transform ideas into thoughtful digital experiences that are
              both visually refined and technically robust. As
              Pepper&apos;n&apos;Salt, we value curiosity, experimentation and
              the balance between creativity and functionality.
            </P>
          </div>
        </div>
      </section>
    </section>
  );
}
