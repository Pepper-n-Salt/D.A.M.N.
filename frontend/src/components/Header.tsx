import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const { pathname } = useLocation();
  const isLandingPage =
    pathname === "/landingpage" || pathname.startsWith("/landingpage/");
  const { language, setLanguage } = useLanguage();

  return (
    <header className="border-b border-gray-200 px-8 py-6">
      <div className="mb-20">
        {isLandingPage ? (
          // landingpage für eingeloggte user:innen
          <Link to="/landingpage" aria-label="Go to landingpage">
            <div className="leading-none">
              <p className="-ml-1 text-6xl tracking-[0.02em]">D.A.M.N.</p>
              <p className="mt-1 text-sm">Digital Artwork Management Network</p>
            </div>
          </Link>
        ) : (
          // landingpage product
          // <div className="border-b border-gray-200 pb-6">
          <div className="leading-none">
            <p className="-ml-1 text-6xl tracking-[0.02em]">D.A.M.N.</p>
            <p className="mt-1 text-sm">Digital Artwork Management Network</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <nav className="flex gap-10 text-sm uppercase tracking-[0.2em]">
          {isLandingPage ? (
            <>
              <Link to="/landingpage/artworks">Artworks</Link>
              <Link to="/landingpage/exhibitions">Exhibitions</Link>
              <Link to="/landingpage/screens">Screens</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </>
          )}
        </nav>

        {/* {!isLandingPage && (
          <div className="flex items-center uppercase gap-4">
            <button
              className="text-sm uppercase tracking-[0.2em] cursor-pointer"
              onClick={() => setLanguage(language === "de" ? "en" : "de")}
            >
              {language.toUpperCase()}
            </button>

            <Link
              href="/login"
              className="self-start border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Login
            </Link>
          </div>
        )} */}
        {isLandingPage ? (
          <div className="flex items-center gap-8 text-sm uppercase tracking-[0.2em]">
            <Link to="/landingpage/user">User</Link>

            <p className="text-neutral-500 normal-case tracking-normal">
              Hello Superuser!
            </p>

            <button
              className="cursor-pointer"
              onClick={() => setLanguage(language === "de" ? "en" : "de")}
            >
              {language.toUpperCase()}
            </button>

            <Link
              to="/login"
              className="border border-black px-8 py-2.5 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className="flex items-center uppercase gap-4">
            <button
              className="text-sm uppercase tracking-[0.2em] cursor-pointer"
              onClick={() => setLanguage(language === "de" ? "en" : "de")}
            >
              {language.toUpperCase()}
            </button>

            <Link
              to="/login"
              className="border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
