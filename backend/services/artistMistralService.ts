import { Mistral } from "@mistralai/mistralai";

export type ArtistLanguage = "de" | "en";

export interface ArtistTranslationInput {
  sourceLanguage: ArtistLanguage;
  firstName: string;
  lastName: string;
  country?: string | null;
  description?: string | null;
}

export interface ArtistTranslationContent {
  firstName: string;
  lastName: string;
  country: string | null;
  description: string | null;
}

export interface ArtistTranslationAIResult {
  sourceLanguage: ArtistLanguage;
  corrected: ArtistTranslationContent;
  translation: ArtistTranslationContent;
  targetLanguage: ArtistLanguage;
}

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const SYSTEM_PROMPT = `
Du bist ein professioneller Redakteur und Übersetzer für eine
internationale Galerie- und Ausstellungsplattform.

Die Ausgangssprache wird vom System ausdrücklich vorgegeben.

WICHTIG:
Die vom System vorgegebene sourceLanguage ist IMMER maßgeblich.

Wenn sourceLanguage = "de":
- Die Eingaben sind als deutsche Inhalte zu behandeln.
- targetLanguage MUSS "en" sein.

Wenn sourceLanguage = "en":
- Die Eingaben sind als englische Inhalte zu behandeln.
- targetLanguage MUSS "de" sein.

Die Sprache einzelner Wörter oder Felder darf NICHT dazu führen,
dass die sourceLanguage geändert wird.

Beispiel:

sourceLanguage = "de"
country = "Germany"

Dann ist "Germany" Bestandteil des deutschen Formularinhalts.
Die sourceLanguage bleibt trotzdem "de".

AUFGABE:

1. Korrigiere Rechtschreibung und Grammatik in der vorgegebenen
   Ausgangssprache.

2. Verändere dabei keine Informationen und keine Fakten.

3. Erstelle anschließend eine professionelle Übersetzung der
   korrigierten Inhalte in die vorgegebene targetLanguage.

4. Erfinde keine Informationen.

5. Entferne keine Informationen.

6. Verändere keine Fakten.

7. Namen von Galerien niemals verändern.

8. Ortsnamen nicht unnötig verändern.

9. URLs niemals verändern.

10. Keine zusätzlichen Erklärungen hinzufügen.

11. Keine Markdown-Formatierung verwenden.

12. Wenn ein Eingabefeld null ist, muss dieses Feld sowohl in
    corrected als auch in translation null sein.

13. firstName und lastName müssen immer vorhanden sein.

14. Übersetze Eigennamen nicht unnötig.

15. Verwende etablierte deutsche bzw. englische Namensvarianten,
    wenn eine solche Variante tatsächlich existiert.

16. Wenn ein Wert bereits in der Zielsprache korrekt und natürlich
    ist, darf er unverändert bleiben.

KÜNSTLERNAMEN:

Bei Künstlernamen können Deutsch und Englisch unterschiedliche
etablierte Schreibweisen verwenden.

Beispiele:

Deutsch:
Pjotr Iljitsch Tschaikowski

Englisch:
Pyotr Ilyich Tchaikovsky

Deutsch:
Nikolai Rimski-Korsakow

Englisch:
Nikolai Rimsky-Korsakov

Deutsch:
Wassily Kandinsky

Englisch:
Wassily Kandinsky

Deutsch:
Iwan Aiwasowski

Englisch:
Ivan Aivazovsky

Deutsch:
Ilja Repin

Englisch:
Ilya Repin

Wenn eine etablierte sprachabhängige Schreibweise existiert,
verwende diese.

Künstlernamen niemals frei erfinden oder phonetisch verändern.

Wenn keine etablierte sprachabhängige Variante bekannt ist,
behalte den Namen unverändert.

LÄNDER:

Länderbezeichnungen dürfen in der Zielsprache übersetzt werden,
wenn eine etablierte Übersetzung existiert.

Beispiel:

Deutsch:
Deutschland

Englisch:
Germany

Beispiel:

Deutsch:
Vereinigtes Königreich

Englisch:
United Kingdom

AUSGABE:

Die Antwort MUSS exakt folgende JSON-Struktur besitzen:

{
  "sourceLanguage": "de",
  "targetLanguage": "en",
  "corrected": {
    "firstName": "korrigierter Vorname",
    "lastName": "korrigierter Nachname",
    "country": null,
    "description": null
  },
  "translation": {
    "firstName": "übersetzter Vorname",
    "lastName": "übersetzter Nachname",
    "country": null,
    "description": null
  }
}

REGELN FÜR DIE JSON-ANTWORT:

- sourceLanguage darf ausschließlich "de" oder "en" sein.
- targetLanguage darf ausschließlich "de" oder "en" sein.
- sourceLanguage muss exakt der vorgegebenen sourceLanguage entsprechen.
- targetLanguage muss die jeweils andere Sprache sein.
- sourceLanguage "de" bedeutet targetLanguage "en".
- sourceLanguage "en" bedeutet targetLanguage "de".
- corrected enthält ausschließlich die korrigierte Ausgangssprache.
- translation enthält ausschließlich die Übersetzung von corrected.
- corrected muss firstName, lastName, country und description enthalten.
- translation muss firstName, lastName, country und description enthalten.
- country und description müssen null sein, wenn sie null waren.
- Keine zusätzlichen JSON-Felder hinzufügen.
- Keine Kommentare hinzufügen.
- Kein Markdown verwenden.

Gib ausschließlich gültiges JSON zurück.
`;

export async function processArtistTranslation(
  input: ArtistTranslationInput
): Promise<ArtistTranslationAIResult> {
  const targetLanguage: ArtistLanguage =
    input.sourceLanguage === "de" ? "en" : "de";

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
          sourceLanguage: input.sourceLanguage,
          targetLanguage,

          firstName: input.firstName,
          lastName: input.lastName,
          country: input.country ?? null,
          description: input.description ?? null,
        }),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Ungültige Antwort vom Mistral-Modell.");
  }

  let result: unknown;

  try {
    result = JSON.parse(content);
  } catch {
    throw new Error("Die Antwort vom Mistral-Modell ist kein gültiges JSON.");
  }

  validateAIResult(result, input.sourceLanguage);

  return result;
}

function validateAIResult(
  result: unknown,
  expectedSourceLanguage: ArtistLanguage
): asserts result is ArtistTranslationAIResult {
  if (!result || typeof result !== "object") {
    throw new Error("Ungültige Antwort vom Mistral-Modell.");
  }

  const data = result as Record<string, unknown>;

  /*
   * ---------------------------------------------------------------
   * sourceLanguage
   * ---------------------------------------------------------------
   */

  if (data.sourceLanguage !== "de" && data.sourceLanguage !== "en") {
    throw new Error(
      "Das Mistral-Modell hat einen ungültigen sourceLanguage-Code zurückgegeben."
    );
  }

  if (data.sourceLanguage !== expectedSourceLanguage) {
    throw new Error(
      `Das Mistral-Modell hat "${data.sourceLanguage}" als sourceLanguage zurückgegeben. Erwartet wurde "${expectedSourceLanguage}".`
    );
  }

  /*
   * ---------------------------------------------------------------
   * targetLanguage
   * ---------------------------------------------------------------
   */

  const expectedTargetLanguage: ArtistLanguage =
    expectedSourceLanguage === "de" ? "en" : "de";

  if (data.targetLanguage !== "de" && data.targetLanguage !== "en") {
    throw new Error(
      "Das Mistral-Modell hat einen ungültigen targetLanguage-Code zurückgegeben."
    );
  }

  if (data.targetLanguage !== expectedTargetLanguage) {
    throw new Error(
      `Das Mistral-Modell hat "${data.targetLanguage}" als targetLanguage zurückgegeben. Erwartet wurde "${expectedTargetLanguage}".`
    );
  }

  /*
   * ---------------------------------------------------------------
   * sourceLanguage !== targetLanguage
   * ---------------------------------------------------------------
   */

  if (data.sourceLanguage === data.targetLanguage) {
    throw new Error(
      "sourceLanguage und targetLanguage dürfen nicht identisch sein."
    );
  }

  /*
   * ---------------------------------------------------------------
   * corrected
   * ---------------------------------------------------------------
   */

  validateTranslationContent(data.corrected, "corrected");

  /*
   * ---------------------------------------------------------------
   * translation
   * ---------------------------------------------------------------
   */

  validateTranslationContent(data.translation, "translation");
}

function validateTranslationContent(
  value: unknown,
  fieldName: string
): asserts value is ArtistTranslationContent {
  if (!value || typeof value !== "object") {
    throw new Error(
      `Das Feld "${fieldName}" der Mistral-Antwort ist ungültig.`
    );
  }

  const data = value as Record<string, unknown>;

  /*
   * firstName
   */

  if (typeof data.firstName !== "string") {
    throw new Error(
      `Das Feld "${fieldName}.firstName" der Mistral-Antwort ist ungültig.`
    );
  }

  /*
   * lastName
   */

  if (typeof data.lastName !== "string") {
    throw new Error(
      `Das Feld "${fieldName}.lastName" der Mistral-Antwort ist ungültig.`
    );
  }

  /*
   * country
   */

  if (data.country !== null && typeof data.country !== "string") {
    throw new Error(
      `Das Feld "${fieldName}.country" der Mistral-Antwort ist ungültig.`
    );
  }

  /*
   * description
   */

  if (data.description !== null && typeof data.description !== "string") {
    throw new Error(
      `Das Feld "${fieldName}.description" der Mistral-Antwort ist ungültig.`
    );
  }
}
