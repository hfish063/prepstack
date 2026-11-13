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
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ProblemExample, ProgrammingLanguage } from "@/app/api/coding-problems";
import {
  ExampleRunResultRead,
  ProblemSubmissionRead,
} from "@/app/api/code-execution";
import EditorConsole from "./editor-console";
import { useTheme } from "@wrksz/themes/client";
import { useCode } from "@/hooks/use-code";
import { useLocalStorage } from "@/hooks/use-local-storage";

const DEFAULT_FONT_SIZE = 14;
const DEFAULT_TAB_SIZE = 4;
const DEFAULT_WORD_WRAP = true;

const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const TAB_SIZES = [2, 4];

const EDITOR_PANEL_SIZE = 50;
const CONSOLE_PANEL_SIZE = 50;

export type ExecutionResult =
  | { type: "run"; data: ExampleRunResultRead[]; examples: ProblemExample[] }
  | { type: "submission"; data: ProblemSubmissionRead };

type EditorPanelProps = {
  phaseId: number;
  language: ProgrammingLanguage;
  starterCode: string;
  examples: ProblemExample[];
};

export default function EditorPanel({
  phaseId,
  language,
  starterCode,
  examples,
}: EditorPanelProps) {
  const { runCode, submitCode } = useCode();

  const { getItem, setItem } = useLocalStorage<string>();
  const storageKey = `editor-${phaseId}-${language.id}`;

  const { theme } = useTheme();

  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [tabSize, setTabSize] = useState(DEFAULT_TAB_SIZE);
  const [wordWrapEnabled, setWordWrapEnabled] = useState(DEFAULT_WORD_WRAP);

  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [executionResults, setExecutionResults] = useState<ExecutionResult>();
  const [isSubmissionLoading, setIsSubmissionLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const codeRef = useRef(starterCode);

  const handleEditorMount: OnMount = (editor) => {
    const savedCode = getItem(storageKey);
    const initialCode = savedCode ?? starterCode;

    editor.setValue(initialCode);
    codeRef.current = initialCode;
  };

  const handleToggleConsole = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };

  const handleRunCode = async () => {
    const sourceCode = codeRef.current ?? "";
    setIsRunning(true);

    try {
      const results = await runCode(phaseId, {
        sourceCode: sourceCode,
        languageId: language.id,
      });

      setExecutionResults({ type: "run", data: results, examples: examples });
    } catch {
      console.error(`Error running code against example cases.`);
    } finally {
      setIsConsoleOpen(true);
      setIsRunning(false);
      setItem(storageKey, sourceCode);
    }
  };

  const handleSubmitCode = async () => {
    const sourceCode = codeRef.current ?? "";

    setIsSubmissionLoading(true);

    try {
      const submission = await submitCode(phaseId, {
        sourceCode,
        languageId: language.id,
      });

      setExecutionResults({ type: "submission", data: submission });
    } catch {
      console.error("Code submission request failed");
    } finally {
      setIsConsoleOpen(true);
      setIsSubmissionLoading(false);
    }
  };

  return (
    <Card className="h-full gap-0 p-0">
      <CardHeader className="flex flex-row gap-4 py-2 items-center justify-between shrink-0">
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
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel
            defaultSize={
              isConsoleOpen
                ? EDITOR_PANEL_SIZE
                : EDITOR_PANEL_SIZE + CONSOLE_PANEL_SIZE
            }
            style={{ overflow: "hidden" }}
          >
            <Editor
              theme={theme === "dark" ? "vs-dark" : "light"}
              loading={<Spinner />}
              language={language.name.toLowerCase()}
              height="100%"
              onChange={(value) => (codeRef.current = value ?? "")}
              onMount={handleEditorMount}
              options={{
                fontSize: fontSize,
                tabSize: tabSize,
                wordWrap: wordWrapEnabled ? "on" : "off",
                minimap: { enabled: false },
              }}
            />
          </ResizablePanel>
          {isConsoleOpen && (
            <>
              <ResizableHandle className="mb-2" withHandle />
              <ResizablePanel defaultSize={CONSOLE_PANEL_SIZE}>
                {executionResults && (
                  <EditorConsole
                    isLoading={isSubmissionLoading || isRunning}
                    executionResults={executionResults}
                  />
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </CardContent>

      <Separator />

      <CardFooter className="flex gap-4 py-2 justify-between">
        <Button variant={"ghost"} onClick={handleToggleConsole}>
          Console {isConsoleOpen ? <ChevronDown /> : <ChevronUp />}
        </Button>
        <div className="flex flex-row items-center gap-4">
          <Button
            variant={"secondary"}
            onClick={handleRunCode}
            disabled={isRunning || isSubmissionLoading}
          >
            {isRunning ? <Spinner /> : <Play />}
          </Button>
          <Button
            variant={"confirmation"}
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmissionLoading}
          >
            {isSubmissionLoading ? <Spinner /> : <CloudUpload />}
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
