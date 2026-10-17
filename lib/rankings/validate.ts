export type AddPlayerValues = {
  name: string;
  email: string;
  position: string;
};

export type AddPlayerErrors = Partial<Record<keyof AddPlayerValues, string>>;

export type AddPlayerInput = {
  name: string;
  email: string;
  position: number | null;
};

export type AddPlayerValidation =
  | { ok: true; value: AddPlayerInput }
  | { ok: false; errors: AddPlayerErrors };

export const emptyAddPlayerValues: AddPlayerValues = {
  name: "",
  email: "",
  position: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function addPlayerValuesFromFormData(
  formData: FormData
): AddPlayerValues {
  return {
    name: readText(formData, "name"),
    email: readText(formData, "email"),
    position: readText(formData, "position"),
  };
}

export function validateAddPlayer(
  values: AddPlayerValues,
  maxPosition: number
): AddPlayerValidation {
  const errors: AddPlayerErrors = {};
  const name = values.name.trim();
  const email = values.email.trim().toLowerCase();
  const positionValue = values.position.trim();

  if (!name) {
    errors.name = "Enter the player's name.";
  }
  if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  let position: number | null = null;
  if (positionValue) {
    const parsedPosition = /^\d+$/.test(positionValue)
      ? Number(positionValue)
      : Number.NaN;
    if (
      !Number.isInteger(parsedPosition) ||
      parsedPosition < 1 ||
      parsedPosition > maxPosition
    ) {
      errors.position = `Enter a position from 1 to ${maxPosition}, or leave it blank.`;
    } else {
      position = parsedPosition;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: { name, email, position },
  };
}
