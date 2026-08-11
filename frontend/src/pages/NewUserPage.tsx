import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import P from "../components/ui/typography/P";

export default function NewUserPage() {
  const { t } = useTranslation("newUser");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("user");
  const [organisationName, setOrganisationName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentRole = user?.role;
  const allowedRoles =
    currentRole === "super"
      ? ["admin", "user"]
      : currentRole === "admin"
        ? ["user"]
        : [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== repeatPassword) {
      setError(t("newUser.form.passwordMismatch"));
      return;
    }

    const body: Record<string, string> = {
      firstName,
      lastName,
      email,
      password,
      userRole: role,
    };

    if (currentRole === "super" && organisationName) {
      body.organisationName = organisationName;
    }

    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.msg || t("newUser.form.error"));
      return;
    }

    setSuccess(t("newUser.form.success"));
    setTimeout(() => navigate("/landingpage/user"), 800);
  };

  if (allowedRoles.length === 0) {
    return (
      <section className="space-y-20 py-8">
        <section className="space-y-8">
          <H1>{t("newUser.title")}</H1>
          <P>{t("newUser.noPermission")}</P>
        </section>
      </section>
    );
  }

  return (
    <section className="space-y-20 py-8">
      <section className="space-y-8">
        <H1>{t("newUser.title")}</H1>
        <P>{t("newUser.paragraph")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <H2>{t("newUser.userInformation")}</H2>
          </div>

          <form
            className="lg:col-span-8 max-w-md flex flex-col gap-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstname"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("newUser.form.firstName")}
              </label>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
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
                {t("newUser.form.lastName")}
              </label>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
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
                {t("newUser.form.email")}
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                {t("newUser.form.password")}
              </label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
                {t("newUser.form.repeatPassword")}
              </label>
              <input
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
                type="password"
                id="repeat-password"
                name="repeat-password"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="role"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("newUser.form.role")}
              </label>
              <select
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="border-b border-neutral-900 bg-transparent py-3 outline-none"
              >
                {allowedRoles.map((option) => (
                  <option key={option} value={option}>
                    {t(`newUser.form.roleOptions.${option}`)}
                  </option>
                ))}
              </select>
            </div>
            {currentRole === "super" ? (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="organisationName"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("newUser.form.organisation")}
                </label>
                <input
                  value={organisationName}
                  onChange={(event) => setOrganisationName(event.target.value)}
                  type="text"
                  id="organisationName"
                  name="organisationName"
                  className="border-b border-neutral-900 bg-transparent py-3 outline-none"
                  placeholder={t("newUser.form.organisation")}
                />
              </div>
            ) : null}
            {error ? <P>{error}</P> : null}
            {success ? <P>{success}</P> : null}
            <button
              type="submit"
              className="self-start mt-4 border border-black px-8 py-3 uppercase tracking-[0.25em] text-sm transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("newUser.form.submit")}
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}
