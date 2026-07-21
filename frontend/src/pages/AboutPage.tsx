export default function About() {
  return (
    <section className="space-y-20">
      <section className="space-y-20">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-light">
          Pepper&apos;n&apos;Salt
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 tracking-widest leading-loose">
          <p>
            Pepper&apos;n&apos;Salt is a creative collaboration between two
            designers exploring digital experiences, visual communication and
            cultural heritage. Together we combine design thinking and technical
            implementation to create digital products with a clear focus on
            usability and aesthetics.
          </p>

          <p>
            As our finale project of our Web Development training, we developed
            D.A.M.N. — the Digital Artwork Management Network. The platform was
            created to simplify the management, curation and presentation of
            digital artworks while providing museums, galleries and cultural
            institutions with a flexible and future-oriented workflow.
          </p>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12 space-y-12">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          The Team
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <article className="space-y-8">
            <div className="aspect-[4/5] border border-neutral-300 bg-neutral-100 flex items-center justify-center text-neutral-400 uppercase tracking-[0.3em] text-sm">
              Portrait
            </div>

            <div>
              <h2 className="text-3xl font-light leading-tight">Melanie Heß</h2>

              <p className="mt-2 uppercase tracking-[0.2em] text-sm text-neutral-500">
                UX Design · Frontend Development
              </p>
            </div>

            <p className="tracking-widest leading-loose">
              Passionate about creating intuitive and engaging digital
              experiences through thoughtful UX design and modern frontend
              development. Focused on translating complex ideas into clear,
              accessible interfaces while ensuring a seamless interaction
              between design, functionality and technology throughout the
              development of D.A.M.N.
            </p>
          </article>

          <article className="space-y-8">
            <div className="aspect-[4/5] border border-neutral-300 bg-neutral-100 flex items-center justify-center text-neutral-400 uppercase tracking-[0.3em] text-sm">
              Portrait
            </div>

            <div>
              <h2 className="text-3xl font-light leading-tight">Imke Högden</h2>

              <p>Frontend Development · Backend Development</p>
            </div>

            <p>
              Focused on frontend and backend development, creating the
              technical foundation of D.A.M.N. Responsible for implementing the
              user interface, designing the application architecture,
              integrating the database and ensuring a reliable connection
              between functionality and user experience.
            </p>
          </article>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p>Collaboration</p>

            <h2>Design meets Development.</h2>
          </div>

          <div className="md:col-span-8">
            <p>
              We believe that successful digital products emerge through close
              collaboration. By combining different perspectives and skill sets,
              we transform ideas into thoughtful digital experiences that are
              both visually refined and technically robust. As
              Pepper&apos;n&apos;Salt, we value curiosity, experimentation and
              the balance between creativity and functionality.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
