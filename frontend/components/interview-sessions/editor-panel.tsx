"use client";

import { Editor } from "@monaco-editor/react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { ChevronDown, CloudUpload, CodeXml, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import { ScrollArea } from "../ui/scroll-area";

const DEFAULT_FONT_SIZE = 14;
const DEFAULT_TAB_SIZE = 4;

const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const TAB_SIZES = [2, 4];

type EditorPanelProps = {
  language: string;
  starterCode: string;
};

export default function EditorPanel({
  language,
  starterCode,
}: EditorPanelProps) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [tabSize, setTabSize] = useState(DEFAULT_TAB_SIZE);
  const [wordWrapEnabled, setWordWrapEnabled] = useState(true);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row gap-4 items-center justify-between shrink-0">
        <div className="flex flex-row items-center gap-2 font-semibold">
          <CodeXml />
          Code
        </div>
        <EditorPanelConfigurationMenu
          fontSize={fontSize}
          tabSize={tabSize}
          wordWrapEnabled={wordWrapEnabled}
          onFontSizeChange={setFontSize}
          onTabSizeChange={setTabSize}
          onWordWrapChange={setWordWrapEnabled}
        />
      </CardHeader>

      <Separator />

      <CardContent className="min-h-0 flex-1 p-0">
        <Editor
          loading={<Spinner />}
          language={language}
          height="100%"
          defaultValue={starterCode}
          options={{
            fontSize: fontSize,
            tabSize: tabSize,
            wordWrap: wordWrapEnabled == true ? "on" : "off",
            minimap: { enabled: false },
          }}
        />
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-end">
        <Button variant={"confirmation"}>
          <CloudUpload />
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

type EditorPanelConfigurationMenuProps = {
  fontSize: number;
  tabSize: number;
  wordWrapEnabled: boolean;
  onFontSizeChange: (size: number) => void;
  onTabSizeChange: (size: number) => void;
  onWordWrapChange: (enabled: boolean) => void;
};

function EditorPanelConfigurationMenu({
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
        <div className="flex flex-row gap-4 justify-between items-center">
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
        <div className="flex flex-row gap-4 justify-between items-center">
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
        <div className="flex flex-row gap-4 justify-between items-center">
          <p>Word Wrap</p>
          <Switch
            checked={wordWrapEnabled}
            onCheckedChange={onWordWrapChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
