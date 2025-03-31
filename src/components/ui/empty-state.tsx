
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Horse, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  createUrl?: string;
  createLabel?: string;
}

export const EmptyState = ({
  title,
  description,
  createUrl,
  createLabel,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <Horse className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {createUrl && (
          <Button asChild className="mt-4" size="sm">
            <Link to={createUrl}>
              <Plus className="mr-2 h-4 w-4" />
              {createLabel || "Crear nuevo"}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
