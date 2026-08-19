import type { ExhibitionFormData } from "../components/ExhibitionForm";

const API_URL = `${import.meta.env.VITE_API_URL || ""}`;

export type CreateExhibitionResponse = {
  id: string;
  coverImageId: string | null;
  fileUrl: string | null;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdByName?: string | null;
  lastEditedBy: string;
  isArchived: boolean;
  isDeleted: boolean;
  backgroundColor?: string | null;

  languageCode: string;
  title: string;
  subtitle: string | null;
  location: string | null;
  description: string | null;
  isScreen: boolean;
};

const languageToCode = (language: "german" | "english") => {
  return language === "german" ? "de" : "en";
};

/*
 * --------------------------------------------------------------------------
 * Exhibition erstellen
 * --------------------------------------------------------------------------
 */

export async function createExhibition(
  formData: ExhibitionFormData,
  language: "german" | "english",
  imageId: string | null
): Promise<CreateExhibitionResponse> {
  const response = await fetch(`${API_URL}/exhibition`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coverImageId: imageId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      languageCode: languageToCode(language),
      title: formData.title,
      subtitle: formData.subtitle || null,
      location: formData.location || null,
      description: formData.description || null,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Exhibition konnte nicht gespeichert werden."
    );
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Alle Exhibitions laden
 * --------------------------------------------------------------------------
 */

export async function getExhibitions(
  languageCode: "de" | "en"
): Promise<CreateExhibitionResponse[]> {
  const response = await fetch(`${API_URL}/exhibition/${languageCode}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Exhibitions konnten nicht geladen werden."
    );
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Eine Exhibition laden
 * --------------------------------------------------------------------------
 */

export async function getExhibition(
  exhibitionId: string,
  language: "german" | "english"
): Promise<CreateExhibitionResponse> {
  const languageCode = languageToCode(language);

  const response = await fetch(
    `${API_URL}/exhibition/${exhibitionId}/${languageCode}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Die Exhibition konnte nicht geladen werden.");
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Bestehende Exhibition aktualisieren
 * --------------------------------------------------------------------------
 */

export async function updateExhibition(
  exhibitionId: string,
  language: "german" | "english",
  formData: ExhibitionFormData,
  imageId: string | null
): Promise<CreateExhibitionResponse> {
  const languageCode = languageToCode(language);

  const response = await fetch(
    `${API_URL}/exhibition/${exhibitionId}/${languageCode}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coverImageId: imageId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        title: formData.title,
        subtitle: formData.subtitle || null,
        location: formData.location || null,
        description: formData.description || null,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Exhibition konnte nicht aktualisiert werden."
    );
  }

  return data;
}
export async function deleteExhibition(exhibitionId: string): Promise<void> {
  const response = await fetch(`${API_URL}/exhibition/${exhibitionId}/delete`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Exhibition konnte nicht gelöscht werden."
    );
  }
}
export async function getDeletedExhibitions(
  languageCode: "de" | "en"
): Promise<CreateExhibitionResponse[]> {
  const response = await fetch(
    `${API_URL}/exhibition/deleted/${languageCode}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die gelöschten Exhibitions konnten nicht geladen werden."
    );
  }

  return data;
}

export async function restoreExhibition(exhibitionId: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/exhibition/${exhibitionId}/restore`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Exhibition konnte nicht wiederhergestellt werden."
    );
  }
}
