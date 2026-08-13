import { useTranslation } from "react-i18next";
import type { ArtworkFormData } from "../components/ArtworkForm";

export type ArtworkFormErrors = Partial<Record<keyof ArtworkFormData, string>>;

export function useArtworkValidation() {
  const { t } = useTranslation("validation");

  function validateArtworkForm(formData: ArtworkFormData): ArtworkFormErrors {
    const errors: ArtworkFormErrors = {};

    // Title
    if (!formData.title.trim()) {
      errors.title = t("title.required");
    }

    // Year
    if (!formData.year.trim()) {
      errors.year = t("year.required");
    } else if (!/^\d+$/.test(formData.year.trim())) {
      errors.year = t("year.numbersOnly");
    } else {
      const year = Number(formData.year);

      if (!Number.isInteger(year)) {
        errors.year = t("year.wholeNumber");
      } else if (year < 0 || year > new Date().getFullYear()) {
        errors.year = t("year.invalid");
      }
    }

    // Country
    if (!formData.country.trim()) {
      errors.country = t("country.required");
    }

    // Origin
    if (!formData.origin.trim()) {
      errors.origin = t("origin.required");
    }

    // Material
    if (!formData.material.trim()) {
      errors.material = t("material.required");
    }

    // Dimensions
    if (!formData.dimensions.trim()) {
      errors.dimensions = t("dimensions.required");
    }

    // Description
    if (!formData.description.trim()) {
      errors.description = t("description.required");
    }

    /*
     * ARTISTS
     *
     * Currently optional while we are testing the frontend.
     *
     * Later, when the database functionality is implemented,
     * this field MUST be required.
     *
     * Then uncomment:
     *
     * if (formData.artists.length === 0) {
     *   errors.artists = t("validation.artists.required");
     * }
     */

    /*
     * IMAGE
     *
     * Currently optional while we are testing the frontend.
     *
     * Later, when the database/image functionality is implemented,
     * an image MUST be required.
     */

    return errors;
  }

  return { validateArtworkForm };
}
