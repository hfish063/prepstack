import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/dashboard"}>
        <Button>Get Started</Button>
      </Link>
    </div>
  );
}
