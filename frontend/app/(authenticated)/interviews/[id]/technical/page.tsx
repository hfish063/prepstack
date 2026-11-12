import { redirect } from "next/navigation";

export default async function TechnicalPhasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/interviews/${id}/technical/question`);
}
