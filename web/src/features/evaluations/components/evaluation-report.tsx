import type { InterviewSummaryRead, PhaseType } from "@/lib/api/generated"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { findEvaluationByPhaseType } from "../utils/utils"

type EvaluationReportProps = {
  summary: InterviewSummaryRead
}

const PHASES: { type: PhaseType; label: string }[] = [
  { type: "behavioral", label: "Behavioral" },
  { type: "conceptual", label: "Conceptual" },
  { type: "technical", label: "Technical" },
]

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#18181b",
    lineHeight: 1.4,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#71717a",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 12,
  },
  listText: {
    flex: 1,
  },
})

export default function EvaluationReport({ summary }: EvaluationReportProps) {
  const strengths = summary.feedback.filter((item) => item.type === "strength")
  const improvements = summary.feedback.filter(
    (item) => item.type === "improvement"
  )

  return (
    <Document title="Interview Evaluation">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Interview Evaluation</Text>
        <Text style={styles.subtitle}>
          {`Overall score of ${summary.overallScore} / 100`}
        </Text>

        <View style={styles.section}>
          <Text style={styles.heading}>Summary</Text>
          <Text>{summary.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Phase Scores</Text>
          {PHASES.map((phase) => {
            const evaluation = findEvaluationByPhaseType(
              summary.phaseEvaluations,
              phase.type
            )

            return (
              <View key={phase.type} style={styles.row}>
                <Text>{phase.label}</Text>
                <Text>
                  {evaluation ? `${evaluation.score} / 100` : "Not evaluated"}
                </Text>
              </View>
            )
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Interview Stats</Text>
          <View style={styles.row}>
            <Text>Questions Answered</Text>
            <Text>
              {`${summary.stats.answeredQuestions} / ${summary.stats.totalQuestions}`}
            </Text>
          </View>
          <View style={styles.row}>
            <Text>Messages Sent</Text>
            <Text>{summary.stats.messageCount}</Text>
          </View>
          <View style={styles.row}>
            <Text>Hints Used</Text>
            <Text>{summary.stats.hintsUsed}</Text>
          </View>
        </View>

        <FeedbackList title="Key Strengths" items={strengths} />
        <FeedbackList title="Areas to Improve" items={improvements} />
      </Page>
    </Document>
  )
}

type FeedbackListProps = {
  title: string
  items: InterviewSummaryRead["feedback"]
}

function FeedbackList({ title, items }: FeedbackListProps) {
  if (items.length == 0) {
    return null
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>{item.content}</Text>
        </View>
      ))}
    </View>
  )
}
