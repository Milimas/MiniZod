import { e, ValidationError } from "../error";
import { SchemaType } from "../schema";
import { HtmlNumberInputAttributes } from "../types";

export class NumberSchema extends SchemaType<number> {
  public htmlAttributes: HtmlNumberInputAttributes = {
    type: "number",
    value: 0,
  };

  validate(data: unknown): e.ValidationResult<number> {
    const errors: ValidationError[] = [];
    if (typeof data !== "number" || isNaN(data)) {
      errors.push(
        new ValidationError(
          [],
          "Invalid number",
          "invalid_type",
          "number",
          typeof data,
          data
        )
      );
      return e.ValidationResult.fail<number>(errors);
    }

    if (errors.length > 0) {
      return e.ValidationResult.fail<number>(errors);
    }
    return e.ValidationResult.ok<number>(data);
  }
}
