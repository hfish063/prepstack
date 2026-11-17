import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const numberFormat = new Intl.NumberFormat();

type StatCardProps = {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  valueClassName?: string;
};

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
  valueClassName,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className={cn("text-3xl", valueClassName)}>
          {numberFormat.format(value)}
        </CardTitle>
        <CardAction>
          <Icon className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
