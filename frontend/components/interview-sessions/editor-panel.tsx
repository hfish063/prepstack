"use client";

import { Editor, type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  ChevronDown,
  ChevronUp,
  CloudUpload,
  CodeXml,
  Play,
  Settings,
  Terminal,
} from "lucide-react";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
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
import { ProgrammingLanguage } from "@/app/api/coding-problems";
import { runCodeAgainstExamples } from "@/app/api/code-execution";
import { useAuth } from "@clerk/nextjs";

const DEFAULT_FONT_SIZE = 14;
const DEFAULT_TAB_SIZE = 4;
const DEFAULT_WORD_WRAP = true;

const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const TAB_SIZES = [2, 4];

type EditorPanelProps = {
  phaseId: number;
  language: ProgrammingLanguage;
  starterCode: string;
};

export default function EditorPanel({
  phaseId,
  language,
  starterCode,
}: EditorPanelProps) {
  const { getToken } = useAuth();

  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [tabSize, setTabSize] = useState(DEFAULT_TAB_SIZE);
  const [wordWrapEnabled, setWordWrapEnabled] = useState(DEFAULT_WORD_WRAP);

  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [runStatus, setRunStatus] = useState<"accepted" | "failed" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    const sourceCode = editorRef.current?.getValue() ?? "";
    const token = await getToken();
    if (!token) return;

    setIsLoading(true);

    try {
      const results = await runCodeAgainstExamples(token, phaseId, {
        sourceCode,
        languageId: language.id,
      });

      setRunStatus(
        results.every((result) => result.passed) ? "accepted" : "failed",
      );
    } catch {
      console.error(`Error running code against example cases.`);
    } finally {
      setIsConsoleOpen(true);
      setIsLoading(false);
    }
  };

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
          language={language.name.toLowerCase()}
          height="100%"
          defaultValue={starterCode}
          onMount={handleEditorMount}
          options={{
            fontSize: fontSize,
            tabSize: tabSize,
            wordWrap: wordWrapEnabled ? "on" : "off",
            minimap: { enabled: false },
          }}
        />
      </CardContent>

      {isConsoleOpen && (
        <EditorConsole isLoading={isLoading} status={runStatus} />
      )}
      <Separator />

      <CardFooter className="flex gap-4 justify-between">
        <Button
          variant={"ghost"}
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
        >
          Console {isConsoleOpen ? <ChevronDown /> : <ChevronUp />}
        </Button>
        <div className="flex flex-row items-center gap-4">
          <Button
            variant={"secondary"}
            onClick={handleRunCode}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : <Play />}
          </Button>
          <Button variant={"confirmation"} disabled={isLoading}>
            <CloudUpload />
            Submit
          </Button>
        </div>
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

type EditorConsoleProps = {
  isLoading: boolean;
  status: "accepted" | "failed" | null;
};

function EditorConsole({ isLoading, status }: EditorConsoleProps) {
  return (
    <div className="flex flex-col gap-4 h-1/3">
      <Separator />

      <div className="flex items-center gap-1 font-semibold px-4">
        <Terminal />
        Output
      </div>

      <Separator />

      {status && !isLoading && (
        <ScrollArea>
          <p
            className={
              status === "accepted"
                ? "px-4 text-confirmation"
                : "px-4 text-destructive"
            }
          >
            {status === "accepted" ? "Accepted" : "Failed"}
          </p>
        </ScrollArea>
      )}
    </div>
  );
}
