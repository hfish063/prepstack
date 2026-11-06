"use client";

import { Editor } from "@monaco-editor/react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { CloudUpload, CodeXml } from "lucide-react";
import { Button } from "../ui/button";

const DEFAULT_FONT_SIZE = 14;
const DEFAULT_TAB_SIZE = 4;

type EditorPanelProps = {
  language: string;
  starterCode: string;
};

export default function EditorPanel({
  language,
  starterCode,
}: EditorPanelProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden">
      <CardHeader className="shrink-0">
        <div className="flex flex-row items-center gap-2 font-semibold">
          <CodeXml />
          Code
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="min-h-0 flex-1 p-0">
        <Editor
          loading={<Spinner />}
          language={language}
          height="100%"
          defaultValue={starterCode}
          options={{
            fontSize: DEFAULT_FONT_SIZE,
            tabSize: DEFAULT_TAB_SIZE,
            wordWrap: "on",
            minimap: { enabled: false },
          }}
        />
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-end">
        <Button>
          <CloudUpload />
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
