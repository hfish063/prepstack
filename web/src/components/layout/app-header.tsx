import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import { Show, UserButton } from "@clerk/react"
import ThemeToggle from "./theme-toggle"

export default function AppHeader() {
  return (
    <header>
      <div className="flex flex-row items-center justify-between gap-4 p-2">
        <SidebarTrigger />
        <div className="flex flex-row items-center gap-4">
          <ThemeToggle />
          <Show when={"signed-in"}>
            <UserButton />
          </Show>
        </div>
      </div>
      <Separator />
    </header>
  )
}
