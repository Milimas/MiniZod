import { s } from "./zod";
import { ValidationAggregateError, ValidationError } from "./zod/error";

export const UserSchema = s.object({
  id: s
    .string()
    .datalist("id-list", [
      "550e8400-e29b-41d4-a716-446655440000",
      "123e4567-e89b-12d3-a456-426614174000",
      "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    ]),
  name: s.string(),
  email: s.string(),
  createdAt: s.boolean(),
  num: s.number(),
});
const configSchema = s.object({
  auth: s
    .object({
      region: s.string().min(1, "Region is required").default("us-east-1"),
      credentials: s
        .object({
          accessKeyId: s.string().default(""),
          secretAccessKey: s.string().default(""),
        })
        .optional(),
    })
    .optional(),
  endpointUrl: s.url().default("https://s3.amazonaws.com"),
  operation: s
    .enum([
      "createBucket",
      "deleteBucket",
      "getAllBuckets",
      "searchWithinBucket",
      "copyFile",
      "deleteFile",
      "downloadFile",
      "listFiles",
      "uploadFile",
      "createFolder",
      "deleteFolder",
      "listFolders",
    ])
    .default("getAllBuckets"),
  prefix: s.string().optional(),
  sourceBucketName: s.string().optional(),
  sourceKey: s.string().optional(),
  destinationBucketName: s.string().optional(),
  destinationKey: s.string().optional(),
  folderName: s.string().optional(),
  forcePathStyle: s.boolean().default(false),
});

export type User = s.Infer<typeof configSchema>;

export function validateUser(data: unknown): User {
  return configSchema.parse(data);
}

function main() {
  const sampleData: Partial<User> = {
    auth: {
      region: "us-west-2",
      credentials: {
        accessKeyId: "AKIA...",
        secretAccessKey: "abcd1234...",
      },
    },
    destinationBucketName: "",
    destinationKey: "",
    endpointUrl: "https://s3.amazonaws.com",
    prefix: "",
    sourceBucketName: "",
    sourceKey: "",
    folderName: "",
    forcePathStyle: false,
  };

  // const user2 = validateUser(sampleData);
  try {
    // console.dir(UserSchema.toJSON(), { depth: null });
    const user = validateUser(sampleData);
    console.log("Valid user:", user);
    console.log(configSchema.parse({}));
    console.dir(configSchema.toJSON(), { depth: null });
  } catch (e: ValidationError | any) {
    if (e instanceof ValidationAggregateError) {
      console.error(e.errors);
    }
    // console.dir(e.errors, { depth: null });
  }
}

main();
