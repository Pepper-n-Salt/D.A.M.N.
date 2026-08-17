import { useTranslation } from "react-i18next";
import type { ArtistFormData } from "../components/ArtistForm";

export type ArtistFormErrors = Partial<Record<keyof ArtistFormData, string>>;

export function useArtistValidation() {
  const { t } = useTranslation("validation");

  function validateArtistForm(formData: ArtistFormData): ArtistFormErrors {
    const errors: ArtistFormErrors = {};

    // First name
    if (!formData.firstName.trim()) {
      errors.firstName = t("firstName.required");
    }

    // Last name
    if (!formData.lastName.trim()) {
      errors.lastName = t("lastName.required");
    }

    // Country
    if (!formData.country.trim()) {
      errors.country = t("country.required");
    }

    // Date of birth
    if (formData.dateOfBirth) {
      const dateOfBirth = new Date(formData.dateOfBirth);
      const today = new Date();

      if (dateOfBirth > today) {
        errors.dateOfBirth = t("dateOfBirth.future");
      }
    }

    // Date of death
    if (formData.dateOfDeath) {
      const dateOfDeath = new Date(formData.dateOfDeath);
      const today = new Date();

      if (dateOfDeath > today) {
        errors.dateOfDeath = t("dateOfDeath.future");
      }
    }

    // Death date must not be before birth date
    if (formData.dateOfBirth && formData.dateOfDeath) {
      const dateOfBirth = new Date(formData.dateOfBirth);
      const dateOfDeath = new Date(formData.dateOfDeath);

      if (dateOfDeath < dateOfBirth) {
        errors.dateOfDeath = t("dateOfDeath.beforeBirth");
      }
    }

    return errors;
  }

  return { validateArtistForm };
}
