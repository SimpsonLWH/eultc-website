import { describe, expect, it } from "vitest";

import {
  addPlayerValuesFromFormData,
  validateAddPlayer,
  type AddPlayerValues,
} from "./validate";

function values(overrides: Partial<AddPlayerValues> = {}): AddPlayerValues {
  return {
    name: "Alex Morgan",
    email: "Alex.Morgan@Example.com",
    position: "",
    ...overrides,
  };
}

describe("validateAddPlayer", () => {
  it("normalizes name and email and allows an appended player", () => {
    const result = validateAddPlayer(
      values({ name: "  Alex Morgan  ", email: " Alex.Morgan@Example.com " }),
      4
    );

    expect(result).toEqual({
      ok: true,
      value: {
        name: "Alex Morgan",
        email: "alex.morgan@example.com",
        position: null,
      },
    });
  });

  it("accepts an in-range optional position", () => {
    const result = validateAddPlayer(values({ position: "2" }), 4);

    expect(result.ok && result.value.position).toBe(2);
  });

  it("rejects invalid names, emails and positions", () => {
    for (const [overrides, field] of [
      [{ name: "  " }, "name"],
      [{ email: "not-an-email" }, "email"],
      [{ position: "0" }, "position"],
      [{ position: "5" }, "position"],
      [{ position: "2.5" }, "position"],
    ] as const) {
      const result = validateAddPlayer(values(overrides), 4);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors[field]).toBeTruthy();
      }
    }
  });

  it("reads and trims form values", () => {
    const formData = new FormData();
    formData.set("name", "  Sam Lee ");
    formData.set("email", " SAM@EXAMPLE.COM ");
    formData.set("position", " 3 ");

    expect(addPlayerValuesFromFormData(formData)).toEqual({
      name: "Sam Lee",
      email: "SAM@EXAMPLE.COM",
      position: "3",
    });
  });
});
