import { Mistral } from "@mistralai/mistralai";
import type { Transaction } from "sequelize";
import ExhibitionTranslation from "../models/ExhibitionTranslation.js";

export type ExhibitionLanguage = "de" | "en";

export interface ExhibitionTranslationInput {
  title: string;
  subtitle?: string | null;
  location?: string | null;
  description?: string | null;
  openingEvent?: string | null;
  specialEvent?: string | null;
  closingEvent?: string | null;
}

export interface ExhibitionTranslationContent {
  title: string;
  subtitle: string | null;
  location: string | null;
  description: string | null;
  openingEvent: string | null;
  specialEvent: string | null;
  closingEvent: string | null;
}

export interface ExhibitionTranslationAIResult {
  sourceLanguage: ExhibitionLanguage;
  corrected: ExhibitionTranslationContent;
  translation: ExhibitionTranslationContent;
  targetLanguage: ExhibitionLanguage;
}

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const SYSTEM_PROMPT = `
Du bist ein professioneller Redakteur und Übersetzer für eine
internationale Galerie- und Ausstellungsplattform.

Du erhältst die sprachabhängigen Inhalte einer Ausstellung.

Deine Aufgaben:

1. Erkenne, ob der Inhalt auf Deutsch oder Englisch verfasst wurde.
2. Korrigiere Rechtschreibung und Grammatik.
3. Verändere dabei nicht den Inhalt oder die Fakten.
4. Übersetze anschließend die korrigierte Version in die jeweils andere Sprache.
5. Die Übersetzung soll professionell und natürlich für eine
internationale Kunst- und Galerieplattform klingen.

WICHTIGE REGELN:

- Erfinde keine Informationen.
- Entferne keine Informationen.
- Verändere keine Fakten.
- Künstlernamen niemals verändern.
- Namen von Galerien niemals verändern.
- Ortsnamen nicht unnötig verändern.
- URLs niemals verändern.
- Keine zusätzlichen Erklärungen hinzufügen.
- Keine Markdown-Formatierung verwenden.
- Wenn ein Feld null ist, muss es null bleiben.
- Titel dürfen natürlich übersetzt werden.
- Kunsthistorische und kuratorische Begriffe sollen professionell übersetzt werden.
- Die Sprache muss entweder "de" oder "en" sein.

Gib ausschließlich gültiges JSON zurück.
`;

export async function processExhibitionTranslation(
  input: ExhibitionTranslationInput
): Promise<ExhibitionTranslationAIResult> {
  const response = await mistral.chat.complete({
    model: "mistral-large-latest",
    temperature: 0.1,
    responseFormat: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify({
          title: input.title,
          subtitle: input.subtitle ?? null,
          location: input.location ?? null,
          description: input.description ?? null,
          openingEvent: input.openingEvent ?? null,
          specialEvent: input.specialEvent ?? null,
          closingEvent: input.closingEvent ?? null,
        }),
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Mistral returned an empty response.");
  }

  let result: unknown;

  try {
    result = JSON.parse(content);
  } catch {
    throw new Error("Mistral returned invalid JSON.");
  }

  validateAIResult(result);

  return result;
}

/**
 * Speichert die von Mistral korrigierte Ausgangssprache
 * und die Übersetzung in die andere Sprache.
 */
export async function saveExhibitionTranslations(
  exhibitionId: string,
  aiResult: ExhibitionTranslationAIResult,
  transaction: Transaction
) {
  const correctedTranslation = await ExhibitionTranslation.upsert(
    {
      exhibitionId,
      languageCode: aiResult.sourceLanguage,
      title: aiResult.corrected.title,
      subtitle: aiResult.corrected.subtitle,
      location: aiResult.corrected.location,
      description: aiResult.corrected.description,
      aiGenerated: true,
      isScreen: false,
    },
    {
      transaction,
    }
  );

  const translatedTranslation = await ExhibitionTranslation.upsert(
    {
      exhibitionId,
      languageCode: aiResult.targetLanguage,
      title: aiResult.translation.title,
      subtitle: aiResult.translation.subtitle,
      location: aiResult.translation.location,
      description: aiResult.translation.description,
      aiGenerated: true,
      isScreen: false,
    },
    {
      transaction,
    }
  );

  return {
    corrected: correctedTranslation,
    translation: translatedTranslation,
  };
}

function validateAIResult(
  result: unknown
): asserts result is ExhibitionTranslationAIResult {
  if (!result || typeof result !== "object") {
    throw new Error("Invalid Mistral response.");
  }

  const data = result as Record<string, unknown>;

  if (data.sourceLanguage !== "de" && data.sourceLanguage !== "en") {
    throw new Error("Invalid source language returned by Mistral.");
  }

  if (data.targetLanguage !== "de" && data.targetLanguage !== "en") {
    throw new Error("Invalid target language returned by Mistral.");
  }

  if (data.sourceLanguage === data.targetLanguage) {
    throw new Error("Source and target language must be different.");
  }

  validateTranslationContent(data.corrected, "corrected");
  validateTranslationContent(data.translation, "translation");
}

function validateTranslationContent(
  value: unknown,
  fieldName: string
): asserts value is ExhibitionTranslationContent {
  if (!value || typeof value !== "object") {
    throw new Error(`Invalid ${fieldName} content.`);
  }

  const data = value as Record<string, unknown>;

  if (typeof data.title !== "string") {
    throw new Error(`${fieldName}.title must be a string.`);
  }

  const nullableStringFields = [
    "subtitle",
    "location",
    "description",
    "openingEvent",
    "specialEvent",
    "closingEvent",
  ];

  for (const field of nullableStringFields) {
    if (data[field] !== null && typeof data[field] !== "string") {
      throw new Error(`${fieldName}.${field} must be a string or null.`);
    }
  }
}
