import type { ArtworkFormData } from "../components/ArtworkForm";

const API_URL = `${import.meta.env.VITE_API_URL || ""}`;

type Language = "german" | "english";

const languageToCode = (language: Language): "de" | "en" => {
  return language === "german" ? "de" : "en";
};

export type ArtworkTranslationPreviewResponse = {
  artworkId: string;

  languageCode: "de" | "en";

  title: string;
  subtitle: string | null;
  country: string | null;
  origin: string | null;
  material: string | null;
  description: string | null;

  alreadyExists?: boolean;
  aiGenerated?: boolean;
};

/*
 * --------------------------------------------------------------------------
 * KI-Übersetzung preview
 * --------------------------------------------------------------------------
 */

export async function previewArtworkTranslation(
  artworkId: string,
  targetLanguage: Language
): Promise<ArtworkTranslationPreviewResponse> {
  const response = await fetch(
    `${API_URL}/artworktranslation/${artworkId}/translations/preview`,
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

export async function createArtworkTranslation(
  artworkId: string,
  formData: ArtworkFormData,
  language: Language
) {
  const response = await fetch(
    `${API_URL}/artworktranslation/${artworkId}/translations`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        languageCode: languageToCode(language),

        title: formData.title,
        subtitle: formData.subtitle || null,
        country: formData.country || null,
        origin: formData.origin || null,
        material: formData.material || null,
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

/*
 * --------------------------------------------------------------------------
 * Translation aktualisieren
 * --------------------------------------------------------------------------
 */

export async function updateArtworkTranslation(
  artworkId: string,
  language: Language,
  formData: ArtworkFormData
) {
  const languageCode = languageToCode(language);

  const response = await fetch(
    `${API_URL}/artworktranslation/${artworkId}/translations/${languageCode}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        subtitle: formData.subtitle || null,
        country: formData.country || null,
        origin: formData.origin || null,
        material: formData.material || null,
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
