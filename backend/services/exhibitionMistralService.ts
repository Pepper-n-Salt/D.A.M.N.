import { Mistral } from "@mistralai/mistralai";

/*
  Dieser Service enthält ausschließlich die Kommunikation mit Mistral.

  Wichtig:
  - Hier wird NICHT in die Datenbank geschrieben.
  - Der Controller entscheidet, wann Daten gespeichert werden.
  - Der Mistral API-Key bleibt ausschließlich im Backend.
*/

export type ExhibitionLanguage = "de" | "en";

export interface ExhibitionTranslationInput {
  title: string;
  subtitle?: string | null;
  location?: string | null;
  description?: string | null;
}

/*
  Das Ergebnis der Mistral-Prüfung.

  "corrected" enthält die von Mistral korrigierte Version
  der Ausgangssprache.

  Die "translation" wird beim normalen Prüf-Aufruf zunächst
  ebenfalls geliefert, damit wir sie später für den Translate-
  Flow verwenden können.
*/

export interface ExhibitionTranslationContent {
  title: string;
  subtitle: string | null;
  location: string | null;
  description: string | null;
}

export interface ExhibitionTranslationAIResult {
  sourceLanguage: ExhibitionLanguage;
  corrected: ExhibitionTranslationContent;
  translation: ExhibitionTranslationContent;
  targetLanguage: ExhibitionLanguage;
}

/*
  Mistral Client

  Der API-Key kommt aus deiner .env:

  MISTRAL_API_KEY=...
*/

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

/*
  Dein bisheriger Prompt bleibt hier bewusst weitgehend erhalten.

  Die Events habe ich entfernt, weil du sie momentan nicht
  verwenden möchtest.
*/

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

Die Antwort MUSS exakt folgende JSON-Struktur haben:

{
  "sourceLanguage": "de",
  "targetLanguage": "en",
  "corrected": {
    "title": "korrigierter Titel",
    "subtitle": null,
    "location": null,
    "description": null
  },
  "translation": {
    "title": "übersetzter Titel",
    "subtitle": null,
    "location": null,
    "description": null
  }
}

Dabei gilt:

- "sourceLanguage" darf ausschließlich "de" oder "en" sein.
- "targetLanguage" darf ausschließlich "de" oder "en" sein.
- Wenn sourceLanguage "de" ist, muss targetLanguage "en" sein.
- Wenn sourceLanguage "en" ist, muss targetLanguage "de" sein.
- Die Werte dürfen nicht "German", "English", "german" oder "english" lauten.
- Verwende ausschließlich die Codes "de" und "en".
- "corrected" enthält die korrigierte Version der erkannten Ausgangssprache.
- "translation" enthält die Übersetzung von "corrected" in die jeweils andere Sprache.
- Alle vier Felder in "corrected" und "translation" müssen vorhanden sein.
- subtitle, location und description müssen null bleiben, wenn sie im Input null sind.


Gib ausschließlich gültiges JSON zurück.
`;

/*
  --------------------------------------------------------------------------
  processExhibitionTranslation
  --------------------------------------------------------------------------

  Diese Funktion macht die eigentliche Mistral-Verarbeitung.

  Sie:
  1. erkennt Deutsch/Englisch
  2. korrigiert die Ausgangssprache
  3. übersetzt die korrigierte Version
  4. liefert beides zurück

  Es wird NICHT gespeichert.
*/

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
        }),
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  console.log("Mistral raw response:");
  console.log(content);

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

/*
  --------------------------------------------------------------------------
  Validierung der Mistral-Antwort
  --------------------------------------------------------------------------

  Auch wenn Mistral JSON zurückgeben soll, prüfen wir die Antwort
  zusätzlich selbst.

  Damit landet kein unerwartetes Objekt aus der AI direkt im
  weiteren Backend-Code.
*/

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

  const nullableStringFields = ["subtitle", "location", "description"];

  for (const field of nullableStringFields) {
    if (data[field] !== null && typeof data[field] !== "string") {
      throw new Error(`${fieldName}.${field} must be a string or null.`);
    }
  }
}
