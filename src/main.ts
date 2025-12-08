import { s } from "./zod/types";

export const UserSchema = s.object({
  id: s.string(),
  name: s.string(),
  email: s.string(),
  createdAt: s.boolean(),
  num: s.number(),
});

export type User = s.Infer<typeof UserSchema>;

export function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}

function main() {
  const sampleData = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: true,
    num: 42,
  };

  try {
    const user = validateUser(sampleData);
    console.log("Valid user:", user);
  } catch (e: Error | any) {
    console.error("Validation failed:", e.errors);
  }
}

main();
