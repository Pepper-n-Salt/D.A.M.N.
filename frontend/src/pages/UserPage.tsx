import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import H1 from "../components/ui/typography/H1";
import H2 from "../components/ui/typography/H2";
import H3 from "../components/ui/typography/H3";
import P from "../components/ui/typography/P";
import Borderbutton from "../components/ui/buttons/Borderbutton";
import { useAuth } from "../context/AuthContext";

type UserListItem = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  organisationId?: string;
};

type Organisation = {
  id: string;
  name: string;
};

export default function User() {
  const { t } = useTranslation("user");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [organisationId, setOrganisationId] = useState("");

  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loadingOrganisations, setLoadingOrganisations] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<UserListItem[] | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const currentRole = user?.role || "user";

  const isAdmin = currentRole === "admin" || currentRole === "super";
  const isSuper = currentRole === "super";

  /*
  |--------------------------------------------------------------------------
  | Eigene Userdaten laden
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setOrganisationId(user.organisationId || "");
  }, [user]);

  /*
  |--------------------------------------------------------------------------
  | Organisationen laden
  |--------------------------------------------------------------------------
  |
  | NUR Superuser laden die komplette Organisationsliste.
  |
  | Dieser Endpoint bleibt bewusst:
  | /api/organisation
  |
  */

  useEffect(() => {
    if (!isSuper) {
      return;
    }

    const loadOrganisations = async () => {
      setLoadingOrganisations(true);

      try {
        const response = await fetch("/api/organisation", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || t("account.form.organisationLoadError"));
        }

        setOrganisations(data.organisations || []);
      } catch (err: unknown) {
        console.error("Organisationen konnten nicht geladen werden:", err);

        setError(
          err instanceof Error
            ? err.message
            : t("account.form.organisationLoadError")
        );
      } finally {
        setLoadingOrganisations(false);
      }
    };

    loadOrganisations();
  }, [isSuper, t]);

  /*
  |--------------------------------------------------------------------------
  | User laden
  |--------------------------------------------------------------------------
  |
  | Admin:
  |   Backend liefert User der eigenen Organisation.
  |
  | Super:
  |   Backend liefert ALLE User.
  |
  | User:
  |   Kein Laden notwendig.
  |
  */

  useEffect(() => {
    if (!isAdmin) {
      setUsers(null);
      return;
    }

    const loadUsers = async () => {
      setLoadingUsers(true);
      setError(null);

      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || t("management.loadUsersError"));
        }

        setUsers(data.users || []);
      } catch (err: unknown) {
        console.error("User konnten nicht geladen werden:", err);

        setError(
          err instanceof Error ? err.message : t("management.loadUsersError")
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [isAdmin, t]);

  /*
  |--------------------------------------------------------------------------
  | User löschen
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (userIdToDelete: string) => {
    if (!confirm(t("management.confirmDelete"))) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/user/${userIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || t("management.deleteError"));
      }

      setUsers((prev) =>
        prev ? prev.filter((u) => u.id !== userIdToDelete) : prev
      );

      setMessage(data.msg || t("management.deleteSuccess"));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : t("management.deleteError")
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Account aktualisieren
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setError(null);
    setMessage(null);

    const body: Record<string, string> = {
      email,
      firstName,
      lastName,
    };

    if (password) {
      body.password = password;
    }

    /*
      NUR Superuser darf die Organisation ändern.
    */

    if (isSuper && organisationId) {
      body.organisationId = organisationId;
    }

    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || t("account.form.error"));
        return;
      }

      setMessage(t("account.form.success"));

      if (data.user) {
        login(data.user);
        setPassword("");

        navigate("/landingpage/user");
      }
    } catch (err) {
      console.error(err);
      setError(t("account.form.error"));
    }
  };

  return (
    <section className="space-y-20">
      {/* ---------------------------------------------------------------- */}
      {/* Hero */}
      {/* ---------------------------------------------------------------- */}

      <section className="space-y-12">
        <H1>{t("hero.title")}</H1>

        <P>{t("hero.subtitle")}</P>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Account */}
      {/* ---------------------------------------------------------------- */}

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <H2>{t("account.title")}</H2>
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
                {t("account.form.firstName")}
              </label>

              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                type="text"
                id="firstname"
                name="firstname"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* Last name */}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastname"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.lastName")}
              </label>

              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                type="text"
                id="lastname"
                name="lastname"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* Email */}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.email")}
              </label>

              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                id="email"
                name="email"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* ---------------------------------------------------------- */}
            {/* Organisation                                               */}
            {/* ---------------------------------------------------------- */}
            {/*                                                             */}
            {/* WICHTIG:                                                     */}
            {/*                                                             */}
            {/* Super = sichtbar                                            */}
            {/* Admin = überhaupt nicht gerendert                           */}
            {/* User  = überhaupt nicht gerendert                           */}
            {/* ---------------------------------------------------------- */}

            {isSuper && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="organisation"
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {t("account.form.organisation")}
                </label>

                <select
                  id="organisation"
                  name="organisation"
                  value={organisationId}
                  onChange={(event) => setOrganisationId(event.target.value)}
                  disabled={loadingOrganisations}
                  className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2 disabled:opacity-40"
                >
                  <option value="">
                    {loadingOrganisations
                      ? t("account.form.organisationLoading")
                      : t("account.form.organisationSelect")}
                  </option>

                  {organisations.map((organisation) => (
                    <option key={organisation.id} value={organisation.id}>
                      {organisation.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Password */}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.password")}
              </label>

              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                id="password"
                name="password"
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

            {/* Role */}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="role"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.role")}
              </label>

              <input
                id="role"
                value={currentRole}
                disabled
                className="border-b border-neutral-900 bg-neutral-100 py-3 outline-none"
              />
            </div>

            {/* Messages */}

            {error && <P>{error}</P>}

            {message && <P>{message}</P>}

            {/* Submit */}

            <button
              type="submit"
              className="mt-4 self-start border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("account.form.submit")}
            </button>
          </form>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* User Management                                                  */}
      {/* ---------------------------------------------------------------- */}
      {/*                                                                 */}
      {/* NUR ADMIN UND SUPER                                             */}
      {/* User bekommt diesen kompletten Abschnitt NICHT.                 */}
      {/* ---------------------------------------------------------------- */}

      {isAdmin && (
        <section className="border-t border-neutral-200 pt-12">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <H2>{t("management.title")}</H2>
            </div>

            <div className="lg:col-span-8">
              <H3>{t("management.heading")}</H3>

              <br />

              <P>{t("management.description")}</P>

              <br />
              <br />

              {/* Create User */}

              <Borderbutton onClick={() => navigate("/landingpage/user/new")}>
                {t("management.button")}
              </Borderbutton>

              {/* -------------------------------------------------------- */}
              {/* User list                                                 */}
              {/* -------------------------------------------------------- */}

              <div className="mt-8 space-y-4">
                <H3>{t("management.usersListTitle")}</H3>

                {loadingUsers ? (
                  <P>{t("management.loading")}</P>
                ) : users && users.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between border border-neutral-900 p-4"
                      >
                        <div>
                          <div className="font-medium">
                            {u.firstName} {u.lastName}
                          </div>

                          <div className="text-sm text-neutral-600">
                            {u.email}
                          </div>

                          <div className="mt-1 text-xs uppercase tracking-[0.15em]">
                            {u.role}
                          </div>

                          {/* ------------------------------------------------ */}
                          {/* Organisation ID                                  */}
                          {/* ------------------------------------------------ */}
                          {/* Nur Superuser darf sie sehen.                   */}
                          {/* Admin bekommt keinerlei Organisationsinfo.      */}
                          {/* ------------------------------------------------ */}

                          {isSuper && u.organisationId && (
                            <div className="mt-2 text-xs text-neutral-500">
                              Organisation: {u.organisationId}
                            </div>
                          )}
                        </div>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() => handleDelete(u.id)}
                          className="border border-red-600 px-4 py-2 text-sm uppercase tracking-[0.15em] text-red-600 transition-colors duration-300 hover:bg-red-600 hover:text-white"
                        >
                          {t("management.delete")}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <P>{t("management.noUsers")}</P>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
