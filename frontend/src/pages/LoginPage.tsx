import { Link } from "react-router-dom";
import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";

export default function LoginPage() {
  return (
    <section className="max-w-md">
      <H1>Login</H1>
      <br />
      <br />
      <P>Access the Digital Artwork Management Network!</P>

      <form action="/login" method="post" className="mt-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm uppercase tracking-[0.2em]"
            >
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
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
              className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
            />
          </div>

          <Link
            to="/landingpage"
            type="submit"
            className="mt-6 self-start border border-black px-8 py-3 uppercase tracking-[0.25em] text-sm transition-colors duration-300 hover:bg-black hover:text-white"
          >
            Login
          </Link>
        </div>
      </form>
    </section>
  );
}
