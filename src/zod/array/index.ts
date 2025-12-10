import { e, ValidationError } from "../error";
import { SchemaType } from "../schema";
import {
  HtmlArrayType,
  HTMLAttributes,
  HtmlContainerAttributes,
  SchemaTypeAny,
  TypeOf,
} from "../types";

export class ArraySchema<T extends SchemaTypeAny> extends SchemaType<
  TypeOf<T>[]
> {
  public htmlAttributes: HtmlArrayType<HTMLAttributes> = {
    type: "array",
    items: [],
  };
  constructor(private itemSchema: T) {
    super({});
  }

  validate(data: unknown): e.ValidationResult<TypeOf<T>[]> {
    const errors: ValidationError[] = [];
    if (!Array.isArray(data)) {
      errors.push(
        new ValidationError(
          [],
          "Invalid array",
          "invalid_type",
          "array",
          typeof data,
          data
        )
      );
      return e.ValidationResult.fail<TypeOf<T>[]>(errors);
    }

    const result: TypeOf<T>[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const itemResult = this.itemSchema.safeParse(item);
      if (!itemResult.success) {
        const itemErrors = itemResult.errors.map((err) => ({
          ...err,
          path: [i, ...err.path],
        }));
        errors.push(...itemErrors);
      } else {
        result.push(itemResult.data);
      }
    }

    if (errors.length > 0) {
      return e.ValidationResult.fail<TypeOf<T>[]>(errors);
    }
    return e.ValidationResult.ok<TypeOf<T>[]>(result);
  }

  toJSON(): HtmlArrayType<HTMLAttributes> {
    const json: HtmlArrayType<HTMLAttributes> = {
      ...this.htmlAttributes,
      type: "array",
      items: [this.itemSchema.toJSON()],
    };
    return json;
  }
}
