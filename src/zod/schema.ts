import { e } from "./error";
import { SchemaDef, HTMLAttributes } from "./types";

export abstract class SchemaType<
  Output = any,
  Def extends SchemaDef = SchemaDef,
  Input = Output
> {
  public abstract htmlAttributes: HTMLAttributes;
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
    if (this.htmlAttributes?.value === null) {
      data = this.htmlAttributes.value;
    }
    if (
      this.htmlAttributes?.required === false &&
      (data === undefined || data === null)
    ) {
      return data as Output;
    }
    const result = this.validate(data);
    if (!result.success) {
      throw result.intoError();
    }
    return result.data as Output;
  }

  safeParse(data: unknown): e.ValidationResult<Output> {
    if (this.htmlAttributes?.value === null) {
      data = this.htmlAttributes.value;
    }
    if (
      this.htmlAttributes?.required === false &&
      (data === undefined || data === null)
    ) {
      return e.ValidationResult.ok<Output>(data as Output);
    }
    return this.validate(data);
  }

  toJSON(): this["htmlAttributes"] {
    return this.htmlAttributes;
  }

  optional(): OptionalSchema<this> {
    this.htmlAttributes = { ...this.htmlAttributes, required: false };
    return new OptionalSchema(this);
  }

  nullable(): NullableSchema<this> {
    return new NullableSchema(this);
  }

  default(value: Output): DefaultSchema<this> {
    return new DefaultSchema(this, value);
  }
}

export class OptionalSchema<
  T extends SchemaType<any, any, any>
> extends SchemaType<
  T["_output"] | undefined,
  T["_def"],
  T["_input"] | undefined
> {
  constructor(private inner: T) {
    super(inner._def);
    this.htmlAttributes = { ...inner.htmlAttributes, required: false };
  }

  public htmlAttributes: T["htmlAttributes"];

  validate(data: unknown): e.ValidationResult<T["_output"] | undefined> {
    if (
      (data === undefined || data === null) &&
      this.htmlAttributes?.value === undefined
    ) {
      return e.ValidationResult.ok<undefined>(undefined);
    }
    return this.inner.validate(data);
  }

  parse(data: unknown) {
    if (
      (data === undefined || data === null) &&
      this.htmlAttributes?.value === undefined
    ) {
      return undefined as T["_output"] | undefined;
    }
    return this.inner.parse(data);
  }

  safeParse(data: unknown) {
    if (
      (data === undefined || data === null) &&
      this.htmlAttributes?.value === undefined
    ) {
      return e.ValidationResult.ok<undefined>(undefined);
    }
    return this.inner.safeParse(data);
  }
}

export class NullableSchema<
  T extends SchemaType<any, any, any>
> extends SchemaType<T["_output"] | null, T["_def"], T["_input"] | null> {
  constructor(private inner: T) {
    super(inner._def);
    this.htmlAttributes = inner.htmlAttributes;
  }

  public htmlAttributes: T["htmlAttributes"];

  validate(data: unknown): e.ValidationResult<T["_output"] | null> {
    if (data === null && this.htmlAttributes?.value === undefined) {
      return e.ValidationResult.ok<null>(null);
    }
    return this.inner.validate(data);
  }

  parse(data: unknown) {
    if (data === null && this.htmlAttributes?.value === undefined) {
      return null as T["_output"] | null;
    }
    return this.inner.parse(data);
  }

  safeParse(data: unknown) {
    if (data === null && this.htmlAttributes?.value === undefined) {
      return e.ValidationResult.ok<null>(null);
    }
    return this.inner.safeParse(data);
  }
}

export class DefaultSchema<
  T extends SchemaType<any, any, any>
> extends SchemaType<T["_output"], T["_def"], T["_input"] | undefined> {
  constructor(private inner: T, private defaultValue: T["_output"]) {
    super(inner._def);
    this.htmlAttributes = { ...inner.htmlAttributes, value: defaultValue };
  }

  public htmlAttributes: T["htmlAttributes"];

  validate(data: unknown): e.ValidationResult<T["_output"]> {
    if (data === undefined || data === null) {
      data = this.defaultValue;
    }
    return this.inner.validate(data);
  }

  parse(data: unknown): T["_output"] {
    if (data === undefined || data === null) {
      data = this.defaultValue;
    }
    return this.inner.parse(data);
  }

  safeParse(data: unknown): e.ValidationResult<T["_output"]> {
    if (data === undefined || data === null) {
      data = this.defaultValue;
    }
    return this.inner.safeParse(data);
  }

  readOnly(message: string = "String is read-only"): this {
    this.errorMap.set("readOnly", message);
    this.htmlAttributes = { ...this.htmlAttributes, readOnly: true };
    return this;
  }
}
