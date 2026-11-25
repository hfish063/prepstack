import { Button } from "../ui/button"
import { Moon, Sun } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useTheme } from "../theme-provider"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={"outline"}
            size={"icon-sm"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        }
      />
      <TooltipContent>
        <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
