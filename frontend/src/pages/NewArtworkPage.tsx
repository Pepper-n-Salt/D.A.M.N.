import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import H1 from "../components/ui/typography/H1";
import P from "../components/ui/typography/P";

import ArtworkForm, {
  type ArtworkFormData,
  type Artist,
  type Language,
} from "../components/ArtworkForm";

import { createArtwork, getArtwork, updateArtwork } from "../api/artworkApi";

import {
  previewArtworkTranslation,
  createArtworkTranslation,
  updateArtworkTranslation,
} from "../api/artworkTranslationApi";

import { getArtists } from "../api/artistApi";

const createEmptyFormData = (): ArtworkFormData => ({
  title: "",
  subtitle: "",
  artists: [],
  year: "",
  country: "",
  origin: "",
  material: "",
  dimensions: "",
  description: "",
  image: null,
  imageId: "",
});

export default function NewArtworkPage() {
  const { t } = useTranslation("newArtwork");

  const { id } = useParams<{ id: string }>();

  const isEditMode = !!id;

  const [language, setLanguage] = useState<Language>("german");

  const [artworkId, setArtworkId] = useState<string | null>(null);

  const [artworkSaved, setArtworkSaved] = useState(false);

  const [translationLanguage, setTranslationLanguage] =
    useState<Language | null>(null);

  const [translationSaved, setTranslationSaved] = useState(false);

  const [formData, setFormData] = useState<ArtworkFormData>(
    createEmptyFormData()
  );

  const [translationFormData, setTranslationFormData] =
    useState<ArtworkFormData>(createEmptyFormData());

  const [artists, setArtists] = useState<Artist[]>([]);

  const [translationArtists, setTranslationArtists] = useState<Artist[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const [isTranslating, setIsTranslating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  /*
   * ------------------------------------------------------------------------
   * Artists laden
   * ------------------------------------------------------------------------
   *
   * getArtists() ruft das Backend auf.
   *
   * Die Backend-Logik muss dort anhand des eingeloggten Users entscheiden:
   *
   * - normaler User/Admin -> Artists seiner organisationId
   * - super -> alle Artists
   *
   * Die Organisation wird NICHT im Frontend gefiltert.
   */

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const languageCode = language === "german" ? "de" : "en";

        const result = await getArtists(languageCode);

        setArtists(result as Artist[]);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die Artists konnten nicht geladen werden."
        );
      }
    };

    loadArtists();
  }, [language]);

  /*
   * ------------------------------------------------------------------------
   * Artists für Übersetzung laden
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!translationLanguage) {
      setTranslationArtists([]);
      return;
    }

    const loadTranslationArtists = async () => {
      try {
        const languageCode = translationLanguage === "german" ? "de" : "en";

        const result = await getArtists(languageCode);

        setTranslationArtists(result as Artist[]);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Die Artists konnten nicht geladen werden."
        );
      }
    };

    loadTranslationArtists();
  }, [translationLanguage]);

  /*
   * ------------------------------------------------------------------------
   * Bestehendes Artwork laden
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!id) return;

    const loadArtwork = async () => {
      try {
        setError(null);

        let germanResult = null;
        let englishResult = null;

        try {
          germanResult = await getArtwork(id, "german");
        } catch {
          console.log("Keine deutsche Translation gefunden.");
        }

        try {
          englishResult = await getArtwork(id, "english");
        } catch {
          console.log("Keine englische Translation gefunden.");
        }

        if (!germanResult && !englishResult) {
          throw new Error(
            "Das Artwork oder seine Übersetzungen konnten nicht geladen werden."
          );
        }

        setArtworkId(id);

        /*
         * Nur Deutsch vorhanden
         */

        if (germanResult && !englishResult) {
          setLanguage("german");

          setFormData({
            title: germanResult.title,
            subtitle: germanResult.subtitle ?? "",
            artists: germanResult.artists?.map((artist) => artist.id) ?? [],
            year: germanResult.year?.toString() ?? "",
            country: germanResult.country ?? "",
            origin: germanResult.origin ?? "",
            material: germanResult.material ?? "",
            dimensions: germanResult.dimensions ?? "",
            description: germanResult.description ?? "",
            image: null,
            imageId: germanResult.imageId ?? "",
          });

          setImageUrl(germanResult.fileUrl ?? null);

          setTranslationLanguage(null);
          setTranslationSaved(false);
        }

        /*
         * Nur Englisch vorhanden
         */

        if (!germanResult && englishResult) {
          setLanguage("english");

          setFormData({
            title: englishResult.title,
            subtitle: englishResult.subtitle ?? "",
            artists: englishResult.artists?.map((artist) => artist.id) ?? [],
            year: englishResult.year?.toString() ?? "",
            country: englishResult.country ?? "",
            origin: englishResult.origin ?? "",
            material: englishResult.material ?? "",
            dimensions: englishResult.dimensions ?? "",
            description: englishResult.description ?? "",
            image: null,
            imageId: englishResult.imageId ?? "",
          });

          setImageUrl(englishResult.fileUrl ?? null);

          setTranslationLanguage(null);
          setTranslationSaved(false);
        }

        /*
         * Deutsch + Englisch vorhanden
         */

        if (germanResult && englishResult) {
          setLanguage("german");

          setFormData({
            title: germanResult.title,
            subtitle: germanResult.subtitle ?? "",
            artists: germanResult.artists?.map((artist) => artist.id) ?? [],
            year: germanResult.year?.toString() ?? "",
            country: germanResult.country ?? "",
            origin: germanResult.origin ?? "",
            material: germanResult.material ?? "",
            dimensions: germanResult.dimensions ?? "",
            description: germanResult.description ?? "",
            image: null,
            imageId: germanResult.imageId ?? "",
          });

          setImageUrl(germanResult.fileUrl ?? null);

          setTranslationLanguage("english");

          setTranslationFormData({
            title: englishResult.title,
            subtitle: englishResult.subtitle ?? "",
            artists: englishResult.artists?.map((artist) => artist.id) ?? [],
            year: englishResult.year?.toString() ?? "",
            country: englishResult.country ?? "",
            origin: englishResult.origin ?? "",
            material: englishResult.material ?? "",
            dimensions: englishResult.dimensions ?? "",
            description: englishResult.description ?? "",
            image: null,
            imageId: englishResult.imageId ?? "",
          });

          setTranslationSaved(true);
        }

        setArtworkSaved(true);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Das Artwork konnte nicht geladen werden."
        );
      }
    };

    loadArtwork();
  }, [id]);

  /*
   * ------------------------------------------------------------------------
   * Artwork speichern / aktualisieren
   * ------------------------------------------------------------------------
   */

  const handleSave = async (
    imageId: string | null,
    newImageUrl: string | null
  ) => {
    if (isSaving) return;

    setImageUrl(newImageUrl);

    setError(null);
    setIsSaving(true);

    try {
      /*
       * NEUES Artwork
       */

      if (!isEditMode) {
        if (!imageId) {
          throw new Error("Für ein neues Artwork wird eine Image-ID benötigt.");
        }

        const toSend = { ...formData, imageId };

        const result = await createArtwork(toSend, language);

        setArtworkId(result.id);
        setArtworkSaved(true);

        console.log("Artwork gespeichert:", result);

        return;
      }

      /*
       * BESTEHENDES Artwork
       */

      if (!id) {
        throw new Error("Keine Artwork-ID vorhanden.");
      }

      const toSend = { ...formData, ...(imageId ? { imageId } : {}) };

      const result = await updateArtwork(id, language, toSend);

      setArtworkId(result.id);
      setArtworkSaved(true);

      console.log("Artwork aktualisiert:", result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Das Artwork konnte nicht gespeichert werden."
      );

      setArtworkSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      setImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreviewUrl(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImagePreviewUrl(null);

    setFormData((previous) => ({
      ...previous,
      image: null,
    }));
  };

  /*
   * ------------------------------------------------------------------------
   * Übersetzung von Mistral anfordern
   * ------------------------------------------------------------------------
   */

  const handleTranslate = async () => {
    if (!artworkId) {
      setError(
        "Das Artwork muss zuerst gespeichert werden, bevor es übersetzt werden kann."
      );

      return;
    }

    if (isTranslating) return;

    const newLanguage: Language = language === "german" ? "english" : "german";

    setError(null);
    setIsTranslating(true);

    try {
      const result = await previewArtworkTranslation(artworkId, newLanguage);

      setTranslationFormData({
        title: result.title,
        subtitle: result.subtitle ?? "",
        artists: formData.artists,
        year: formData.year,
        country: result.country ?? "",
        origin: result.origin ?? "",
        material: formData.material,
        dimensions: formData.dimensions,
        description: result.description ?? "",
        image: null,
        imageId: formData.imageId,
      });

      setTranslationLanguage(newLanguage);

      setTranslationSaved(result.alreadyExists === true);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Die Übersetzung konnte nicht erstellt werden."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  /*
   * ------------------------------------------------------------------------
   * Übersetzung speichern / aktualisieren
   * ------------------------------------------------------------------------
   */

  const handleSaveTranslation = async (
    _imageId?: string | null,
    _newImageUrl?: string | null
  ) => {
    if (!artworkId || !translationLanguage) {
      setError("Das Artwork muss zuerst gespeichert und übersetzt werden.");

      return;
    }

    if (isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      /*
       * Neue Translation
       */

      if (!translationSaved) {
        await createArtworkTranslation(
          artworkId,
          translationFormData,
          translationLanguage
        );

        setTranslationSaved(true);

        console.log("Übersetzung gespeichert.");

        return;
      }

      /*
       * Bestehende Translation
       */

      await updateArtworkTranslation(
        artworkId,
        translationLanguage,
        translationFormData
      );

      setTranslationSaved(true);

      console.log("Übersetzung aktualisiert.");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Die Übersetzung konnte nicht gespeichert werden."
      );

      setTranslationSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-10 py-8">
      <div className="space-y-8 border-b border-neutral-200 pt-12">
        <H1>{t("hero.title")}</H1>

        <P>{t("hero.paragraph")}</P>

        <br />
      </div>

      {error && (
        <div className="border border-red-600 p-4 text-red-600">{error}</div>
      )}

      <div
        className={`flex w-full gap-8 ${
          translationLanguage ? "flex-col lg:flex-row" : "flex-col"
        }`}
      >
        {/* ORIGINAL */}

        <div className="w-full">
          <ArtworkForm
            language={language}
            onLanguageChange={setLanguage}
            formData={formData}
            setFormData={setFormData}
            artists={artists}
            artworkSaved={artworkSaved}
            onSave={handleSave}
            imageUrl={imageUrl}
            imagePreviewUrl={imagePreviewUrl}
            onImageSelect={handleImageSelect}
            onRemoveImage={handleRemoveImage}
            onTranslate={handleTranslate}
            showTranslateButton={translationLanguage === null}
            languageDisabled={translationLanguage !== null}
            isSaving={isSaving}
            isTranslating={isTranslating}
          />

          {isSaving && !translationLanguage && (
            <p className="mt-4 text-sm uppercase tracking-[0.2em]">
              Speichern...
            </p>
          )}

          {isTranslating && (
            <p className="mt-4 text-sm uppercase tracking-[0.2em]">
              Übersetzung wird erstellt...
            </p>
          )}
        </div>

        {/* TRANSLATION */}

        {translationLanguage !== null && (
          <div className="w-full">
            <ArtworkForm
              language={translationLanguage}
              onLanguageChange={setTranslationLanguage}
              formData={translationFormData}
              setFormData={setTranslationFormData}
              artists={translationArtists}
              artworkSaved={translationSaved}
              onSave={handleSaveTranslation}
              showTranslateButton={false}
              languageDisabled={true}
              isSaving={isSaving}
              showImage={false}
            />

            {translationSaved && (
              <p className="mt-4 text-sm uppercase tracking-[0.2em]">
                Übersetzung gespeichert.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
