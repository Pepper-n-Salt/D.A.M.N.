import type { ExhibitionFormData } from "../components/ExhibitionForm";

const API_URL = "http://localhost:3000/api";

export type CreateExhibitionResponse = {
  id: string;
  coverImageId: string | null;
  startDate: string;
  endDate: string;
  createdBy: string;
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

export async function createExhibition(
  formData: ExhibitionFormData,
  language: "german" | "english"
): Promise<CreateExhibitionResponse> {
  const response = await fetch(`${API_URL}/exhibition`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coverImageId: null,
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
