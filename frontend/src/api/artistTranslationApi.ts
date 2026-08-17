import type { ArtistFormData } from "../components/ArtistForm";

const API_URL = `${import.meta.env.VITE_API_URL || ""}`;

type Language = "german" | "english";

const languageToCode = (language: Language): "de" | "en" => {
  return language === "german" ? "de" : "en";
};

export type ArtistTranslationPreviewResponse = {
  artistId: string;

  languageCode: "de" | "en";

  firstName: string;
  lastName: string;

  country: string | null;
  description: string | null;

  alreadyExists: boolean;
  aiGenerated: boolean;
};

/*
 * --------------------------------------------------------------------------
 * Translation aktualisieren
 * --------------------------------------------------------------------------
 */

export async function updateArtistTranslation(
  artistId: string,
  language: Language,
  formData: ArtistFormData
) {
  const languageCode = languageToCode(language);

  const response = await fetch(
    `${API_URL}/artisttranslation/${artistId}/translations/${languageCode}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country || null,
        description: formData.description || null,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Übersetzung konnte nicht aktualisiert werden."
    );
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * KI-Übersetzung preview
 * --------------------------------------------------------------------------
 */

export async function previewArtistTranslation(
  artistId: string,
  targetLanguage: Language
): Promise<ArtistTranslationPreviewResponse> {
  const response = await fetch(
    `${API_URL}/artisttranslation/${artistId}/translations/preview`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetLanguage: languageToCode(targetLanguage),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Übersetzung konnte nicht erstellt werden."
    );
  }

  return data;
}

/*
 * --------------------------------------------------------------------------
 * Neue Translation erstellen
 * --------------------------------------------------------------------------
 */

export async function createArtistTranslation(
  artistId: string,
  formData: ArtistFormData,
  language: Language
) {
  const response = await fetch(
    `${API_URL}/artisttranslation/${artistId}/translations`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        languageCode: languageToCode(language),

        firstName: formData.firstName,
        lastName: formData.lastName,

        country: formData.country || null,
        description: formData.description || null,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || "Die Übersetzung konnte nicht gespeichert werden."
    );
  }

  return data;
}
