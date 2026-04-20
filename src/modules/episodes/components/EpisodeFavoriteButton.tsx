import { cn } from "@/lib/lib";
import { Heart, Loader2 } from "lucide-react";

type EpisodeFavoriteButtonProps = {
  isFavorite: boolean;
  isPending: boolean;
  onToggle: () => void;
};

export const EpisodeFavoriteButton = ({
  isFavorite,
  isPending,
  onToggle,
}: EpisodeFavoriteButtonProps) => {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      disabled={isPending}
      className={cn(
        "rounded-full p-1.5",
        isPending && "pointer-events-none opacity-50",
        isFavorite
          ? "text-red-500 hover:bg-red-500/5"
          : "text-muted-foreground hover:text-red-500 hover:bg-red-500/5",
      )}
      title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Heart className={cn(`h-3 w-3 ${isFavorite && "fill-current"}`)} />
      )}
    </button>
  );
};
