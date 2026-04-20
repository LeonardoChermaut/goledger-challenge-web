import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/lib";
import { Heart, Loader2, Pencil, Trash2 } from "lucide-react";
import { FunctionComponent, ReactNode } from "react";

type DetailActionBarProps = {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;

  favorite?: {
    isFavorite: boolean;
    isPending: boolean;
    label: string;
    onToggle: () => void;
  };
};

const styles = {
  default:
    "text-muted-foreground/60 hover:bg-secondary/80 hover:text-foreground",
  destructive:
    "text-destructive/50 hover:bg-destructive/10 hover:text-destructive",
  favorite: "text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/5",
  "favorite-active": "text-red-500 hover:bg-red-500/10",
} as const;

type ActionButtonVariant = keyof typeof styles;

type ActionButtonProps = {
  disabled?: boolean;
  tooltip: string;
  variant?: ActionButtonVariant;
  children: ReactNode;
  onClick: () => void;
};

const ActionButton: FunctionComponent<ActionButtonProps> = ({
  disabled,
  tooltip,
  variant = "default",
  children,
  onClick,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          aria-label={tooltip}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-150",
            "disabled:pointer-events-none disabled:opacity-40",
            styles[variant],
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const DetailActionBar: FunctionComponent<DetailActionBarProps> = ({
  favorite,
  editLabel = "Editar",
  deleteLabel = "Remover",
  onEdit,
  onDelete,
}) => (
  <div className="flex shrink-0 items-center gap-1.5">
    {favorite && (
      <ActionButton
        onClick={favorite.onToggle}
        disabled={favorite.isPending}
        tooltip={favorite.label}
        variant={favorite.isFavorite ? "favorite-active" : "favorite"}
      >
        {favorite.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Heart
            className={cn("h-3.5 w-3.5", favorite.isFavorite && "fill-current")}
          />
        )}
      </ActionButton>
    )}

    <div className="mx-1 h-4 w-px bg-border/50" />

    <ActionButton onClick={onEdit} tooltip={editLabel}>
      <Pencil className="h-3.5 w-3.5" />
    </ActionButton>

    <ActionButton
      onClick={onDelete}
      tooltip={deleteLabel}
      variant="destructive"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </ActionButton>
  </div>
);
