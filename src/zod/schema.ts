import { e, ValidationError } from "./error";
import { SchemaDef, HTMLAttributes } from "./types";

export abstract class SchemaType<
  Output = any,
  Def extends SchemaDef = SchemaDef,
  Input = Output
> {
  public abstract htmlAttributes: HTMLAttributes;
  public isOptional: boolean = false;
  public isNullable: boolean = false;
  protected errorMap: Map<string, string> = new Map();

  readonly _output!: Output;
  readonly _input!: Input;
  readonly _def!: Def;

  constructor(def: Def) {
    this._def = def;
  }

  get description(): string | undefined {
    return this._def.description;
  }

  abstract validate(data: unknown): e.ValidationResult<Output>;
  parse(data: unknown): Output {
    if (this.isNullable && data === null) {
      return data as Output;
    }
    if (this.isOptional && (data === undefined || data === null)) {
      return data as Output;
    }
    const result = this.validate(data);
    if (!result.success) {
      //   console.log(result.errors);
      throw new ValidationError(
        [],
        result.getErrorMessages().join(", "),
        "validation_error"
      );
    }
    return result.data as Output;
  }

  safeParse(data: unknown): e.ValidationResult<Output> {
    return this.validate(data);
  }

  toJSON(): this["htmlAttributes"] {
    return this.htmlAttributes;
  }

  optional(): this {
    this.isOptional = true;
    return this;
  }

  nullable(): this {
    this.isNullable = true;
    return this;
  }
}
