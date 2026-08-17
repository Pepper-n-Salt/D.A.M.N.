import { useTranslation } from "react-i18next";
import type { ExhibitionFormData } from "../components/ExhibitionForm";

export type ExhibitionFormErrors = Partial<
  Record<keyof ExhibitionFormData, string>
>;

export function useExhibitionValidation() {
  const { t } = useTranslation("validation");

  function validateExhibitionForm(
    formData: ExhibitionFormData
  ): ExhibitionFormErrors {
    const errors: ExhibitionFormErrors = {};

    // Title
    if (!formData.title.trim()) {
      errors.title = t("title.required");
    }

    // Start date
    if (!formData.startDate.trim()) {
      errors.startDate = t("startDate.required");
    }

    // End date
    if (!formData.endDate.trim()) {
      errors.endDate = t("endDate.required");
    }

    // End date must not be before start date
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        errors.endDate = t("endDate.beforeStart");
      }
    }

    return errors;
  }

  return { validateExhibitionForm };
}
