import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InterviewPhaseEvaluationRead } from "@/lib/api/generated"
import ConversationEvaluationResults from "./conversation-results"
import TechnicalEvaluationResults from "./technical-results"
import { findEvaluationByPhaseType } from "../utils/utils"

type PhaseEvaluationTabsProps = {
  evaluations: InterviewPhaseEvaluationRead[]
}

export default function PhaseEvaluationTabs({
  evaluations,
}: PhaseEvaluationTabsProps) {
  const behavioralEvaluation = findEvaluationByPhaseType(
    evaluations,
    "behavioral"
  )
  const conceptualEvaluation = findEvaluationByPhaseType(
    evaluations,
    "conceptual"
  )
  const technicalEvaluation = findEvaluationByPhaseType(
    evaluations,
    "technical"
  )

  return (
    <Tabs defaultValue={"behavioral"}>
      <TabsList className="mb-2">
        <TabsTrigger value={"behavioral"}>Behavioral</TabsTrigger>
        <TabsTrigger value={"conceptual"}>Conceptual</TabsTrigger>
        <TabsTrigger value={"technical"}>Technical</TabsTrigger>
      </TabsList>
      <TabsContent value={"behavioral"}>
        <ConversationEvaluationResults evaluation={behavioralEvaluation} />
      </TabsContent>
      <TabsContent value={"conceptual"}>
        <ConversationEvaluationResults evaluation={conceptualEvaluation} />
      </TabsContent>
      <TabsContent value={"technical"}>
        <TechnicalEvaluationResults technicalEvaluation={technicalEvaluation} />
      </TabsContent>
    </Tabs>
  )
}
