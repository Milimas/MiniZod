import { SchemaType } from "./schema";

export type TypeOf<T extends SchemaTypeAny> = T["_output"];
export type Infer<T extends SchemaTypeAny> = TypeOf<T>;

export type SchemaDef = {
  description?: string;
};

export type HtmlGenericInputAttributes = {
  name?: string;
  alt?: string;
  title?: string;
  required?: boolean;
  readOnly?: boolean;
  tabIndex?: number;
  hidden?: boolean;
  disabled?: boolean | undefined;
};

export type HtmlCheckboxAttributes = {
  type: "checkbox" | "radio";
  checked: boolean;
  value?: boolean | undefined;
} & HtmlGenericInputAttributes;

export type HtmlNumberInputAttributes = {
  type: "number";
  value?: number | undefined;
  min?: number;
  max?: number;
  step?: number;
} & HtmlGenericInputAttributes;

export type HtmlFileInputAttributes = {
  type: "file";
  value?: any | undefined;
  accept?: string;
  multiple?: boolean;
} & HtmlGenericInputAttributes;

export type HtmlContainerAttributes<R = Record<string, any>, I = any> =
  | HtmlObjectType<R>
  | HtmlArrayType<I>;

export type HtmlArrayType<ItemType = any> = {
  type: "array";
  value?: ItemType[] | undefined;
  items: ItemType[];
  required?: boolean;
};
export type HtmlObjectType<ObjectProperties = Record<string, any>> = {
  type: "object";
  value?: ObjectProperties | undefined;
  properties?: ObjectProperties;
  required?: boolean;
};

export type HtmlStringAttributes = {
  type:
    | "text"
    | "email"
    | "password"
    | "url"
    | "date"
    | "datetime-local"
    | "color";
  value?: string | undefined;
  placeholder?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  list?: string;
  dataList?: string[];
} & HtmlGenericInputAttributes;

export type HtmlSelectAttributes<T = string> = {
  type: "select";
  value?: T | undefined;
  options: T[];
} & HtmlGenericInputAttributes;

export type HTMLAttributes =
  | HtmlStringAttributes
  | HtmlCheckboxAttributes
  | HtmlNumberInputAttributes
  | HtmlFileInputAttributes
  | HtmlContainerAttributes
  | HtmlSelectAttributes;

export type ObjectShape = { [key: string]: SchemaTypeAny };
export type SchemaTypeAny = SchemaType<any, any, any>;
