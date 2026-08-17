import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
export default function Footer() {
  const { t } = useTranslation("common");
  const { pathname } = useLocation();
  const isDisplay = pathname === "/display" || pathname.startsWith("/display/");

  if (isDisplay) {
    return null;
  }

  return (
    <footer className="border-t border-gray-200 px-8 py-8">
      <div className="flex justify-between items-center text-sm uppercase tracking-[0.2em]">
        <p className="text-gray-400">
          {t("footer.copyright", {
            appName: t("app.name"),
            year: new Date().getFullYear(),
          })}
        </p>

        <nav className="flex gap-8">
          <Link to="/imprint">{t("footer.imprint")}</Link>
          <Link to="/privacy">{t("footer.privacy")}</Link>
        </nav>
      </div>
    </footer>
  );
}
