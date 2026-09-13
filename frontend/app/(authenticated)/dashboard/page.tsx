import { auth } from "@clerk/nextjs/server";

export default async function Dashboard() {
  await auth.protect();
  return <></>;
}
