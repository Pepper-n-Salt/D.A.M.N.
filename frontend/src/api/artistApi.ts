import type { ArtistFormData } from "../components/ArtistForm";

const API_URL = `${import.meta.env.VITE_API_URL || ""}`;

export type Language = "german" | "english";

export type CreateArtistResponse = {
  id: string;

  imageId: string | null;
  fileUrl: string | null;

  dateOfBirth: string | null;
  dateOfDeath: string | null;

  createdBy: string;
  createdByName?: string | null;

  lastEditedBy: string;
  isDeleted: boolean;

  languageCode: "de" | "en";

  firstName: string;
  lastName: string;

  country: string | null;
  description: string | null;

  isScreen?: boolean;
};

const languageToCode = (language: Language): "de" | "en" => {
  return language === "german" ? "de" : "en";
};

/*
 * --------------------------------------------------------------------------
 * Artist erstellen
 * --------------------------------------------------------------------------
 */

export async function createArtist(
  formData: ArtistFormData,
  language: Language
): Promise<CreateArtistResponse> {
  const response = await fetch(`${API_URL}/artist`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      languageCode: languageToCode(language),

      firstName: formData.firstName,
      lastName: formData.lastName,

      dateOfBirth: formData.dateOfBirth || null,
      dateOfDeath: formData.dateOfDeath || null,

      country: formData.country || null,
      description: formData.description || null,

      imageId: null,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Der Artist konnte nicht gespeichert werden.");
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Alle Artists laden
 * --------------------------------------------------------------------------
 */

export async function getArtists(
  languageCode: "de" | "en"
): Promise<CreateArtistResponse[]> {
  const response = await fetch(`${API_URL}/artist/${languageCode}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Die Artists konnten nicht geladen werden.");
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Einen Artist laden
 * --------------------------------------------------------------------------
 */

export async function getArtist(
  artistId: string,
  language: Language
): Promise<CreateArtistResponse> {
  const languageCode = languageToCode(language);

  const response = await fetch(
    `${API_URL}/artist/${artistId}/${languageCode}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Der Artist konnte nicht geladen werden.");
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Artist aktualisieren
 * --------------------------------------------------------------------------
 */

export async function updateArtist(
  artistId: string,
  language: Language,
  formData: ArtistFormData
): Promise<CreateArtistResponse> {
  const languageCode = languageToCode(language);

  const response = await fetch(
    `${API_URL}/artist/${artistId}/${languageCode}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,

        dateOfBirth: formData.dateOfBirth || null,
        dateOfDeath: formData.dateOfDeath || null,

        country: formData.country || null,
        description: formData.description || null,

        imageId: null,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Der Artist konnte nicht aktualisiert werden."
    );
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Artist löschen
 * --------------------------------------------------------------------------
 */

export async function deleteArtist(artistId: string): Promise<void> {
  const response = await fetch(`${API_URL}/artist/${artistId}/delete`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Der Artist konnte nicht gelöscht werden.");
  }
}

/*
 * --------------------------------------------------------------------------
 * Gelöschte Artists laden
 * --------------------------------------------------------------------------
 */

export async function getDeletedArtists(
  languageCode: "de" | "en"
): Promise<CreateArtistResponse[]> {
  const response = await fetch(`${API_URL}/artist/deleted/${languageCode}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die gelöschten Artists konnten nicht geladen werden."
    );
  }

  return data;
}

export async function restoreArtist(artistId: string): Promise<void> {
  const response = await fetch(`${API_URL}/artist/${artistId}/restore`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Der Artist konnte nicht wiederhergestellt werden."
    );
  }
}
