import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "de" ? "en" : "de");
  };

  const nextLanguage = i18n.language === "de" ? "en" : "de";

  return (
    <button
      onClick={toggleLanguage}
      className="text-sm uppercase tracking-[0.2em] cursor-pointer"
    >
      {nextLanguage.toUpperCase()}
    </button>
  );
}
