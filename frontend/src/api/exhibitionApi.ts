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

// Eine Exhibition erstellen

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

// Alle Exhibition laden

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

// Eine Exhibition laden

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

export async function getPublicExhibition(
  exhibitionId: string,
  languageCode: "de" | "en"
): Promise<CreateExhibitionResponse> {
  const response = await fetch(
    `${API_URL}/exhibition/public/${exhibitionId}/${languageCode}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Die Exhibition konnte nicht geladen werden.");
  }

  return data;
}

// Bestehende Exhibtion akualisieren / editieren

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

// eine Exhibition löschen (nur soft delete)
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

// die soft gelöschten Exhibitions anzeigen
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

// gelöschte Exhibitions wiederherstellen
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

// eine Exhibition als Screen markieren
export async function setExhibitionScreen(
  exhibitionId: string,
  languageCode: "de" | "en"
): Promise<void> {
  const response = await fetch(
    `${API_URL}/exhibition/${exhibitionId}/${languageCode}/screen`,
    { method: "PATCH", credentials: "include" }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Exhibition konnte nicht als Screen markiert werden."
    );
  }
}

// eine Exhibition von Screens entfernen
export async function removeExhibitionScreen(
  exhibitionId: string,
  languageCode: "de" | "en"
): Promise<void> {
  const response = await fetch(
    `${API_URL}/exhibition/${exhibitionId}/${languageCode}/unscreen`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg || "Der Screen konnte nicht entfernt werden.");
  }
}
