export namespace s {
  export type TypeOf<T extends s.SchemaType<any, any, any>> = T["_output"];
  export type Infer<T extends s.SchemaType<any, any, any>> = TypeOf<T>;
  type SchemaDef = {
    description?: string;
  };

  export abstract class SchemaType<
    Output = any,
    Def extends SchemaDef = SchemaDef,
    Input = Output
  > {
    readonly _output!: Output;
    readonly _input!: Input;
    readonly _def!: Def;

    constructor(def: Def) {
      this._def = def;
    }

    get description(): string | undefined {
      return this._def.description;
    }

    abstract parse(data: unknown): Output;
  }

  ////////////////////////////
  /////   string  ////////////
  ////////////////////////////

  export class StringSchema extends SchemaType<string> {
    parse(data: unknown): string {
      if (typeof data !== "string") {
        throw new Error("Invalid string");
      }
      return data;
    }
  }

  export function string(): StringSchema {
    return new StringSchema({});
  }

  ////////////////////////////
  /////   number  ////////////
  ////////////////////////////

  export class NumberSchema extends SchemaType<number> {
    parse(data: unknown): number {
      if (typeof data !== "number") {
        throw new Error("Invalid number");
      }
      return data;
    }
  }

  export function number(): NumberSchema {
    return new NumberSchema({});
  }

  ////////////////////////////
  /////   boolean  ///////////
  ////////////////////////////

  export class BooleanSchema extends SchemaType<boolean> {
    parse(data: unknown): boolean {
      if (typeof data !== "boolean") {
        throw new Error("Invalid boolean");
      }
      return data;
    }
  }

  export function boolean(): BooleanSchema {
    return new BooleanSchema({});
  }

  ////////////////////////////
  /////   object  ////////////
  ////////////////////////////

  export class ObjectSchema<
    Shape extends { [key: string]: SchemaType<any, any, any> }
  > extends SchemaType<{ [K in keyof Shape]: TypeOf<Shape[K]> }> {
    constructor(private shape: Shape) {
      super({});
    }

    parse(data: unknown): { [K in keyof Shape]: TypeOf<Shape[K]> } {
      if (typeof data !== "object" || data === null) {
        throw new Error("Invalid object");
      }
      const result: any = {};
      for (const key in this.shape) {
        result[key] = this.shape[key].parse((data as any)[key]);
      }
      return result;
    }
  }

  export function object<
    Shape extends { [key: string]: SchemaType<any, any, any> }
  >(shape: Shape): ObjectSchema<Shape> {
    return new ObjectSchema(shape);
  }
}
