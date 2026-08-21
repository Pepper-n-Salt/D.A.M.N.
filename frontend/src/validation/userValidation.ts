import { useTranslation } from "react-i18next";

export type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  role: string;
  organisationName: string;
};

export type UserFormErrors = Partial<Record<keyof UserFormData, string>>;

export function useUserValidation() {
  const { t } = useTranslation("validation");

  function validateUserForm(
    formData: UserFormData,
    requiresOrganisation = false
  ): UserFormErrors {
    const errors: UserFormErrors = {};

    // First name
    if (!formData.firstName.trim()) {
      errors.firstName = t("firstName.required");
    } else if (formData.firstName.trim().length > 255) {
      errors.firstName = t("firstName.maxLength");
    }

    // Last name
    if (!formData.lastName.trim()) {
      errors.lastName = t("lastName.required");
    } else if (formData.lastName.trim().length > 255) {
      errors.lastName = t("lastName.maxLength");
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = t("email.required");
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email.trim())) {
        errors.email = t("email.invalid");
      }
    }

    // Password
    if (!formData.password) {
      errors.password = t("password.required");
    } else if (formData.password.length < 8) {
      errors.password = t("password.minLength");
    }

    // Repeat password
    if (!formData.repeatPassword) {
      errors.repeatPassword = t("repeatPassword.required");
    } else if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword = t("passwordMismatch");
    }

    // Role
    if (!formData.role) {
      errors.role = t("role.required");
    }

    // Organisation
    if (requiresOrganisation) {
      if (!formData.organisationName.trim()) {
        errors.organisationName = t("organisation.required");
      } else if (formData.organisationName.trim().length > 255) {
        errors.organisationName = t("organisation.maxLength");
      }
    }

    return errors;
  }

  return { validateUserForm };
}
