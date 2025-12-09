import { e, ValidationError } from "../error";
import { SchemaType } from "../schema";
import { HtmlCheckboxAttributes } from "../types";

export class BooleanSchema extends SchemaType<boolean> {
  public htmlAttributes: HtmlCheckboxAttributes = {
    type: "checkbox",
    checked: false,
  };

  validate(data: unknown): e.ValidationResult<boolean> {
    const errors: ValidationError[] = [];
    if (typeof data !== "boolean") {
      errors.push(
        new ValidationError(
          [],
          "Invalid boolean",
          "invalid_type",
          "boolean",
          typeof data,
          data
        )
      );
      return e.ValidationResult.fail<boolean>(errors);
    }

    if (errors.length > 0) {
      return e.ValidationResult.fail<boolean>(errors);
    }
    return e.ValidationResult.ok<boolean>(data);
  }

  default(value: boolean): this {
    this.htmlAttributes = { ...this.htmlAttributes, checked: value };
    return this;
  }
}
