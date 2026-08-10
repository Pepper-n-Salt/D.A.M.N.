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

export default function User() {
  const { t } = useTranslation("user");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserListItem[] | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setOrganisationName("");
    }
  }, [user]);

  useEffect(() => {
    const loadUsers = async () => {
      const currentRole = user?.role;
      if (currentRole !== "admin" && currentRole !== "super") return;
      setLoadingUsers(true);
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.msg || "Fehler beim Laden der Nutzer");
        setUsers(data.users || []);
      } catch (err: any) {
        setError(err.message || "Fehler beim Laden der Nutzer");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [user]);

  const handleDelete = async (userIdToDelete: string) => {
    if (!confirm("Benutzer wirklich löschen?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/user/${userIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Löschen fehlgeschlagen");
      setUsers((prev) =>
        prev ? prev.filter((u) => u.id !== userIdToDelete) : prev
      );
      setMessage(data.msg || "Gelöscht.");
    } catch (err: any) {
      setError(err.message || "Löschen fehlgeschlagen");
    }
  };

  const currentRole = user?.role || "user";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

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

    if (currentRole === "admin" || currentRole === "super") {
      body.organisationName = organisationName;
    }

    const response = await fetch(`/api/user/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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
      navigate("/landingpage/user");
    }
  };

  return (
    <section className="space-y-20">
      <section className="space-y-12">
        <H1>{t("hero.title")}</H1>

        <P>{t("hero.subtitle")}</P>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <H2>{t("account.title")}</H2>
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

            <div className="flex flex-col gap-2">
              <label
                htmlFor="organisationName"
                className="text-sm uppercase tracking-[0.2em]"
              >
                {t("account.form.organisation")}
              </label>
              <input
                value={organisationName}
                onChange={(event) => setOrganisationName(event.target.value)}
                type="text"
                id="organisationName"
                name="organisationName"
                disabled={!(currentRole === "admin" || currentRole === "super")}
                placeholder={t("account.form.organisation")}
                className="border-b border-neutral-900 bg-transparent py-3 outline-none focus:border-b-2"
              />
            </div>

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
                className="border-b border-neutral-900 bg-neutral-100 py-3 outline-none focus:border-b-2"
              />
            </div>

            {error ? <P></P> : null}
            {message ? <P>{message}</P> : null}

            <button
              type="submit"
              className="self-start mt-4 border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {t("account.form.submit")}
            </button>
          </form>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <H2>{t("management.title")}</H2>
          </div>

          <div className="lg:col-span-8">
            <H3>{t("management.heading")}</H3>
            <br />
            <P>{t("management.description")}</P>
            <br />
            <br />
            {currentRole === "admin" || currentRole === "super" ? (
              <Borderbutton onClick={() => navigate("/landingpage/user/new")}>
                {t("management.button")}
              </Borderbutton>
            ) : (
              <P>{t("management.noPermission")}</P>
            )}
            {(currentRole === "admin" || currentRole === "super") && (
              <div className="mt-8 space-y-4">
                <H3>{t("management.usersListTitle")}</H3>
                {loadingUsers ? (
                  <P>{t("management.loading")}</P>
                ) : error ? (
                  <P>{error}</P>
                ) : users && users.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between border p-3 rounded"
                      >
                        <div>
                          <div className="font-medium">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {u.email}
                          </div>
                          <div className="text-xs uppercase tracking-[0.15em] mt-1">
                            {u.role}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            {t("management.delete")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <P>{t("management.noUsers")}</P>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
