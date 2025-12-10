import { e, ValidationError } from "../error";
import { SchemaType } from "../schema";
import { HtmlStringAttributes, SchemaDef } from "../types";

export class StringSchema<D extends SchemaDef = SchemaDef> extends SchemaType<
  string,
  D
> {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    required: true,
  };

  validate(data: unknown): e.ValidationResult<string> {
    const errors: ValidationError[] = [];
    // Basic type check
    if (typeof data !== "string") {
      errors.push(
        new ValidationError(
          [],
          "Invalid string",
          "invalid_type",
          "string",
          typeof data,
          data
        )
      );
      return e.ValidationResult.fail<string>(errors);
    }

    // Pattern check
    if (
      this.htmlAttributes.pattern &&
      !this.htmlAttributes.pattern.test(data)
    ) {
      errors.push(
        new ValidationError(
          [],
          this.errorMap.get("pattern") || "Invalid format",
          "pattern",
          this.htmlAttributes.pattern,
          data,
          data
        )
      );
    }

    // required check
    if (
      this.htmlAttributes.required &&
      (data === null || data === undefined || data === "")
    )
      errors.push(
        new ValidationError(
          [],
          this.errorMap.get("required") || "String is required",
          "required",
          true,
          data,
          data
        )
      );

    // Length checks
    if (
      this.htmlAttributes.min !== undefined &&
      data.length < this.htmlAttributes.min
    )
      errors.push(
        new ValidationError(
          [],
          this.errorMap.get("min") || "String is too short",
          "min",
          this.htmlAttributes.min,
          data.length,
          data
        )
      );

    // Length checks
    if (
      this.htmlAttributes.max !== undefined &&
      data.length > this.htmlAttributes.max
    )
      errors.push(
        new ValidationError(
          [],
          this.errorMap.get("max") || "String is too long",
          "max",
          this.htmlAttributes.max,
          data.length,
          data
        )
      );

    if (this.htmlAttributes.readOnly) {
      errors.push(
        new ValidationError(
          [],
          this.errorMap.get("readOnly") || "String is read-only",
          "readOnly",
          true,
          data,
          data
        )
      );
    }

    if (errors.length > 0) {
      return e.ValidationResult.fail<string>(errors);
    }

    return e.ValidationResult.ok<string>(data);
  }

  placeholder(value: string): this {
    this.htmlAttributes = { ...this.htmlAttributes, placeholder: value };
    return this;
  }

  min(value: number, message: string = "String is too short"): this {
    this.errorMap.set("min", message);
    this.htmlAttributes = { ...this.htmlAttributes, min: value };
    return this;
  }

  max(value: number, message: string = "String is too long"): this {
    this.errorMap.set("max", message);
    this.htmlAttributes = { ...this.htmlAttributes, max: value };
    return this;
  }

  pattern(
    value: RegExp,
    message: string = "String does not match pattern"
  ): this {
    this.errorMap.set("pattern", message);
    this.htmlAttributes = { ...this.htmlAttributes, pattern: value };
    return this;
  }

  datalist(list: string, dataList: string[]): this {
    this.htmlAttributes = {
      type: "text",
      list,
      dataList,
    };
    return this;
  }
}

export class PasswordSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "password",
  };
}

export class UrlSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "url",
    value: "",
    pattern:
      /^(?<Scheme>[a-z][a-z0-9\+\-\.]*):(?<HierPart>\/\/(?<Authority>((?<UserInfo>(\%[0-9a-f][0-9a-f]|[a-z0-9\-\.\_\~]|[\!\$\&\'\(\)\*\+\,\;\=]|\:)*)\@)?(?<Host>\[((?<IPv6>((?<IPv6_1_R_H16>[0-9a-f]{1,4})\:){6,6}(?<IPV6_1_R_LS32>((?<IPV6_1_R_LS32_IPV4_DEC_OCTET>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3,3}(?<IPV6_1_R_LS32_IPV4_DEC_OCTET_>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])|(?<IPV6_1_R_LS32_H16_1>[0-9a-f]{1,4})\:(?<IPV6_1_R_LS32_H16_2>[0-9a-f]{1,4}))|\:\:((?<IPV6_2_R_H16>[0-9a-f]{1,4})\:){5,5}(?<IPV6_2_R_LS32>((?<IPV6_2_R_LS32_IPV4_DEC_OCTET>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3,3}(?<IPV6_2_R_LS32_IPV4_DEC_OCTET_>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])|(?<IPV6_2_R_LS32_H16_1>[0-9a-f]{1,4})\:(?<IPV6_2_R_LS32_H16_2>[0-9a-f]{1,4}))|(?<IPV6_3_L_H16>[0-9a-f]{1,4})?\:\:((?<IPV6_3_R_H16>[0-9a-f]{1,4})\:){4,4}(?<IPV6_3_R_LS32>((?<IPV6_3_R_LS32_IPV4_DEC_OCTET>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3,3}(?<IPV6_3_R_LS32_IPV4_DEC_OCTET_>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])|(?<IPV6_3_R_LS32_H16_1>[0-9a-f]{1,4})\:(?<IPV6_3_R_LS32_H16_2>[0-9a-f]{1,4}))|(((?<IPV6_4_L_H16_REPEAT>[0-9a-f]{1,4})\:)?(?<IPV6_4_L_H16>[0-9a-f]{1,4}))?\:\:((?<IPV6_4_R_H16>[0-9a-f]{1,4})\:){3,3}(?<IPV6_4_R_LS32>((?<IPV6_4_R_LS32_IPV4_DEC_OCTET>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3,3}(?<IPV6_4_R_LS32_IPV4_DEC_OCTET_>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])|(?<IPV6_4_R_LS32_H16_1>[0-9a-f]{1,4})\:(?<IPV6_4_R_LS32_H16_2>[0-9a-f]{1,4}))|(((?<IPV6_5_L_H16_REPEAT>[0-9a-f]{1,4})\:){0,2}(?<IPV6_5_L_H16>[0-9a-f]{1,4}))?\:\:((?<IPV6_5_R_H16>[0-9a-f]{1,4})\:){2,2}(?<IPV6_5_R_LS32>((?<IPV6_5_R_LS32_IPV4_DEC_OCTET>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3,3}(?<IPV6_5_R_LS32_IPV4_DEC_OCTET_>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])|(?<IPV6_5_R_LS32_H16_1>[0-9a-f]{1,4})\:(?<IPV6_5_R_LS32_H16_2>[0-9a-f]{1,4}))|(((?<IPV6_6_L_H16_REPEAT>[0-9a-f]{1,4})\:){0,3}(?<IPV6_6_L_H16>[0-9a-f]{1,4}))?\:\:(?<IPV6_6_R_H16>[0-9a-f]{1,4})\:(?<IPV6_6_R_LS32>((?<IPV6_6_R_LS32_IPV4_DEC_OCTET>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3,3}(?<IPV6_6_R_LS32_IPV4_DEC_OCTET_>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])|(?<IPV6_6_R_LS32_H16_1>[0-9a-f]{1,4})\:(?<IPV6_6_R_LS32_H16_2>[0-9a-f]{1,4}))|(((?<IPV6_7_L_H16_REPEAT>[0-9a-f]{1,4})\:){0,4}(?<IPV6_7_L_H16>[0-9a-f]{1,4}))?\:\:(?<IPV6_7_R_LS32>((?<IPV6_7_R_LS32_IPV4_DEC_OCTET>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3,3}(?<IPV6_7_R_LS32_IPV4_DEC_OCTET_>[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])|(?<IPV6_7_R_LS32_H16_1>[0-9a-f]{1,4})\:(?<IPV6_7_R_LS32_H16_2>[0-9a-f]{1,4}))|(((?<IPV6_8_L_H16_REPEAT>[0-9a-f]{1,4})\:){0,5}(?<IPV6_8_L_H16>[0-9a-f]{1,4}))?\:\:(?<IPV6_8_R_H16>[0-9a-f]{1,4})|(((?<IPV6_9_L_H16_REPEAT>[0-9a-f]{1,4})\:){0,6}(?<IPV6_9_L_H16>[0-9a-f]{1,4}))?\:\:)|v[a-f0-9]+\.([a-z0-9\-\.\_\~]|[\!\$\&\'\(\)\*\+\,\;\=]|\:)+)\]|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3,3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])|([a-z0-9\-\.\_\~]|\%[0-9a-f][0-9a-f]|[\!\$\&\'\(\)\*\+\,\;\=])*)(:(?<Port>[0-9]+))?)(?<Path>(\/([a-z0-9\-\.\_\~\!\$\&\'\(\)\*\+\,\;\=\:\@]|(%[a-f0-9]{2,2}))*)*))(?<Query>\?([a-z0-9\-\.\_\~\!\$\&\'\(\)\*\+\,\;\=\:\@\/\?]|(%[a-f0-9]{2,2}))*)?(?<Fragment>#([a-z0-9\-\.\_\~\!\$\&\'\(\)\*\+\,\;\=\:\@\/\?]|(%[a-f0-9]{2,2}))*)?$/,
    placeholder: "https://example.com",
  };
}

export class ZipCodeSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern: /^[0-9]{5}(?:-[0-9]{4})?$/,
    placeholder: "12345 or 12345-6789",
  };
}

export class XMLSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern: /(?<=<TAG.*?>)(.*?)(?=<\/TAG>)/g,
    placeholder: "<TAG>value</TAG>",
  };
}

export class UUIDSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern:
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    placeholder: "550e8400-e29b-41d4-a716-446655440000",
  };
}

export class StreetAddressSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern:
      /^(\d{1,}) [a-zA-Z0-9\s]+(\,)? [a-zA-Z]+(\,)? [A-Z]{2} [0-9]{5,6}$/,
    placeholder: "1234 Main St, City, ST 12345",
  };
}

export class PhoneNumberSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern:
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    placeholder: "+12345678900",
  };
}

export class StringNumberSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern:
      /^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/,
    placeholder: "12345",
  };
}

export class HexColorSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
    placeholder: "#RRGGBB or #RGB",
  };
}

export class MacAddressSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern: /^(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})$/,
    placeholder: "00:1A:2B:3C:4D:5E",
  };
}

export class IPAddressSchema<
  V extends "IPV4" | "IPV6" = "IPV4" | "IPV6",
  D extends SchemaDef = SchemaDef
> extends StringSchema<D> {
  private patterns: Record<V, RegExp> = {
    IPV4: /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    IPV6: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  } as Record<V, RegExp>;
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    placeholder: "255.255.255.255",
  };
  constructor(private version: V, def: D) {
    super(def);
    this.htmlAttributes.pattern = this.patterns[version];
  }
}

export class HTMLSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern: /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g,
    placeholder: "<tag>content</tag>",
  };
}

export class GUIDSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern:
      /^(?:\{{0,1}(?:[0-9a-fA-F]){8}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){12}\}{0,1})$/,
    placeholder: "550e8400-e29b-41d4-a716-446655440000",
  };
}

export class DateSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "date",
    pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/,
    placeholder: "MM/DD/YYYY",
  };
}

export class DatetimeLocalSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "datetime-local",
    pattern:
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d T([01][0-9]|2[0-3]):([0-5][0-9])$/,
    placeholder: "MM/DD/YYYYTHH:MM",
  };
}

export class ISODateSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "text",
    pattern:
      /^(?:\d{4})-(?:\d{2})-(?:\d{2})T(?:\d{2}):(?:\d{2}):(?:\d{2}(?:\.\d*)?)(?:(?:-(?:\d{2}):(?:\d{2})|Z)?)$/,
    placeholder: "YYYY-MM-DDTHH:MM:SSZ",
  };
}

export class EmailSchema extends StringSchema {
  public htmlAttributes: HtmlStringAttributes = {
    type: "email",
    pattern:
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  };

  parse(data: unknown): string {
    if (typeof data !== "string" || !this.htmlAttributes.pattern!.test(data)) {
      throw new Error("Invalid email");
    }
    return data;
  }
}
