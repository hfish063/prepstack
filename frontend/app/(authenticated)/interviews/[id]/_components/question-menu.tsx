"use client";

import Link from "next/link";
import { InterviewQuestion } from "@/app/api/questions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";

type QuestionMenuProps = {
  questions: InterviewQuestion[];
  activeQuestionId: number;
};

export default function QuestionMenu({
  questions,
  activeQuestionId,
}: QuestionMenuProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Questions</CardTitle>
        <CardDescription>
          {`${questions.length} questions in this phase`}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <ItemGroup>
            {questions.map((question) => (
              <QuestionMenuItem
                key={question.id}
                question={question}
                active={question.id === activeQuestionId}
              />
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

type QuestionMenuItemProps = {
  question: InterviewQuestion;
  active: boolean;
};

function QuestionMenuItem({ question, active }: QuestionMenuItemProps) {
  return (
    <Item
      size="sm"
      variant={active ? "muted" : "default"}
      aria-current={active ? "page" : undefined}
      render={<Link href={`?question=${question.id}`} />}
    >
      <ItemMedia>
        <Badge variant={active ? "default" : "outline"}>
          {question.ordinal}
        </Badge>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{`Question ${question.ordinal}`}</ItemTitle>
        <ItemDescription>{question.text}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
