import { Mistral } from "@mistralai/mistralai";

export type ArtworkLanguage = "de" | "en";

export interface ArtworkTranslationInput {
  sourceLanguage: ArtworkLanguage;
  title: string;
  subtitle?: string | null;
  country?: string | null;
  origin?: string | null;
  material?: string | null;
  description?: string | null;
}

export interface ArtworkTranslationContent {
  title: string;
  subtitle: string | null;
  country: string | null;
  origin: string | null;
  material: string | null;
  description: string | null;
}

export interface ArtworkTranslationAIResult {
  sourceLanguage: ArtworkLanguage;
  corrected: ArtworkTranslationContent;
  translation: ArtworkTranslationContent;
  targetLanguage: ArtworkLanguage;
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

13. title muss immer vorhanden sein.

14. Übersetze Eigennamen nicht unnötig.

15. Verwende etablierte deutsche bzw. englische Namensvarianten,
    wenn eine solche Variante tatsächlich existiert.

16. Wenn ein Wert bereits in der Zielsprache korrekt und natürlich
    ist, darf er unverändert bleiben.

17. Kunsttitel dürfen nicht frei interpretiert oder kreativ
    umformuliert werden.

18. Materialbezeichnungen dürfen fachlich korrekt übersetzt werden,
    dürfen aber keine zusätzlichen Materialien enthalten.

19. Technische oder kunsthistorische Begriffe sollen fachlich
    korrekt und natürlich übersetzt werden.

20. Bei dimensionsbezogenen Angaben dürfen Zahlen, Maßeinheiten
    und vorhandene Formatierungen nicht verändert werden.

21. Jahreszahlen dürfen nicht verändert werden.

22. Wenn ein Feld bereits korrekt und natürlich in der
    Ausgangssprache formuliert ist, ändere es nicht unnötig.

23. country darf in die Zielsprache übersetzt werden, wenn eine
    etablierte Länderbezeichnung existiert.

24. origin darf übersetzt werden, wenn es sich um eine normale
    sprachliche Angabe handelt. Ortsnamen selbst dürfen dabei nicht
    unnötig verändert werden.

25. Materialbezeichnungen sollen in der Zielsprache mit den
    üblichen kunstbezogenen Fachbegriffen wiedergegeben werden.

AUSGABE:

Die Antwort MUSS exakt folgende JSON-Struktur besitzen:

{
  "sourceLanguage": "de",
  "targetLanguage": "en",
  "corrected": {
    "title": "korrigierter Titel",
    "subtitle": null,
    "country": null,
    "origin": null,
    "material": null,
    "description": null
  },
  "translation": {
    "title": "übersetzter Titel",
    "subtitle": null,
    "country": null,
    "origin": null,
    "material": null,
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
- corrected muss title, subtitle, country, origin, material und
  description enthalten.
- translation muss title, subtitle, country, origin, material und
  description enthalten.
- title muss immer ein String sein.
- subtitle, country, origin, material und description müssen null
  sein, wenn sie null waren.
- Keine zusätzlichen JSON-Felder hinzufügen.
- Keine Kommentare hinzufügen.
- Kein Markdown verwenden.

Gib ausschließlich gültiges JSON zurück.
`;

export async function processArtworkTranslation(
  input: ArtworkTranslationInput
): Promise<ArtworkTranslationAIResult> {
  const targetLanguage: ArtworkLanguage =
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

          title: input.title,
          subtitle: input.subtitle ?? null,
          country: input.country ?? null,
          origin: input.origin ?? null,
          material: input.material ?? null,
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
  expectedSourceLanguage: ArtworkLanguage
): asserts result is ArtworkTranslationAIResult {
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

  const expectedTargetLanguage: ArtworkLanguage =
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

  validateArtworkTranslationContent(data.corrected, "corrected");

  /*
   * ---------------------------------------------------------------
   * translation
   * ---------------------------------------------------------------
   */

  validateArtworkTranslationContent(data.translation, "translation");
}

function validateArtworkTranslationContent(
  value: unknown,
  fieldName: string
): asserts value is ArtworkTranslationContent {
  if (!value || typeof value !== "object") {
    throw new Error(
      `Das Feld "${fieldName}" der Mistral-Antwort ist ungültig.`
    );
  }

  const data = value as Record<string, unknown>;

  /*
   * title
   */

  if (typeof data.title !== "string") {
    throw new Error(
      `Das Feld "${fieldName}.title" der Mistral-Antwort ist ungültig.`
    );
  }

  /*
   * subtitle
   */

  if (data.subtitle !== null && typeof data.subtitle !== "string") {
    throw new Error(
      `Das Feld "${fieldName}.subtitle" der Mistral-Antwort ist ungültig.`
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
   * origin
   */

  if (data.origin !== null && typeof data.origin !== "string") {
    throw new Error(
      `Das Feld "${fieldName}.origin" der Mistral-Antwort ist ungültig.`
    );
  }

  /*
   * material
   */

  if (data.material !== null && typeof data.material !== "string") {
    throw new Error(
      `Das Feld "${fieldName}.material" der Mistral-Antwort ist ungültig.`
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
