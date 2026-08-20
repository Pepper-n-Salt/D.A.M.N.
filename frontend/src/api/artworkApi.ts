import type { ArtworkFormData } from "../components/ArtworkForm";

const API_URL = `${import.meta.env.VITE_API_URL || ""}`;

export type Language = "german" | "english";

export type ArtworkArtist = {
  id: string;

  imageId: string | null;

  dateOfBirth: string | null;
  dateOfDeath: string | null;

  createdBy: string;
  lastEditedBy: string | null;

  isDeleted: boolean;

  languageCode: "de" | "en";

  firstName: string;
  lastName: string;

  country: string | null;
  description: string | null;

  isScreen?: boolean;
};

export type ArtworkResponse = {
  id: string;

  year: number | null;
  dimensions: string | null;
  imageId: string | null;
  fileUrl: string | null;

  createdBy: string;
  createdByName?: string | null;
  lastEditedBy: string | null;

  isDeleted: boolean;

  languageCode: "de" | "en";

  title: string;
  subtitle: string | null;
  country: string | null;
  origin: string | null;
  material: string | null;
  description: string | null;

  /*
   * Artists, die diesem Artwork zugeordnet sind
   */
  artists: ArtworkArtist[];
  // artists: string[];

  isScreen?: boolean;
};

const languageToCode = (language: Language): "de" | "en" => {
  return language === "german" ? "de" : "en";
};

/*
 * --------------------------------------------------------------------------
 * Artwork erstellen
 * --------------------------------------------------------------------------
 */

export async function createArtwork(
  formData: ArtworkFormData,
  language: Language
): Promise<ArtworkResponse> {
  if (!formData.imageId) {
    throw new Error(
      "Für ein neues Artwork muss eine gültige Image-ID vorhanden sein."
    );
  }

  const response = await fetch(`${API_URL}/artwork`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      year: Number(formData.year),
      country: formData.country || null,
      dimensions: formData.dimensions || null,
      imageId: formData.imageId,

      languageCode: languageToCode(language),

      title: formData.title,
      subtitle: formData.subtitle || null,
      origin: formData.origin || null,
      material: formData.material || null,
      description: formData.description || null,

      artists: formData.artists,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Das Artwork konnte nicht gespeichert werden."
    );
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Alle Artworks laden
 * --------------------------------------------------------------------------
 */

export async function getArtworks(
  languageCode: "de" | "en"
): Promise<ArtworkResponse[]> {
  const response = await fetch(`${API_URL}/artwork/${languageCode}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Die Artworks konnten nicht geladen werden.");
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Ein Artwork laden
 * --------------------------------------------------------------------------
 */

export async function getArtwork(
  artworkId: string,
  language: Language
): Promise<ArtworkResponse> {
  const languageCode = languageToCode(language);

  const response = await fetch(
    `${API_URL}/artwork/${artworkId}/${languageCode}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Das Artwork konnte nicht geladen werden.");
  }

  return data;
}

// Ein Artwork ohne Auth laden für Screens
export async function getPublicArtwork(
  artworkId: string,
  languageCode: "de" | "en"
): Promise<ArtworkResponse> {
  const response = await fetch(
    `${API_URL}/artwork/public/${artworkId}/${languageCode}`,
    {
      method: "GET", // ohne include, weil öffentlich
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Das Artwork konnte nicht geladen werden.");
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Artwork aktualisieren
 * --------------------------------------------------------------------------
 */

export async function updateArtwork(
  artworkId: string,
  language: Language,
  formData: ArtworkFormData
): Promise<ArtworkResponse> {
  const languageCode = languageToCode(language);

  const response = await fetch(
    `${API_URL}/artwork/${artworkId}/${languageCode}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year: formData.year ? Number(formData.year) : undefined,
        country: formData.country || null,
        dimensions: formData.dimensions || null,

        ...(formData.imageId
          ? {
              imageId: formData.imageId,
            }
          : {}),

        title: formData.title,
        subtitle: formData.subtitle || null,
        origin: formData.origin || null,
        material: formData.material || null,
        description: formData.description || null,

        artists: formData.artists,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Das Artwork konnte nicht aktualisiert werden."
    );
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Artwork löschen
 * --------------------------------------------------------------------------
 */

export async function deleteArtwork(artworkId: string): Promise<void> {
  const response = await fetch(`${API_URL}/artwork/${artworkId}/delete`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Das Artwork konnte nicht gelöscht werden.");
  }
}

/*
 * --------------------------------------------------------------------------
 * Gelöschte Artworks laden
 * --------------------------------------------------------------------------
 */

export async function getDeletedArtworks(
  languageCode: "de" | "en"
): Promise<ArtworkResponse[]> {
  const response = await fetch(`${API_URL}/artwork/deleted/${languageCode}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die gelöschten Artworks konnten nicht geladen werden."
    );
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Artwork wiederherstellen
 * --------------------------------------------------------------------------
 */

export async function restoreArtwork(artworkId: string): Promise<void> {
  const response = await fetch(`${API_URL}/artwork/${artworkId}/restore`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Das Artwork konnte nicht wiederhergestellt werden."
    );
  }
}
