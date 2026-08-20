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

  // Nur Superadmins dürfen eine Organisation festlegen.
  // Es wird der Name eingegeben, nicht die ID.
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

    /*
     * Superadmin:
     * - darf admin oder user erstellen
     * - muss eine Organisation angeben
     *
     * Admin:
     * - darf nur user erstellen
     * - Organisation wird automatisch vom Backend übernommen
     */
    if (currentRole === "super" && !organisationName.trim()) {
      setError(t("newUser.form.organisationRequired"));
      return;
    }

    const body: Record<string, string> = {
      firstName,
      lastName,
      email,
      password,
      userRole: role,
    };

    /*
     * Nur der Superadmin sendet den Organisationsnamen.
     *
     * Der Admin sendet KEINE organisationId.
     * Das Backend nimmt automatisch die organisationId
     * des eingeloggten Admins.
     */
    if (currentRole === "super") {
      body.organisationName = organisationName.trim();
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || t("newUser.form.error"));
        return;
      }

      setSuccess(t("newUser.form.success"));

      setTimeout(() => {
        navigate("/landingpage/user");
      }, 800);
    } catch (err) {
      console.error(err);
      setError(t("newUser.form.error"));
    }
  };

  /*
   * User dürfen diese Seite nicht zum Anlegen von Usern verwenden.
   */
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
      {/* --------------------------------------------------------------- */}
      {/* Hero */}
      {/* --------------------------------------------------------------- */}

      <section className="space-y-8">
        <H1>{t("newUser.title")}</H1>

        <P>{t("newUser.paragraph")}</P>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* User information */}
      {/* --------------------------------------------------------------- */}

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <H2>{t("newUser.userInformation")}</H2>
          </div>

          <form
            className="flex max-w-md flex-col gap-8 lg:col-span-8"
            onSubmit={handleSubmit}
          >
            {/* First name */}

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
                required
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* Last name */}

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
                required
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* Email */}

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
                required
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* Password */}

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
                required
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* Repeat password */}

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
                required
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* Role */}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="role"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("newUser.form.role")}
              </label>

              <select
                id="role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              >
                {allowedRoles.map((option) => (
                  <option key={option} value={option}>
                    {t(`newUser.form.roleOptions.${option}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Organisation */}
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
                  required
                  className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
                  placeholder={t("newUser.form.organisation")}
                />

                {/* <P>{t("newUser.form.organisationHint")}</P> */}
              </div>
            ) : null}

            {/* Messages */}

            {error ? <P>{error}</P> : null}

            {success ? <P>{success}</P> : null}

            {/* Submit */}

            <button
              type="submit"
              className="mt-4 self-start border border-black px-8 py-3 text-sm uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("newUser.form.submit")}
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}
