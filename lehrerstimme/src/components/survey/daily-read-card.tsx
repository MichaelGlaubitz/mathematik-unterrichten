import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DailyReadCardProps = {
  title?: string;
  text: string;
  href?: string | null;
  linkLabel?: string;
};

export function DailyReadCard({
  title = "Impuls des Tages",
  text,
  href,
  linkLabel = "Quelle öffnen",
}: DailyReadCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Didaktischer Kontext für den Alltag.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
        {href ? (
          <a
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkLabel}
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}
