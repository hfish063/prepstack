import { auth } from "@clerk/nextjs/server";

export async function getServerAuthToken() {
  const { getToken } = await auth();

  const token = await getToken();

  if (!token) {
    throw new Error("Missing authentication token");
  }

  return token;
}
