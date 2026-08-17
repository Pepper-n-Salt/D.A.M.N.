import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const { login: setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        // set auth context so ProtectedRoute recognizes the user
        setUser(data?.user || null);
        navigate("/landingpage");
        return;
      }

      setError(data?.msg || t("form.loginFailed"));
    } catch (err) {
      console.error(err);
      setError(t("form.networkError"));
    }
  };

  return (
    <section>
      <div className="border-b border-neutral-200 pt-12 ">
        <H1>{t("hero.title")}</H1>
        <br />
        <br />
        <P>{t("hero.subtitle")}</P>
        <br />
      </div>
      <form onSubmit={handleSubmit} className="mt-15">
        <div className="flex flex-col gap-8 max-w-md">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.email")}
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm uppercase tracking-[0.2em]"
            >
              {t("form.password")}
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
            />
          </div>

          {error && <P>{error}</P>}

          <button
            type="submit"
            className="mt-6 self-start border border-black px-8 py-3 uppercase tracking-[0.25em] text-sm transition-colors duration-300 hover:bg-black hover:text-white"
          >
            {t("form.submit")}
          </button>
        </div>
      </form>
    </section>
  );
}
