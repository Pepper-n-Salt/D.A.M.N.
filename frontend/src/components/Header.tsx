import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { t } = useTranslation("common");
  const { pathname } = useLocation();
  const isLandingPage =
    pathname === "/landingpage" || pathname.startsWith("/landingpage/");
  const isDisplay = pathname === "/display" || pathname.startsWith("/display/");

  if (isDisplay) {
    return null;
  }

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-200 px-8 py-6">
      <div className="mb-20">
        {isLandingPage ? (
          // landingpage für eingeloggte user:innen
          <NavLink to="/landingpage" aria-label={t("header.goToLandingpage")}>
            <div className="leading-none">
              <p className="-ml-1.25 text-6xl tracking-[0.02em]">
                {t("app.name")}
              </p>
              <p className="mt-1 origin-left scale-x-[0.972] text-sm leading-loose">
                {t("header.brandSubtitle")}
              </p>
            </div>
          </NavLink>
        ) : (
          // landingpage product für alle
          <NavLink to="/" aria-label={t("header.goToHomepage")}>
            <div className="leading-none">
              <p className="-ml-1.25 text-6xl tracking-[0.02em]">
                {t("app.name")}
              </p>
              <p className="mt-1 origin-left scale-x-[0.972] text-sm leading-loose">
                {t("header.brandSubtitle")}
              </p>
            </div>
          </NavLink>
        )}
      </div>

      <div className="flex justify-between items-center">
        <nav className="flex gap-10 text-sm uppercase tracking-[0.2em]">
          {isLandingPage ? (
            <>
              {" "}
              <NavLink
                to="/landingpage/exhibitions"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                {t("navigation.exhibitions")}
              </NavLink>
              <NavLink
                to="/landingpage/artworks"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                {t("navigation.artworks")}
              </NavLink>{" "}
              <NavLink
                to="/landingpage/artists"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                {t("navigation.artists")}
              </NavLink>
              <NavLink
                to="/landingpage/screens"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                {t("navigation.screens")}
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
                {t("navigation.home")}
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                {t("navigation.about")}
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-semibold border-b border-black"
                    : "text-black"
                }
              >
                {t("navigation.contact")}
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
              {t("navigation.user")}
            </NavLink>

            <p className="text-neutral-500 normal-case tracking-normal">
              {t("header.welcome", { name: user?.firstName || "Superuser" })}
            </p>

            <LanguageSwitcher />

            <button
              type="button"
              onClick={handleLogout}
              className="border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("navigation.logout")}
            </button>
          </div>
        ) : (
          <div className="flex items-center uppercase gap-4">
            <LanguageSwitcher />

            <NavLink
              to="/login"
              className="border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("navigation.login")}
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
