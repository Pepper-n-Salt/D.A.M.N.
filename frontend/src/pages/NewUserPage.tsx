export default function NewUserPage() {
  return (
    <section className="space-y-20 py-8">
      <section className="space-y-8">
        <h1 className="text-5xl md:text-7xl sm:text-5xl lg:text-9xl font-light">
          Add Member
        </h1>
        <p className="tracking-widest leading-loose max-w-2xl">
          Create a new account for your organization and define the appropriate
          access level within D.A.M.N.
        </p>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
              User Information
            </p>
          </div>

          <form className="lg:col-span-8 max-w-md flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstname"
                className="text-sm uppercase tracking-[0.2em]"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastname"
                className="text-sm uppercase tracking-[0.2em]"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
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
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm uppercase tracking-[0.2em]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="repeat-password"
                className="text-sm uppercase tracking-[0.2em]"
              >
                Repeat Password
              </label>
              <input
                type="password"
                id="repeat-password"
                name="repeat-password"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <button
              type="submit"
              className="self-start mt-4 border border-black px-8 py-3 uppercase tracking-[0.25em] text-sm transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Save
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}
