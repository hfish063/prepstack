"use client";

import { useTheme } from "@wrksz/themes/client";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={"outline"}
            size={"icon-sm"}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
          </Button>
        }
      />
      <TooltipContent>
        <p>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
