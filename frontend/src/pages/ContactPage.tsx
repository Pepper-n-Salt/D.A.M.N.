import P from "../components/ui/typography/P";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";

export default function ContactPage() {
  return (
    <section className="space-y-20">
      <section className="space-y-12">
        <H1>
          Let&apos;s create
          <br />
          something meaningful together.
        </H1>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 tracking-widest leading-loose">
        <div className="space-y-8">
          <div>
            <H2>Get in touch</H2>

            <P>
              Whether you represent a museum, gallery, exhibition space or
              cultural institution, D.A.M.N. is designed to simplify the
              management and presentation of digital artworks. Our platform
              helps you create engaging digital exhibitions without requiring
              technical expertise, allowing you to focus on your collections and
              visitors.
            </P>
          </div>

          <P>
            To ensure a personal and secure experience, we kindly ask all
            prospective members to complete the contact form before accessing
            our services. Once we receive your message, our team will review
            your request and get back to you as soon as possible. This first
            step helps us learn more about you, answer your questions, and
            provide the most suitable support for your needs. After your inquiry
            has been reviewed, you'll receive further information about joining
            our platform and using our services. We look forward to connecting
            with you and welcoming you to our community.
          </P>
        </div>

        <form action="" className="flex flex-col gap-8 max-w-md w-full mx-auto">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              className="border-b border-black bg-transparent py-3 outline-none focus:border-2 focus:border-t-0 focus:border-l-0 focus:border-r-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm uppercase tracking-[0.2em]"
            >
              E-mail
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className="border-b border-black bg-transparent py-3 outline-none focus:border-2 focus:border-t-0 focus:border-l-0 focus:border-r-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Message
            </label>

            <textarea
              id="message"
              name="message"
              rows={6}
              className="border-b border-black bg-transparent py-3 outline-none resize-none focus:border-2 focus:border-t-0 focus:border-l-0 focus:border-r-0"
            />
          </div>
          <button
            type="submit"
            className="self-start border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
          >
            Send
          </button>
        </form>
      </div>
      {/* </section> */}
    </section>
  );
}
