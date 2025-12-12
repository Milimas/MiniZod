import app from "./http";
import { s, ValidationAggregateError } from "validator";

const arrayOfNumber = s.array(s.number());

type NumberArray = s.Infer<typeof arrayOfNumber>;

arrayOfNumber.parse([222, "world", 342]); // This will throw a validation error

const fileAttachmentSchema = s.object({
  "@odata.type": s.string().default("#microsoft.graph.fileAttachment"),
  name: s.string().default("Attached File"),
  contentType: s.string().default("text/plain"),
  contentBytes: s.string(),
});

const eventAttachmentSchema = s.object({
  "@odata.type": s.string().default("#microsoft.graph.eventAttachment"),
  name: s.string().default("Attached Event"),
  event: s.object({
    subject: s.string().optional(),
    body: s
      .object({
        contentType: s.enum(["Text", "HTML"] as const).default("HTML"),
        content: s.string(),
      })
      .optional(),
    start: s.string().optional(),
    end: s.string().optional(),
    location: s
      .object({
        displayName: s.string().optional(),
      })
      .optional(),
    attendees: s
      .array(
        s.object({
          emailAddress: s.object({
            address: s.string(),
            name: s.string().optional(),
          }),
          type: s
            .enum(["required", "optional", "resource"] as const)
            .default("required"),
        })
      )
      .optional(),
    isAllDay: s.boolean().optional().default(false),
    sensitivity: s
      .enum(["normal", "personal", "private", "confidential"] as const)
      .optional()
      .default("normal"),
  }),
});

/*
// Zod version - commented out, using validator library instead
export const configSchema = z.object({
  apiToken: z.string(),
  userId: z.string().default("me"),
  type: z.enum([
    "calendar",
    "contact",
    "draft",
    "event",
    "mailFolder",
    "folderMessage",
    "message",
    "messageAttachment",
  ]),
  calendar: z
    .object({
      operation: z.enum(["create", "delete", "get", "getMany", "update"]),
      calendarName: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [{ field: "calendar.operation", value: "create" }],
          })
        ),
      calendarId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              {
                field: "calendar.operation",
                pattern: "^delete$|^get$|^update$",
              },
            ],
          })
        ),
    })
    .optional()
    .describe(
      inputMetaData({ dependsOn: [{ field: "type", value: "calendar" }] })
    ),
  contact: z
    .object({
      operation: z.enum(["create", "delete", "get", "getMany", "update"]),
      contactId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              {
                field: "contact.operation",
                pattern: "^delete$|^get$|^update$",
              },
            ],
          })
        ),
    })
    .optional()
    .describe(
      inputMetaData({ dependsOn: [{ field: "type", value: "contact" }] })
    ),
  draft: z
    .object({
      operation: z.enum([
        "create",
        "delete",
        "get",
        "getMany",
        "send",
        "update",
      ]),
      messageId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              {
                field: "draft.operation",
                pattern: "^delete$|^get$|^send$|^update$",
              },
            ],
          })
        ),
    })
    .optional()
    .describe(
      inputMetaData({ dependsOn: [{ field: "type", value: "draft" }] })
    ),
  event: z
    .object({
      operation: z.enum(["create", "delete", "get", "getMany", "update"]),
      eventId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              { field: "event.operation", pattern: "^delete$|^get$|^update$" },
            ],
          })
        ),
    })
    .optional()
    .describe(
      inputMetaData({ dependsOn: [{ field: "type", value: "event" }] })
    ),
  mailFolder: z
    .object({
      operation: z.enum(["create", "delete", "get", "getMany", "update"]),
      displayName: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              { field: "mailFolder.operation", pattern: "^create$|^update$" },
            ],
          })
        ),
      parentFolderId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              { field: "mailFolder.operation", pattern: "^create$|^update$" },
            ],
          })
        ),
      isHidden: z
        .boolean()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              { field: "mailFolder.operation", pattern: "^create$|^update$" },
            ],
          })
        ),
      folderId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              {
                field: "mailFolder.operation",
                pattern: "^delete$|^get$|^update$",
              },
            ],
          })
        ),
    })
    .optional()
    .describe(
      inputMetaData({ dependsOn: [{ field: "type", value: "mailFolder" }] })
    ),
  folderMessage: z
    .object({
      folderId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [{ field: "type", value: "folderMessage" }],
          })
        ),
    })
    .optional()
    .describe(
      inputMetaData({ dependsOn: [{ field: "type", value: "folderMessage" }] })
    ),
  message: z
    .object({
      operation: z.enum(["delete", "get", "getMany", "move", "reply", "send"]),
      destinationId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [{ field: "message.operation", value: "move" }],
          })
        ),
      inReplyToMessageId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [{ field: "message.operation", value: "reply" }],
          })
        ),
      messageId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              { field: "message.operation", pattern: "^delete$|^get$|^move$" },
            ],
          })
        ),
      message: z
        .object({
          subject: z.string().optional(),
          body: z
            .object({
              contentType: z.enum(["Text", "HTML"]).default("HTML"),
              content: z.string().describe(inputMetaData({ type: "textarea" })),
            })
            .optional(),
          toRecipients: z
            .array(
              z.object({
                emailAddress: z.object({
                  address: z.string(),
                  name: z.string().optional(),
                }),
              })
            )
            .optional(),
          ccRecipients: z
            .array(
              z.object({
                emailAddress: z.object({
                  address: z.string(),
                  name: z.string().optional(),
                }),
              })
            )
            .optional(),
          bccRecipients: z
            .array(
              z.object({
                emailAddress: z.object({
                  address: z.string(),
                  name: z.string().optional(),
                }),
              })
            )
            .optional(),
          replyTo: z
            .array(
              z.object({
                emailAddress: z.object({
                  address: z.string(),
                  name: z.string().optional(),
                }),
              })
            )
            .optional(),
          importance: z.enum(["Low", "Normal", "High"]).optional(),
        })
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [{ field: "message.operation", value: "send" }],
          })
        ),
      saveToSentItems: z
        .boolean()
        .optional()
        .default(true)
        .describe(
          inputMetaData({
            dependsOn: [{ field: "message.operation", value: "send" }],
          })
        ),
    })
    .optional()
    .describe(
      inputMetaData({ dependsOn: [{ field: "type", value: "message" }] })
    ),
  messageAttachment: z
    .object({
      operation: z.enum(["add", "download", "get", "getMany", "delete"]),
      messageId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              {
                field: "messageAttachment.operation",
                pattern: "^add$|^download$|^get$|^getMany$|^delete$",
              },
            ],
          })
        ),
      attachmentId: z
        .string()
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [
              {
                field: "messageAttachment.operation",
                pattern: "^download$|^get$|^delete$",
              },
            ],
          })
        ),
      addType: z
        .enum(["file", "item"])
        .optional()
        .describe(
          inputMetaData({
            dependsOn: [{ field: "messageAttachment.operation", value: "add" }],
          })
        ),
      file: fileAttachmentSchema.optional().describe(
        inputMetaData({
          dependsOn: [
            {
              field: "messageAttachment.operation",
              value: "add",
            },
            { field: "messageAttachment.addType", value: "file" },
          ],
        })
      ),
      event: eventAttachmentSchema.optional().describe(
        inputMetaData({
          dependsOn: [
            {
              field: "messageAttachment.operation",
              value: "add",
            },
            { field: "messageAttachment.addType", value: "item" },
          ],
        })
      ),
    })
    .optional()
    .describe(
      inputMetaData({
        dependsOn: [{ field: "type", value: "messageAttachment" }],
      })
    ),
});
*/

// const configSchema = s.object({
//   stringField: s.string(),
//   numberField: s.number().min(0).max(100).default(50),
//   booleanField: s.boolean().default(true),
//   selectField: s
//     .enum(["option1", "option2", "option3"] as const)
//     .default("option1"),
//   option1: s
//     .object({
//       subFieldA: s.string().minLength(2).maxLength(10),
//       subFieldB: s.number().min(1).max(10),
//     })
//     .dependsOn([
//       { field: "selectField", condition: (val) => val === "option1" },
//     ]),
//   option2: s
//     .object({
//       subFieldC: s.boolean().default(false),
//       subFieldD: s.url().optional(),
//     })
//     .dependsOn([
//       { field: "selectField", condition: (val) => val === "option2" },
//     ]),
//   option3: s
//     .string()
//     .minLength(5)
//     .maxLength(15)
//     .dependsOn([
//       { field: "selectField", condition: (val) => val === "option3" },
//     ]),
//   nestedObject: s.object({
//     nestedString: s.string().minLength(5).maxLength(20),
//     nestedNumber: s.number().min(10).max(500),
//   }),
//   arrayField: s.array(s.string().minLength(3)).minLength(1).maxLength(5),
//   urlField: url().optional(),
//   passwordField: password()
//     .minLength(8)
//     .pattern(/[0-9]{8,}/)
//     .datalist("passwords", ["example1", "example2"]),
//   emailField: email().required(),
// });

// const configSchema = s.object({
//   // Basic fields
//   stringField: s.string().minLength(1).maxLength(50),

//   numberField: s.number().min(0).max(100).default(50),

//   booleanField: s.boolean().default(true),

//   // Enum + default
//   selectField: s
//     .enum(["option1", "option2", "option3", "advanced"] as const)
//     .default("option1"),

//   // Option 1 object
//   option1: s
//     .object({
//       subFieldA: s.string().minLength(2).maxLength(10),
//       subFieldB: s.number().min(1).max(10),
//       subFieldC: s
//         .string()
//         .pattern(/^([A-Z]{3}-[0-9]{3})$/) // e.g. ABC-123
//         .optional(),
//     })
//     .dependsOn([{ field: "selectField", condition: (v) => v === "option1" }]),

//   // Option 2 object
//   option2: s
//     .object({
//       subFieldC: s.boolean().default(false),
//       subFieldD: s.url().optional(),
//       subFieldE: s
//         .array(s.number().min(1).max(5))
//         .minLength(1)
//         .maxLength(10)
//         .optional(),
//     })
//     .dependsOn([{ field: "selectField", condition: (v) => v === "option2" }]),

//   // Option 3 simple string
//   option3: s
//     .string()
//     .minLength(5)
//     .maxLength(15)
//     .dependsOn([{ field: "selectField", condition: (v) => v === "option3" }]),

//   // More advanced conditional:
//   // If selectField === "advanced" AND numberField > 80 then this object must exist
//   advancedSettings: s
//     .object({
//       mode: s.enum(["low", "medium", "high"]).default("medium"),
//       threshold: s.number().min(100).max(999),
//       flags: s.array(s.string()).minLength(1).maxLength(10),
//     })
//     .dependsOn([
//       {
//         field: "selectField",
//         condition: (v) => v === "advanced",
//       },
//       {
//         field: "numberField",
//         condition: (v) => v > 80,
//       },
//     ]),

//   // Nested object example
//   nestedObject: s
//     .object({
//       nestedString: s.string().minLength(5).maxLength(20),
//       nestedNumber: s.number().min(10).max(500),

//       deeper: s.object({
//         deepString: s.string().minLength(3),
//         deepList: s
//           .array(
//             s.object({
//               flag: s.boolean().default(false),
//               level: s.number().min(0).max(10),
//             })
//           )
//           .minLength(1),
//       }),
//     })
//     .default({
//       nestedString: "default",
//       nestedNumber: 100,
//       deeper: {
//         deepString: "deep",
//         deepList: [{ flag: true, level: 5 }],
//       },
//     }),

//   // Array of objects with internal constraints
//   servers: s
//     .array(
//       s.object({
//         url: s.url(),
//         priority: s.number().min(1).max(10).default(5),
//         enabled: s.boolean().default(true),
//       })
//     )
//     .minLength(1)
//     .maxLength(10),

//   // Simple array field
//   arrayField: s.array(s.string().minLength(3)).minLength(1).maxLength(5),

//   // URL field
//   urlField: url().optional(),

//   // Password field
//   passwordField: password()
//     .minLength(8)
//     .pattern(/[0-9]{8,}/)
//     .datalist("passwords", ["example1", "example2"]),

//   // Email field
//   emailField: email().required(),

//   // Dynamic data-* attributes using your library's object schema extension
//   attributes: s
//     .object({
//       ["data-*" as any]: s
//         .object({})
//         // .record(s.string(), s.string()) // or s.map(s.string(), s.string())
//         .optional(),
//     })
//     .optional(),
// });

const configSchema = s.object({
  option: s.enum(["redis config", "level1", "login"]).default("login"),
  login: s
    .object({
      username: s.string().minLength(3).maxLength(20).default("user"),
      password: s.password().minLength(8).maxLength(100),
    })
    .dependsOn([{ field: "option", condition: /login/ }]),
  redis: s
    .object({
      option: s.enum(["uri", "config"]).default("uri"),
      uri: s
        .string()
        .pattern(
          /^redis:\/\/(?:(?:[^:@]+)(?::[^:@]*)?@)?([A-Za-z0-9_]+)(?::(\d+))?(?:\/(\d+))?$/
        )
        .default("redis://localhost:6379/0")
        .dependsOn([{ field: "redis.option", condition: /^uri$/ }]),
      config: s
        .object({
          host: s.string().minLength(1).default("localhost"),
          port: s.number().min(1).max(65535).default(6379),
          password: s.string().optional(),
          db: s.number().min(0).max(15).default(0),
        })
        .dependsOn([{ field: "redis.option", condition: /^config$/ }]),
    })
    .dependsOn([{ field: "option", condition: /^redis config$/ }]),
  level1: s
    .object({
      name: s.string().minLength(1),
      active: s.boolean().default(true),
      level2: s.object({
        count: s.number().min(0).max(10),
        list: s
          .array(
            s.object({
              id: s.uuid().default(crypto.randomUUID()),
              meta: s.object({
                tags: s.array(s.string().minLength(2)).minLength(1),
                createdAt: s.datetime(),
                updatedAt: s.datetime().optional(),
              }),
            })
          )
          .minLength(1),
        level3: s.object({
          flag: s.boolean(),
          value: s.string().pattern(/^[A-Z_]{5,20}$/),
          deepList: s.array(s.array(s.array(s.number().min(-5).max(5)))),
        }),
      }),
    })
    .dependsOn([{ field: "option", condition: /^level1$/ }]),
  requiredNumber: s
    .number()
    .min(10, "Number must be at least 10")
    .max(100, "Number must be at most 100")
    .required(true, "This number is required"),
  booleanField: s
    .boolean()
    .default(false)
    .required(true, "Boolean field is required"),
});

const myEnum = s
  .enum(["A", "B", "C"])
  .default("A")
  .required(true, "Enum is required");

type EnumType = s.Infer<typeof myEnum>;

export type Config = s.Infer<typeof configSchema>;

export function validateConfig(data: unknown): Config {
  return configSchema.parse(data);
}

function main() {
  try {
    console.dir(configSchema.toJSON(), { depth: null });
  } catch (e: ValidationAggregateError | any) {
    console.error(e);
    // console.dir(e.errors, { depth: null });
  }
}
app.get("/schema", (req, res) => {
  console.log("Schema requested");
  res.json(configSchema.toJSON());
});

app.post("/submit", (req, res) => {
  console.log("Form submitted with data:", req.body);
  try {
    const validatedData = validateConfig(req.body);
    res.status(200).json({
      message: "Form data is valid",
      data: validatedData,
    });
    console.log("Validated data:", validatedData);
  } catch (e: ValidationAggregateError | any) {
    res.status(400).json({
      message: "Validation errors occurred",
      errors: e.errors,
    });
    console.error("Validation errors:", e);
  }
});

main();
