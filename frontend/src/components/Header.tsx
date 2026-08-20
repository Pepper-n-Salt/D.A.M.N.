import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { t } = useTranslation("common");
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // const isLandingPage =
  //   pathname === "/landingpage" || pathname.startsWith("/landingpage/");
  const isDisplay = pathname === "/display" || pathname.startsWith("/display/");

  if (isDisplay) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // jetzt vom user abhängig und nicht mehr von "isLandingPage"

  return (
    <header className="border-b border-gray-200 px-8 py-6">
      <div className="mb-20">
        {user ? (
          // eingeloggter User:innen
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
          // nicht eingeloggte User:innen
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

      <div className="flex items-center justify-between">
        {/* Navigation */}
        <nav className="flex gap-10 text-sm uppercase tracking-[0.2em]">
          {user ? (
            <>
              <NavLink
                to="/landingpage/exhibitions"
                className={({ isActive }) =>
                  isActive
                    ? "border-b border-black font-semibold text-black"
                    : "text-black"
                }
              >
                {t("navigation.exhibitions")}
              </NavLink>

              <NavLink
                to="/landingpage/artworks"
                className={({ isActive }) =>
                  isActive
                    ? "border-b border-black font-semibold text-black"
                    : "text-black"
                }
              >
                {t("navigation.artworks")}
              </NavLink>

              <NavLink
                to="/landingpage/artists"
                className={({ isActive }) =>
                  isActive
                    ? "border-b border-black font-semibold text-black"
                    : "text-black"
                }
              >
                {t("navigation.artists")}
              </NavLink>

              <NavLink
                to="/landingpage/screens"
                className={({ isActive }) =>
                  isActive
                    ? "border-b border-black font-semibold text-black"
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
                    ? "border-b border-black font-semibold text-black"
                    : "text-black"
                }
              >
                {t("navigation.home")}
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "border-b border-black font-semibold text-black"
                    : "text-black"
                }
              >
                {t("navigation.about")}
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "border-b border-black font-semibold text-black"
                    : "text-black"
                }
              >
                {t("navigation.contact")}
              </NavLink>
            </>
          )}
        </nav>

        {/* User:innen Anzeige */}

        {user ? (
          <div className="flex items-center gap-8 text-sm uppercase tracking-[0.2em]">
            <NavLink
              to="/landingpage/user"
              className={({ isActive }) =>
                isActive
                  ? "border-b border-black font-semibold text-black"
                  : "text-black"
              }
            >
              {t("navigation.user")}
            </NavLink>

            <p className="normal-case tracking-normal text-neutral-500">
              {t("header.welcome", {
                name: user.firstName || "Superuser",
              })}
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
          <div className="flex items-center gap-4 uppercase">
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
