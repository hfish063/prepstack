import { InterviewSession } from "@/app/api/interview-sessions";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ChevronRight, Monitor } from "lucide-react";
import Link from "next/link";

type RecentInterviewsListProps = {
  recentInterviews: InterviewSession[];
};

export default function RecentInterviewsList({
  recentInterviews,
}: RecentInterviewsListProps) {
  return (
    <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2 gap-0 p-0">
      <CardHeader className="flex flex-row gap-4 justify-between items-center py-4">
        <CardTitle>Recent Activity</CardTitle>
        <Link
          href="/interviews"
          className={buttonVariants({ variant: "link" })}
        >
          All Interviews
          <ArrowRight />
        </Link>
      </CardHeader>
      <Separator />
      <CardContent className="py-6">
        <ItemGroup>
          {recentInterviews.map((interview) => (
            <Item
              key={interview.id}
              variant={"outline"}
              render={<Link href={`/interviews/${interview.id}`} />}
              className="group"
            >
              <ItemMedia>
                <Monitor />
              </ItemMedia>
              <ItemContent className="h-12">
                <ItemTitle>{interview.role}</ItemTitle>
                <ItemDescription className="line-clamp-1 overflow-ellipsis">
                  {interview.topics}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="transition-transform duration-200 group-hover:-translate-x-2" />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
