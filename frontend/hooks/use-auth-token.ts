"use client";

import { useAuth } from "@clerk/nextjs";

export function useAuthToken() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return async function resolveToken(): Promise<string> {
    if (!isSignedIn || !isLoaded) {
      throw new Error("User is not authenticated");
    }

    const token = await getToken();

    if (!token) {
      throw new Error("Missing authentication token");
    }

    return token;
  };
}
