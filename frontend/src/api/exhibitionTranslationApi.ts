import type { ExhibitionFormData } from "../components/ExhibitionForm";

const API_URL = "http://localhost:3000/api";

type Language = "german" | "english";

export type TranslationPreviewResponse = {
  exhibitionId: string;
  languageCode: "de" | "en";

  title: string;
  subtitle: string | null;
  location: string | null;
  description: string | null;

  alreadyExists: boolean;
  aiGenerated: boolean;
};

const languageToCode = (language: Language) => {
  return language === "german" ? "de" : "en";
};

export async function previewExhibitionTranslation(
  exhibitionId: string,
  targetLanguage: Language
): Promise<TranslationPreviewResponse> {
  const response = await fetch(
    `${API_URL}/exhibitiontranslation/${exhibitionId}/translations/preview`,
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

export async function createExhibitionTranslation(
  exhibitionId: string,
  formData: ExhibitionFormData,
  language: Language
) {
  const response = await fetch(
    `${API_URL}/exhibitiontranslation/${exhibitionId}/translations`,
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
        location: formData.location || null,
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
