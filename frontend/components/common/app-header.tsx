import { Show, UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import ThemeToggle from "./theme-toggle";

export default function AppHeader() {
  return (
    <header>
      <div className="flex flex-row items-center justify-between gap-4 p-1.5">
        <SidebarTrigger />
        <div className="flex flex-row gap-4 items-center">
          <ThemeToggle />
          <Show when={"signed-in"}>
            <UserButton />
          </Show>
        </div>
      </div>
      <Separator />
    </header>
  );
}
