import { useTranslation } from "react-i18next";
import type { ArtworkFormData } from "../components/ArtworkForm";

export type ArtworkFormErrors = Partial<Record<keyof ArtworkFormData, string>>;

export function useArtworkValidation() {
  const { t } = useTranslation("validate");

  function validateArtworkForm(formData: ArtworkFormData): ArtworkFormErrors {
    const errors: ArtworkFormErrors = {};

    // Title
    if (!formData.title.trim()) {
      errors.title = t("validation.title.required");
    }

    // Year
    if (!formData.year.trim()) {
      errors.year = t("validation.year.required");
    } else if (!/^\d+$/.test(formData.year.trim())) {
      errors.year = t("validation.year.numbersOnly");
    } else {
      const year = Number(formData.year);

      if (!Number.isInteger(year)) {
        errors.year = t("validation.year.wholeNumber");
      } else if (year < 0 || year > new Date().getFullYear()) {
        errors.year = t("validation.year.invalid");
      }
    }

    // Country
    if (!formData.country.trim()) {
      errors.country = t("validation.country.required");
    }

    // Origin
    if (!formData.origin.trim()) {
      errors.origin = t("validation.origin.required");
    }

    // Material
    if (!formData.material.trim()) {
      errors.material = t("validation.material.required");
    }

    // Dimensions
    if (!formData.dimensions.trim()) {
      errors.dimensions = t("validation.dimensions.required");
    }

    // Description
    if (!formData.description.trim()) {
      errors.description = t("validation.description.required");
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
