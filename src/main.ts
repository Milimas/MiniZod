import { s } from "./zod";
import { ValidationError } from "./zod/error";

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
  auth: s.object({
    region: s.string().min(1, "Region is required").default("us-east-1"),
    credentials: s
      .object({
        accessKeyId: s
          .string()
          .min(100, "Access Key ID must be at least 100 characters")
          .default(""),
        secretAccessKey: s.string().default(""),
      })
      .optional(),
  }),
  endpointUrl: s.url(),
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
  forcePathStyle: s.boolean().optional().default(false),
});

export type User = s.Infer<typeof configSchema>;

export function validateUser(data: unknown): User {
  return configSchema.parse(data);
}

function main() {
  const sampleData: User = {
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
    operation: "getAllBuckets",
    prefix: "",
    sourceBucketName: "",
    sourceKey: "",
    folderName: "",
    forcePathStyle: false,
  };

  try {
    const user = validateUser(sampleData);
    console.log("Valid user:", user);
    console.log("User ID:", UserSchema.toJSON());
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      console.error("Validation failed:", e.message);
    }
    console.log(typeof e);
  }
}

main();
