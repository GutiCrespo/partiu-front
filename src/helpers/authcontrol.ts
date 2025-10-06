import { cookies } from "next/headers";

export default async function getAuthToken(): Promise<string | null> {
  return (await cookies()).get("authToken")?.value ?? null;
}
