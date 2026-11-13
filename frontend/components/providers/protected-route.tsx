import { auth } from "@clerk/nextjs/server";

type ProtectedRouteProviderProps = {
  children: React.ReactNode;
};

export default async function ProtectedRouteProvider({
  children,
}: ProtectedRouteProviderProps) {
  await auth.protect();

  return children;
}
