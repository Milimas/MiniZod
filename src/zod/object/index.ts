import { e, ValidationError } from "../error";
import { SchemaType } from "../schema";
import {
  HTMLAttributes,
  HtmlContainerAttributes,
  HtmlObjectType,
  TypeOf,
} from "../types";

export class ObjectSchema<
  Shape extends { [key: string]: SchemaType<any, any, any> }
> extends SchemaType<{ [K in keyof Shape]: TypeOf<Shape[K]> }> {
  public htmlAttributes: HtmlContainerAttributes = {
    type: "object",
  };
  constructor(private shape: Shape) {
    super({});
  }

  validate(
    data: unknown
  ): e.ValidationResult<{ [K in keyof Shape]: TypeOf<Shape[K]> }> {
    const errors: ValidationError[] = [];
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      errors.push(
        new ValidationError(
          [],
          "Invalid object",
          "invalid_type",
          "object",
          typeof data,
          data
        )
      );
      return e.ValidationResult.fail<{
        [K in keyof Shape]: TypeOf<Shape[K]>;
      }>(errors);
    }

    const result: Partial<{ [K in keyof Shape]: TypeOf<Shape[K]> }> = {};

    for (const key in this.shape) {
      const schema = this.shape[key];
      const value = (data as any)[key];
      const fieldResult = schema.safeParse(value);
      if (!fieldResult.success) {
        const fieldErrors = fieldResult.errors.map((err) => {
          return {
            ...err,
            path: [key, ...err.path],
          };
        });
        errors.push(...fieldErrors);
      } else {
        result[key] = fieldResult.data;
      }
    }

    if (errors.length > 0) {
      return e.ValidationResult.fail<{
        [K in keyof Shape]: TypeOf<Shape[K]>;
      }>(errors);
    }
    return e.ValidationResult.ok<{ [K in keyof Shape]: TypeOf<Shape[K]> }>(
      result as { [K in keyof Shape]: TypeOf<Shape[K]> }
    );
  }

  toJSON(): HtmlObjectType<{ [K in keyof Shape]: HTMLAttributes }> {
    const json: HtmlObjectType<{ [K in keyof Shape]: HTMLAttributes }> = {
      ...this.htmlAttributes,
      type: "object",
      properties: Object.fromEntries(
        Object.entries(this.shape).map(([key, schema]) => [
          key,
          schema.toJSON(),
        ])
      ) as { [K in keyof Shape]: HTMLAttributes },
    };
    return json;
  }
}
