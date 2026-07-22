import { Link } from "react-router-dom";
import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";

export default function User() {
  return (
    <section className="space-y-20">
      <section className="space-y-12">
        <H1>Account settings</H1>

        <P>Manage your account information and update your personal details.</P>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <H2>Account Information</H2>
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
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
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
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
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

            <button
              type="submit"
              className="self-start mt-4 border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Save Changes
            </button>
          </form>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <H2>User Management</H2>
          </div>

          <div className="lg:col-span-8">
            <H3>Create a new user</H3>
            <br />
            <P>
              Add new members to your organization and manage access to the
              Digital Artwork Management Network.
            </P>
            <br />
            <br />
            <Link to="/landingpage/user/new">
              {" "}
              <Borderbutton>Create User</Borderbutton>
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
