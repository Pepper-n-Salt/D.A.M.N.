import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";
export default function NewExhibitionPage() {
  return (
    <section className="space-y-10 py-8">
      <div className="border-b border-neutral-200 pt-12 space-y-8">
        <H1>Add new Exhibition</H1>
        <P>Fill in the details below to create a new exhibition entry.</P>
        <br />
      </div>

      <form className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-none border border-black p-8">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="subtitle"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="startDate"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="endDate"
              className="text-sm uppercase tracking-[0.2em]"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              htmlFor="location"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="border-b border-black bg-transparent py-3 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm uppercase tracking-[0.2em]"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="resize-none border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="events"
            className="text-sm uppercase tracking-[0.2em]"
          >
            Events
          </label>
          <textarea
            id="events"
            name="events"
            rows={4}
            className="resize-none border-b border-black bg-transparent py-3 outline-none"
          />
        </div>

        <button
          type="submit"
          className="self-start border border-black px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-black hover:text-white"
        >
          Save Exhibition
        </button>
      </form>
    </section>
  );
}
