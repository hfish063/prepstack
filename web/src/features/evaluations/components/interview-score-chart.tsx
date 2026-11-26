import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

const MAX_SCORE = 100
const PASSING_SCORE = 70
const EXCELLENT_SCORE = 90

type InterviewScoreChartProps = {
  score: number
}

export function InterviewScoreChart({ score }: InterviewScoreChartProps) {
  const chartData = [{ score, fill: "var(--color-score)" }]

  const isPassing = score >= PASSING_SCORE
  const isExcellent = score >= EXCELLENT_SCORE

  const chartConfig = {
    score: {
      label: "Score",
      color: isPassing ? "var(--confirmation)" : "var(--destructive)",
    },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col items-center gap-2">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[200px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={-270}
          outerRadius={90}
          innerRadius={80}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, MAX_SCORE]}
            tick={false}
            axisLine={false}
          />
          <RadialBar dataKey="score" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {score}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {`out of ${MAX_SCORE}`}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <Badge variant={isPassing ? "success" : "destructive"}>
        {isExcellent
          ? "Strong Hire"
          : isPassing
            ? "Potential Hire"
            : "Weak Hire"}
      </Badge>
    </div>
  )
}
