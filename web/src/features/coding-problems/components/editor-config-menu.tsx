import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, Settings } from "lucide-react"

const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
const TAB_SIZES = [2, 4]

type EditorPanelConfigurationMenuProps = {
  fontSize: number
  tabSize: number
  wordWrapEnabled: boolean
  onFontSizeChange: (size: number) => void
  onTabSizeChange: (size: number) => void
  onWordWrapChange: (enabled: boolean) => void
}

export default function EditorPanelConfigurationMenu({
  fontSize,
  tabSize,
  wordWrapEnabled,
  onFontSizeChange,
  onTabSizeChange,
  onWordWrapChange,
}: EditorPanelConfigurationMenuProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant={"ghost"} size={"icon"}>
            <Settings />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Editor Configuration</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-row items-center justify-between gap-4">
          <p>Font Size</p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant={"outline"} className="w-32">
                  {fontSize}px <ChevronDown />
                </Button>
              }
            />
            <DropdownMenuContent>
              <ScrollArea className="h-[160px]">
                <DropdownMenuRadioGroup
                  value={fontSize}
                  onValueChange={onFontSizeChange}
                >
                  {FONT_SIZES.map((size) => (
                    <DropdownMenuRadioItem key={size} value={size} closeOnClick>
                      {size}px
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <p>Tab Size</p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant={"outline"} className="w-32">
                  {tabSize} Spaces <ChevronDown />
                </Button>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={tabSize}
                onValueChange={onTabSizeChange}
              >
                {TAB_SIZES.map((size) => (
                  <DropdownMenuRadioItem key={size} value={size} closeOnClick>
                    {size} Spaces
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <p>Word Wrap</p>
          <Switch
            checked={wordWrapEnabled}
            onCheckedChange={onWordWrapChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
