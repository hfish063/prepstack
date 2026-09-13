import { Show, UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";

export default function AppHeader() {
  return (
    <header>
      <div className="flex flex-row items-center justify-between gap-4 p-2">
        <SidebarTrigger />
        <Show when={"signed-in"}>
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
