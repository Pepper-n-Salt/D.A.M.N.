import { NavLink, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { pathname } = useLocation();
  const isLandingPage =
    pathname === "/landingpage" || pathname.startsWith("/landingpage/");
  const isDisplay = pathname === "/display" || pathname.startsWith("/display/");

  if (isDisplay) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 px-8 py-6">
      <div className="mb-20">
        {isLandingPage ? (
          // landingpage für eingeloggte user:innen
          <NavLink to="/landingpage" aria-label="Go to landingpage">
            <div className="leading-none">
              <p className="-ml-1 text-6xl tracking-[0.02em]">D.A.M.N.</p>
              <p className="mt-1 text-sm leading-loose">
                Digital Artwork Management Network
              </p>
            </div>
          </NavLink>
        ) : (
          // landingpage product
          // <div className="border-b border-gray-200 pb-6">
          <div className="leading-none">
            <p className="-ml-1 text-6xl tracking-[0.02em]">D.A.M.N.</p>
            <p className="mt-1 text-sm leading-loose">
              Digital Artwork Management Network
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <nav className="flex gap-10 text-sm uppercase tracking-[0.2em]">
          {isLandingPage ? (
            <>
              <NavLink
                to="/landingpage/artworks"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                Artworks
              </NavLink>
              <NavLink
                to="/landingpage/exhibitions"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                Exhibitions
              </NavLink>
              <NavLink
                to="/landingpage/screens"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                Screens
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                Contact
              </NavLink>
            </>
          )}
        </nav>

        {isLandingPage ? (
          <div className="flex items-center gap-8 text-sm uppercase tracking-[0.2em]">
            <NavLink
              to="/landingpage/user"
              className={({ isActive }) =>
                isActive
                  ? "text-black font-semibold border-b border-black"
                  : "text-black"
              }
            >
              User
            </NavLink>

            <p className="text-neutral-500 normal-case tracking-normal">
              Hello Superuser!
            </p>

            <LanguageSwitcher />

            <NavLink
              to="/login"
              className="border border-black px-8 py-2.5 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Logout
            </NavLink>
          </div>
        ) : (
          <div className="flex items-center uppercase gap-4">
            <LanguageSwitcher />

            <NavLink
              to="/login"
              className="border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
