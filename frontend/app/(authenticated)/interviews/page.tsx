import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";

export default async function Interviews() {
  await auth.protect();
  return (
    <div className="flex flex-col gap-4">
      <Button className="w-fit">
        <Plus />
        New Interview
      </Button>
    </div>
  );
}
