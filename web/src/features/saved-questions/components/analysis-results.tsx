import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSavedQuestionAnalysis } from "../hooks/use-saved-question-analyses"
import { Link, useParams } from "@tanstack/react-router"
import { Item, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot } from "lucide-react"
import { useSavedQuestion } from "../hooks/use-saved-question"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"

export default function AnalysisResults() {
  const params = useParams({
    from: "/_protected/question-bank/$questionId/analyze",
  })
  const savedQuestionId = Number(params.questionId)

  const { data: analysis } = useSavedQuestionAnalysis(savedQuestionId)
  const { data: savedQuestion } = useSavedQuestion(savedQuestionId)

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/question-bank"
        className={cn(buttonVariants({ variant: "link" }), "w-fit px-0")}
      >
        <ArrowLeft /> Question Bank
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
          <CardDescription>{savedQuestion.content}</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-confirmation">
              Optimal Response
            </CardTitle>
            <CardDescription>{analysis.exampleResponse}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Likely Follow-Up Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              {analysis.followUps.map((followUp, index) => (
                <Item key={index} variant={"outline"}>
                  <ItemMedia>
                    <Bot />
                  </ItemMedia>
                  <ItemContent className="text-muted-foreground">
                    {followUp.content}
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Improvement Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {analysis.tips.map((tip, index) => (
              <Item key={index} variant={"outline"}>
                <ItemMedia>
                  <Badge>{index + 1}</Badge>
                </ItemMedia>
                <ItemContent>{tip.content}</ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  )
}
